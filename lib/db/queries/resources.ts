// Generic per-type resource list/detail. Drop-in for the bundle.items arrays
// in lib/seed/_configs.ts. Returns GenericResource shape so the existing
// GenericResourceIndex / DetailChassis components consume directly.

import 'server-only';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { resources } from '@/db/schema';
import type { ResourceTypeId } from '@/lib/resource-types';
import type { GenericResource, GenericSort } from '@/lib/seed/generic';

import { safeQuery } from './_safe';

// resource-type ids in lib/resource-types.ts use singular dashed (e.g. "docs-for-llms"),
// but the DB enum stores singular underscored ('docs_for_llms'). The conversion
// is mechanical: most ids match the enum directly; a couple need a swap.
function toEnum(typeId: ResourceTypeId): string {
  return typeId;
}

function baseWhere(typeId: ResourceTypeId) {
  return and(
    eq(resources.typeSlug, toEnum(typeId) as never),
    eq(resources.status, 'published'),
    isNull(resources.deletedAt),
  );
}

export interface ListResourcesArgs {
  sort?: GenericSort;
  limit?: number;
  offset?: number;
}

export async function listResources(
  typeId: ResourceTypeId,
  args: ListResourcesArgs = {},
): Promise<GenericResource[]> {
  const { sort = 'trending', limit = 200, offset = 0 } = args;

  return safeQuery(async () => {
    const orderClause = (() => {
      switch (sort) {
        case 'rating':
          return desc(resources.ratingAvg);
        case 'newest':
          return desc(resources.publishedAt);
        case 'trending':
        default:
          return desc(resources.trendingScore);
      }
    })();

    const rows = await db
      .select()
      .from(resources)
      .where(baseWhere(typeId))
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return rows.map(mapRow);
  }, [] as GenericResource[]);
}

export async function getResourceBySlug(
  typeId: ResourceTypeId,
  slug: string,
): Promise<GenericResource | undefined> {
  return safeQuery(async () => {
    const rows = await db
      .select()
      .from(resources)
      .where(and(baseWhere(typeId), eq(resources.slug, slug)))
      .limit(1);
    if (rows.length === 0) return undefined;
    return mapRow(rows[0]!);
  }, undefined);
}

export async function listResourceSlugs(typeId: ResourceTypeId): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db
      .select({ slug: resources.slug })
      .from(resources)
      .where(baseWhere(typeId));
    return rows.map((r) => r.slug);
  }, []);
}

/** Total published rows for a given type — used by index-page kickers so the
    "X INDEXED" count doesn't lie when the listResources query LIMITs the
    returned items. Cheap; covered by `resources_type_idx`. */
export async function getResourceCount(typeId: ResourceTypeId): Promise<number> {
  return safeQuery(async () => {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(resources)
      .where(baseWhere(typeId));
    return rows[0]?.n ?? 0;
  }, 0);
}

type ResourceRow = typeof resources.$inferSelect;

function mapRow(r: ResourceRow): GenericResource {
  return {
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
    description: r.description ?? '',
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
