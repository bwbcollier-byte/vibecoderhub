// Live queries against pk_deals. Drop-in for lib/seed/deals.ts.

import 'server-only';
import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { deals } from '@/db/schema';
import { colors } from '@/lib/tokens';
import type { Deal, DealCategory, DealTier } from '@/lib/seed/deals';

import { safeQuery } from './_safe';

const PROVIDER_TINTS: Record<string, string> = {
  Anthropic: colors.tileOrange,
  OpenAI: colors.tileMint,
  Google: colors.tilePurple,
  Vercel: colors.tileBlue,
  AWS: colors.tileYellow,
  Linear: colors.tilePink,
};

const baseWhere = and(eq(deals.status, 'active'), isNull(deals.deletedAt));

export interface ListDealsArgs {
  tier?: DealTier;
  category?: DealCategory;
  sort?: 'newest' | 'value-high' | 'expiring';
  limit?: number;
}

export async function listDeals(args: ListDealsArgs = {}): Promise<Deal[]> {
  const { tier, category, sort = 'newest', limit = 100 } = args;
  return safeQuery(async () => {
    const conds = [baseWhere];
    if (tier) conds.push(eq(deals.tier, tier));
    if (category) conds.push(eq(deals.category, category));

    const orderClause = (() => {
      switch (sort) {
        case 'value-high':
          return desc(deals.valueAmountUsd);
        case 'expiring':
          return deals.expiresAt;
        case 'newest':
        default:
          return desc(deals.createdAt);
      }
    })();

    const rows = await db
      .select()
      .from(deals)
      .where(and(...conds))
      .orderBy(orderClause)
      .limit(limit);

    return rows.map(mapRow);
  }, [] as Deal[]);
}

type DealRow = typeof deals.$inferSelect;

function mapRow(d: DealRow): Deal {
  const provider = d.providerName;
  return {
    slug: d.slug,
    name: d.title,
    value: d.valueLabel ?? (d.valueAmountUsd ? `$${Number(d.valueAmountUsd).toLocaleString()}` : ''),
    valueRaw: d.valueAmountUsd != null ? Number(d.valueAmountUsd) : 0,
    summary: d.tagline ?? d.description ?? '',
    tier: d.tier,
    // category is text in DB but the seed shape narrows it; coerce.
    category: (d.category ?? 'Dev tools') as DealCategory,
    provider,
    providerColor: PROVIDER_TINTS[provider] ?? colors.tileMint,
    expires: d.expiresAt ? d.expiresAt.toISOString().slice(0, 10) : 'rolling',
    claimed: d.claimCountTotal,
  };
}
