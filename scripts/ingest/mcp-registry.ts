// Official MCP Registry (registry.modelcontextprotocol.io). Anthropic-backed,
// becoming canonical. Per data-sourcing spec §3. Every 6h.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(60, 60_000);

interface RegistryServer {
  id?: string;
  name: string;
  description?: string;
  repository?: { url?: string };
  homepage?: string;
  version_detail?: { version?: string };
  packages?: Array<{ runtime?: string }>;
}

interface ListResponse {
  servers: RegistryServer[];
  next?: string;
}

await withIngestionRun(
  { sourceSlug: 'mcp-official-registry', priority: 'high' },
  async (ctx) => {
    const all: RegistryServer[] = [];
    let cursor: string | undefined;
    let pages = 0;
    do {
      await limiter.acquire();
      const url = cursor
        ? `https://registry.modelcontextprotocol.io/v0/servers?cursor=${encodeURIComponent(cursor)}`
        : 'https://registry.modelcontextprotocol.io/v0/servers';
      const resp = await fetchJson<ListResponse>(url, {
        headers: { 'user-agent': 'vibecoderhub-ingest/1' },
      });
      all.push(...(resp.servers ?? []));
      cursor = resp.next;
      pages += 1;
      if (pages > 50) break;
    } while (cursor);

    await ctx.dump(all);
    ctx.metadata.fetched = all.length;
    ctx.metadata.pages = pages;

    for (const srv of all) {
      const slug = slugify(srv.name);
      await upsertResource(ctx, {
        typeSlug: 'mcp',
        slug,
        name: srv.name,
        tagline: srv.description?.slice(0, 200) ?? null,
        description: srv.description ?? null,
        sourceUrl: srv.repository?.url ?? null,
        homepageUrl: srv.homepage ?? null,
        currentVersion: srv.version_detail?.version ?? null,
        isOfficial: true,
      }).catch(() => undefined);
    }
  },
);
