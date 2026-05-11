// OpenRouter /api/v1/models — free, no auth. Source-of-truth for
// provider-availability + a backup signal for model pricing. Per data-sourcing
// spec §2.
//
// Every 6h via .github/workflows/ingest-openrouter.yml.

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

interface ORModel {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  top_provider?: { is_moderated?: boolean };
  architecture?: { modality?: string };
}

interface ORResponse {
  data: ORModel[];
}

const limiter = new RateLimiter(60, 60_000);

await withIngestionRun(
  { sourceSlug: 'openrouter', priority: 'high' },
  async (ctx) => {
    await limiter.acquire();
    const json = await fetchJson<ORResponse>('https://openrouter.ai/api/v1/models', {
      headers: { 'user-agent': 'vibecoderhub-ingest/1' },
    });

    await ctx.dump(json);
    ctx.metadata.fetched = json.data.length;
    ctx.logger.info('fetched', { count: json.data.length });

    for (const m of json.data) {
      const slug = slugify(m.id);
      const isOpenWeights = m.id.includes('/') && /^(meta-llama|mistralai|qwen|google\/gemma|deepseek|nous|cognitivecomputations)\//i.test(m.id);
      await upsertResource(ctx, {
        typeSlug: 'model',
        slug,
        name: m.name ?? m.id,
        tagline: m.description?.slice(0, 200) ?? null,
        description: m.description ?? null,
        sourceUrl: `https://openrouter.ai/models/${m.id}`,
        isOpenWeights,
      }).catch(() => undefined);
    }
  },
);
