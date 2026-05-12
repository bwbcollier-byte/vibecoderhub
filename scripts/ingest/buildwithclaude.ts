// buildwithclaude marketplace — plugins.json on GitHub. Per data-sourcing
// spec §6. Daily cadence. Bundled skills/commands/hooks land as their own
// rows so they show up under the right resource type.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(30, 60_000);

interface MarketplacePlugin {
  name: string;
  description?: string;
  version?: string;
  author?: { name?: string; url?: string } | string;
  repository?: string;
  license?: string;
  keywords?: string[];
  category?: string;
  source?: { type?: string; path?: string };
}

interface Marketplace {
  name?: string;
  version?: string;
  plugins?: MarketplacePlugin[];
}

function authorHandle(a: MarketplacePlugin['author']): string | null {
  if (!a) return null;
  if (typeof a === 'string') return a;
  return a.name ?? null;
}

async function main() {
  await withIngestionRun(
  { sourceSlug: 'buildwithclaude', priority: 'normal' },
  async (ctx) => {
    await limiter.acquire();
    const data = await fetchJson<Marketplace>(
      'https://raw.githubusercontent.com/davepoon/buildwithclaude/main/.claude-plugin/marketplace.json',
    ).catch((err) => {
      ctx.logger.warn('marketplace fetch failed', { err: String(err).slice(0, 200) });
      return { plugins: [] as MarketplacePlugin[] };
    });
    const plugins = data.plugins ?? [];

    await ctx.dump(data);
    ctx.metadata.plugins = plugins.length;

    for (const p of plugins) {
      if (!p.name) continue;
      const pluginSlug = slugify(p.name);
      await upsertResource(ctx, {
        typeSlug: 'plugin',
        slug: pluginSlug,
        name: p.name,
        tagline: p.description?.slice(0, 200) ?? null,
        description: p.description ?? null,
        sourceUrl: p.repository ?? null,
        currentVersion: p.version ?? null,
        authorHandle: authorHandle(p.author),
        stackTags: ['claude-code', ...(p.keywords ?? []).slice(0, 6)],
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
