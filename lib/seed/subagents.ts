// Seed data for /subagents (specialized Claude Code subagents).

import type { GenericResource } from './generic';

export const SUBAGENTS_SEED: GenericResource[] = [
  {
    slug: 'test-writer',
    name: 'Test Writer',
    tagline: 'Generates unit + e2e tests from source code',
    author: 'agentkit',
    version: '0.5.0',
    license: 'MIT',
    compatibleClients: ['claude-code'],
    stackTags: ['Vitest', 'Playwright'],
    ratingAvg: 4.6,
    installCount7d: 821,
    installCountTotal: 3401,
    updatedLabel: '5d ago',
    description:
      'Inspects a function or component, then writes Vitest unit tests with a Playwright e2e companion for UI paths.',
  },
  {
    slug: 'pr-reviewer',
    name: 'PR Reviewer',
    tagline: 'Reviews PRs against your team conventions',
    author: 'agentkit',
    version: '0.4.1',
    license: 'MIT',
    compatibleClients: ['claude-code', 'cursor'],
    stackTags: [],
    ratingAvg: 4.4,
    installCount7d: 312,
    installCountTotal: 1840,
    updatedLabel: '2w ago',
    description:
      'Reads the diff plus your repo conventions doc and produces a structured review (correctness / security / perf / style).',
  },
  {
    slug: 'migration-planner',
    name: 'Migration Planner',
    tagline: 'Sequences risky DB migrations with rollback steps',
    author: 'planetscale',
    version: '0.2.0',
    license: 'MIT',
    compatibleClients: ['claude-code'],
    stackTags: ['Postgres'],
    ratingAvg: 4.5,
    installCount7d: 240,
    installCountTotal: 920,
    updatedLabel: '3w ago',
    description:
      'Takes a schema-change brief and emits an ordered migration plan with locking notes + a rollback runbook.',
  },
  {
    slug: 'security-auditor',
    name: 'Security Auditor',
    tagline: 'Scans code paths for OWASP Top 10 issues',
    author: 'snyk',
    version: '1.0.0',
    license: 'MIT',
    compatibleClients: ['claude-code', 'cursor'],
    stackTags: [],
    ratingAvg: 4.6,
    installCount7d: 612,
    installCountTotal: 4210,
    updatedLabel: '1w ago',
    description:
      'Triages a route or function for injection / authn / authz / CSRF / SSRF / secrets risk. Pairs with the static-analysis result.',
  },
];
