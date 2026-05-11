// GitHub code search across SKILL.md / AGENT.md / .cursorrules / CLAUDE.md /
// AGENTS.md / .claude/commands/*.md. Per data-sourcing spec §6.
//
// Quality filter: only ingest results from repos with ≥ 5 stars.
//
// Daily for incremental search (pushed:>YYYY-MM-DD), weekly for full re-scan.
// 30 req/min authenticated. Requires GITHUB_INGESTION_TOKEN.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';
import { requireEnv } from './_shared/env';

const limiter = new RateLimiter(25, 60_000);

interface SearchHit {
  name: string;
  path: string;
  html_url: string;
  repository: {
    full_name: string;
    description?: string;
    stargazers_count?: number;
    html_url: string;
  };
}

interface SearchResponse {
  total_count: number;
  items: SearchHit[];
}

// (query, resourceType) tuples. Each query maps to one resource type.
const TARGETS: Array<{ q: string; type: Parameters<typeof upsertResource>[1]['typeSlug'] }> = [
  { q: 'filename:SKILL.md language:markdown', type: 'skill' },
  { q: 'filename:AGENT.md', type: 'subagent' },
  { q: 'filename:AGENTS.md', type: 'subagent' },
  { q: 'filename:.cursorrules', type: 'rule' },
  { q: 'filename:CLAUDE.md', type: 'rule' },
  { q: 'path:.claude/commands extension:md', type: 'command' },
  { q: 'path:.claude/hooks extension:json', type: 'hook' },
];

await withIngestionRun(
  {
    sourceSlug: 'github-code-search',
    priority: 'normal',
    requiredEnv: ['GITHUB_INGESTION_TOKEN'],
  },
  async (ctx) => {
    const token = requireEnv('GITHUB_INGESTION_TOKEN');

    // Incremental: only files changed in last 2 days unless RUN_MODE=full.
    const mode = process.env.RUN_MODE ?? 'incremental';
    const since = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
    const incrementalSuffix = mode === 'incremental' ? ` pushed:>${since}` : '';

    let totalSeen = 0;
    const allHits: SearchHit[] = [];

    for (const target of TARGETS) {
      // Two pages, 100 each → 200 hits per query per run.
      for (let page = 1; page <= 2; page++) {
        await limiter.acquire();
        try {
          const url = `https://api.github.com/search/code?q=${encodeURIComponent(target.q + incrementalSuffix)}&per_page=100&page=${page}`;
          const resp = await fetchJson<SearchResponse>(url, {
            headers: {
              accept: 'application/vnd.github+json',
              authorization: `Bearer ${token}`,
              'user-agent': 'vibecoderhub-ingest/1',
            },
          });
          totalSeen += resp.total_count;
          allHits.push(...resp.items);

          for (const hit of resp.items) {
            const stars = hit.repository.stargazers_count ?? 0;
            if (stars < 5) continue;

            const slug = slugify(`${hit.repository.full_name}-${hit.path}`);
            await upsertResource(ctx, {
              typeSlug: target.type,
              slug,
              name: `${hit.repository.full_name}/${hit.name}`,
              tagline: hit.repository.description?.slice(0, 200) ?? null,
              description: hit.repository.description ?? null,
              sourceUrl: hit.html_url,
              homepageUrl: hit.repository.html_url,
              authorHandle: hit.repository.full_name.split('/')[0],
            }).catch(() => undefined);
          }
          if (resp.items.length < 100) break;
        } catch (err) {
          ctx.counters.failed += 1;
          ctx.logger.warn('search query failed', { q: target.q, err: String(err).slice(0, 200) });
          break;
        }
      }
    }

    await ctx.dump({ hits: allHits });
    ctx.metadata.totalSeen = totalSeen;
    ctx.metadata.mode = mode;
  },
);
