// Live queries against pk_resources ⋈ pk_mcps. Drop-in for lib/seed/mcps.ts.

import 'server-only';
import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { resources, mcps } from '@/db/schema';
import type { McpDetail, McpListItem, McpSort, McpTool } from '@/lib/seed/mcps';

import { safeQuery } from './_safe';

const baseWhere = and(
  eq(resources.typeSlug, 'mcp'),
  eq(resources.status, 'published'),
  isNull(resources.deletedAt),
);

export interface ListMcpsArgs {
  sort?: McpSort;
  limit?: number;
  offset?: number;
}

export async function listMcps(args: ListMcpsArgs = {}): Promise<McpDetail[]> {
  const { sort = 'trending', limit = 200, offset = 0 } = args;

  return safeQuery(async () => {
    const orderClause = (() => {
      switch (sort) {
        case 'rating':
          return desc(resources.ratingAvg);
        case 'newest':
          return desc(resources.publishedAt);
        case 'most-tools':
          return desc(mcps.toolCount);
        case 'trending':
        default:
          return desc(resources.trendingScore);
      }
    })();

    const rows = await db
      .select({ r: resources, m: mcps })
      .from(resources)
      .innerJoin(mcps, eq(mcps.id, resources.id))
      .where(baseWhere)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return rows.map(({ r, m }) => mapRow(r, m));
  }, [] as McpDetail[]);
}

export async function getMcpBySlug(slug: string): Promise<McpDetail | undefined> {
  return safeQuery(async () => {
    const rows = await db
      .select({ r: resources, m: mcps })
      .from(resources)
      .innerJoin(mcps, eq(mcps.id, resources.id))
      .where(and(baseWhere, eq(resources.slug, slug)))
      .limit(1);
    if (rows.length === 0) return undefined;
    return mapRow(rows[0]!.r, rows[0]!.m);
  }, undefined);
}

export async function listMcpSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db.select({ slug: resources.slug }).from(resources).where(baseWhere);
    return rows.map((r) => r.slug);
  }, []);
}

type ResourceRow = typeof resources.$inferSelect;
type McpRow = typeof mcps.$inferSelect;

function mapRow(r: ResourceRow, m: McpRow): McpDetail {
  const tools = (m.tools as McpTool[] | null) ?? [];
  const item: McpListItem = {
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? '',
    author: r.authorHandle ?? '',
    version: r.currentVersion ?? '',
    license: r.license,
    compatibleClients: r.compatibleClients ?? [],
    stackTags: r.stackTags ?? [],
    ratingAvg: r.ratingAvg != null ? Number(r.ratingAvg) : 0,
    installCount7d: r.installCount7d,
    installCountTotal: r.installCountTotal,
    updatedLabel: relativeTime(r.updatedAt),
    toolCount: m.toolCount,
    resourceCount: 0,
    promptCount: 0,
    isFeatured: r.isFeatured,
  };
  return {
    ...item,
    description: r.description ?? '',
    tools,
    resources: [],
    prompts: [],
  };
}

function relativeTime(d: Date | null): string {
  if (!d) return '';
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export { sortMcps, filterMcps } from '@/lib/seed/mcps';
