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

async function main() {
  await withIngestionRun(
  {
    sourceSlug: 'github-code-search',
    priority: 'normal',
    requiredEnv: ['GITHUB_INGESTION_TOKEN'],
  },
  async (ctx) => {
    const token = requireEnv('GITHUB_INGESTION_TOKEN');

    // NOTE: `pushed:>YYYY-MM-DD` is NOT a valid qualifier on /search/code
    // (only /search/repositories supports it). Earlier versions of this
    // script appended ` pushed:>…` to every query, which silently zeroed
    // the result count.
    const mode = process.env.RUN_MODE ?? 'full';

    let totalSeen = 0;
    const allHits: SearchHit[] = [];

    // Stars aren't returned by /search/code — repo payload there is a stub.
    // Resolve via /repos/{owner}/{repo}, cached per repo to keep API calls
    // bounded across queries.
    const starCache = new Map<string, number>();
    const STAR_FLOOR = 5;

    async function resolveStars(fullName: string): Promise<number> {
      const cached = starCache.get(fullName);
      if (cached !== undefined) return cached;
      await limiter.acquire();
      try {
        const repo = await fetchJson<{ stargazers_count?: number }>(
          `https://api.github.com/repos/${fullName}`,
          {
            headers: {
              accept: 'application/vnd.github+json',
              authorization: `Bearer ${token}`,
              'user-agent': 'vibecoderhub-ingest/1',
            },
          },
        );
        const n = repo.stargazers_count ?? 0;
        starCache.set(fullName, n);
        return n;
      } catch {
        starCache.set(fullName, 0);
        return 0;
      }
    }

    for (const target of TARGETS) {
      for (let page = 1; page <= 2; page++) {
        await limiter.acquire();
        try {
          const url = `https://api.github.com/search/code?q=${encodeURIComponent(target.q)}&per_page=100&page=${page}`;
          const resp = await fetchJson<SearchResponse>(url, {
            headers: {
              accept: 'application/vnd.github+json',
              authorization: `Bearer ${token}`,
              'user-agent': 'vibecoderhub-ingest/1',
            },
          });
          totalSeen += resp.total_count;
          allHits.push(...resp.items);
          ctx.logger.info('search hit', {
            q: target.q,
            page,
            total: resp.total_count,
            returned: resp.items.length,
          });

          for (const hit of resp.items) {
            const stars = await resolveStars(hit.repository.full_name);
            if (stars < STAR_FLOOR) continue;

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
    ctx.metadata.uniqueRepos = starCache.size;
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
