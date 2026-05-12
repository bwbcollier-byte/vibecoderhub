// Live queries against pk_resources ⋈ pk_models. Returns shapes compatible
// with lib/seed/models.ts (ModelListItem / ModelDetail) so the page swap is
// a one-line import change. Empty array on DB failure (see _safe.ts).

import 'server-only';
import { and, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { resources, models, modelProviders } from '@/db/schema';
import { colors } from '@/lib/tokens';
import type { ModelDetail, ModelListItem, ModelSort } from '@/lib/seed/models';

import { safeQuery } from './_safe';

const PROVIDER_TINTS: Record<string, string> = {
  Anthropic: colors.tileOrange,
  OpenAI: colors.tileMint,
  Google: colors.tilePurple,
  Meta: colors.tileBlue,
  Mistral: colors.tileYellow,
  DeepSeek: colors.tilePink,
};

function providerColor(provider: string | null | undefined): string {
  if (!provider) return colors.tileMint;
  return PROVIDER_TINTS[provider] ?? colors.tileMint;
}

function asNumber(v: string | number | null | undefined, fallback = 0): number {
  if (v == null) return fallback;
  return typeof v === 'number' ? v : Number(v);
}

const baseWhere = and(
  eq(resources.typeSlug, 'model'),
  eq(resources.status, 'published'),
  isNull(resources.deletedAt),
);

export interface ListModelsArgs {
  sort?: ModelSort;
  openOnly?: boolean;
  limit?: number;
  offset?: number;
}

export async function listModels(args: ListModelsArgs = {}): Promise<ModelDetail[]> {
  const { sort = 'intelligence', openOnly = false, limit = 200, offset = 0 } = args;

  return safeQuery(async () => {
    const orderClause = (() => {
      switch (sort) {
        case 'cost-low':
          // Free/null prices to the back so paid frontier models surface first.
          return sql`${models.blendedCostPerMtok} asc nulls last`;
        case 'speed':
          return sql`${models.outputTokensPerSecond} desc nulls last`;
        case 'context':
          return sql`${models.contextWindowAdvertised} desc nulls last`;
        case 'newest':
          return sql`${resources.publishedAt} desc nulls last`;
        case 'intelligence':
        default:
          // Intelligence not yet ingested for OpenRouter — fall back to recency.
          return sql`${models.intelligenceIndex} desc nulls last, ${resources.publishedAt} desc nulls last`;
      }
    })();

    const whereClause = openOnly
      ? and(baseWhere, eq(resources.isOpenWeights, true))
      : baseWhere;

    const rows = await db
      .select({ r: resources, m: models })
      .from(resources)
      .innerJoin(models, eq(models.id, resources.id))
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return rows.map(({ r, m }) => mapRow(r, m));
  }, [] as ModelDetail[]);
}

export async function getModelBySlug(slug: string): Promise<ModelDetail | undefined> {
  return safeQuery(async () => {
    const rows = await db
      .select({ r: resources, m: models })
      .from(resources)
      .innerJoin(models, eq(models.id, resources.id))
      .where(and(baseWhere, eq(resources.slug, slug)))
      .limit(1);
    if (rows.length === 0) return undefined;
    return mapRow(rows[0]!.r, rows[0]!.m);
  }, undefined);
}

export async function getModelCount(): Promise<number> {
  return safeQuery(async () => {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(resources)
      .where(baseWhere);
    return rows[0]?.n ?? 0;
  }, 0);
}

export async function listModelSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db
      .select({ slug: resources.slug })
      .from(resources)
      .where(baseWhere);
    return rows.map((r) => r.slug);
  }, []);
}

type ResourceRow = typeof resources.$inferSelect;
type ModelRow = typeof models.$inferSelect;

function mapRow(r: ResourceRow, m: ModelRow): ModelDetail {
  const item: ModelListItem = {
    slug: r.slug,
    name: r.name,
    provider: m.provider,
    providerColor: providerColor(m.provider),
    priceInputPerMtok: asNumber(m.priceInputPerMtok),
    priceOutputPerMtok: asNumber(m.priceOutputPerMtok),
    blendedCostPerMtok: asNumber(m.blendedCostPerMtok),
    intelligenceIndex: asNumber(m.intelligenceIndex),
    outputTokensPerSecond: asNumber(m.outputTokensPerSecond),
    ttftMs: m.ttftMs ?? 0,
    contextWindowAdvertised: m.contextWindowAdvertised ?? 0,
    contextWindowEffective: m.contextWindowEffective ?? 0,
    knowledgeCutoff: m.knowledgeCutoff ? String(m.knowledgeCutoff) : '',
    releasedAt: r.releasedAt ? formatMonthYear(r.releasedAt) : '',
    priceDeltaPct: 0, // computed from pk_model_price_history; cheap default
    tags: r.stackTags ?? [],
    isOpenWeights: r.isOpenWeights,
  };
  return {
    ...item,
    description: r.description ?? '',
    supportsTools: m.supportsTools,
    supportsVision: m.supportsVision,
    supportsAudio: m.supportsAudio,
    supportsCaching: m.supportsCaching,
    supportsReasoning: m.supportsReasoning,
    parametersBillions: m.parametersBillions != null ? Number(m.parametersBillions) : null,
    architecture: m.architecture,
  };
}

function formatMonthYear(d: Date): string {
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

// Re-export helpers from the seed module so swap is import-only.
export { sortModels, filterModels } from '@/lib/seed/models';
export { modelProviders };
