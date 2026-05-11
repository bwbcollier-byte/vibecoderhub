// Seed data for /deals. Three tiers: `public` (visible to all),
// `member` (visible after signup), `pro` (blurred + paywalled until upgrade).
// Reference: docs/planning/promptkit-recon/src/data.js window.DEALS.

import { colors } from '../tokens';

export type DealTier = 'public' | 'member' | 'pro';
export type DealCategory = 'AI APIs' | 'Cloud' | 'Dev tools' | 'Productivity';

export interface Deal {
  slug: string;
  name: string;
  /** Display value, e.g. "$5,000" or "6 months". */
  value: string;
  /** Numeric value in USD for sorting; rough conversion for non-$ values. */
  valueRaw: number;
  summary: string;
  tier: DealTier;
  category: DealCategory;
  provider: string;
  /** Tile colour for the provider mark, from canonical palette. */
  providerColor: string;
  expires: string;
  claimed: number;
}

export const DEALS: Deal[] = [
  {
    slug: 'anthropic-startup',
    name: 'Anthropic Startup Program',
    value: '$5,000',
    valueRaw: 5_000,
    summary: 'Claude API credits for early-stage startups',
    tier: 'public',
    category: 'AI APIs',
    provider: 'Anthropic',
    providerColor: colors.tileOrange,
    expires: 'Dec 31, 2026',
    claimed: 8_421,
  },
  {
    slug: 'cursor-pro-50',
    name: 'Cursor Pro 50% off',
    value: '6 months',
    valueRaw: 240,
    summary: 'Half off six months of Cursor Pro',
    tier: 'member',
    category: 'Dev tools',
    provider: 'Cursor',
    providerColor: colors.tileWhite,
    expires: 'Aug 31, 2026',
    claimed: 4_012,
  },
  {
    slug: 'do-hatch',
    name: 'DigitalOcean Hatch',
    value: '$10,000',
    valueRaw: 10_000,
    summary: 'Cloud credits for early-stage founders',
    tier: 'public',
    category: 'Cloud',
    provider: 'DigitalOcean',
    providerColor: colors.tileBlue,
    expires: 'Dec 31, 2026',
    claimed: 2_104,
  },
  {
    slug: 'msft-startups',
    name: 'Microsoft for Startups',
    value: '$150,000',
    valueRaw: 150_000,
    summary: 'Azure credits + GitHub + Visual Studio bundles',
    tier: 'pro',
    category: 'Cloud',
    provider: 'Microsoft',
    providerColor: colors.tilePurple,
    expires: 'Mar 31, 2027',
    claimed: 1_240,
  },
  {
    slug: 'aws-activate',
    name: 'AWS Activate',
    value: '$5,000',
    valueRaw: 5_000,
    summary: 'AWS credits for accelerator-backed startups',
    tier: 'pro',
    category: 'Cloud',
    provider: 'AWS',
    providerColor: colors.tileOrange,
    expires: 'Dec 31, 2026',
    claimed: 4_012,
  },
  {
    slug: 'vercel-pro',
    name: 'Vercel Pro',
    value: '$10,000',
    valueRaw: 10_000,
    summary: '12 months of Vercel Pro on us',
    tier: 'pro',
    category: 'Cloud',
    provider: 'Vercel',
    providerColor: colors.tileWhite,
    expires: 'Jun 30, 2026',
    claimed: 821,
  },
  {
    slug: 'gcp-startup',
    name: 'Google for Startups',
    value: '$200,000',
    valueRaw: 200_000,
    summary: 'GCP credits over 2 years',
    tier: 'pro',
    category: 'Cloud',
    provider: 'Google',
    providerColor: colors.tileBlue,
    expires: 'Dec 31, 2026',
    claimed: 2_102,
  },
  {
    slug: 'linear-startup',
    name: 'Linear Startup',
    value: '50% off',
    valueRaw: 600,
    summary: '6 months off the Linear Standard plan',
    tier: 'public',
    category: 'Productivity',
    provider: 'Linear',
    providerColor: colors.tilePurple,
    expires: 'Sep 30, 2026',
    claimed: 4_210,
  },
  {
    slug: 'stripe-atlas',
    name: 'Stripe Atlas',
    value: '$5,000',
    valueRaw: 5_000,
    summary: 'Free incorporation + $5K AWS credits',
    tier: 'member',
    category: 'Productivity',
    provider: 'Stripe',
    providerColor: colors.tilePurple,
    expires: 'Dec 31, 2026',
    claimed: 1_820,
  },
  {
    slug: 'openai-startups',
    name: 'OpenAI for Startups',
    value: '$2,500',
    valueRaw: 2_500,
    summary: 'OpenAI API credits for YC-backed teams',
    tier: 'member',
    category: 'AI APIs',
    provider: 'OpenAI',
    providerColor: colors.tileMint,
    expires: 'Dec 31, 2026',
    claimed: 3_410,
  },
];

export function totalDealValue(): number {
  return DEALS.reduce((sum, d) => sum + d.valueRaw, 0);
}

export function listDeals(): Deal[] {
  return DEALS;
}
