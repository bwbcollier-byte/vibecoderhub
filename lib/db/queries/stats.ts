// Live aggregate counts for the landing-page stats strip + footer hints.
// Cached per process in dev; in prod each request just runs three count
// queries (cheap — covered by partial indexes).

import 'server-only';
import { and, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { resources, news, deals } from '@/db/schema';

import { safeQuery } from './_safe';

export interface SiteStats {
  totalResources: number;
  totalModels: number;
  totalMcps: number;
  totalNews: number;
  activeDealsValueUsd: number;
}

export async function getSiteStats(): Promise<SiteStats> {
  return safeQuery(async () => {
    const [resAll, resModels, resMcps, newsCount, dealsValue] = await Promise.all([
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(resources)
        .where(and(eq(resources.status, 'published'), isNull(resources.deletedAt))),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(resources)
        .where(
          and(
            eq(resources.typeSlug, 'model'),
            eq(resources.status, 'published'),
            isNull(resources.deletedAt),
          ),
        ),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(resources)
        .where(
          and(
            eq(resources.typeSlug, 'mcp'),
            eq(resources.status, 'published'),
            isNull(resources.deletedAt),
          ),
        ),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(news)
        .where(isNull(news.deletedAt)),
      db
        .select({ v: sql<number>`coalesce(sum(value_amount_usd), 0)::int` })
        .from(deals)
        .where(and(eq(deals.status, 'active'), isNull(deals.deletedAt))),
    ]);

    return {
      totalResources: resAll[0]?.n ?? 0,
      totalModels: resModels[0]?.n ?? 0,
      totalMcps: resMcps[0]?.n ?? 0,
      totalNews: newsCount[0]?.n ?? 0,
      activeDealsValueUsd: dealsValue[0]?.v ?? 0,
    };
  }, {
    totalResources: 0,
    totalModels: 0,
    totalMcps: 0,
    totalNews: 0,
    activeDealsValueUsd: 0,
  });
}
