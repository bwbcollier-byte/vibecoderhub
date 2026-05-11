// Hacker News (Algolia API) — keyword scan over front-page stories for
// AI-IDE / model / agent / MCP launch events. Feeds the news queue. Hourly.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
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

    for (const h of all) {
      const title = h.title ?? h.story_title;
      const url = h.url ?? h.story_url;
      if (!title || !url) continue;
      if ((h.points ?? 0) < 20) continue;
      const slug = slugify(`hn-${h.objectID}`);
      await upsertResource(ctx, {
        typeSlug: 'news',
        slug,
        name: title,
        tagline: `${h.points ?? 0} points on Hacker News`,
        description: title,
        sourceUrl: url,
        homepageUrl: `https://news.ycombinator.com/item?id=${h.objectID}`,
        authorHandle: h.author,
        stackTags: ['hacker-news'],
      }).catch(() => undefined);
    }
  },
);
