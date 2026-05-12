// Live queries against pk_news. Drop-in for lib/seed/news.ts.

import 'server-only';
import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { news } from '@/db/schema';
import type { NewsItem, NewsKind } from '@/lib/seed/news';

import { safeQuery } from './_safe';

const baseWhere = isNull(news.deletedAt);

type DbNewsKind = 'ecosystem' | 'release' | 'price_change' | 'tutorial' | 'op_ed';

const SEED_TO_DB: Record<NewsKind, DbNewsKind> = {
  breaking: 'ecosystem',
  releases: 'release',
  ecosystem: 'ecosystem',
  tutorials: 'tutorial',
  'op-eds': 'op_ed',
  price: 'price_change',
};

const DB_TO_SEED: Record<DbNewsKind, NewsKind> = {
  ecosystem: 'ecosystem',
  release: 'releases',
  price_change: 'price',
  tutorial: 'tutorials',
  op_ed: 'op-eds',
};

export interface ListNewsArgs {
  kind?: NewsKind;
  limit?: number;
  offset?: number;
}

export async function listNews(args: ListNewsArgs = {}): Promise<NewsItem[]> {
  const { kind, limit = 100, offset = 0 } = args;
  return safeQuery(async () => {
    const where = kind ? and(baseWhere, eq(news.kind, SEED_TO_DB[kind])) : baseWhere;
    const rows = await db
      .select()
      .from(news)
      .where(where)
      .orderBy(desc(news.publishedAt))
      .limit(limit)
      .offset(offset);
    return rows.map(mapRow);
  }, [] as NewsItem[]);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return safeQuery(async () => {
    const rows = await db
      .select()
      .from(news)
      .where(and(baseWhere, eq(news.slug, slug)))
      .limit(1);
    if (rows.length === 0) return undefined;
    return mapRow(rows[0]!);
  }, undefined);
}

export async function listNewsSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db.select({ slug: news.slug }).from(news).where(baseWhere);
    return rows.map((r) => r.slug);
  }, []);
}

type NewsRow = typeof news.$inferSelect;

function mapRow(n: NewsRow): NewsItem {
  return {
    slug: n.slug,
    kind: n.isBreaking ? 'breaking' : DB_TO_SEED[n.kind as DbNewsKind],
    headline: n.title,
    summary: n.summary ?? '',
    source: n.sourceName ?? '',
    time: relativeTime(n.publishedAt),
    variant: n.isBreaking ? 'pink' : n.isPinned ? 'mint' : 'dark',
    topics: n.topics ?? [],
    auto: n.sourceKind !== 'editorial',
    body: n.body ?? '',
  };
}

function relativeTime(d: Date): string {
  const hours = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
