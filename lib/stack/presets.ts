// Stack Picker presets — seed list per ANSWERS Q3.5 ("30 Stack Picker
// presets, top-6 above fold"). Full 30-preset seed lives in
// editorial-seed/presets/*.json (Ben provides). For Phase 1 we ship 6 hand-
// curated top picks; the full seed lands when the editorial bundle does.

export interface StackPreset {
  id: string;
  label: string;
  aiClients: string[];
  techStack: string[];
}

export const AI_CLIENTS = [
  'cursor',
  'claude-code',
  'windsurf',
  'cline',
  'claude-desktop',
  'continue',
  'zed',
  'aider',
] as const;

export const STACK_TAGS = [
  'Next.js',
  'React',
  'TypeScript',
  'Vue',
  'Svelte',
  'Astro',
  'Remix',
  'Tailwind',
  'Supabase',
  'Convex',
  'Postgres',
  'Drizzle',
  'Prisma',
  'Vercel',
  'Cloudflare',
  'AWS',
  'Bun',
  'Deno',
  'Node',
  'Python',
  'Rust',
  'Go',
  'Express',
  'Hono',
  'tRPC',
  'Stripe',
  'Clerk',
] as const;

export const STACK_PRESETS: StackPreset[] = [
  {
    id: 'cursor-next-supabase',
    label: 'Cursor + Next.js + Supabase',
    aiClients: ['cursor'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Drizzle'],
  },
  {
    id: 'cc-monorepo',
    label: 'Claude Code + monorepo',
    aiClients: ['claude-code'],
    techStack: ['TypeScript', 'tRPC', 'Drizzle', 'Postgres'],
  },
  {
    id: 'windsurf-svelte',
    label: 'Windsurf + SvelteKit',
    aiClients: ['windsurf'],
    techStack: ['Svelte', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'astro-content',
    label: 'Astro content site',
    aiClients: ['cursor', 'claude-code'],
    techStack: ['Astro', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'rust-cli',
    label: 'Rust CLI tooling',
    aiClients: ['claude-code', 'cursor'],
    techStack: ['Rust'],
  },
  {
    id: 'python-data',
    label: 'Python data + ML',
    aiClients: ['cursor', 'claude-code'],
    techStack: ['Python'],
  },
];
