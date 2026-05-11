// 21st.dev — community shadcn-style component marketplace. Sitemap-driven
// discovery, JSON-per-component ingest. Per data-sourcing spec §4.
//
// Daily for known components, weekly full sitemap re-crawl. This script
// handles both: pulls the sitemap, queues each registry URL.

import { withIngestionRun } from './_shared/runs';
import { fetchJson, fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(30, 60_000);

interface ComponentEntry {
  name: string;
  description?: string;
  username?: string;
  slug?: string;
}

await withIngestionRun(
  { sourceSlug: '21st-dev', priority: 'normal' },
  async (ctx) => {
    const sitemap = await fetchText('https://21st.dev/sitemap.xml', {
      headers: { 'user-agent': 'vibecoderhub-ingest/1' },
    });

    // Match /r/{user}/{slug} registry URLs in the sitemap.
    const urls = Array.from(
      sitemap.matchAll(/<loc>(https:\/\/21st\.dev\/r\/[^<]+)<\/loc>/g),
    )
      .map((m) => m[1])
      .filter((u): u is string => typeof u === 'string');

    // Cap per run to keep workflow well under timeout. Full re-crawl happens
    // weekly via the same script; daily runs hit the most recent slice.
    const MAX = 200;
    const targets = urls.slice(0, MAX);
    ctx.metadata.discovered = urls.length;
    ctx.metadata.attempted = targets.length;

    const collected: ComponentEntry[] = [];
    for (const url of targets) {
      await limiter.acquire();
      try {
        const entry = await fetchJson<ComponentEntry>(url, {
          headers: { 'user-agent': 'vibecoderhub-ingest/1' },
        });
        const parts = url.replace('https://21st.dev/r/', '').split('/');
        const username = entry.username ?? parts[0];
        const slug = slugify(`${username}-${entry.name ?? parts[1]}`);
        collected.push(entry);
        await upsertResource(ctx, {
          typeSlug: 'component',
          slug,
          name: entry.name ?? slug,
          description: entry.description ?? null,
          sourceUrl: url,
          authorHandle: username,
          stackTags: ['shadcn', 'react'],
        }).catch(() => undefined);
      } catch (err) {
        ctx.counters.failed += 1;
        ctx.logger.warn('21st fetch failed', { url, err: String(err).slice(0, 200) });
      }
    }

    await ctx.dump(collected);
  },
);
