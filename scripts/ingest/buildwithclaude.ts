// buildwithclaude marketplace — plugins.json on GitHub. Per data-sourcing
// spec §6. Daily cadence. Bundled skills/commands/hooks land as their own
// rows so they show up under the right resource type.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(30, 60_000);

interface Plugin {
  name: string;
  description?: string;
  repo?: string;
  author?: string;
  version?: string;
  skills?: Array<{ name: string; description?: string }>;
  commands?: Array<{ name: string; description?: string }>;
  hooks?: Array<{ name: string; description?: string }>;
  subagents?: Array<{ name: string; description?: string }>;
}

interface PluginsFile {
  plugins: Plugin[];
}

await withIngestionRun(
  { sourceSlug: 'buildwithclaude', priority: 'normal' },
  async (ctx) => {
    await limiter.acquire();
    const data = await fetchJson<PluginsFile | Plugin[]>(
      'https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/plugins.json',
    ).catch(() => ({ plugins: [] as Plugin[] }));
    const plugins = Array.isArray(data) ? data : (data.plugins ?? []);

    await ctx.dump(plugins);
    ctx.metadata.plugins = plugins.length;

    for (const p of plugins) {
      const pluginSlug = slugify(p.name);
      await upsertResource(ctx, {
        typeSlug: 'plugin',
        slug: pluginSlug,
        name: p.name,
        tagline: p.description?.slice(0, 200) ?? null,
        description: p.description ?? null,
        sourceUrl: p.repo ?? null,
        currentVersion: p.version ?? null,
        authorHandle: p.author ?? null,
        stackTags: ['claude-code'],
      }).catch(() => undefined);

      const bundles: Array<[Plugin['skills'], Parameters<typeof upsertResource>[1]['typeSlug']]> = [
        [p.skills, 'skill'],
        [p.commands, 'command'],
        [p.hooks, 'hook'],
        [p.subagents, 'subagent'],
      ];
      for (const [items, typeSlug] of bundles) {
        for (const item of items ?? []) {
          await upsertResource(ctx, {
            typeSlug,
            slug: slugify(`${p.name}-${item.name}`),
            name: item.name,
            tagline: item.description?.slice(0, 200) ?? null,
            description: item.description ?? null,
            sourceUrl: p.repo ?? null,
            stackTags: ['claude-code', `bundled:${pluginSlug}`],
          }).catch(() => undefined);
        }
      }
    }
  },
);
