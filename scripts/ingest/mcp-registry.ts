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
  name?: string;
  title?: string;
  description?: string;
  version?: string;
  repository?: { url?: string };
  homepage?: string;
  packages?: Array<{ runtime?: string }>;
}

interface RegistryEntry {
  server?: RegistryServer;
  _meta?: Record<string, unknown>;
}

interface ListResponse {
  servers: RegistryEntry[];
  metadata?: { nextCursor?: string; count?: number };
}

async function main() {
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
      for (const entry of resp.servers ?? []) {
        if (entry.server) all.push(entry.server);
      }
      cursor = resp.metadata?.nextCursor;
      pages += 1;
      if (pages > 50) break;
    } while (cursor);

    await ctx.dump(all);
    ctx.metadata.fetched = all.length;
    ctx.metadata.pages = pages;

    // De-duplicate by canonical name — the registry returns every published version.
    const latest = new Map<string, RegistryServer>();
    for (const srv of all) {
      if (!srv.name) continue;
      latest.set(srv.name, srv);
    }

    for (const srv of latest.values()) {
      const name = srv.title || srv.name!;
      const slug = slugify(srv.name!);
      await upsertResource(ctx, {
        typeSlug: 'mcp',
        slug,
        name,
        tagline: srv.description?.slice(0, 200) ?? null,
        description: srv.description ?? null,
        sourceUrl: srv.repository?.url ?? null,
        homepageUrl: srv.homepage ?? null,
        currentVersion: srv.version ?? null,
        isOfficial: true,
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
