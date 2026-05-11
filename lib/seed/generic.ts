/**
 * Generic resource seed shape — shared by S03-S08 (components / skills /
 * rules / subagents / plugins / prompts). The same per-type folder pattern
 * stays in place (one folder per resource type per Phase B Flag 2); each
 * page is a thin import of these shared types + a per-type seed module.
 *
 * Drop-in for the eventual `resources` Drizzle row. When Supabase is wired,
 * `listFor(typeId)` flips to a real query in `lib/queries/resources.ts`.
 */

import type { ResourceTypeId } from '@/lib/resource-types';

export interface GenericResource {
  slug: string;
  name: string;
  tagline: string;
  author: string;
  version: string;
  license: string;
  compatibleClients: string[];
  stackTags: string[];
  ratingAvg: number;
  installCount7d: number;
  installCountTotal: number;
  updatedLabel: string;
  description: string;
  /** Optional code snippet — used by /components, /prompts, /rules. */
  codeSnippet?: string;
  /** Optional code language hint (ts | js | md | json | …). */
  codeLanguage?: string;
}

export type GenericSort = 'trending' | 'rating' | 'newest';

export function sortGeneric(items: GenericResource[], sort: GenericSort): GenericResource[] {
  const copy = [...items];
  switch (sort) {
    case 'trending':
      return copy.sort((a, b) => b.installCount7d - a.installCount7d);
    case 'rating':
      return copy.sort((a, b) => b.ratingAvg - a.ratingAvg);
    case 'newest':
      return copy.reverse();
    default:
      return copy;
  }
}

export function filterGeneric(
  items: GenericResource[],
  q: string,
  clientFilter: string | null,
): GenericResource[] {
  const needle = q.trim().toLowerCase();
  return items.filter((m) => {
    if (clientFilter && !m.compatibleClients.includes(clientFilter)) return false;
    if (!needle) return true;
    const hay = `${m.name} ${m.author} ${m.tagline} ${m.description} ${m.stackTags.join(' ')}`.toLowerCase();
    return hay.includes(needle);
  });
}

/**
 * Per-type config consumed by GenericResourceIndex + DetailChassis. Drives
 * the kicker glyph, base path, OG title, and whether to expose a client
 * filter (compatible-client filter is meaningless for, say, /prompts).
 */
export interface GenericTypeConfig {
  typeId: ResourceTypeId;
  /** Plural URL slug (e.g. 'components'). */
  basePath: string;
  /** Display headline for the index hero (e.g. 'Components.'). */
  indexHeadline: string;
  /** Singular noun shown in the breadcrumb (e.g. 'Component'). */
  singular: string;
  /** Plural noun for empty-state copy. */
  plural: string;
  /** Glyph from the resource-type registry (e.g. '▢'). */
  glyph: string;
  /** Show the compatible-client filter row on the index? */
  showClientFilter: boolean;
}
