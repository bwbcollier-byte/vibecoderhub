// Live queries against pk_guides ⋈ pk_guide_steps. Drop-in for lib/seed/guides.ts.

import 'server-only';
import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { guides, guideSteps } from '@/db/schema';
import type { Guide, GuideDifficulty, GuideKind, GuideStep } from '@/lib/seed/guides';

import { safeQuery } from './_safe';

const baseWhere = and(eq(guides.isPublished, true), isNull(guides.deletedAt));

const KIND_TO_LABEL: Record<string, GuideKind> = {
  get_started: 'GET STARTED',
  usage: 'USAGE',
  troubleshoot: 'TROUBLESHOOT',
  migrate: 'MIGRATE',
  advanced: 'ADVANCED',
};

const VARIANTS: Guide['variant'][] = ['mint', 'uv', 'yellow', 'pink'];

export async function listGuides(): Promise<Guide[]> {
  return safeQuery(async () => {
    const rows = await db.select().from(guides).where(baseWhere);
    // Lightweight list — defer step body until detail.
    return rows.map((g, i) => mapRow(g, [], i));
  }, [] as Guide[]);
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  return safeQuery(async () => {
    const rows = await db
      .select()
      .from(guides)
      .where(and(baseWhere, eq(guides.slug, slug)))
      .limit(1);
    if (rows.length === 0) return undefined;
    const g = rows[0]!;
    const steps = await db
      .select()
      .from(guideSteps)
      .where(eq(guideSteps.guideId, g.id))
      .orderBy(asc(guideSteps.stepOrder));
    return mapRow(g, steps, 0);
  }, undefined);
}

export async function listGuideSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db.select({ slug: guides.slug }).from(guides).where(baseWhere);
    return rows.map((r) => r.slug);
  }, []);
}

type GuideRow = typeof guides.$inferSelect;
type StepRow = typeof guideSteps.$inferSelect;

function mapRow(g: GuideRow, steps: StepRow[], index: number): Guide {
  return {
    slug: g.slug,
    title: g.title,
    kind: KIND_TO_LABEL[g.kind] ?? 'USAGE',
    difficulty: g.difficulty as GuideDifficulty,
    duration: g.durationMinutes ? `${g.durationMinutes}m` : '—',
    os: g.osSupport ?? [],
    variant: VARIANTS[index % VARIANTS.length] as Guide['variant'],
    description: g.body.slice(0, 280),
    steps: steps.map(mapStep),
  };
}

function mapStep(s: StepRow): GuideStep {
  return {
    title: s.title,
    body: s.body,
    verifyCommand: s.verifierCommand ?? undefined,
    verifyExpect: s.verifierExpectedPattern ?? undefined,
  };
}
