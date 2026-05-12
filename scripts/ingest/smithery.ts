// Smithery Registry — broader MCP coverage including hosted variants. Per
// data-sourcing spec §3. Every 6h.
//
// The /servers endpoint at registry.smithery.ai is publicly readable (no
// auth required) — we use that. SMITHERY_API_KEY is honoured if set, for
// rate-limit headroom, but the script no longer requires it.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(60, 60_000);

interface SmitheryServer {
  qualifiedName: string;
  displayName?: string;
  description?: string;
  homepage?: string;
  iconUrl?: string;
  remote?: boolean;
}

interface SmitheryResponse {
  servers: SmitheryServer[];
  pagination?: { totalPages?: number; currentPage?: number; totalCount?: number };
}

const MAX_PAGES = 60; // 60 × 100 = 6,000 servers — generous headroom.

async function main() {
  await withIngestionRun(
  { sourceSlug: 'smithery', priority: 'normal' },
  async (ctx) => {
    const apiKey = process.env.SMITHERY_API_KEY;
    const headers: Record<string, string> = {
      'user-agent': 'vibecoderhub-ingest/1',
      accept: 'application/json',
    };
    if (apiKey && apiKey !== 'sk_dummy') {
      headers.authorization = `Bearer ${apiKey}`;
    }

    const all: SmitheryServer[] = [];
    let page = 1;
    let totalPages: number | undefined;

    while (page <= MAX_PAGES) {
      await limiter.acquire();
      try {
        const resp = await fetchJson<SmitheryResponse>(
          `https://registry.smithery.ai/servers?page=${page}&pageSize=100`,
          { headers },
        );
        const batch = resp.servers ?? [];
        all.push(...batch);
        totalPages = resp.pagination?.totalPages ?? totalPages ?? 1;
        if (page === 1) {
          ctx.logger.info('smithery first page', {
            totalPages,
            totalCount: resp.pagination?.totalCount,
            firstBatch: batch.length,
          });
        }
        if (batch.length === 0 || page >= totalPages) break;
        page += 1;
      } catch (err) {
        ctx.logger.warn('smithery page failed', { page, err: String(err).slice(0, 200) });
        break;
      }
    }

    await ctx.dump(all);
    ctx.metadata.fetched = all.length;
    ctx.metadata.totalPages = totalPages;
    ctx.metadata.usedAuth = Boolean(apiKey && apiKey !== 'sk_dummy');

    for (const srv of all) {
      if (!srv.qualifiedName) continue;
      const slug = slugify(srv.qualifiedName);
      await upsertResource(ctx, {
        typeSlug: 'mcp',
        slug,
        name: srv.displayName ?? srv.qualifiedName,
        tagline: srv.description?.slice(0, 200) ?? null,
        description: srv.description ?? null,
        sourceUrl: `https://smithery.ai/server/${srv.qualifiedName}`,
        homepageUrl: srv.homepage ?? null,
        thumbnailUrl: srv.iconUrl ?? null,
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
