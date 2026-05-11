// GitHub stargazer-velocity scanner. Discovers fast-rising repos in the
// vibe-coding / AI-IDE / agent space → drives the "trending" signal on
// resources we already track + nominates new ones for editorial review.
// Per data-sourcing spec §5 + §7. Daily.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';
import { requireEnv } from './_shared/env';

const limiter = new RateLimiter(25, 60_000);

interface Repo {
  full_name: string;
  description?: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  topics?: string[];
}

interface RepoSearch {
  total_count: number;
  items: Repo[];
}

const TOPICS = [
  'claude-code',
  'cursor-rules',
  'ai-agent',
  'mcp-server',
  'vibe-coding',
  'ai-coding',
];

await withIngestionRun(
  {
    sourceSlug: 'github-stargazer-velocity',
    priority: 'low',
    requiredEnv: ['GITHUB_INGESTION_TOKEN'],
  },
  async (ctx) => {
    const token = requireEnv('GITHUB_INGESTION_TOKEN');
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
    const all: Repo[] = [];

    for (const topic of TOPICS) {
      await limiter.acquire();
      try {
        const url = `https://api.github.com/search/repositories?q=topic:${topic}+pushed:>${since}&sort=stars&order=desc&per_page=50`;
        const resp = await fetchJson<RepoSearch>(url, {
          headers: {
            accept: 'application/vnd.github+json',
            authorization: `Bearer ${token}`,
            'user-agent': 'vibecoderhub-ingest/1',
          },
        });
        all.push(...resp.items);
      } catch (err) {
        ctx.logger.warn('topic search failed', { topic, err: String(err).slice(0, 200) });
      }
    }

    await ctx.dump(all);
    ctx.metadata.discovered = all.length;

    for (const repo of all) {
      if (repo.stargazers_count < 25) continue;
      // Heuristic type assignment from topics — falls through to `tool`.
      const topics = repo.topics ?? [];
      const typeSlug = topics.includes('mcp-server')
        ? 'mcp'
        : topics.includes('cursor-rules')
        ? 'rule'
        : 'tool';
      await upsertResource(ctx, {
        typeSlug,
        slug: slugify(repo.full_name),
        name: repo.full_name,
        tagline: repo.description?.slice(0, 200) ?? null,
        description: repo.description ?? null,
        sourceUrl: repo.html_url,
        homepageUrl: repo.homepage ?? null,
        authorHandle: repo.full_name.split('/')[0] ?? null,
        stackTags: topics.slice(0, 10),
      }).catch(() => undefined);
    }
  },
);
