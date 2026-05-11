// shadcn/ui official registry. JSON per component at /r/{name}.json.
// Per data-sourcing spec §4. Daily cadence.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';

const limiter = new RateLimiter(30, 60_000);

// Canonical shadcn primitives. Ground truth — broader registries layered on top.
const COMPONENTS = [
  'accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'avatar', 'badge',
  'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox',
  'collapsible', 'combobox', 'command', 'context-menu', 'data-table', 'date-picker',
  'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input', 'input-otp',
  'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress',
  'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet',
  'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea',
  'toast', 'toggle', 'toggle-group', 'tooltip',
];

interface ShadcnEntry {
  name: string;
  description?: string;
  type?: string;
  dependencies?: string[];
  files?: Array<{ path: string }>;
}

await withIngestionRun(
  { sourceSlug: 'shadcn', priority: 'normal' },
  async (ctx) => {
    const collected: ShadcnEntry[] = [];
    for (const name of COMPONENTS) {
      await limiter.acquire();
      try {
        const entry = await fetchJson<ShadcnEntry>(`https://ui.shadcn.com/r/styles/default/${name}.json`, {
          headers: { 'user-agent': 'vibecoderhub-ingest/1' },
        });
        collected.push(entry);
        await upsertResource(ctx, {
          typeSlug: 'component',
          slug: name,
          name: entry.name ?? name,
          tagline: `shadcn/ui ${name} primitive`,
          description: entry.description ?? null,
          sourceUrl: `https://ui.shadcn.com/docs/components/${name}`,
          isOfficial: true,
          stackTags: ['shadcn', 'react', 'tailwind'],
        }).catch(() => undefined);
      } catch (err) {
        ctx.counters.failed += 1;
        ctx.logger.warn('shadcn component fetch failed', { name, err: String(err) });
      }
    }
    await ctx.dump(collected);
    ctx.metadata.fetched = collected.length;
  },
);
