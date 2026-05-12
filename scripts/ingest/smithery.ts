// Smithery Registry — broader MCP coverage including hosted variants. Per
// data-sourcing spec §3. Every 6h. API key required for headroom.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';
import { requireEnv } from './_shared/env';

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
  pagination?: { totalPages?: number };
}

async function main() {
  await withIngestionRun(
  { sourceSlug: 'smithery', priority: 'normal', requiredEnv: ['SMITHERY_API_KEY'] },
  async (ctx) => {
    const apiKey = requireEnv('SMITHERY_API_KEY');
    const all: SmitheryServer[] = [];

    let page = 1;
    while (page <= 50) {
      await limiter.acquire();
      const resp = await fetchJson<SmitheryResponse>(
        `https://registry.smithery.ai/servers?page=${page}&pageSize=100`,
        {
          headers: {
            authorization: `Bearer ${apiKey}`,
            'user-agent': 'vibecoderhub-ingest/1',
          },
        },
      );
      const batch = resp.servers ?? [];
      all.push(...batch);
      const total = resp.pagination?.totalPages ?? 1;
      if (page >= total || batch.length === 0) break;
      page += 1;
    }

    await ctx.dump(all);
    ctx.metadata.fetched = all.length;

    for (const srv of all) {
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
