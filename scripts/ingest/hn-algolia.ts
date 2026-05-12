// Hacker News (Algolia API) — keyword scan over front-page stories for
// AI-IDE / model / agent / MCP launch events. Feeds the news queue. Hourly.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertNews } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(60, 60_000);

const QUERIES = [
  'claude code',
  'cursor ai',
  'mcp server',
  'openrouter',
  'agentic coding',
  'ai coding agent',
];

interface Hit {
  objectID: string;
  title?: string;
  story_title?: string;
  url?: string;
  story_url?: string;
  author: string;
  points?: number;
  created_at: string;
}

interface AlgoliaResp {
  hits: Hit[];
}

async function main() {
  await withIngestionRun(
  { sourceSlug: 'hn-algolia', priority: 'normal' },
  async (ctx) => {
    const all: Hit[] = [];
    for (const q of QUERIES) {
      await limiter.acquire();
      try {
        const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=30`;
        const resp = await fetchJson<AlgoliaResp>(url, {
          headers: { 'user-agent': 'vibecoderhub-ingest/1' },
        });
        all.push(...resp.hits);
      } catch (err) {
        ctx.logger.warn('hn query failed', { q, err: String(err).slice(0, 200) });
      }
    }

    await ctx.dump(all);
    ctx.metadata.items = all.length;

    // De-duplicate by objectID — different queries return overlapping stories.
    const seen = new Set<string>();
    for (const h of all) {
      if (seen.has(h.objectID)) continue;
      seen.add(h.objectID);
      const title = h.title ?? h.story_title;
      const url = h.url ?? h.story_url;
      if (!title || !url) continue;
      if ((h.points ?? 0) < 20) continue;
      const slug = slugify(`hn-${h.objectID}`);
      const publishedAt = h.created_at ? new Date(h.created_at) : new Date();
      await upsertNews(ctx, {
        slug,
        title,
        summary: `${h.points ?? 0} points on Hacker News · by ${h.author}`,
        body: title,
        kind: 'ecosystem',
        sourceKind: 'rss_imported',
        sourceName: `Hacker News · ${h.author}`,
        sourceUrl: url,
        publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        topics: ['hacker-news'],
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
