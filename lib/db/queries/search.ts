// Full-text search via the tsvector search_vector column on pk_resources.

import 'server-only';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { resources } from '@/db/schema';
import type { ResourceTypeId } from '@/lib/resource-types';

import { safeQuery } from './_safe';

export interface SearchHit {
  type: ResourceTypeId;
  slug: string;
  name: string;
  tagline: string;
  rank: number;
}

export async function searchResources(
  query: string,
  type?: ResourceTypeId,
  limit = 25,
): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  return safeQuery(async () => {
    const tsq = sql`websearch_to_tsquery('english', ${q})`;
    const conds = [
      eq(resources.status, 'published'),
      isNull(resources.deletedAt),
      sql`${resources.searchVector} @@ ${tsq}`,
    ];
    if (type) conds.push(eq(resources.typeSlug, type as never));

    const rows = await db
      .select({
        type: resources.typeSlug,
        slug: resources.slug,
        name: resources.name,
        tagline: resources.tagline,
        rank: sql<number>`ts_rank(${resources.searchVector}, ${tsq})`,
      })
      .from(resources)
      .where(and(...conds))
      .orderBy(desc(sql`ts_rank(${resources.searchVector}, ${tsq})`))
      .limit(limit);

    return rows.map((r) => ({
      type: r.type as ResourceTypeId,
      slug: r.slug,
      name: r.name,
      tagline: r.tagline ?? '',
      rank: Number(r.rank),
    }));
  }, [] as SearchHit[]);
}
