/**
 * Resolves comparison row ids (`${typeId}:${slug}`) to a unified CompareItem
 * shape via the live query layer. Falls back to undefined fields when the
 * underlying resource lacks a value.
 */

import { getModelBySlug } from '@/lib/db/queries/models';
import { getMcpBySlug } from '@/lib/db/queries/mcps';
import { getResourceBySlug } from '@/lib/db/queries/resources';
import { RESOURCE_TYPES, type ResourceTypeId } from '@/lib/resource-types';

export interface CompareItem {
  id: string;
  type: string;
  slug: string;
  name: string;
  href: string;
  author?: string;
  providerColor?: string;
  ratingAvg?: number;
  installCount7d?: number;
  license?: string;
  compatibleClients?: string[];
  /** Model-specific. */
  priceInputPerMtok?: number;
  priceOutputPerMtok?: number;
  blendedCostPerMtok?: number;
  intelligenceIndex?: number;
  contextWindowAdvertised?: number;
  outputTokensPerSecond?: number;
  /** MCP-specific. */
  toolCount?: number;
}

const RESOURCE_TYPE_IDS = new Set<string>(RESOURCE_TYPES.map((t) => t.id));

function resourceBasePath(typeId: string): string {
  return RESOURCE_TYPES.find((t) => t.id === typeId)?.slug ?? `${typeId}s`;
}

async function resolveOne(id: string): Promise<CompareItem | null> {
  const colonIdx = id.indexOf(':');
  if (colonIdx <= 0) return null;
  const type = id.slice(0, colonIdx);
  const slug = id.slice(colonIdx + 1);
  if (!type || !slug) return null;

  if (type === 'model') {
    const m = await getModelBySlug(slug);
    if (!m) return null;
    return {
      id,
      type,
      slug,
      name: m.name,
      href: `/models/${slug}`,
      author: m.provider,
      providerColor: m.providerColor,
      license: m.isOpenWeights ? 'Open weights' : 'Proprietary',
      priceInputPerMtok: m.priceInputPerMtok,
      priceOutputPerMtok: m.priceOutputPerMtok,
      blendedCostPerMtok: m.blendedCostPerMtok,
      intelligenceIndex: m.intelligenceIndex > 0 ? m.intelligenceIndex : undefined,
      contextWindowAdvertised:
        m.contextWindowAdvertised > 0 ? m.contextWindowAdvertised : undefined,
      outputTokensPerSecond:
        m.outputTokensPerSecond > 0 ? m.outputTokensPerSecond : undefined,
    };
  }

  if (type === 'mcp') {
    const m = await getMcpBySlug(slug);
    if (!m) return null;
    return {
      id,
      type,
      slug,
      name: m.name,
      href: `/mcps/${slug}`,
      author: m.author || undefined,
      ratingAvg: m.ratingAvg > 0 ? m.ratingAvg : undefined,
      installCount7d: m.installCount7d > 0 ? m.installCount7d : undefined,
      license: m.license !== 'unknown' ? m.license : undefined,
      compatibleClients: m.compatibleClients.length > 0 ? m.compatibleClients : undefined,
      toolCount: m.toolCount > 0 ? m.toolCount : undefined,
    };
  }

  // Generic resource types — anything in RESOURCE_TYPES other than model/mcp.
  if (!RESOURCE_TYPE_IDS.has(type)) return null;
  const r = await getResourceBySlug(type as ResourceTypeId, slug);
  if (!r) return null;
  return {
    id,
    type,
    slug,
    name: r.name,
    href: `/${resourceBasePath(type)}/${slug}`,
    author: r.author || undefined,
    ratingAvg: r.ratingAvg > 0 ? r.ratingAvg : undefined,
    installCount7d: r.installCount7d > 0 ? r.installCount7d : undefined,
    license: r.license !== 'unknown' ? r.license : undefined,
    compatibleClients: r.compatibleClients.length > 0 ? r.compatibleClients : undefined,
  };
}

export async function resolveCompareIds(ids: string[]): Promise<CompareItem[]> {
  const seen = new Set<string>();
  const dedup: string[] = [];
  for (const raw of ids) {
    const id = raw.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    dedup.push(id);
  }
  const resolved = await Promise.all(dedup.map(resolveOne));
  return resolved.filter((x): x is CompareItem => x !== null);
}
