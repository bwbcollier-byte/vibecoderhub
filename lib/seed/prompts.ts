// Seed data for /prompts (reusable instruction packs).

import type { GenericResource } from './generic';

const PR_SUMMARY = `You are reviewing a pull request diff. Produce a 1-2 sentence summary
written in the **why**, not the **what**.

Rules:
- Lead with the user-visible change OR the business outcome.
- If it's a refactor, name the rule it enforces and why now.
- If it's a fix, name the bug class and the regression risk.
- Never restate the file paths — readers can see those in the diff.

Diff:
{diff}`;

const COMMIT_MESSAGE = `Generate a Conventional Commits message for this staged diff.

Type prefixes (pick one): feat | fix | chore | refactor | docs | test | perf.
Scope is optional; use a noun (auth, models, mcps, schema).
Subject is imperative present-tense, under 70 chars.
Body explains why — wrap at 72 cols, max 3 short paragraphs.
Footer: \`BREAKING CHANGE: …\` if any contract change.

Diff:
{diff}`;

export const PROMPTS_SEED: GenericResource[] = [
  {
    slug: 'pr-summary',
    name: 'PR Summary',
    tagline: 'Generate concise PR descriptions',
    author: 'octocat',
    version: '1.0.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code'],
    stackTags: [],
    ratingAvg: 4.3,
    installCount7d: 1240,
    installCountTotal: 8210,
    updatedLabel: '6d ago',
    description:
      'Reads a diff and produces a 1-2 sentence summary written in the *why*, not the *what*.',
    codeLanguage: 'md',
    codeSnippet: PR_SUMMARY,
  },
  {
    slug: 'commit-message',
    name: 'Commit Message',
    tagline: 'Conventional Commits from a staged diff',
    author: 'commitlint',
    version: '1.1.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: [],
    ratingAvg: 4.7,
    installCount7d: 3210,
    installCountTotal: 24201,
    updatedLabel: '2d ago',
    description:
      'Emits a type(scope): subject + body + optional BREAKING CHANGE footer per the Conventional Commits spec.',
    codeLanguage: 'md',
    codeSnippet: COMMIT_MESSAGE,
  },
  {
    slug: 'release-notes',
    name: 'Release Notes',
    tagline: 'Group merged PRs into user-facing release notes',
    author: 'release-drafter',
    version: '2.0.0',
    license: 'MIT',
    compatibleClients: ['claude-code'],
    stackTags: [],
    ratingAvg: 4.5,
    installCount7d: 820,
    installCountTotal: 4810,
    updatedLabel: '1w ago',
    description:
      'Groups merged PRs by label (feature / fix / chore) and rewrites titles into user-facing release notes.',
  },
  {
    slug: 'jira-from-thread',
    name: 'Jira from Thread',
    tagline: 'Turn a Slack thread into a structured Jira ticket',
    author: 'atlassian',
    version: '0.3.0',
    license: 'MIT',
    compatibleClients: ['claude-code', 'claude-desktop'],
    stackTags: [],
    ratingAvg: 4.4,
    installCount7d: 612,
    installCountTotal: 2820,
    updatedLabel: '2w ago',
    description:
      'Reads a Slack thread + extracts: title, repro steps, expected / actual, severity, attachments.',
  },
];
