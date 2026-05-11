// Per-type config + seed access for the batch types (S03-S08).

import { COMPONENTS_SEED } from './components';
import { SKILLS_SEED } from './skills';
import { RULES_SEED } from './rules';
import { SUBAGENTS_SEED } from './subagents';
import { PLUGINS_SEED } from './plugins';
import { PROMPTS_SEED } from './prompts';
import {
  TOOLS_SEED,
  HOOKS_SEED,
  COMMANDS_SEED,
  STARTERS_SEED,
  WORKFLOWS_SEED,
  EVALS_SEED,
  SHOWCASE_SEED,
  SANDBOXES_SEED,
  OBSERVABILITY_SEED,
  BACKENDS_SEED,
  ASSETS_SEED,
  DOCS_FOR_LLMS_SEED,
  SPECS_SEED,
  STACKS_SEED,
  SCRIPTS_SEED,
  MARKETPLACES_SEED,
} from './_remaining';
import type { GenericResource, GenericTypeConfig } from './generic';
import { getResourceType } from '@/lib/resource-types';

interface TypeBundle {
  config: GenericTypeConfig;
  items: GenericResource[];
}

function bundle(
  typeId: GenericTypeConfig['typeId'],
  basePath: string,
  indexHeadline: string,
  singular: string,
  plural: string,
  items: GenericResource[],
  showClientFilter: boolean,
): TypeBundle {
  const t = getResourceType(typeId);
  return {
    items,
    config: {
      typeId,
      basePath,
      indexHeadline,
      singular,
      plural,
      glyph: t?.glyph ?? '◆',
      showClientFilter,
    },
  };
}

export const COMPONENTS = bundle(
  'component',
  'components',
  'Components.',
  'Component',
  'Components',
  COMPONENTS_SEED,
  true,
);

export const SKILLS = bundle(
  'skill',
  'skills',
  'Skills.',
  'Skill',
  'Skills',
  SKILLS_SEED,
  true,
);

export const RULES = bundle(
  'rule',
  'rules',
  'Rules.',
  'Rule',
  'Rules',
  RULES_SEED,
  true,
);

export const SUBAGENTS = bundle(
  'subagent',
  'subagents',
  'Subagents.',
  'Subagent',
  'Subagents',
  SUBAGENTS_SEED,
  true,
);

export const PLUGINS = bundle(
  'plugin',
  'plugins',
  'Plugins.',
  'Plugin',
  'Plugins',
  PLUGINS_SEED,
  true,
);

export const PROMPTS = bundle(
  'prompt',
  'prompts',
  'Prompts.',
  'Prompt',
  'Prompts',
  PROMPTS_SEED,
  false, // prompts are client-agnostic
);

// ── Batch from _remaining.ts ───────────────────────────────────────────

export const TOOLS = bundle('tool', 'tools', 'Tools.', 'Tool', 'Tools', TOOLS_SEED, false);
export const HOOKS = bundle('hook', 'hooks', 'Hooks.', 'Hook', 'Hooks', HOOKS_SEED, true);
export const COMMANDS = bundle('command', 'commands', 'Commands.', 'Command', 'Commands', COMMANDS_SEED, true);
export const STARTERS = bundle('starter', 'starters', 'Starters.', 'Starter', 'Starters', STARTERS_SEED, true);
export const WORKFLOWS = bundle('workflow', 'workflows', 'Workflows.', 'Workflow', 'Workflows', WORKFLOWS_SEED, false);
export const EVALS = bundle('eval', 'evals', 'Evals.', 'Eval', 'Evals', EVALS_SEED, false);
export const SHOWCASE = bundle('showcase', 'showcase', 'Showcase.', 'Project', 'Projects', SHOWCASE_SEED, false);
export const SANDBOXES = bundle('sandbox', 'sandboxes', 'Sandboxes.', 'Sandbox', 'Sandboxes', SANDBOXES_SEED, false);
export const OBSERVABILITY = bundle('observability', 'observability', 'Observability.', 'Tool', 'Tools', OBSERVABILITY_SEED, false);
export const BACKENDS = bundle('backend', 'backends', 'Backends.', 'Backend', 'Backends', BACKENDS_SEED, false);
export const ASSETS = bundle('asset', 'assets', 'Assets.', 'Asset', 'Assets', ASSETS_SEED, false);
export const DOCS_FOR_LLMS = bundle('docs_for_llms', 'docs-for-llms', 'Docs for LLMs.', 'Doc', 'Docs', DOCS_FOR_LLMS_SEED, false);
export const SPECS = bundle('spec', 'specs', 'Specs.', 'Spec', 'Specs', SPECS_SEED, false);
export const STACKS = bundle('stack', 'stacks', 'Stacks.', 'Stack', 'Stacks', STACKS_SEED, false);
export const SCRIPTS = bundle('script', 'scripts', 'Scripts.', 'Script', 'Scripts', SCRIPTS_SEED, false);
export const MARKETPLACES = bundle('marketplace', 'marketplaces', 'Marketplaces.', 'Marketplace', 'Marketplaces', MARKETPLACES_SEED, true);
