// Per-type config + seed access for the batch types (S03-S08).

import { COMPONENTS_SEED } from './components';
import { SKILLS_SEED } from './skills';
import { RULES_SEED } from './rules';
import { SUBAGENTS_SEED } from './subagents';
import { PLUGINS_SEED } from './plugins';
import { PROMPTS_SEED } from './prompts';
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
