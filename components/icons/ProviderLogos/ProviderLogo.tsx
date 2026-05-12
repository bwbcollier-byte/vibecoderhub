import * as React from 'react';

import { cn } from '@/lib/shadcn/cn';

interface ProviderLogoProps {
  /** Raw provider name from the data layer, e.g. "OpenAI", "DeepSeek". */
  provider: string;
  /** Pixel size for the rendered mark (square). Defaults to 32 to match ModelCard. */
  size?: number;
  /** Optional bg colour for the fallback initials tile (typically `model.providerColor`). */
  fallbackColor?: string;
  className?: string;
}

/**
 * Known provider slugs we ship SVGs for under `/logos/providers/<slug>.svg`.
 * Keep this list in sync with `public/logos/providers/`.
 */
const KNOWN_SLUGS = new Set([
  'openai',
  'anthropic',
  'google',
  'meta',
  'mistral',
  'cohere',
  'deepseek',
  'microsoft',
  'nvidia',
  'amazon',
  'alibaba',
  'xai',
  'together',
  'perplexity',
  'inflection',
]);

/**
 * Defensive alias map: normalised key (lowercase, alnum only) → canonical slug.
 * Catches casing variants, spacing, hyphens, and common rebrands/shorthand.
 */
const ALIAS_MAP: Record<string, string> = {
  // OpenAI
  openai: 'openai',
  gpt: 'openai',
  chatgpt: 'openai',
  // Anthropic
  anthropic: 'anthropic',
  claude: 'anthropic',
  // Google
  google: 'google',
  googledeepmind: 'google',
  deepmind: 'google',
  gemini: 'google',
  googleai: 'google',
  // Meta
  meta: 'meta',
  metaai: 'meta',
  facebook: 'meta',
  llama: 'meta',
  // Mistral
  mistral: 'mistral',
  mistralai: 'mistral',
  // Cohere
  cohere: 'cohere',
  // DeepSeek
  deepseek: 'deepseek',
  // Microsoft
  microsoft: 'microsoft',
  msft: 'microsoft',
  phi: 'microsoft',
  // NVIDIA
  nvidia: 'nvidia',
  nemotron: 'nvidia',
  // Amazon
  amazon: 'amazon',
  aws: 'amazon',
  amazonbedrock: 'amazon',
  bedrock: 'amazon',
  amazonwebservices: 'amazon',
  // Alibaba
  alibaba: 'alibaba',
  qwen: 'alibaba',
  alibabacloud: 'alibaba',
  // xAI
  xai: 'xai',
  grok: 'xai',
  // Together
  together: 'together',
  togetherai: 'together',
  // Perplexity
  perplexity: 'perplexity',
  perplexityai: 'perplexity',
  // Inflection
  inflection: 'inflection',
  inflectionai: 'inflection',
  pi: 'inflection',
};

function normalise(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function resolveSlug(provider: string): string | null {
  const key = normalise(provider);
  if (!key) return null;
  if (ALIAS_MAP[key]) return ALIAS_MAP[key];
  if (KNOWN_SLUGS.has(key)) return key;
  return null;
}

export function ProviderLogo({
  provider,
  size = 32,
  fallbackColor,
  className,
}: ProviderLogoProps): React.ReactElement {
  const slug = resolveSlug(provider);

  if (slug) {
    return (
      <img
        src={`/logos/providers/${slug}.svg`}
        alt={`${provider} logo`}
        width={size}
        height={size}
        className={cn('shrink-0', className)}
      />
    );
  }

  // Fallback: initials tile, mirrors the styling previously inlined in ModelCard.
  const initials = provider
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const style: React.CSSProperties = { width: size, height: size };
  if (fallbackColor) style.background = fallbackColor;

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex items-center justify-center rounded-sm font-mono font-bold text-[11px] text-black tracking-[0.5px] shrink-0',
        !fallbackColor && 'bg-text-secondary',
        className,
      )}
      style={style}
    >
      {initials}
    </span>
  );
}
