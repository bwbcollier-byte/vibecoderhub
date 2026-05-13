// Live queries against pk_resources ⋈ pk_design_systems. Session 20.

import 'server-only';
import { and, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { resources, designSystems } from '@/db/schema';

import { safeQuery } from './_safe';

const baseWhere = and(
  eq(resources.typeSlug, 'design_system'),
  eq(resources.status, 'published'),
  isNull(resources.deletedAt),
);

export type DesignSystemSort =
  | 'quality'
  | 'newest'
  | 'a-z'
  | 'oldest-company';

export interface PrimaryColor {
  hex: string;
  type?: string;
}

export interface DesignSystemListItem {
  slug: string;
  name: string;
  domain: string | null;
  industry: string | null;
  tagline: string | null;
  headingFont: string | null;
  bodyFont: string | null;
  primaryColors: PrimaryColor[];
  qualityScore: number | null;
  foundedYear: number | null;
  headquarters: string | null;
}

export interface DesignSystemDetail extends DesignSystemListItem {
  description: string | null;
  brandDna: string | null;
  quickStart: string | null;
  systemPrompt: string | null;
  designTokensJson: unknown;
  secondaryColors: PrimaryColor[];
  accentColors: PrimaryColor[];
  gradientLibrary: string | null;
  fontStack: string | null;
  typeScale: unknown;
  spacingScale: unknown;
  radiusTokens: unknown;
  shadowTokens: unknown;
  motionTokens: unknown;
  iconographyStyle: string | null;
  imageryStyle: string | null;
  voiceAndTone: string | null;
  sampleMicrocopy: string | null;
  dos: string | null;
  donts: string | null;
  spacingLayout: string | null;
  componentExamples: string | null;
  templateHtml: string | null;
  templateReact: string | null;
  accessibilityNotes: string | null;
  employeeCount: number | null;
}

type ResourceRow = typeof resources.$inferSelect;
type DesignSystemRow = typeof designSystems.$inferSelect;

function toColors(v: unknown): PrimaryColor[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((c) => {
      if (typeof c === 'string') return { hex: c };
      if (c && typeof c === 'object' && 'hex' in c && typeof (c as PrimaryColor).hex === 'string') {
        return { hex: (c as PrimaryColor).hex, type: (c as PrimaryColor).type };
      }
      return null;
    })
    .filter((x): x is PrimaryColor => x !== null);
}

function mapList(r: ResourceRow, d: DesignSystemRow): DesignSystemListItem {
  return {
    slug: r.slug,
    name: r.name,
    domain: d.domain,
    industry: d.industry,
    tagline: r.tagline,
    headingFont: d.headingFont,
    bodyFont: d.bodyFont,
    primaryColors: toColors(d.primaryColors),
    qualityScore: d.qualityScore,
    foundedYear: d.foundedYear,
    headquarters: d.headquarters,
  };
}

function mapDetail(r: ResourceRow, d: DesignSystemRow): DesignSystemDetail {
  return {
    ...mapList(r, d),
    description: r.description,
    brandDna: d.brandDna,
    quickStart: d.quickStart,
    systemPrompt: d.systemPrompt,
    designTokensJson: d.designTokensJson,
    secondaryColors: toColors(d.secondaryColors),
    accentColors: toColors(d.accentColors),
    gradientLibrary: d.gradientLibrary,
    fontStack: d.fontStack,
    typeScale: d.typeScale,
    spacingScale: d.spacingScale,
    radiusTokens: d.radiusTokens,
    shadowTokens: d.shadowTokens,
    motionTokens: d.motionTokens,
    iconographyStyle: d.iconographyStyle,
    imageryStyle: d.imageryStyle,
    voiceAndTone: d.voiceAndTone,
    sampleMicrocopy: d.sampleMicrocopy,
    dos: d.dos,
    donts: d.donts,
    spacingLayout: d.spacingLayout,
    componentExamples: d.componentExamples,
    templateHtml: d.templateHtml,
    templateReact: d.templateReact,
    accessibilityNotes: d.accessibilityNotes,
    employeeCount: d.employeeCount,
  };
}

export interface ListDesignSystemsArgs {
  industry?: string;
  sort?: DesignSystemSort;
  limit?: number;
  offset?: number;
}

export async function listDesignSystems(
  args: ListDesignSystemsArgs = {},
): Promise<DesignSystemListItem[]> {
  const { industry, sort = 'quality', limit = 200, offset = 0 } = args;
  return safeQuery(async () => {
    const orderClause = (() => {
      switch (sort) {
        case 'newest':
          return sql`${resources.publishedAt} desc nulls last`;
        case 'a-z':
          return resources.name;
        case 'oldest-company':
          return sql`${designSystems.foundedYear} asc nulls last`;
        case 'quality':
        default:
          return sql`${designSystems.qualityScore} desc nulls last, ${resources.publishedAt} desc nulls last`;
      }
    })();

    const where = industry
      ? and(baseWhere, eq(designSystems.industry, industry))
      : baseWhere;

    const rows = await db
      .select({ r: resources, d: designSystems })
      .from(resources)
      .innerJoin(designSystems, eq(designSystems.id, resources.id))
      .where(where)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return rows.map(({ r, d }) => mapList(r, d));
  }, [] as DesignSystemListItem[]);
}

export async function getDesignSystemBySlug(slug: string): Promise<DesignSystemDetail | undefined> {
  return safeQuery(async () => {
    const rows = await db
      .select({ r: resources, d: designSystems })
      .from(resources)
      .innerJoin(designSystems, eq(designSystems.id, resources.id))
      .where(and(baseWhere, eq(resources.slug, slug)))
      .limit(1);
    if (rows.length === 0) return undefined;
    return mapDetail(rows[0]!.r, rows[0]!.d);
  }, undefined);
}

export async function getDesignSystemCount(): Promise<number> {
  return safeQuery(async () => {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(resources)
      .innerJoin(designSystems, eq(designSystems.id, resources.id))
      .where(baseWhere);
    return rows[0]?.n ?? 0;
  }, 0);
}

export async function listDesignSystemSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const rows = await db
      .select({ slug: resources.slug })
      .from(resources)
      .innerJoin(designSystems, eq(designSystems.id, resources.id))
      .where(baseWhere);
    return rows.map((r) => r.slug);
  }, []);
}

export interface IndustryFacet {
  industry: string;
  count: number;
}

/** Industries with ≥ 1 published design_system. Drops empty / null industries
 *  so the filter pill row never shows a "ghost" pill with no records behind it.
 *  Sorted by count desc so most-populated industries lead. */
export async function listDesignSystemIndustries(): Promise<IndustryFacet[]> {
  return safeQuery(async () => {
    const rows = await db
      .select({
        industry: designSystems.industry,
        count: sql<number>`count(*)::int`,
      })
      .from(resources)
      .innerJoin(designSystems, eq(designSystems.id, resources.id))
      .where(baseWhere)
      .groupBy(designSystems.industry);
    return rows
      .filter((r): r is { industry: string; count: number } =>
        typeof r.industry === 'string' && r.industry.trim().length > 0 && r.count > 0,
      )
      .sort((a, b) => b.count - a.count || a.industry.localeCompare(b.industry));
  }, []);
}
