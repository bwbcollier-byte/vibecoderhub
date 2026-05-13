/**
 * Resource type registry — the 24 destination types (per ANSWERS Pre-A R2;
 * matches `resource_type` enum in db/enums.ts minus the 3 content surfaces
 * `guide`/`deal`/`news` which live as separate top-level destinations).
 *
 * `slug` is the URL segment (`/components`, `/mcps`, …). `glyph` is the
 * single-char mark used in TypeBadge. `tint` references the canonical tile
 * accent palette in `lib/tokens.ts` — the only authorized place for raw hex.
 */

import { colors } from './tokens';

export type ResourceTypeId =
  | 'component' | 'mcp' | 'skill' | 'subagent' | 'script' | 'rule'
  | 'prompt' | 'plugin' | 'marketplace' | 'hook' | 'command' | 'starter'
  | 'tool' | 'model' | 'sandbox' | 'observability' | 'backend' | 'asset'
  | 'showcase' | 'docs_for_llms' | 'spec' | 'workflow' | 'eval' | 'stack'
  | 'design_system';

export interface ResourceType {
  id: ResourceTypeId;
  slug: string;
  label: string;
  glyph: string;
  tint: string;
  group: 'extensions' | 'prompts' | 'infra' | 'content';
}

export const RESOURCE_TYPES: readonly ResourceType[] = [
  // EXTENSIONS
  { id: 'skill',        slug: 'skills',        label: 'Skills',        glyph: '◆', tint: colors.tileMint, group: 'extensions' },
  { id: 'subagent',     slug: 'subagents',     label: 'Subagents',     glyph: '◇', tint: colors.tileMint, group: 'extensions' },
  { id: 'plugin',       slug: 'plugins',       label: 'Plugins',       glyph: '⊕', tint: colors.tileMint, group: 'extensions' },
  { id: 'hook',         slug: 'hooks',         label: 'Hooks',         glyph: '⌘', tint: colors.tileMint, group: 'extensions' },
  { id: 'command',      slug: 'commands',      label: 'Commands',      glyph: '/', tint: colors.tileMint, group: 'extensions' },
  { id: 'marketplace',  slug: 'marketplaces',  label: 'Marketplaces',  glyph: '⊟', tint: colors.tileMint, group: 'extensions' },
  // PROMPTS
  { id: 'prompt',       slug: 'prompts',       label: 'Prompts',       glyph: '✎', tint: colors.tileYellow, group: 'prompts' },
  { id: 'spec',         slug: 'specs',         label: 'Specs',         glyph: '§', tint: colors.tileYellow, group: 'prompts' },
  { id: 'rule',         slug: 'rules',         label: 'Rules',         glyph: '⚖', tint: colors.tileYellow, group: 'prompts' },
  { id: 'workflow',     slug: 'workflows',     label: 'Workflows',     glyph: '⇄', tint: colors.tileYellow, group: 'prompts' },
  // INFRA
  { id: 'sandbox',      slug: 'sandboxes',     label: 'Sandboxes',     glyph: '▣', tint: colors.tileBlue, group: 'infra' },
  { id: 'observability',slug: 'observability', label: 'Observability', glyph: '◉', tint: colors.tileBlue, group: 'infra' },
  { id: 'backend',      slug: 'backends',      label: 'Backends',      glyph: '☰', tint: colors.tileBlue, group: 'infra' },
  { id: 'docs_for_llms',slug: 'docs-for-llms', label: 'Docs for LLMs', glyph: '⌬', tint: colors.tileBlue, group: 'infra' },
  { id: 'eval',         slug: 'evals',         label: 'Evals',         glyph: '⊜', tint: colors.tileBlue, group: 'infra' },
  // CONTENT
  { id: 'component',    slug: 'components',    label: 'Components',    glyph: '▢', tint: colors.tilePink, group: 'content' },
  { id: 'asset',        slug: 'assets',        label: 'Assets',        glyph: '◫', tint: colors.tilePink, group: 'content' },
  { id: 'starter',      slug: 'starters',      label: 'Starters',      glyph: '⊛', tint: colors.tilePink, group: 'content' },
  { id: 'showcase',     slug: 'showcase',      label: 'Showcase',      glyph: '✦', tint: colors.tilePink, group: 'content' },
  { id: 'stack',        slug: 'stacks',        label: 'Stacks',        glyph: '⫶', tint: colors.tilePink, group: 'content' },
  { id: 'script',       slug: 'scripts',       label: 'Scripts',       glyph: '$_', tint: colors.tilePink, group: 'content' },
  // Top-level navigation surfaces (also resource types but get their own nav slot)
  { id: 'tool',         slug: 'tools',         label: 'Tools',         glyph: '⚒', tint: colors.tileOrange, group: 'infra' },
  { id: 'model',        slug: 'models',        label: 'Models',        glyph: '◯', tint: colors.tilePurple, group: 'infra' },
  { id: 'mcp',          slug: 'mcps',          label: 'MCPs',          glyph: '⌖', tint: colors.tilePurple, group: 'extensions' },
  // Brand systems — Session 20. URL slug `design-systems` (dashed); enum `design_system` (underscored).
  { id: 'design_system',slug: 'design-systems', label: 'Design Systems', glyph: '◐', tint: colors.tileOrange, group: 'content' },
];

export const RESOURCE_TYPE_GROUPS: ReadonlyArray<{
  heading: string;
  group: ResourceType['group'];
  ids: ResourceTypeId[];
}> = [
  { heading: 'EXTENSIONS', group: 'extensions', ids: ['skill', 'subagent', 'plugin', 'hook', 'command', 'marketplace'] },
  { heading: 'PROMPTS',    group: 'prompts',    ids: ['prompt', 'spec', 'rule', 'workflow'] },
  { heading: 'INFRA',      group: 'infra',      ids: ['sandbox', 'observability', 'backend', 'docs_for_llms', 'eval'] },
  { heading: 'CONTENT',    group: 'content',    ids: ['component', 'asset', 'starter', 'showcase', 'stack', 'script', 'design_system'] },
];

export function getResourceType(id: ResourceTypeId): ResourceType | undefined {
  return RESOURCE_TYPES.find((t) => t.id === id);
}
