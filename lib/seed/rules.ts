// Seed data for /rules (Cursor / Claude Code rules — coding conventions
// enforced by the agent at completion time).

import type { GenericResource } from './generic';

const TS_STRICT_RULE = `# Strict TypeScript

Bans \`any\` (including \`as any\`).
Requires explicit return types on every exported function.
Forbids non-null assertions (\`!\`).
Treats unions as exhaustive — every \`switch\` over a discriminated union
must have a default branch that's never-typed.

Pairs well with \`@typescript-eslint/no-explicit-any\` and
\`@typescript-eslint/explicit-function-return-type\`.`;

const TAILWIND_ORDER_RULE = `# Tailwind Class Order

Sort utility classes by Tailwind convention:
1. Layout (flex, grid, block, …)
2. Box model (w-*, h-*, p-*, m-*)
3. Typography (text-*, font-*, leading-*, tracking-*)
4. Visual (bg-*, border-*, rounded-*, shadow-*)
5. State variants (hover:, focus:, …) last in each group

Replaces \`prettier-plugin-tailwindcss\` for editors that can't run it.`;

export const RULES_SEED: GenericResource[] = [
  {
    slug: 'ts-strict',
    name: 'Strict TypeScript',
    tagline: 'Bans any, enforces exhaustive types',
    author: 't3.gg',
    version: '2.0.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: ['TypeScript'],
    ratingAvg: 4.8,
    installCount7d: 4012,
    installCountTotal: 28210,
    updatedLabel: '3d ago',
    description:
      'Pin every TypeScript edit to a strict subset. Bans `any`, requires explicit return types, treats unions as exhaustive.',
    codeLanguage: 'md',
    codeSnippet: TS_STRICT_RULE,
  },
  {
    slug: 'tailwind-conventions',
    name: 'Tailwind class order',
    tagline: 'Sorts classes by Tailwind convention',
    author: 'tailwindlabs',
    version: '1.4.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline'],
    stackTags: ['Tailwind'],
    ratingAvg: 4.6,
    installCount7d: 2810,
    installCountTotal: 18420,
    updatedLabel: '1w ago',
    description:
      'Replaces `prettier-plugin-tailwindcss` for editors without prettier on save.',
    codeLanguage: 'md',
    codeSnippet: TAILWIND_ORDER_RULE,
  },
  {
    slug: 'no-emoji-in-code',
    name: 'No emoji in code',
    tagline: 'Strip emoji from variable / function names + comments',
    author: 'opinions',
    version: '0.1.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code'],
    stackTags: [],
    ratingAvg: 4.2,
    installCount7d: 410,
    installCountTotal: 1820,
    updatedLabel: '3w ago',
    description:
      'Cosmetic rule that keeps your codebase greppable and bug-tracker-friendly.',
  },
  {
    slug: 'commit-conventional',
    name: 'Conventional Commits',
    tagline: 'Type(scope): subject + body convention',
    author: 'commitlint',
    version: '5.0.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: [],
    ratingAvg: 4.7,
    installCount7d: 1240,
    installCountTotal: 9820,
    updatedLabel: '6d ago',
    description:
      'Adds a one-line check at commit time: subject must start with one of `feat | fix | chore | docs | refactor | test`.',
  },
];
