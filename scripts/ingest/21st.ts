// 21st.dev — community shadcn-style component marketplace. Sitemap-driven
// discovery, JSON-per-component ingest. Per data-sourcing spec §4.
//
// Daily for known components, weekly full sitemap re-crawl. This script
// handles both: pulls the sitemap, queues each registry URL.

import { eq, inArray } from 'drizzle-orm';

import { withIngestionRun } from './_shared/runs';
import { fetchJson, fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';
import { getDb } from './_shared/db';
import { resources } from '@/db/schema';

const limiter = new RateLimiter(30, 60_000);

interface ComponentEntry {
  name: string;
  description?: string;
  username?: string;
  slug?: string;
}

async function main() {
  await withIngestionRun(
  { sourceSlug: '21st-dev', priority: 'normal' },
  async (ctx) => {
    const sitemap = await fetchText('https://21st.dev/sitemap.xml', {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; vibecoderhub-ingest/1)' },
    });

    // Sitemap pattern was reorganised — components now live under
    // /community/components/{user}/{slug}, not /r/{user}/{slug} as before.
    // The /r/{user}/{slug} JSON registry endpoint still works for fetches.
    const componentPaths = Array.from(
      sitemap.matchAll(
        /<loc>https:\/\/21st\.dev\/community\/components\/([^/<]+)\/([^/<]+?)<\/loc>/g,
      ),
    )
      .map((m) => ({ user: m[1]!, slug: m[2]! }))
      // Drop overview routes like /community/components/popular.
      .filter(
        (p) =>
          !['popular', 'newest', 'featured', 'week', 'search', 'pro', 'all'].includes(p.user),
      );

    // De-dupe — the same component appears under multiple list filters.
    const seen = new Set<string>();
    const unique = componentPaths.filter((p) => {
      const k = `${p.user}/${p.slug}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    // Resume across runs by skipping URLs already in pk_resources. Each
    // sitemap entry has a stable detail URL we use as `source_url` on
    // upsert, so the same URL across runs hits the same row. We chunk the
    // existence query because Postgres `IN (…)` arrays > a few thousand
    // become unwieldy; 4,500 fits in one round-trip but the chunking keeps
    // headroom if 21st grows.
    const allDetailUrls = unique.map(
      (p) => `https://21st.dev/community/components/${p.user}/${p.slug}`,
    );
    const db = getDb();
    const existing = new Set<string>();
    const CHUNK = 1000;
    for (let i = 0; i < allDetailUrls.length; i += CHUNK) {
      const slice = allDetailUrls.slice(i, i + CHUNK);
      const rows = await db
        .select({ url: resources.sourceUrl })
        .from(resources)
        .where(
          slice.length === 1
            ? eq(resources.sourceUrl, slice[0]!)
            : inArray(resources.sourceUrl, slice),
        );
      for (const r of rows) if (r.url) existing.add(r.url);
    }

    const todo = unique.filter(
      (p) => !existing.has(`https://21st.dev/community/components/${p.user}/${p.slug}`),
    );

    const MAX_PER_RUN = 200;
    const targets = todo.slice(0, MAX_PER_RUN);
    ctx.metadata.discovered = unique.length;
    ctx.metadata.alreadyIngested = existing.size;
    ctx.metadata.todo = todo.length;
    ctx.metadata.attempted = targets.length;
    ctx.logger.info('21st sitemap parsed', {
      sitemapBytes: sitemap.length,
      uniqueComponents: unique.length,
      alreadyIngested: existing.size,
      remaining: todo.length,
      attempting: targets.length,
    });

    const collected: ComponentEntry[] = [];
    for (const { user, slug: rawSlug } of targets) {
      const registryUrl = `https://21st.dev/r/${user}/${rawSlug}`;
      const detailUrl = `https://21st.dev/community/components/${user}/${rawSlug}`;
      await limiter.acquire();
      try {
        const entry = await fetchJson<ComponentEntry>(registryUrl, {
          headers: { 'user-agent': 'Mozilla/5.0 (compatible; vibecoderhub-ingest/1)' },
        });
        const username = entry.username ?? user;
        const slug = slugify(`${username}-${entry.name ?? rawSlug}`);
        collected.push(entry);
        await upsertResource(ctx, {
          typeSlug: 'component',
          slug,
          name: entry.name ?? rawSlug,
          description: entry.description ?? null,
          sourceUrl: detailUrl,
          homepageUrl: registryUrl,
          authorHandle: username,
          stackTags: ['shadcn', 'react'],
        }).catch(() => undefined);
      } catch (err) {
        ctx.counters.failed += 1;
        ctx.logger.warn('21st fetch failed', {
          url: registryUrl,
          err: String(err).slice(0, 200),
        });
      }
    }

    await ctx.dump(collected);
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
