// Seed data for /best-for. Editorial stack-rankings per use case.
// Phase 1: 12 use cases × 3 picks each. Slots 4–10 are stubbed as
// "More picks coming Q3 2026" until the editorial bundle lands.

import { colors } from '../tokens';

export interface BestForPick {
  /** id of an existing resource: `${type}:${slug}`. */
  resourceId: string;
  /** Display name (denormalized from the resource for the SSR render). */
  resourceName: string;
  /** Resource type for the TypeBadge kicker. */
  resourceType: string;
  /** Href to the resource detail page. */
  href: string;
  /** Short "why this is best for X" rationale; ~140 chars. */
  rationale: string;
}

export interface BestForUseCase {
  slug: string;
  /** e.g. 'Building a SaaS in a weekend'. */
  title: string;
  /** 1-2 sentence intro shown in the hero. */
  description: string;
  /** Tile colour for the index card + per-page accent. */
  variant: 'mint' | 'uv' | 'yellow' | 'pink';
  picks: BestForPick[];
}

const VARIANT_TILE: Record<BestForUseCase['variant'], string> = {
  mint:   colors.tileMint,
  uv:     colors.tilePurple,
  yellow: colors.tileYellow,
  pink:   colors.tilePink,
};

export function bestForVariantToTile(variant: BestForUseCase['variant']): string {
  return VARIANT_TILE[variant];
}

const USE_CASES: BestForUseCase[] = [
  {
    slug: 'saas-weekend',
    title: 'Building a SaaS in a weekend',
    description:
      'You have 48 hours, an idea, and a Stripe account. These picks collapse weeks of boilerplate into one afternoon of wiring.',
    variant: 'mint',
    picks: [
      {
        resourceId: 'starter:saas-kit',
        resourceName: 'SaaS Starter — Next + Supabase + Stripe',
        resourceType: 'STARTER',
        href: '/starters/saas-kit',
        rationale:
          'Auth, billing, dashboard, marketing — already wired. Clone it Friday night and you are charging cards by Sunday.',
      },
      {
        resourceId: 'mcp:stripe-mcp',
        resourceName: 'Stripe MCP',
        resourceType: 'MCP',
        href: '/mcps/stripe-mcp',
        rationale:
          'Skip the Stripe dashboard. Create products, prices, and webhooks straight from Claude Code while you build the UI.',
      },
      {
        resourceId: 'model:claude-sonnet-4-6',
        resourceName: 'Claude Sonnet 4.6',
        resourceType: 'MODEL',
        href: '/models/claude-sonnet-4-6',
        rationale:
          'The price/speed sweet spot for shipping fast. Cheap enough to run a whole weekend, sharp enough to ship product.',
      },
    ],
  },
  {
    slug: 'agent-coding',
    title: 'Best for agentic coding',
    description:
      'Long-horizon tasks, tool use, and multi-step plans. The models and runtimes here keep their head over thousands of tool calls.',
    variant: 'uv',
    picks: [
      {
        resourceId: 'model:claude-opus-4-7',
        resourceName: 'Claude Opus 4.7',
        resourceType: 'MODEL',
        href: '/models/claude-opus-4-7',
        rationale:
          'State-of-the-art on SWE-bench Verified and Terminal-Bench. The one model that reliably finishes long agent loops without drift.',
      },
      {
        resourceId: 'guide:agent-loops-claude-code',
        resourceName: 'Agent loops in Claude Code',
        resourceType: 'GUIDE',
        href: '/guides/agent-loops-claude-code',
        rationale:
          'A 20-minute primer on structuring tool-use loops so the agent self-corrects instead of spiraling into a 200-step death march.',
      },
      {
        resourceId: 'subagent:pr-reviewer',
        resourceName: 'PR Reviewer subagent',
        resourceType: 'SUBAGENT',
        href: '/subagents/pr-reviewer',
        rationale:
          'Dedicated review subagent runs in parallel to the main loop. Catches the regressions your primary agent missed.',
      },
    ],
  },
  {
    slug: 'open-weights-local',
    title: 'Running open-weights models locally',
    description:
      'Air-gapped, offline, or just refusing to send code to a third party. The best picks for self-hosted inference on consumer hardware.',
    variant: 'yellow',
    picks: [
      {
        resourceId: 'model:qwen-3-coder-32b',
        resourceName: 'Qwen 3 Coder 32B',
        resourceType: 'MODEL',
        href: '/models/qwen-3-coder-32b',
        rationale:
          'The strongest sub-40B coder weights you can run on a 64GB MacBook. Cursor-tier completions, zero API spend.',
      },
      {
        resourceId: 'guide:install-qwen-mac',
        resourceName: 'Install Qwen 3 Coder 32B on macOS',
        resourceType: 'GUIDE',
        href: '/guides/install-qwen-mac',
        rationale:
          'Five-minute Ollama install plus the exact JSON to wire it into Cursor as a custom endpoint. Verifiable at every step.',
      },
      {
        resourceId: 'model:llama-4-405b',
        resourceName: 'Llama 4 405B',
        resourceType: 'MODEL',
        href: '/models/llama-4-405b',
        rationale:
          'When you have the H100s, 405B is the open-weights ceiling. Use it as the inference layer behind your own product.',
      },
    ],
  },
  {
    slug: 'long-context-rag',
    title: 'Long-context RAG over millions of tokens',
    description:
      'Codebases, depositions, financials — anything where the whole archive matters. Picks chosen for retrieval fidelity at extreme context.',
    variant: 'pink',
    picks: [
      {
        resourceId: 'model:gemini-3-1-pro',
        resourceName: 'Gemini 3.1 Pro',
        resourceType: 'MODEL',
        href: '/models/gemini-3-1-pro',
        rationale:
          '2M-token context with near-perfect needle-in-haystack recall. The only model that genuinely uses the whole window.',
      },
      {
        resourceId: 'model:claude-opus-4-7',
        resourceName: 'Claude Opus 4.7',
        resourceType: 'MODEL',
        href: '/models/claude-opus-4-7',
        rationale:
          '200k context plus the strongest reasoning over it. Use prompt caching and you get long-context for cents per query.',
      },
      {
        resourceId: 'mcp:filesystem-mcp',
        resourceName: 'Filesystem MCP',
        resourceType: 'MCP',
        href: '/mcps/filesystem-mcp',
        rationale:
          'Streams local files into the model on demand instead of stuffing the prompt. Lazy retrieval beats brute-force tokens.',
      },
    ],
  },
  {
    slug: 'cheap-throughput',
    title: 'Cheap, fast inference at scale',
    description:
      'Background jobs, batch enrichment, embeddings pipelines. Picks where cost-per-million is the only metric that matters.',
    variant: 'mint',
    picks: [
      {
        resourceId: 'model:deepseek-v4',
        resourceName: 'DeepSeek V4',
        resourceType: 'MODEL',
        href: '/models/deepseek-v4',
        rationale:
          'GPT-4-class outputs at roughly 1/30th the price. The default choice for any pipeline that processes millions of rows.',
      },
      {
        resourceId: 'model:kimi-k3',
        resourceName: 'Kimi K3',
        resourceType: 'MODEL',
        href: '/models/kimi-k3',
        rationale:
          'Mixture-of-experts that hits 300+ tokens/sec on hosted providers. Use it for chat surfaces where latency dominates UX.',
      },
      {
        resourceId: 'model:claude-sonnet-4-6',
        resourceName: 'Claude Sonnet 4.6',
        resourceType: 'MODEL',
        href: '/models/claude-sonnet-4-6',
        rationale:
          'Prompt caching takes Sonnet from "cheap" to "absurdly cheap" for repeated-context workloads. Cache hits cost 90% less.',
      },
    ],
  },
  {
    slug: 'multi-agent',
    title: 'Coordinating multi-agent workflows',
    description:
      'Planner, executor, reviewer, critic. When one agent isn’t enough, these tools structure the handoffs and stop them stepping on each other.',
    variant: 'uv',
    picks: [
      {
        resourceId: 'subagent:migration-planner',
        resourceName: 'Migration Planner subagent',
        resourceType: 'SUBAGENT',
        href: '/subagents/migration-planner',
        rationale:
          'Decomposes a big change into ordered subtasks before any code runs. Use it as the planner in a planner/executor split.',
      },
      {
        resourceId: 'subagent:test-writer',
        resourceName: 'Test Writer subagent',
        resourceType: 'SUBAGENT',
        href: '/subagents/test-writer',
        rationale:
          'Runs in parallel with your implementation agent. Tests get written against the spec, not the (potentially buggy) code.',
      },
      {
        resourceId: 'guide:agent-loops-claude-code',
        resourceName: 'Agent loops in Claude Code',
        resourceType: 'GUIDE',
        href: '/guides/agent-loops-claude-code',
        rationale:
          'Walks through the orchestration pattern: when to spawn a subagent vs stay in the main loop, plus how to pass context cleanly.',
      },
    ],
  },
  {
    slug: 'enterprise-compliance',
    title: 'Enterprise-compliant deployments',
    description:
      'SOC 2, HIPAA, data residency, BAAs. Picks chosen because Procurement will actually sign off on them.',
    variant: 'pink',
    picks: [
      {
        resourceId: 'model:claude-opus-4-7',
        resourceName: 'Claude Opus 4.7',
        resourceType: 'MODEL',
        href: '/models/claude-opus-4-7',
        rationale:
          'Available on AWS Bedrock and GCP Vertex with full BAA + zero-retention options. The default safe pick for regulated workloads.',
      },
      {
        resourceId: 'mcp:auth0-mcp',
        resourceName: 'Auth0 MCP',
        resourceType: 'MCP',
        href: '/mcps/auth0-mcp',
        rationale:
          'Enterprise SSO, SAML, and audit logs without rolling your own. Auditors recognise the name, which matters more than you think.',
      },
      {
        resourceId: 'subagent:security-auditor',
        resourceName: 'Security Auditor subagent',
        resourceType: 'SUBAGENT',
        href: '/subagents/security-auditor',
        rationale:
          'Runs OWASP and secret-scan checks on every diff before commit. Stops the obvious compliance failures before review.',
      },
    ],
  },
  {
    slug: 'vision-multimodal',
    title: 'Vision + multimodal understanding',
    description:
      'Screenshots, charts, video frames, PDFs with figures. Picks chosen for visual reasoning, not just OCR.',
    variant: 'yellow',
    picks: [
      {
        resourceId: 'model:gemini-3-1-pro',
        resourceName: 'Gemini 3.1 Pro',
        resourceType: 'MODEL',
        href: '/models/gemini-3-1-pro',
        rationale:
          'Best-in-class on chart and document VQA. Native video understanding too — feed it 30 minutes of screen recording and ask.',
      },
      {
        resourceId: 'model:gpt-5',
        resourceName: 'GPT-5',
        resourceType: 'MODEL',
        href: '/models/gpt-5',
        rationale:
          'Strongest spatial reasoning of the frontier set. Use it when "where is X in the image" matters more than "what is X".',
      },
      {
        resourceId: 'mcp:playwright-mcp',
        resourceName: 'Playwright MCP',
        resourceType: 'MCP',
        href: '/mcps/playwright-mcp',
        rationale:
          'Pairs with a vision model: take a screenshot, ask the model what to click, drive the browser. The actual UI-agent stack.',
      },
    ],
  },
  {
    slug: 'code-refactor',
    title: 'Repo-wide refactors',
    description:
      'Type rename across 800 files, framework migration, dead-code purge. Picks that hold the whole repo in their head and don’t flinch.',
    variant: 'mint',
    picks: [
      {
        resourceId: 'model:claude-opus-4-7',
        resourceName: 'Claude Opus 4.7',
        resourceType: 'MODEL',
        href: '/models/claude-opus-4-7',
        rationale:
          'Best at multi-file consistency. Edits stay aligned across the codebase instead of fixing one call site and breaking three others.',
      },
      {
        resourceId: 'subagent:migration-planner',
        resourceName: 'Migration Planner subagent',
        resourceType: 'SUBAGENT',
        href: '/subagents/migration-planner',
        rationale:
          'Produces the dependency-ordered plan before a single line changes. Stops the "halfway through and stuck" failure mode.',
      },
      {
        resourceId: 'mcp:github-mcp',
        resourceName: 'GitHub MCP',
        resourceType: 'MCP',
        href: '/mcps/github-mcp',
        rationale:
          'Lets the agent open PRs, scope diffs, and track review threads. Refactor stops being a 4,000-line blob nobody can merge.',
      },
    ],
  },
  {
    slug: 'ui-generation',
    title: 'AI-generated UI components',
    description:
      'Forms, dashboards, marketing pages. Picks chosen because the output is something you’d actually ship, not a rough sketch.',
    variant: 'pink',
    picks: [
      {
        resourceId: 'model:claude-sonnet-4-6',
        resourceName: 'Claude Sonnet 4.6',
        resourceType: 'MODEL',
        href: '/models/claude-sonnet-4-6',
        rationale:
          'Generates idiomatic shadcn + Tailwind on the first try. Design tokens stay consistent, hover/focus states actually exist.',
      },
      {
        resourceId: 'starter:t3-app',
        resourceName: 'T3 App starter',
        resourceType: 'STARTER',
        href: '/starters/t3-app',
        rationale:
          'Type-safe scaffolding that AI-generated components plug into without a fight. tRPC + Tailwind + shadcn out of the box.',
      },
      {
        resourceId: 'model:gpt-5',
        resourceName: 'GPT-5',
        resourceType: 'MODEL',
        href: '/models/gpt-5',
        rationale:
          'Strongest at translating a Figma screenshot into working JSX. Pair with vision input and skip the design handoff entirely.',
      },
    ],
  },
  {
    slug: 'mcp-tooling',
    title: 'Tooling for Claude Code & Cursor',
    description:
      'The MCP servers and subagents that actually move the needle on day-to-day vibe coding. Curated, not exhaustive.',
    variant: 'uv',
    picks: [
      {
        resourceId: 'mcp:github-mcp',
        resourceName: 'GitHub MCP',
        resourceType: 'MCP',
        href: '/mcps/github-mcp',
        rationale:
          'The single highest-leverage MCP. PRs, issues, reviews, diffs — all from the agent loop, no context switch to the browser.',
      },
      {
        resourceId: 'mcp:supabase-mcp',
        resourceName: 'Supabase MCP',
        resourceType: 'MCP',
        href: '/mcps/supabase-mcp',
        rationale:
          'Schema reads, migrations, RLS policy edits straight from Claude Code. Stops the "what was that column called again" tax.',
      },
      {
        resourceId: 'mcp:linear-mcp',
        resourceName: 'Linear MCP',
        resourceType: 'MCP',
        href: '/mcps/linear-mcp',
        rationale:
          'Reads the ticket, writes the comment, moves the status. The agent closes its own Linear issue when the PR merges.',
      },
    ],
  },
  {
    slug: 'learning-vibe-coding',
    title: 'Learning vibe coding from scratch',
    description:
      'Never opened a terminal? These are the picks that get you from zero to shipping in a week without the typical Stack Overflow gauntlet.',
    variant: 'yellow',
    picks: [
      {
        resourceId: 'guide:connect-supabase-cursor',
        resourceName: 'Connect Supabase to Cursor',
        resourceType: 'GUIDE',
        href: '/guides/connect-supabase-cursor',
        rationale:
          'The first "real app" wiring guide. Database + IDE + AI talking to each other — the foundational vibe-coding loop in 10 minutes.',
      },
      {
        resourceId: 'starter:astro-content',
        resourceName: 'Astro Content starter',
        resourceType: 'STARTER',
        href: '/starters/astro-content',
        rationale:
          'The simplest "I shipped something" project. Markdown in, real website out — almost impossible to break, easy to extend.',
      },
      {
        resourceId: 'model:claude-sonnet-4-6',
        resourceName: 'Claude Sonnet 4.6',
        resourceType: 'MODEL',
        href: '/models/claude-sonnet-4-6',
        rationale:
          'Cheap enough to leave running all day while you learn. Explains its edits in plain English instead of just spraying code.',
      },
    ],
  },
];

export function listBestForUseCases(): BestForUseCase[] {
  return USE_CASES;
}

export function getBestForBySlug(slug: string): BestForUseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
