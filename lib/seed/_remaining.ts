// Batch seed for the 16 remaining resource types. Each gets 3 entries so
// the index renders something real without dragging session budget into
// editorial work. Real data lands when ingestion + editorial seed bundle
// arrive.

import type { GenericResource } from './generic';

function mk(
  slug: string,
  name: string,
  tagline: string,
  author: string,
  description: string,
  options: Partial<GenericResource> = {},
): GenericResource {
  return {
    slug,
    name,
    tagline,
    author,
    description,
    version: '1.0.0',
    license: 'MIT',
    compatibleClients: [],
    stackTags: [],
    ratingAvg: 4.5 + Math.random() * 0.4,
    installCount7d: 200 + Math.floor(Math.random() * 4_000),
    installCountTotal: 2_000 + Math.floor(Math.random() * 40_000),
    updatedLabel: `${Math.ceil(Math.random() * 14)}d ago`,
    ...options,
  };
}

export const TOOLS_SEED: GenericResource[] = [
  mk(
    'cursor',
    'Cursor',
    'AI-first VS Code fork — tab completion, agents, chat',
    'Anysphere',
    'The flagship AI-first IDE built on VS Code. Tab completion, multi-file agents, repo-wide search.',
    { license: 'Proprietary', stackTags: [] },
  ),
  mk(
    'claude-code',
    'Claude Code',
    'Terminal-native coding agent from Anthropic',
    'Anthropic',
    'Lives in your terminal. Reads + writes the filesystem, runs commands, drives tests.',
    { license: 'Proprietary' },
  ),
  mk(
    'windsurf',
    'Windsurf',
    'Codeium\'s agentic IDE',
    'Codeium',
    'Cascade agent mode + flow-state focus. Free tier covers most personal use.',
    { license: 'Proprietary' },
  ),
];

export const HOOKS_SEED: GenericResource[] = [
  mk(
    'pre-commit-tests',
    'Pre-commit test runner',
    'Runs vitest on changed files before commit',
    'agentkit',
    'Hook that intercepts `git commit` and runs the relevant vitest suites against the diff.',
    { compatibleClients: ['claude-code', 'cursor'], stackTags: ['Vitest'] },
  ),
  mk(
    'pre-push-typecheck',
    'Pre-push typecheck',
    'Blocks pushes that break tsc --noEmit',
    'agentkit',
    'Catches the breakage locally; saves a CI round-trip and a force-push later.',
    { compatibleClients: ['claude-code'], stackTags: ['TypeScript'] },
  ),
  mk(
    'post-merge-deps',
    'Post-merge deps install',
    'Detects lockfile changes and runs pnpm install',
    'agentkit',
    'No more "why does it not work after merging main?" — the hook reinstalls when the lockfile drifts.',
    { compatibleClients: ['claude-code', 'cursor'] },
  ),
];

export const COMMANDS_SEED: GenericResource[] = [
  mk(
    'deploy',
    '/deploy',
    'Deploy to Vercel with safety checks',
    'verceldevs',
    'Slash command that gates `vercel --prod` on a passing typecheck + lint + (optional) e2e.',
    { compatibleClients: ['claude-code'], stackTags: ['Vercel'] },
  ),
  mk(
    'review',
    '/review',
    'Review staged diff against repo conventions',
    'agentkit',
    'Reads CONVENTIONS.md + the diff, then produces a structured review (correctness / security / perf / style).',
    { compatibleClients: ['claude-code', 'cursor'] },
  ),
  mk(
    'ship',
    '/ship',
    'PR + push + Vercel deploy in one command',
    'shipfast',
    'Convenience macro for `git push origin head && gh pr create && vercel`. Fail-fast on any step.',
    { compatibleClients: ['claude-code'], stackTags: ['Vercel'] },
  ),
];

export const STARTERS_SEED: GenericResource[] = [
  mk(
    'saas-kit',
    'SaaS Starter — Next + Supabase + Stripe',
    'Auth, billing, dashboard, marketing — ready in an afternoon',
    'shipfast',
    'Production-ready Next.js 15 + Supabase auth + Stripe billing + Resend email. shadcn/ui throughout.',
    {
      compatibleClients: ['cursor', 'claude-code', 'windsurf'],
      stackTags: ['Next.js', 'Supabase', 'Stripe', 'Tailwind'],
    },
  ),
  mk(
    't3-app',
    'T3 App',
    'Next.js + TS + tRPC + Tailwind + Drizzle',
    'create-t3-app',
    'Generator for the typesafe T3 stack. Drizzle is now the default ORM.',
    {
      compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline'],
      stackTags: ['Next.js', 'TypeScript', 'tRPC', 'Drizzle', 'Tailwind'],
    },
  ),
  mk(
    'astro-content',
    'Astro Content Starter',
    'Markdown blog with content collections',
    'astro',
    'Type-safe content collections, MDX, RSS, sitemap. Ships in under 5 KB JS.',
    { stackTags: ['Astro', 'TypeScript', 'Tailwind'] },
  ),
];

export const WORKFLOWS_SEED: GenericResource[] = [
  mk(
    'saas-launch-7-days',
    'SaaS Launch in 7 Days',
    'Idea → live product in twelve steps',
    'shipfast',
    'Idea framing → MVP scoping → auth wiring → billing → marketing copy → deploy → first sale.',
    { stackTags: ['Next.js', 'Supabase', 'Stripe'] },
  ),
  mk(
    'pr-triage',
    'PR triage workflow',
    'Label / route / assign every incoming PR',
    'agentkit',
    'Reads the PR diff + description, labels by area, routes to the right reviewer, requests changes if conventions break.',
    { compatibleClients: ['claude-code'] },
  ),
  mk(
    'doc-from-tests',
    'Docs from tests',
    'Generate user docs from a test suite',
    'agentkit',
    'Walks vitest + playwright, extracts user-facing flows, writes a how-to page per flow.',
    { compatibleClients: ['claude-code'] },
  ),
];

export const EVALS_SEED: GenericResource[] = [
  mk(
    'swe-bench-verified',
    'SWE-Bench Verified',
    'Human-verified subset of SWE-Bench tasks',
    'princeton-nlp',
    'Curated tasks where success is reliably gradeable. The default benchmark for agentic coding model comparisons.',
    { license: 'MIT' },
  ),
  mk(
    'taubench',
    'TauBench',
    'Multi-turn tool-use evaluation with role-played users',
    'sierra',
    'Customer-service simulation graded by task completion + DB state.',
    { license: 'Apache-2.0' },
  ),
  mk(
    'pkg-bench',
    'Pkg-Bench',
    'Eval suite for full repo-level edits',
    'vibe-coder-hub',
    'Multi-file diffs graded by passing tests + repo conventions.',
  ),
];

export const SHOWCASE_SEED: GenericResource[] = [
  mk(
    'linkrr',
    'linkrr.app',
    'Vibe-coded link shortener — built solo in 4 days',
    'benhope',
    'Solo build with Cursor + Claude. Edge runtime, Supabase, Tailwind, custom domains.',
    { license: '', stackTags: ['Next.js', 'Supabase'] },
  ),
  mk(
    'devbox',
    'devbox.tools',
    'A directory of vibe-coding tools — built with the same stack',
    'devbox-team',
    'Curated tools, similar shape, smaller scope.',
    { stackTags: ['Astro', 'Tailwind'] },
  ),
  mk(
    'snip',
    'snip.dev',
    'Personal code-snippet vault — built on Convex',
    'mike',
    'Personal use case shipped publicly. Convex backend, Next App Router.',
    { stackTags: ['Next.js', 'Convex'] },
  ),
];

export const SANDBOXES_SEED: GenericResource[] = [
  mk(
    'e2b',
    'E2B Code Interpreter',
    'Cloud sandboxes for AI agents',
    'E2B',
    'Hardened Linux sandbox for agent-executed code. Filesystem, networking, optional GPU.',
    { license: 'Apache-2.0' },
  ),
  mk(
    'modal',
    'Modal Sandbox',
    'On-demand containers from your agent',
    'Modal',
    'Spawn an isolated container with one API call. Fast cold-start, ML-friendly.',
    { license: 'Apache-2.0' },
  ),
  mk(
    'gitpod-flex',
    'Gitpod Flex',
    'Self-hosted dev environments at scale',
    'Gitpod',
    'Per-developer cloud workspaces; agent integration via the Gitpod CLI.',
    { license: 'Apache-2.0' },
  ),
];

export const OBSERVABILITY_SEED: GenericResource[] = [
  mk(
    'langfuse',
    'Langfuse',
    'LLM observability + evals',
    'Langfuse',
    'Trace, score, replay, and version your LLM calls. Self-host or hosted.',
    { license: 'MIT' },
  ),
  mk(
    'helicone',
    'Helicone',
    'Logs, costs, latency for OpenAI / Anthropic',
    'Helicone',
    'Proxy in front of provider APIs. Per-user cost attribution.',
    { license: 'Apache-2.0' },
  ),
  mk(
    'arize-phoenix',
    'Arize Phoenix',
    'Open-source LLM tracing + evals',
    'Arize',
    'Local dev tracing + evals; rich UI for span inspection.',
    { license: 'Apache-2.0' },
  ),
];

export const BACKENDS_SEED: GenericResource[] = [
  mk(
    'better-auth',
    'better-auth',
    'Modern auth for TypeScript apps',
    'better-auth',
    'OAuth + magic link + 2FA + organizations + RBAC. Drop-in alternative to NextAuth.',
    { stackTags: ['TypeScript'] },
  ),
  mk(
    'convex',
    'Convex',
    'Real-time backend with reactive queries',
    'Convex',
    'TypeScript-first backend with built-in subscriptions, file storage, search.',
    { stackTags: ['TypeScript'] },
  ),
  mk(
    'supabase',
    'Supabase',
    'Postgres-as-a-service with auth + storage + realtime',
    'Supabase',
    'Open-source Firebase alternative. Postgres-backed, RLS for authz.',
    { stackTags: ['Postgres'] },
  ),
];

export const ASSETS_SEED: GenericResource[] = [
  mk(
    'vibe-icons',
    'Vibe Icons (480 SVGs)',
    'Hand-drawn icon set for indie SaaS',
    'vibeicons',
    '480 hand-drawn SVGs across UI, brand, devices, and editorial.',
    { license: 'MIT' },
  ),
  mk(
    'blender-3d-devices',
    '3D Blender Device Scenes',
    '24 device mockups in .blend + USDZ',
    'mockd',
    'High-poly device renders, ready to drop into marketing pages.',
    { license: 'CC-BY' },
  ),
  mk(
    'rauno-textures',
    'Rauno Textures',
    'Subtle noise + grain overlays for hero blocks',
    'rauno',
    'PNG + WebP grain overlays; sized for 1440 × 900 hero blocks.',
    { license: 'CC-BY' },
  ),
];

export const DOCS_FOR_LLMS_SEED: GenericResource[] = [
  mk(
    'react-llms',
    'React llms.txt',
    'LLM-optimized React 19 docs',
    'react-team',
    'Compact, deduplicated React 19 reference suitable for system-prompt injection.',
    { stackTags: ['React'] },
  ),
  mk(
    'tailwind-llms',
    'Tailwind llms.txt',
    'Compact Tailwind v4 reference for agents',
    'tailwindlabs',
    'v4-specific cheatsheet; under 12 KB.',
    { stackTags: ['Tailwind'] },
  ),
  mk(
    'next-llms',
    'Next.js llms.txt',
    'App Router-specific reference',
    'vercel',
    'Server Components, route conventions, server actions; the patterns LLMs trip on.',
    { stackTags: ['Next.js'] },
  ),
];

export const SPECS_SEED: GenericResource[] = [
  mk(
    'payment-flow',
    'Payment flow spec',
    'Stripe Checkout + webhook handling',
    'shipfast',
    'Schema for the canonical Stripe-Checkout-then-webhook flow. Includes failure paths.',
    { stackTags: ['Stripe', 'Next.js'] },
  ),
  mk(
    'saas-onboarding',
    'SaaS onboarding spec',
    '7-step onboarding incl. invites + billing',
    'shipfast',
    'Captured patterns from 30+ B2B SaaS onboardings; covers SSO, invites, plan-picker, paywall placement.',
    { stackTags: ['Next.js'] },
  ),
  mk(
    'agent-chat',
    'Agent chat spec',
    'UI + transport spec for chat-style agent surfaces',
    'vibe-coder-hub',
    'Message shape, streaming protocol, tool-call rendering, retry semantics.',
    { stackTags: ['Next.js'] },
  ),
];

export const STACKS_SEED: GenericResource[] = [
  mk(
    't3-stack',
    'T3 Stack',
    'Next + TypeScript + tRPC + Tailwind + Drizzle',
    'theo',
    'The typesafe full-stack default.',
    { stackTags: ['Next.js', 'TypeScript', 'tRPC', 'Drizzle', 'Tailwind'] },
  ),
  mk(
    'astro-content-stack',
    'Astro Content Stack',
    'Astro + MDX + Tailwind for content-heavy sites',
    'astro',
    'Best when the unit of work is a page, not a component.',
    { stackTags: ['Astro', 'Tailwind'] },
  ),
  mk(
    'convex-stack',
    'Convex Stack',
    'Next + Convex + Clerk + Tailwind',
    'convex',
    'When real-time is the killer feature.',
    { stackTags: ['Next.js', 'Convex', 'Tailwind'] },
  ),
];

export const SCRIPTS_SEED: GenericResource[] = [
  mk(
    'bumpver',
    'bumpver',
    'Bump semver across package.json + Cargo.toml + Pyproject',
    'shipfast',
    'One command, every manifest file in the repo.',
  ),
  mk(
    'envsync',
    'envsync',
    'Sync .env.example with .env.local schema',
    'agentkit',
    'Diffs against a Zod schema; warns on drift.',
    { stackTags: ['TypeScript'] },
  ),
  mk(
    'release-notes-from-prs',
    'release-notes-from-prs',
    'Build CHANGELOG.md from merged PRs since last tag',
    'release-drafter',
    'Filters by label, groups by section, emits markdown.',
  ),
];

export const MARKETPLACES_SEED: GenericResource[] = [
  mk(
    'cursor-directory',
    'Cursor Directory',
    '600+ rules + MCPs curated for Cursor',
    'cursordirectory',
    'Community-curated rules and MCP servers, browsable by stack.',
    { compatibleClients: ['cursor'] },
  ),
  mk(
    'smithery',
    'Smithery',
    'MCP server registry + one-click install',
    'smithery',
    'Hosted MCP servers with one-click install into Cursor, Claude Code, Windsurf.',
    { compatibleClients: ['cursor', 'claude-code', 'windsurf'] },
  ),
  mk(
    'shadcn-registry',
    'shadcn Registry',
    'Component registry hub for shadcn-compatible UIs',
    'shadcn',
    'The canonical registry shadcn CLI pulls from.',
    { stackTags: ['React', 'Tailwind'] },
  ),
];
