// Live queries against pk_use_cases ⋈ pk_best_for ⋈ pk_resources.
// Drop-in for lib/seed/best-for.ts.

import 'server-only';
import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { useCases, bestFor, resources } from '@/db/schema';
import type { BestForUseCase, BestForPick } from '@/lib/seed/best-for';
import { getResourceType } from '@/lib/resource-types';

import { safeQuery } from './_safe';

const VARIANTS: BestForUseCase['variant'][] = ['mint', 'uv', 'yellow', 'pink'];

export async function listUseCases(): Promise<BestForUseCase[]> {
  return safeQuery(async () => {
    const rows = await db.select().from(useCases).orderBy(asc(useCases.name));
    return rows.map((u, i) => ({
      slug: u.slug,
      title: u.name,
      description: u.description ?? u.heroCopy ?? '',
      variant: VARIANTS[i % VARIANTS.length] as BestForUseCase['variant'],
      picks: [],
    }));
  }, [] as BestForUseCase[]);
}

export async function getBestForBySlug(slug: string): Promise<BestForUseCase | undefined> {
  return safeQuery(async () => {
    const ucRows = await db
      .select()
      .from(useCases)
      .where(eq(useCases.slug, slug))
      .limit(1);
    if (ucRows.length === 0) return undefined;
    const u = ucRows[0]!;

    const pickRows = await db
      .select({ rank: bestFor.rank, reasoning: bestFor.reasoning, r: resources })
      .from(bestFor)
      .innerJoin(resources, eq(bestFor.resourceId, resources.id))
      .where(
        and(
          eq(bestFor.useCaseId, u.id),
          eq(resources.status, 'published'),
          isNull(resources.deletedAt),
        ),
      )
      .orderBy(asc(bestFor.rank));

    const picks: BestForPick[] = pickRows.map(({ r, reasoning }) => {
      const type = r.typeSlug;
      const resourceType = getResourceType(type as never);
      const slugPath = resourceType?.slug ?? `${type}s`;
      return {
        resourceId: `${type}:${r.slug}`,
        resourceName: r.name,
        resourceType: type,
        href: `/${slugPath}/${r.slug}`,
        rationale: reasoning ?? '',
      };
    });

    return {
      slug: u.slug,
      title: u.name,
      description: u.description ?? u.heroCopy ?? '',
      variant: 'mint',
      picks,
    };
  }, undefined);
}

export async function listUseCaseSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db.select({ slug: useCases.slug }).from(useCases);
    return rows.map((r) => r.slug);
  }, []);
}
