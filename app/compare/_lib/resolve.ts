/**
 * Resolves comparison row ids (`${typeId}:${slug}`) to a unified CompareItem
 * shape by walking the seed modules. Pure helper — no React, no overlays.
 */

import { getModelBySlug } from '@/lib/seed/models';
import { getMcpBySlug } from '@/lib/seed/mcps';
import * as Configs from '@/lib/seed/_configs';

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

interface TypeBundleLike {
  config: { typeId: string; basePath: string };
  items: Array<{
    slug: string;
    name: string;
    author: string;
    license: string;
    compatibleClients: string[];
    ratingAvg: number;
    installCount7d: number;
  }>;
}

function resolveOne(id: string): CompareItem | null {
  const colonIdx = id.indexOf(':');
  if (colonIdx <= 0) return null;
  const type = id.slice(0, colonIdx);
  const slug = id.slice(colonIdx + 1);
  if (!type || !slug) return null;

  if (type === 'model') {
    const m = getModelBySlug(slug);
    if (!m) return null;
    return {
      id,
      type,
      slug,
      name: m.name,
      href: `/models/${slug}`,
      author: m.provider,
      providerColor: m.providerColor,
      ratingAvg: undefined,
      installCount7d: undefined,
      license: m.isOpenWeights ? 'Open weights' : 'Proprietary',
      compatibleClients: undefined,
      priceInputPerMtok: m.priceInputPerMtok,
      priceOutputPerMtok: m.priceOutputPerMtok,
      blendedCostPerMtok: m.blendedCostPerMtok,
      intelligenceIndex: m.intelligenceIndex,
      contextWindowAdvertised: m.contextWindowAdvertised,
      outputTokensPerSecond: m.outputTokensPerSecond,
    };
  }

  if (type === 'mcp') {
    const m = getMcpBySlug(slug);
    if (!m) return null;
    return {
      id,
      type,
      slug,
      name: m.name,
      href: `/mcps/${slug}`,
      author: m.author,
      ratingAvg: m.ratingAvg,
      installCount7d: m.installCount7d,
      license: m.license,
      compatibleClients: m.compatibleClients,
      toolCount: m.toolCount,
    };
  }

  // Walk generic bundles for everything else.
  const bundles = Object.values(Configs) as unknown as TypeBundleLike[];
  for (const b of bundles) {
    if (!b || typeof b !== 'object' || !('config' in b)) continue;
    if (b.config.typeId !== type) continue;
    const item = b.items.find((it) => it.slug === slug);
    if (!item) return null;
    return {
      id,
      type,
      slug,
      name: item.name,
      href: `/${b.config.basePath}/${slug}`,
      author: item.author,
      ratingAvg: item.ratingAvg,
      installCount7d: item.installCount7d,
      license: item.license,
      compatibleClients: item.compatibleClients,
    };
  }

  return null;
}

export function resolveCompareIds(ids: string[]): CompareItem[] {
  const seen = new Set<string>();
  const out: CompareItem[] = [];
  for (const raw of ids) {
    const id = raw.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const item = resolveOne(id);
    if (item) out.push(item);
  }
  return out;
}
