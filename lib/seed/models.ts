/**
 * Seed model records — Session 5 (Slice S01).
 *
 * Drop-in replacement for the real Drizzle query that will live at
 * `lib/queries/models.ts` once Supabase is connected. The exported shape
 * (`ModelListItem` / `ModelDetail`) matches what `resources ⋈ models` will
 * return so swapping the import in `app/models/page.tsx` is the only change
 * needed when the DB lands.
 *
 * Values are seeded from `docs/planning/promptkit-recon/src/data.js` so the
 * visual reference matches Promptkit's prototype. Hex tints come from the
 * canonical palette in `lib/tokens.ts` — never inline.
 */

import { colors } from '../tokens';

export interface ModelListItem {
  slug: string;
  name: string;
  provider: string;
  providerColor: string;
  priceInputPerMtok: number;
  priceOutputPerMtok: number;
  blendedCostPerMtok: number;
  intelligenceIndex: number;
  outputTokensPerSecond: number;
  ttftMs: number;
  contextWindowAdvertised: number;
  contextWindowEffective: number;
  knowledgeCutoff: string;
  releasedAt: string;
  /** % change in blended cost vs. 30 days ago. Negative = price drop. */
  priceDeltaPct: number;
  tags: string[];
  isOpenWeights: boolean;
}

export interface ModelDetail extends ModelListItem {
  description: string;
  supportsTools: boolean;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsCaching: boolean;
  supportsReasoning: boolean;
  parametersBillions: number | null;
  architecture: string | null;
}

const MODELS: ModelDetail[] = [
  {
    slug: 'claude-opus-4-7',
    name: 'Claude Opus 4.7',
    provider: 'Anthropic',
    providerColor: colors.tileOrange,
    priceInputPerMtok: 3,
    priceOutputPerMtok: 15,
    blendedCostPerMtok: (3 * 3 + 15) / 4,
    intelligenceIndex: 4.7,
    outputTokensPerSecond: 78,
    ttftMs: 600,
    contextWindowAdvertised: 200_000,
    contextWindowEffective: 180_000,
    knowledgeCutoff: 'Apr 2026',
    releasedAt: 'May 2026',
    priceDeltaPct: -30,
    tags: ['reasoning', 'tools', 'vision', 'caching'],
    isOpenWeights: false,
    description:
      "Anthropic's flagship reasoning model. Best in class on agentic coding evals.",
    supportsTools: true,
    supportsVision: true,
    supportsAudio: false,
    supportsCaching: true,
    supportsReasoning: true,
    parametersBillions: null,
    architecture: 'Dense transformer',
  },
  {
    slug: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    providerColor: colors.tileBlue,
    priceInputPerMtok: 1.25,
    priceOutputPerMtok: 5,
    blendedCostPerMtok: (1.25 * 3 + 5) / 4,
    intelligenceIndex: 4.6,
    outputTokensPerSecond: 142,
    ttftMs: 400,
    contextWindowAdvertised: 2_000_000,
    contextWindowEffective: 1_100_000,
    knowledgeCutoff: 'Feb 2026',
    releasedAt: 'Mar 2026',
    priceDeltaPct: -12,
    tags: ['reasoning', 'vision', 'audio', 'tools'],
    isOpenWeights: false,
    description: 'Google\'s long-context flagship. 2M tokens advertised.',
    supportsTools: true,
    supportsVision: true,
    supportsAudio: true,
    supportsCaching: true,
    supportsReasoning: true,
    parametersBillions: null,
    architecture: 'Mixture-of-experts',
  },
  {
    slug: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    providerColor: colors.tileMint,
    priceInputPerMtok: 5,
    priceOutputPerMtok: 20,
    blendedCostPerMtok: (5 * 3 + 20) / 4,
    intelligenceIndex: 4.8,
    outputTokensPerSecond: 95,
    ttftMs: 500,
    contextWindowAdvertised: 400_000,
    contextWindowEffective: 320_000,
    knowledgeCutoff: 'Mar 2026',
    releasedAt: 'Apr 2026',
    priceDeltaPct: 0,
    tags: ['reasoning', 'tools', 'vision', 'audio'],
    isOpenWeights: false,
    description: 'OpenAI\'s frontier general-purpose model.',
    supportsTools: true,
    supportsVision: true,
    supportsAudio: true,
    supportsCaching: true,
    supportsReasoning: true,
    parametersBillions: null,
    architecture: 'Dense transformer',
  },
  {
    slug: 'qwen-3-coder-32b',
    name: 'Qwen 3 Coder 32B',
    provider: 'Alibaba',
    providerColor: colors.tileYellow,
    priceInputPerMtok: 0.18,
    priceOutputPerMtok: 0.54,
    blendedCostPerMtok: (0.18 * 3 + 0.54) / 4,
    intelligenceIndex: 4.2,
    outputTokensPerSecond: 210,
    ttftMs: 300,
    contextWindowAdvertised: 256_000,
    contextWindowEffective: 220_000,
    knowledgeCutoff: 'Jan 2026',
    releasedAt: 'Feb 2026',
    priceDeltaPct: -8,
    tags: ['open-weights', 'tools', 'caching'],
    isOpenWeights: true,
    description: 'Open-weights coder model tuned for agentic loops.',
    supportsTools: true,
    supportsVision: false,
    supportsAudio: false,
    supportsCaching: true,
    supportsReasoning: false,
    parametersBillions: 32,
    architecture: 'Dense transformer',
  },
  {
    slug: 'deepseek-v4',
    name: 'DeepSeek v4',
    provider: 'DeepSeek',
    providerColor: colors.tilePurple,
    priceInputPerMtok: 0.14,
    priceOutputPerMtok: 0.28,
    blendedCostPerMtok: (0.14 * 3 + 0.28) / 4,
    intelligenceIndex: 4.4,
    outputTokensPerSecond: 165,
    ttftMs: 400,
    contextWindowAdvertised: 128_000,
    contextWindowEffective: 110_000,
    knowledgeCutoff: 'Dec 2025',
    releasedAt: 'Jan 2026',
    priceDeltaPct: -22,
    tags: ['reasoning', 'open-weights', 'caching'],
    isOpenWeights: true,
    description: 'Reasoning-strong open-weights model from DeepSeek.',
    supportsTools: true,
    supportsVision: false,
    supportsAudio: false,
    supportsCaching: true,
    supportsReasoning: true,
    parametersBillions: 671,
    architecture: 'Mixture-of-experts',
  },
  {
    slug: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    providerColor: colors.tileOrange,
    priceInputPerMtok: 1.2,
    priceOutputPerMtok: 6,
    blendedCostPerMtok: (1.2 * 3 + 6) / 4,
    intelligenceIndex: 4.5,
    outputTokensPerSecond: 168,
    ttftMs: 400,
    contextWindowAdvertised: 200_000,
    contextWindowEffective: 175_000,
    knowledgeCutoff: 'Apr 2026',
    releasedAt: 'Apr 2026',
    priceDeltaPct: -15,
    tags: ['tools', 'vision', 'caching'],
    isOpenWeights: false,
    description: 'Mid-tier Anthropic model — coding workhorse.',
    supportsTools: true,
    supportsVision: true,
    supportsAudio: false,
    supportsCaching: true,
    supportsReasoning: false,
    parametersBillions: null,
    architecture: 'Dense transformer',
  },
  {
    slug: 'kimi-k3',
    name: 'Kimi K3',
    provider: 'Moonshot',
    providerColor: colors.tilePink,
    priceInputPerMtok: 0.6,
    priceOutputPerMtok: 2.4,
    blendedCostPerMtok: (0.6 * 3 + 2.4) / 4,
    intelligenceIndex: 4.3,
    outputTokensPerSecond: 188,
    ttftMs: 400,
    contextWindowAdvertised: 1_000_000,
    contextWindowEffective: 720_000,
    knowledgeCutoff: 'Jan 2026',
    releasedAt: 'Feb 2026',
    priceDeltaPct: -5,
    tags: ['tools', 'caching'],
    isOpenWeights: false,
    description: '1M-token context model from Moonshot AI.',
    supportsTools: true,
    supportsVision: false,
    supportsAudio: false,
    supportsCaching: true,
    supportsReasoning: false,
    parametersBillions: null,
    architecture: 'Mixture-of-experts',
  },
  {
    slug: 'llama-4-405b',
    name: 'Llama 4 405B',
    provider: 'Meta',
    providerColor: colors.tileBlue,
    priceInputPerMtok: 0.9,
    priceOutputPerMtok: 0.9,
    blendedCostPerMtok: (0.9 * 3 + 0.9) / 4,
    intelligenceIndex: 4.4,
    outputTokensPerSecond: 92,
    ttftMs: 700,
    contextWindowAdvertised: 128_000,
    contextWindowEffective: 96_000,
    knowledgeCutoff: 'Nov 2025',
    releasedAt: 'Dec 2025',
    priceDeltaPct: -18,
    tags: ['open-weights', 'tools', 'vision'],
    isOpenWeights: true,
    description: 'Meta\'s 405B open-weights flagship.',
    supportsTools: true,
    supportsVision: true,
    supportsAudio: false,
    supportsCaching: false,
    supportsReasoning: false,
    parametersBillions: 405,
    architecture: 'Dense transformer',
  },
];

export function listModels(): ModelDetail[] {
  return MODELS;
}

export function getModelBySlug(slug: string): ModelDetail | undefined {
  return MODELS.find((m) => m.slug === slug);
}

export type ModelSort =
  | 'intelligence'
  | 'cost-low'
  | 'speed'
  | 'context'
  | 'newest';

export function sortModels(items: ModelDetail[], sort: ModelSort): ModelDetail[] {
  const copy = [...items];
  switch (sort) {
    case 'intelligence':
      return copy.sort((a, b) => b.intelligenceIndex - a.intelligenceIndex);
    case 'cost-low':
      return copy.sort((a, b) => a.blendedCostPerMtok - b.blendedCostPerMtok);
    case 'speed':
      return copy.sort((a, b) => b.outputTokensPerSecond - a.outputTokensPerSecond);
    case 'context':
      return copy.sort(
        (a, b) => b.contextWindowAdvertised - a.contextWindowAdvertised,
      );
    case 'newest':
      // Reverse order of seed; releasedAt is a coarse string label.
      return copy.reverse();
    default:
      return copy;
  }
}

export function filterModels(
  items: ModelDetail[],
  q: string,
  openOnly: boolean,
): ModelDetail[] {
  const needle = q.trim().toLowerCase();
  return items.filter((m) => {
    if (openOnly && !m.isOpenWeights) return false;
    if (!needle) return true;
    const hay = `${m.name} ${m.provider} ${m.description} ${m.tags.join(' ')}`.toLowerCase();
    return hay.includes(needle);
  });
}
