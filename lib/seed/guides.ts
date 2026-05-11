// Seed data for /guides. Each guide is a vertical stepper with verifiable
// checkpoints between steps; Phase 1 ships static seeds, the editorial
// bundle replaces them later (see SESSION_HANDOFF editorial-seed bundle).

import { colors } from '../tokens';

export type GuideKind = 'GET STARTED' | 'USAGE' | 'TROUBLESHOOT' | 'MIGRATE' | 'ADVANCED';
export type GuideDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GuideStep {
  title: string;
  body: string;
  /** Optional verification command shown in a callout. */
  verifyCommand?: string;
  /** Optional expected output snippet. */
  verifyExpect?: string;
}

export interface Guide {
  slug: string;
  title: string;
  kind: GuideKind;
  difficulty: GuideDifficulty;
  duration: string;
  os: string[];
  variant: 'mint' | 'uv' | 'yellow' | 'pink';
  resourceSlug?: string;
  description: string;
  steps: GuideStep[];
}

const VARIANT_TILE: Record<Guide['variant'], string> = {
  mint:   colors.tileMint,
  uv:     colors.tilePurple,
  yellow: colors.tileYellow,
  pink:   colors.tilePink,
};

export function variantToTile(variant: Guide['variant']): string {
  return VARIANT_TILE[variant];
}

const GUIDES: Guide[] = [
  {
    slug: 'install-qwen-mac',
    title: 'Install Qwen 3 Coder 32B on macOS via Ollama',
    kind: 'GET STARTED',
    difficulty: 'beginner',
    duration: '5 min',
    os: ['macOS'],
    variant: 'mint',
    resourceSlug: 'qwen-3-coder-32b',
    description:
      'Get the Qwen 3 Coder 32B open-weights model running locally via Ollama, then wire it into Cursor as a custom endpoint.',
    steps: [
      {
        title: 'Install Ollama',
        body: 'Download Ollama for macOS. Single binary, no dependencies; runs as a launchd service.',
        verifyCommand: 'ollama --version',
        verifyExpect: 'ollama version is 0.3.x',
      },
      {
        title: 'Pull the model',
        body: 'The 32B variant is recommended for an M3 Max with 36 GB of RAM — the Q4 quantization fits comfortably in memory with headroom for your IDE and browser.',
        verifyCommand: 'ollama pull qwen3-coder:32b',
        verifyExpect: 'pulling … success',
      },
      {
        title: 'Run a test query',
        body: 'Confirm the model responds. First token latency should land in the 0.4s neighborhood.',
        verifyCommand: 'ollama run qwen3-coder:32b "Write a fizzbuzz in Rust."',
      },
      {
        title: 'Connect to Cursor',
        body: 'In Cursor settings, add a custom OpenAI-compatible endpoint pointed at http://localhost:11434/v1.',
      },
    ],
  },
  {
    slug: 'connect-supabase-cursor',
    title: 'Wire Supabase MCP to Cursor in 90 seconds',
    kind: 'GET STARTED',
    difficulty: 'beginner',
    duration: '2 min',
    os: ['macOS', 'Linux', 'Windows'],
    variant: 'uv',
    resourceSlug: 'supabase-mcp',
    description:
      'Install the Supabase MCP and let Cursor query, migrate, and inspect your Supabase project from the editor.',
    steps: [
      {
        title: 'Generate a service-role token',
        body: 'In the Supabase dashboard, project settings → API → service_role key. Treat it like a password.',
      },
      {
        title: 'Install the MCP',
        body: 'Cursor settings → MCP → Add server → Supabase. Paste the service-role token.',
        verifyCommand: 'cursor --mcp list',
      },
      {
        title: 'Smoke test',
        body: 'Ask Cursor to "list public tables." If you see your schema, you\'re wired up.',
      },
    ],
  },
  {
    slug: 'gpt5-jsonmode-fix',
    title: 'When GPT-5 JSON mode fails: a 30-second fix',
    kind: 'TROUBLESHOOT',
    difficulty: 'beginner',
    duration: '3 min',
    os: [],
    variant: 'pink',
    resourceSlug: 'gpt-5',
    description:
      'GPT-5 occasionally emits a trailing-comma quirk in strict JSON mode. Here\'s the one-line fix until OpenAI ships a patch.',
    steps: [
      {
        title: 'Confirm the failure mode',
        body: 'Look for `SyntaxError: Unexpected token } in JSON at position N` when parsing.',
      },
      {
        title: 'Apply the response_format override',
        body: 'Pass `response_format: { type: "json_object" }` plus an explicit schema in your system prompt. Re-parse with `JSON.parse` — works on every retry.',
      },
    ],
  },
  {
    slug: 'agent-loops-claude-code',
    title: 'Agent loops in Claude Code: when to break out',
    kind: 'ADVANCED',
    difficulty: 'intermediate',
    duration: '12 min',
    os: ['macOS', 'Linux'],
    variant: 'yellow',
    resourceSlug: 'claude-code',
    description:
      'Claude Code agents can loop on uncertain instructions. Here\'s the heuristic the team uses to ship cleanly.',
    steps: [
      {
        title: 'Spot the symptom early',
        body: 'Repeated tool calls with the same arguments are the canonical signal. Stop the loop before the budget burns.',
      },
      {
        title: 'Re-anchor with a concrete observation',
        body: 'Ask the agent what it learned from the last 3 tool calls. If the answer is hand-wavy, the loop is real.',
      },
      {
        title: 'Break out, then resume',
        body: 'Send a single high-information user message that names the wrong assumption. The agent re-plans cleanly.',
      },
    ],
  },
];

export function listGuides(): Guide[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_KIND_LABELS: Record<GuideKind, string> = {
  'GET STARTED':  'Get started',
  USAGE:          'Usage',
  TROUBLESHOOT:   'Troubleshoot',
  MIGRATE:        'Migrate',
  ADVANCED:       'Advanced',
};

export const DIFFICULTY_LABELS: Record<GuideDifficulty, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};
