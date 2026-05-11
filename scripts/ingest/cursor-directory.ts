// cursor.directory — largest community .cursorrules registry. Their JSON
// dump lives at /api/rules. Per data-sourcing spec §6. Daily cadence.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(30, 60_000);

interface RuleEntry {
  title?: string;
  slug?: string;
  content?: string;
  tags?: string[];
  author?: { name?: string; url?: string };
  url?: string;
}

await withIngestionRun(
  { sourceSlug: 'cursor-directory', priority: 'normal' },
  async (ctx) => {
    await limiter.acquire();
    const json = await fetchJson<RuleEntry[] | { rules: RuleEntry[] }>(
      'https://cursor.directory/api/rules',
      { headers: { 'user-agent': 'vibecoderhub-ingest/1' } },
    );
    const rules = Array.isArray(json) ? json : (json.rules ?? []);

    await ctx.dump(rules);
    ctx.metadata.fetched = rules.length;

    for (const r of rules) {
      const name = r.title ?? r.slug ?? 'untitled-rule';
      const slug = slugify(r.slug ?? name);
      await upsertResource(ctx, {
        typeSlug: 'rule',
        slug,
        name,
        tagline: r.content?.slice(0, 200) ?? null,
        description: r.content ?? null,
        sourceUrl: r.url ?? `https://cursor.directory/${r.slug ?? slug}`,
        authorHandle: r.author?.name ?? null,
        stackTags: r.tags ?? ['cursor'],
      }).catch(() => undefined);
    }
  },
);
