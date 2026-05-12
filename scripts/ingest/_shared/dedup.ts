// Resource upsert helper. Idempotent on (type_slug, slug).
// Increments ctx counters: inserted vs updated.

import { sql } from 'drizzle-orm';

import { resources, news } from '@/db/schema';
import type { resourceTypeEnum } from '@/db/enums';

import type { RunContext } from './runs';
import { getDb } from './db';
import { slugify } from './slug';

type ResourceType = (typeof resourceTypeEnum.enumValues)[number];

export interface ResourceUpsert {
  typeSlug: ResourceType;
  slug?: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  sourceUrl?: string | null;
  homepageUrl?: string | null;
  docsUrl?: string | null;
  thumbnailUrl?: string | null;
  currentVersion?: string | null;
  isOpenWeights?: boolean;
  isOfficial?: boolean;
  stackTags?: string[];
  authorHandle?: string | null;
}

export async function upsertResource(
  ctx: RunContext,
  input: ResourceUpsert,
): Promise<{ id: string; created: boolean }> {
  const db = getDb();
  const slug = (input.slug ?? slugify(input.name)).slice(0, 80);

  try {
    const rows = await db
      .insert(resources)
      .values({
        typeSlug: input.typeSlug,
        slug,
        name: input.name.slice(0, 200),
        tagline: input.tagline ?? null,
        description: input.description ?? null,
        sourceUrl: input.sourceUrl ?? null,
        homepageUrl: input.homepageUrl ?? null,
        docsUrl: input.docsUrl ?? null,
        thumbnailUrl: input.thumbnailUrl ?? null,
        currentVersion: input.currentVersion ?? null,
        isOpenWeights: input.isOpenWeights ?? false,
        isOfficial: input.isOfficial ?? false,
        stackTags: input.stackTags ?? [],
        authorHandle: input.authorHandle ?? null,
        // Ingested rows land as drafts; editorial promotes to 'published'.
        status: 'draft',
      })
      .onConflictDoUpdate({
        target: [resources.typeSlug, resources.slug],
        targetWhere: sql`deleted_at is null`,
        set: {
          name: input.name.slice(0, 200),
          tagline: input.tagline ?? null,
          description: input.description ?? null,
          sourceUrl: input.sourceUrl ?? null,
          homepageUrl: input.homepageUrl ?? null,
          docsUrl: input.docsUrl ?? null,
          thumbnailUrl: input.thumbnailUrl ?? null,
          currentVersion: input.currentVersion ?? null,
          isOpenWeights: input.isOpenWeights ?? false,
          stackTags: input.stackTags ?? [],
          updatedAt: sql`now()`,
        },
      })
      .returning({
        id: resources.id,
        // xmax = 0 on Postgres means freshly inserted; nonzero = updated.
        created: sql<boolean>`(xmax = 0)`,
      });
    const row = rows[0];
    if (!row) throw new Error('upsert returned no row');
    if (row.created) ctx.counters.inserted += 1;
    else ctx.counters.updated += 1;
    return row;
  } catch (err) {
    ctx.counters.failed += 1;
    ctx.logger.warn('upsert failed', {
      slug,
      typeSlug: input.typeSlug,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

// ---------------------------------------------------------------------------
// News upsert — pk_news has its own table (not part of the resources spine).
// Idempotent on the unique slug.
// ---------------------------------------------------------------------------

type NewsKind = 'ecosystem' | 'release' | 'price_change' | 'tutorial' | 'op_ed';
type NewsSourceKind = 'editorial' | 'auto_generated' | 'rss_imported';

export interface NewsUpsert {
  slug: string;
  title: string;
  summary?: string | null;
  body?: string | null;
  kind: NewsKind;
  sourceKind: NewsSourceKind;
  sourceName?: string | null;
  sourceUrl?: string | null;
  publishedAt?: Date | null;
  topics?: string[];
  isBreaking?: boolean;
}

export async function upsertNews(
  ctx: RunContext,
  input: NewsUpsert,
): Promise<{ id: string; created: boolean }> {
  const db = getDb();
  const slug = input.slug.slice(0, 80);
  try {
    const rows = await db
      .insert(news)
      .values({
        slug,
        title: input.title.slice(0, 300),
        summary: input.summary ?? null,
        body: input.body ?? null,
        kind: input.kind,
        sourceKind: input.sourceKind,
        sourceName: input.sourceName ?? null,
        sourceUrl: input.sourceUrl ?? null,
        publishedAt: input.publishedAt ?? new Date(),
        topics: input.topics ?? [],
        isBreaking: input.isBreaking ?? false,
      })
      .onConflictDoUpdate({
        target: news.slug,
        set: {
          title: input.title.slice(0, 300),
          summary: input.summary ?? null,
          body: input.body ?? null,
          kind: input.kind,
          sourceKind: input.sourceKind,
          sourceName: input.sourceName ?? null,
          sourceUrl: input.sourceUrl ?? null,
          topics: input.topics ?? [],
          isBreaking: input.isBreaking ?? false,
          updatedAt: sql`now()`,
        },
      })
      .returning({ id: news.id, created: sql<boolean>`(xmax = 0)` });
    const row = rows[0];
    if (!row) throw new Error('news upsert returned no row');
    if (row.created) ctx.counters.inserted += 1;
    else ctx.counters.updated += 1;
    return row;
  } catch (err) {
    ctx.counters.failed += 1;
    ctx.logger.warn('news upsert failed', {
      slug,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
