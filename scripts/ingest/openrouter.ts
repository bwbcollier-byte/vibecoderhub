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
import { getDb } from './_shared/db';
import { models } from '@/db/schema';

interface ORModel {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string; image?: string };
  top_provider?: { context_length?: number; max_completion_tokens?: number; is_moderated?: boolean };
  architecture?: { modality?: string; tokenizer?: string; instruct_type?: string | null };
}

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  google: 'Google',
  'meta-llama': 'Meta',
  mistralai: 'Mistral',
  deepseek: 'DeepSeek',
  qwen: 'Qwen',
  cohere: 'Cohere',
  microsoft: 'Microsoft',
  perplexity: 'Perplexity',
  nousresearch: 'Nous Research',
  xai: 'xAI',
};

function deriveProvider(orId: string, displayName: string | undefined): string {
  const prefix = orId.split('/')[0]!.toLowerCase();
  if (PROVIDER_LABELS[prefix]) return PROVIDER_LABELS[prefix]!;
  if (displayName?.includes(':')) return displayName.split(':')[0]!.trim();
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

function perTokenToPerMtok(s: string | undefined): string | null {
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  // OpenRouter prices are per-token in USD. Convert to per-million-tokens.
  return (n * 1_000_000).toFixed(4);
}

function modalityFlags(modality: string | undefined) {
  const m = (modality ?? '').toLowerCase();
  return {
    supportsVision: m.includes('image') || m.includes('vision') || m.includes('multimodal'),
    supportsAudio: m.includes('audio'),
    supportsPdf: m.includes('pdf') || m.includes('document'),
  };
}

interface ORResponse {
  data: ORModel[];
}

const limiter = new RateLimiter(60, 60_000);

async function main() {
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

    const db = getDb();
    for (const m of json.data) {
      const slug = slugify(m.id);
      const isOpenWeights = m.id.includes('/') && /^(meta-llama|mistralai|qwen|google\/gemma|deepseek|nous|cognitivecomputations)\//i.test(m.id);
      const result = await upsertResource(ctx, {
        typeSlug: 'model',
        slug,
        name: m.name ?? m.id,
        tagline: m.description?.slice(0, 200) ?? null,
        description: m.description ?? null,
        sourceUrl: `https://openrouter.ai/models/${m.id}`,
        isOpenWeights,
      }).catch(() => undefined);
      if (!result) continue;

      const provider = deriveProvider(m.id, m.name);
      const priceIn = perTokenToPerMtok(m.pricing?.prompt);
      const priceOut = perTokenToPerMtok(m.pricing?.completion);
      const blended =
        priceIn && priceOut
          ? ((Number(priceIn) * 3 + Number(priceOut)) / 4).toFixed(4)
          : null;
      const ctx2 = m.top_provider?.context_length ?? m.context_length ?? null;
      const flags = modalityFlags(m.architecture?.modality);

      await db
        .insert(models)
        .values({
          id: result.id,
          provider,
          modelFamily: m.id.split('/')[0] ?? null,
          contextWindowAdvertised: ctx2,
          contextWindowEffective: ctx2,
          outputMaxTokens: m.top_provider?.max_completion_tokens ?? null,
          priceInputPerMtok: priceIn,
          priceOutputPerMtok: priceOut,
          blendedCostPerMtok: blended,
          supportsVision: flags.supportsVision,
          supportsAudio: flags.supportsAudio,
          supportsPdf: flags.supportsPdf,
          tokenizer: m.architecture?.tokenizer ?? null,
          architecture: m.architecture?.instruct_type ?? m.architecture?.modality ?? null,
        })
        .onConflictDoUpdate({
          target: models.id,
          set: {
            provider,
            modelFamily: m.id.split('/')[0] ?? null,
            contextWindowAdvertised: ctx2,
            contextWindowEffective: ctx2,
            outputMaxTokens: m.top_provider?.max_completion_tokens ?? null,
            priceInputPerMtok: priceIn,
            priceOutputPerMtok: priceOut,
            blendedCostPerMtok: blended,
            supportsVision: flags.supportsVision,
            supportsAudio: flags.supportsAudio,
            supportsPdf: flags.supportsPdf,
            tokenizer: m.architecture?.tokenizer ?? null,
            architecture: m.architecture?.instruct_type ?? m.architecture?.modality ?? null,
          },
        })
        .catch((err: unknown) => {
          ctx.logger.warn('models upsert failed', { slug, err: String(err) });
        });
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
