// PROMPTKIT — All seed data
// Realistic vibe-coding ecosystem content

window.RESOURCE_TYPES = [
  { id: 'component', label: 'Components', plural: 'Components', glyph: 'CMP', tint: '#3cffd0' },
  { id: 'mcp', label: 'MCPs', plural: 'MCP Servers', glyph: 'MCP', tint: '#5200ff' },
  { id: 'skill', label: 'Skills', plural: 'Skills', glyph: 'SKL', tint: '#f5e642' },
  { id: 'subagent', label: 'Subagents', plural: 'Subagents', glyph: 'SUB', tint: '#ff6b35' },
  { id: 'rule', label: 'Rules', plural: 'Rules Files', glyph: 'RUL', tint: '#3cffd0' },
  { id: 'prompt', label: 'Prompts', plural: 'Prompt Recipes', glyph: 'PRM', tint: '#ff3cac' },
  { id: 'plugin', label: 'Plugins', plural: 'Plugins', glyph: 'PLG', tint: '#1e6efa' },
  { id: 'marketplace', label: 'Marketplaces', plural: 'Marketplaces', glyph: 'MKT', tint: '#5200ff' },
  { id: 'hook', label: 'Hooks', plural: 'Hooks', glyph: 'HK', tint: '#3cffd0' },
  { id: 'command', label: 'Commands', plural: 'Slash Commands', glyph: 'CMD', tint: '#f5e642' },
  { id: 'starter', label: 'Starters', plural: 'Starter Kits', glyph: 'STR', tint: '#ff6b35' },
  { id: 'tool', label: 'Tools', plural: 'IDEs & Tools', glyph: 'TL', tint: '#3cffd0' },
  { id: 'model', label: 'Models', plural: 'AI Models', glyph: 'MDL', tint: '#5200ff' },
  { id: 'sandbox', label: 'Sandboxes', plural: 'Sandboxes', glyph: 'SBX', tint: '#1e6efa' },
  { id: 'observability', label: 'Observability', plural: 'Observability', glyph: 'OBS', tint: '#ff3cac' },
  { id: 'backend', label: 'Backend Kits', plural: 'Backend Kits', glyph: 'BE', tint: '#3cffd0' },
  { id: 'asset', label: 'Assets', plural: 'Design Assets', glyph: 'AST', tint: '#f5e642' },
  { id: 'showcase', label: 'Showcase', plural: 'Showcase', glyph: 'SHW', tint: '#ff6b35' },
  { id: 'docs', label: 'Docs-for-LLMs', plural: 'Docs for LLMs', glyph: 'DOC', tint: '#5200ff' },
  { id: 'spec', label: 'Specs', plural: 'Specs', glyph: 'SPC', tint: '#1e6efa' },
  { id: 'workflow', label: 'Workflows', plural: 'Workflows', glyph: 'WF', tint: '#3cffd0' },
  { id: 'stack', label: 'Stacks', plural: 'Stacks', glyph: 'STK', tint: '#ff3cac' },
  { id: 'eval', label: 'Evals', plural: 'Evals', glyph: 'EV', tint: '#f5e642' },
  { id: 'script', label: 'Scripts', plural: 'Scripts', glyph: 'SC', tint: '#5200ff' },
];

window.CLIENTS = [
  { id: 'cursor', name: 'Cursor', mark: 'CR' },
  { id: 'claude-code', name: 'Claude Code', mark: 'CC' },
  { id: 'windsurf', name: 'Windsurf', mark: 'WS' },
  { id: 'cline', name: 'Cline', mark: 'CL' },
  { id: 'aider', name: 'Aider', mark: 'AD' },
  { id: 'continue', name: 'Continue', mark: 'CN' },
  { id: 'zed', name: 'Zed', mark: 'ZD' },
  { id: 'copilot', name: 'Copilot', mark: 'GH' },
  { id: 'claude-desktop', name: 'Claude Desktop', mark: 'CD' },
  { id: 'cody', name: 'Cody', mark: 'CY' },
];

window.STACK_TAGS = [
  'Next.js', 'React', 'TypeScript', 'Vue', 'Svelte', 'Astro', 'Remix',
  'Tailwind', 'Supabase', 'Convex', 'Postgres', 'Drizzle', 'Prisma',
  'Vercel', 'Cloudflare', 'AWS', 'Bun', 'Deno', 'Node', 'Python',
  'Rust', 'Go', 'Express', 'Hono', 'tRPC', 'Stripe', 'Clerk',
];

window.MODELS = [
  { slug: 'claude-opus-4-7', name: 'Claude Opus 4.7', provider: 'Anthropic', providerColor: '#ff6b35', priceIn: 3, priceOut: 15, intelligence: 4.7, speed: 78, latency: 0.6, ctxAdv: 200000, ctxEff: 180000, cutoff: 'Apr 2026', released: 'May 2026', delta: -30, tags: ['reasoning', 'tools', 'vision', 'caching'], desc: 'Anthropic\'s flagship reasoning model. Best in class on agentic coding evals.' },
  { slug: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro', provider: 'Google', providerColor: '#1e6efa', priceIn: 1.25, priceOut: 5, intelligence: 4.6, speed: 142, latency: 0.4, ctxAdv: 2000000, ctxEff: 1100000, cutoff: 'Feb 2026', released: 'Mar 2026', delta: -12, tags: ['reasoning', 'vision', 'audio', 'tools'] },
  { slug: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', providerColor: '#10a37f', priceIn: 5, priceOut: 20, intelligence: 4.8, speed: 95, latency: 0.5, ctxAdv: 400000, ctxEff: 320000, cutoff: 'Mar 2026', released: 'Apr 2026', delta: 0, tags: ['reasoning', 'tools', 'vision', 'audio'] },
  { slug: 'qwen-3-coder-32b', name: 'Qwen 3 Coder 32B', provider: 'Alibaba', providerColor: '#f5e642', priceIn: 0.18, priceOut: 0.54, intelligence: 4.2, speed: 210, latency: 0.3, ctxAdv: 256000, ctxEff: 220000, cutoff: 'Jan 2026', released: 'Feb 2026', delta: -8, tags: ['open-weights', 'tools', 'caching'], openWeights: true },
  { slug: 'deepseek-v4', name: 'DeepSeek v4', provider: 'DeepSeek', providerColor: '#5200ff', priceIn: 0.14, priceOut: 0.28, intelligence: 4.4, speed: 165, latency: 0.4, ctxAdv: 128000, ctxEff: 110000, cutoff: 'Dec 2025', released: 'Jan 2026', delta: -22, tags: ['reasoning', 'open-weights', 'caching'], openWeights: true },
  { slug: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', providerColor: '#ff6b35', priceIn: 1.2, priceOut: 6, intelligence: 4.5, speed: 168, latency: 0.4, ctxAdv: 200000, ctxEff: 175000, cutoff: 'Apr 2026', released: 'Apr 2026', delta: -15, tags: ['tools', 'vision', 'caching'] },
  { slug: 'kimi-k3', name: 'Kimi K3', provider: 'Moonshot', providerColor: '#ff3cac', priceIn: 0.6, priceOut: 2.4, intelligence: 4.3, speed: 188, latency: 0.4, ctxAdv: 1000000, ctxEff: 720000, cutoff: 'Jan 2026', released: 'Feb 2026', delta: -5, tags: ['tools', 'caching'] },
  { slug: 'llama-4-405b', name: 'Llama 4 405B', provider: 'Meta', providerColor: '#1e6efa', priceIn: 0.9, priceOut: 0.9, intelligence: 4.4, speed: 92, latency: 0.7, ctxAdv: 128000, ctxEff: 96000, cutoff: 'Nov 2025', released: 'Dec 2025', delta: -18, tags: ['open-weights', 'tools', 'vision'], openWeights: true },
];

window.RESOURCES = [
  // Components
  { slug: '21st-pricing-toggle', type: 'component', name: 'Pricing card with monthly/yearly toggle', tagline: 'Animated price card with savings ribbon and feature checklist', author: '21st.dev', version: '1.4.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['React','Tailwind','TypeScript'], score: 4.8, installs7d: 4321, total: 18432, updated: '3d ago', forks: 142, rank: 1, variant: 'mint', desc: 'Drop-in pricing card. Monthly/annual toggle animates a savings ribbon. shadcn/ui compatible. Tailwind + Framer Motion.' },
  { slug: 'shadcn-cmd-palette', type: 'component', name: 'Cmd-K command palette', tagline: 'Keyboard-first palette with grouped results', author: 'shadcn', version: '2.1.0', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline'], stack: ['React','Tailwind'], score: 4.9, installs7d: 8210, total: 92041, updated: '1d ago', forks: 412, rank: 1 },
  { slug: 'magic-glow-button', type: 'component', name: 'Magic Glow Button', tagline: 'Animated gradient ring on hover', author: 'magicui', version: '0.9.2', license: 'MIT', clients: ['cursor','windsurf'], stack: ['React','Tailwind'], score: 4.5, installs7d: 1842, total: 8210, updated: '1w ago', forks: 56, variant: 'pink' },
  { slug: 'aceternity-hero-text', type: 'component', name: 'Hero with text gradient sweep', tagline: 'Massive type with shimmering gradient', author: 'aceternity', version: '1.2.1', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['React','Tailwind'], score: 4.6, installs7d: 2918, total: 14820, updated: '2d ago', forks: 89 },
  { slug: 'animated-dropdown', type: 'component', name: 'Animated dropdown menu', tagline: 'Springy nested menu with keyboard nav', author: 'tremor', version: '3.0.0', license: 'MIT', clients: ['cursor','claude-code'], stack: ['React','Tailwind'], score: 4.4, installs7d: 1240, total: 6921, updated: '5d ago', forks: 34 },
  { slug: 'data-table-pro', type: 'component', name: 'Data table with sorting + selection', tagline: 'Linear-style table with virtualization', author: 'tremor', version: '4.2.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['React','TypeScript'], score: 4.7, installs7d: 3010, total: 21043, updated: '4d ago', forks: 91 },

  // MCPs
  { slug: 'auth0-mcp', type: 'mcp', name: 'Auth0 MCP', tagline: '12 tools for managing Auth0 tenants', author: 'Auth0', version: '0.4.2', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline','claude-desktop'], stack: ['Auth0'], score: 4.6, installs7d: 891, total: 4012, updated: '6d ago', forks: 18, variant: 'uv' },
  { slug: 'supabase-mcp', type: 'mcp', name: 'Supabase MCP', tagline: 'Query, migrate, and manage Supabase from your IDE', author: 'Supabase', version: '1.2.0', license: 'Apache-2.0', clients: ['cursor','claude-code','windsurf','cline'], stack: ['Supabase','Postgres'], score: 4.8, installs7d: 4210, total: 28019, updated: '2d ago', forks: 240, rank: 1 },
  { slug: 'playwright-mcp', type: 'mcp', name: 'Playwright MCP', tagline: 'Browser automation with screenshot tools', author: 'Microsoft', version: '0.8.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: [], score: 4.7, installs7d: 6120, total: 41203, updated: '1d ago', forks: 312, rank: 1 },
  { slug: 'github-mcp', type: 'mcp', name: 'GitHub MCP', tagline: '24 tools across issues, PRs, repos', author: 'GitHub', version: '2.0.1', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline','claude-desktop','continue'], stack: [], score: 4.9, installs7d: 12041, total: 142031, updated: '3d ago', forks: 891, rank: 1 },
  { slug: 'stripe-mcp', type: 'mcp', name: 'Stripe MCP', tagline: 'Read-only access to your Stripe account', author: 'Stripe', version: '1.0.0', license: 'MIT', clients: ['cursor','claude-code','claude-desktop'], stack: ['Stripe'], score: 4.5, installs7d: 1010, total: 5410, updated: '2w ago', forks: 32, variant: 'mint' },
  { slug: 'filesystem-mcp', type: 'mcp', name: 'Filesystem MCP', tagline: 'Sandboxed file ops for any directory', author: 'Anthropic', version: '0.6.1', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline','claude-desktop','continue','zed'], stack: [], score: 4.6, installs7d: 8910, total: 92103, updated: '1w ago', forks: 421 },

  // Skills
  { slug: 'skill-pdf-reader', type: 'skill', name: 'PDF Reader', tagline: 'Extract structured text + tables from PDFs', author: 'Anthropic', version: '1.1.0', license: 'MIT', clients: ['claude-code','claude-desktop'], stack: [], score: 4.7, installs7d: 2103, total: 14021, updated: '4d ago', forks: 41, variant: 'yellow' },
  { slug: 'skill-design-system-builder', type: 'skill', name: 'Design System Builder', tagline: 'Spin up token files + Storybook from a brand brief', author: 'lovable', version: '0.3.0', license: 'MIT', clients: ['claude-code'], stack: [], score: 4.5, installs7d: 612, total: 2042, updated: '1w ago', forks: 11 },

  // Subagents
  { slug: 'subagent-test-writer', type: 'subagent', name: 'Test Writer', tagline: 'Generates unit + e2e tests from source code', author: 'agentkit', version: '0.5.0', license: 'MIT', clients: ['claude-code'], stack: ['Vitest','Playwright'], score: 4.6, installs7d: 821, total: 3401, updated: '5d ago', forks: 24, variant: 'orange' },
  { slug: 'subagent-pr-reviewer', type: 'subagent', name: 'PR Reviewer', tagline: 'Reviews PRs against your team conventions', author: 'agentkit', version: '0.4.1', license: 'MIT', clients: ['claude-code','cursor'], stack: [], score: 4.4, installs7d: 312, total: 1840, updated: '2w ago', forks: 9 },

  // Rules
  { slug: 'rule-ts-strict', type: 'rule', name: 'Strict TypeScript', tagline: 'Bans any, enforces exhaustive types', author: 't3.gg', version: '2.0.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['TypeScript'], score: 4.8, installs7d: 4012, total: 28210, updated: '3d ago', forks: 102 },
  { slug: 'rule-tailwind-conventions', type: 'rule', name: 'Tailwind class order', tagline: 'Sorts classes by Tailwind convention', author: 'tailwindlabs', version: '1.4.0', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline'], stack: ['Tailwind'], score: 4.6, installs7d: 2810, total: 18420, updated: '1w ago', forks: 67 },

  // Prompts
  { slug: 'prompt-pr-summary', type: 'prompt', name: 'PR Summary', tagline: 'Generate concise PR descriptions', author: 'octocat', version: '1.0.0', license: 'MIT', clients: ['cursor','claude-code'], stack: [], score: 4.3, installs7d: 1240, total: 8210, updated: '6d ago', forks: 42 },

  // Plugins
  { slug: 'plugin-shadcn', type: 'plugin', name: 'shadcn/ui Plugin Bundle', tagline: '40+ components + theming + a11y rules', author: 'shadcn', version: '5.1.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['React','Tailwind'], score: 4.9, installs7d: 14021, total: 218042, updated: '2d ago', forks: 1240, variant: 'mint', rank: 1 },

  // Hooks
  { slug: 'hook-pre-commit-tests', type: 'hook', name: 'Pre-commit test runner', tagline: 'Runs vitest on changed files before commit', author: 'agentkit', version: '0.2.0', license: 'MIT', clients: ['claude-code','cursor'], stack: ['Vitest'], score: 4.5, installs7d: 421, total: 1820, updated: '2w ago', forks: 8 },

  // Commands
  { slug: 'cmd-deploy', type: 'command', name: '/deploy', tagline: 'Deploy to Vercel with checks', author: 'verceldevs', version: '1.0.0', license: 'MIT', clients: ['claude-code'], stack: ['Vercel'], score: 4.7, installs7d: 2103, total: 14210, updated: '3d ago', forks: 31 },

  // Starters
  { slug: 'starter-saas-kit', type: 'starter', name: 'SaaS Starter — Next + Supabase + Stripe', tagline: 'Auth, billing, dashboard, marketing', author: 'shipfast', version: '4.2.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['Next.js','Supabase','Stripe','Tailwind'], score: 4.7, installs7d: 1820, total: 14201, updated: '5d ago', forks: 240, variant: 'orange' },
  { slug: 'starter-t3-app', type: 'starter', name: 'T3 App', tagline: 'Next.js, TypeScript, tRPC, Tailwind, Drizzle', author: 'create-t3-app', version: '7.40.0', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline'], stack: ['Next.js','TypeScript','tRPC','Drizzle','Tailwind'], score: 4.9, installs7d: 8210, total: 142031, updated: '1d ago', forks: 1820, rank: 1 },

  // Tools (IDEs)
  { slug: 'cursor', type: 'tool', name: 'Cursor', tagline: 'AI-first VS Code fork. Tab completion, agents, chat.', author: 'Anysphere', version: '0.45.0', license: 'Proprietary', clients: [], stack: [], score: 4.7, installs7d: 0, total: 1240000, updated: '2d ago', forks: 0, variant: 'dark' },
  { slug: 'claude-code', type: 'tool', name: 'Claude Code', tagline: 'Terminal-native coding agent', author: 'Anthropic', version: '1.4.0', license: 'Proprietary', clients: [], stack: [], score: 4.8, installs7d: 0, total: 412000, updated: '3d ago', forks: 0 },

  // Sandboxes
  { slug: 'e2b-sandbox', type: 'sandbox', name: 'E2B Code Interpreter', tagline: 'Cloud sandboxes for AI agents', author: 'E2B', version: '1.2.0', license: 'Apache-2.0', clients: ['claude-code','cursor'], stack: [], score: 4.6, installs7d: 412, total: 8210, updated: '1w ago', forks: 21 },

  // Observability
  { slug: 'langfuse', type: 'observability', name: 'Langfuse', tagline: 'LLM observability + evals', author: 'Langfuse', version: '3.0.0', license: 'MIT', clients: [], stack: [], score: 4.7, installs7d: 1820, total: 28010, updated: '4d ago', forks: 240 },

  // Backend
  { slug: 'better-auth', type: 'backend', name: 'better-auth', tagline: 'Modern auth for TypeScript apps', author: 'better-auth', version: '1.0.0', license: 'MIT', clients: [], stack: ['TypeScript'], score: 4.8, installs7d: 4210, total: 41203, updated: '2d ago', forks: 312 },

  // Showcase
  { slug: 'showcase-linkrr', type: 'showcase', name: 'linkrr.app — vibe-coded link shortener', tagline: 'Built solo by @benhope in 4 days with Cursor + Claude', author: 'benhope', version: '', license: '', clients: [], stack: ['Next.js','Supabase'], score: 4.9, installs7d: 0, total: 0, updated: '1d ago', forks: 0, variant: 'pink' },

  // Marketplaces
  { slug: 'mkt-cursor-directory', type: 'marketplace', name: 'Cursor Directory', tagline: '600+ rules + MCPs curated for Cursor', author: 'cursordirectory', version: '', license: '', clients: ['cursor'], stack: [], score: 4.7, installs7d: 8210, total: 92041, updated: '2d ago', forks: 0, variant: 'uv' },
  { slug: 'mkt-smithery', type: 'marketplace', name: 'Smithery', tagline: 'MCP server registry + one-click install', author: 'smithery', version: '', license: '', clients: ['cursor','claude-code','windsurf'], stack: [], score: 4.6, installs7d: 5420, total: 41203, updated: '4d ago', forks: 0 },

  // Assets
  { slug: 'asset-vibe-icons', type: 'asset', name: 'Vibe Icons (480 SVGs)', tagline: 'Hand-drawn icon set for indie SaaS', author: 'vibeicons', version: '2.0.0', license: 'MIT', clients: [], stack: [], score: 4.8, installs7d: 1240, total: 8210, updated: '6d ago', forks: 41, variant: 'yellow' },
  { slug: 'asset-blender-3d', type: 'asset', name: '3D Blender Scenes — Devices', tagline: '24 device mockups in .blend + USDZ', author: 'mockd', version: '1.1.0', license: 'CC-BY', clients: [], stack: [], score: 4.5, installs7d: 412, total: 2840, updated: '2w ago', forks: 8 },

  // Docs
  { slug: 'docs-react-llms', type: 'docs', name: 'React llms.txt', tagline: 'LLM-optimized React 19 docs', author: 'react-team', version: '19.1.0', license: 'MIT', clients: ['cursor','claude-code','windsurf','cline'], stack: ['React'], score: 4.7, installs7d: 3210, total: 28104, updated: '1w ago', forks: 41, variant: 'uv' },
  { slug: 'docs-tailwind-llms', type: 'docs', name: 'Tailwind llms.txt', tagline: 'Compact Tailwind v4 reference for agents', author: 'tailwindlabs', version: '4.0.0', license: 'MIT', clients: ['cursor','claude-code','windsurf'], stack: ['Tailwind'], score: 4.8, installs7d: 4210, total: 31402, updated: '2d ago', forks: 89 },

  // Specs
  { slug: 'spec-payment-flow', type: 'spec', name: 'Payment flow spec', tagline: 'Stripe checkout + webhook handling', author: 'shipfast', version: '1.0.0', license: 'CC-BY', clients: ['cursor','claude-code'], stack: ['Stripe','Next.js'], score: 4.6, installs7d: 412, total: 2104, updated: '1w ago', forks: 12 },
  { slug: 'spec-saas-onboarding', type: 'spec', name: 'SaaS onboarding spec', tagline: '7-step onboarding incl. invites + billing', author: 'shipfast', version: '1.2.0', license: 'CC-BY', clients: ['cursor','claude-code'], stack: ['Next.js'], score: 4.4, installs7d: 210, total: 1402, updated: '2w ago', forks: 4 },

  // Stacks
  { slug: 'stack-t3-classic', type: 'stack', name: 'T3 Classic', tagline: 'Next.js + tRPC + Drizzle + NextAuth + Tailwind', author: 'create-t3-app', version: '', license: '', clients: ['cursor','claude-code'], stack: ['Next.js','TypeScript','Tailwind'], score: 4.8, installs7d: 5210, total: 41203, updated: '3d ago', forks: 412, variant: 'mint' },
  { slug: 'stack-claude-cursor-supa', type: 'stack', name: 'Cursor + Claude + Supabase', tagline: 'The default vibe-coding stack', author: 'benhope', version: '', license: '', clients: ['cursor','claude-code'], stack: ['Next.js','Supabase','Tailwind'], score: 4.9, installs7d: 9210, total: 82041, updated: '1d ago', forks: 821 },

  // Evals
  { slug: 'eval-swe-bench', type: 'eval', name: 'SWE-bench Verified', tagline: '500 GitHub issues — agent end-to-end fix rate', author: 'swe-bench', version: '2.0.0', license: 'MIT', clients: [], stack: [], score: 4.7, installs7d: 0, total: 0, updated: '1w ago', forks: 0 },
  { slug: 'eval-aider-leaderboard', type: 'eval', name: 'Aider Polyglot Eval', tagline: 'Multi-language code-edit benchmark', author: 'aider', version: '', license: 'Apache-2.0', clients: [], stack: [], score: 4.6, installs7d: 0, total: 0, updated: '4d ago', forks: 0, variant: 'pink' },

  // Scripts
  { slug: 'script-rename-files', type: 'script', name: 'Bulk rename agent', tagline: 'Renames files via natural-language pattern', author: 'octocat', version: '0.3.0', license: 'MIT', clients: ['claude-code','cursor'], stack: ['Node'], score: 4.5, installs7d: 312, total: 1840, updated: '5d ago', forks: 14 },
  { slug: 'script-db-seed', type: 'script', name: 'AI DB seeder', tagline: 'Generates realistic seed data from schema', author: 'agentkit', version: '0.6.0', license: 'MIT', clients: ['claude-code'], stack: ['Postgres','Drizzle'], score: 4.6, installs7d: 421, total: 2840, updated: '1w ago', forks: 21 },

  // Sandboxes (additional)
  { slug: 'modal-sandbox', type: 'sandbox', name: 'Modal', tagline: 'Serverless GPU + sandbox for AI agents', author: 'Modal', version: '1.0.0', license: 'Proprietary', clients: ['claude-code'], stack: ['Python'], score: 4.7, installs7d: 1240, total: 8104, updated: '3d ago', forks: 0, variant: 'uv' },

  // Observability (additional)
  { slug: 'helicone', type: 'observability', name: 'Helicone', tagline: 'LLM proxy with logging + cost tracking', author: 'Helicone', version: '2.1.0', license: 'Apache-2.0', clients: [], stack: [], score: 4.6, installs7d: 1820, total: 14021, updated: '5d ago', forks: 89 },

  // Backend (additional)
  { slug: 'convex-be', type: 'backend', name: 'Convex', tagline: 'TypeScript backend-as-a-service for AI apps', author: 'Convex', version: '1.18.0', license: 'Apache-2.0', clients: [], stack: ['TypeScript','Convex'], score: 4.8, installs7d: 4210, total: 28104, updated: '2d ago', forks: 412, variant: 'mint' },

  // Showcase (additional)
  { slug: 'showcase-promptui', type: 'showcase', name: 'promptui.dev — vibe-coded prompt IDE', tagline: 'Solo project, 12 days from idea to launch', author: 'mira', version: '', license: '', clients: [], stack: ['Next.js','Convex'], score: 4.7, installs7d: 0, total: 0, updated: '4d ago', forks: 0, variant: 'pink' },

  // Tools (additional)
  { slug: 'windsurf', type: 'tool', name: 'Windsurf', tagline: 'Codeium\'s AI-native IDE with Cascade agents', author: 'Codeium', version: '1.4.0', license: 'Proprietary', clients: [], stack: [], score: 4.5, installs7d: 4210, total: 28104, updated: '3d ago', forks: 0 },
  { slug: 'zed', type: 'tool', name: 'Zed', tagline: 'Multiplayer Rust-built editor with AI', author: 'Zed', version: '0.180.0', license: 'GPL-3.0', clients: [], stack: ['Rust'], score: 4.6, installs7d: 2810, total: 18420, updated: '1w ago', forks: 0, variant: 'uv' },

  // Hooks (additional)
  { slug: 'hook-format-on-save', type: 'hook', name: 'Format-on-save hook', tagline: 'Runs prettier + biome on every save', author: 'agentkit', version: '0.4.0', license: 'MIT', clients: ['claude-code','cursor'], stack: [], score: 4.4, installs7d: 612, total: 4210, updated: '6d ago', forks: 12 },

  // Commands (additional)
  { slug: 'cmd-test', type: 'command', name: '/test', tagline: 'Generates + runs tests for current diff', author: 'agentkit', version: '1.1.0', license: 'MIT', clients: ['claude-code'], stack: [], score: 4.6, installs7d: 821, total: 5410, updated: '4d ago', forks: 24 },

  // Prompts (additional)
  { slug: 'prompt-code-review', type: 'prompt', name: 'Code review checklist', tagline: 'Reviews diffs against 12 quality dimensions', author: 'octocat', version: '1.2.0', license: 'MIT', clients: ['cursor','claude-code'], stack: [], score: 4.7, installs7d: 1820, total: 14021, updated: '3d ago', forks: 89, variant: 'pink' },

  // Workflow
  { slug: 'workflow-saas-launch', type: 'workflow', name: 'SaaS Launch in 7 Days', tagline: '12-step workflow: idea → live product', author: 'shipfast', version: '1.2.0', license: 'CC-BY', clients: [], stack: ['Next.js','Supabase','Stripe'], score: 4.7, installs7d: 612, total: 4210, updated: '1w ago', forks: 41, variant: 'yellow' },
];

window.DEALS = [
  { slug: 'anthropic-startup', name: 'Anthropic Startup Program', value: '$5,000', valueRaw: 5000, summary: 'Claude API credits for early-stage startups', tier: 'public', provider: 'Anthropic', providerColor: '#ff6b35', expires: 'Dec 31, 2026', category: 'AI APIs', claimed: 8421 },
  { slug: 'cursor-pro-50', name: 'Cursor Pro 50% off', value: '6 months', valueRaw: 240, summary: 'Half off six months of Cursor Pro', tier: 'member', provider: 'Cursor', providerColor: '#fafafa', expires: 'Aug 31, 2026', category: 'Dev tools', claimed: 4012 },
  { slug: 'do-hatch', name: 'DigitalOcean Hatch', value: '$10,000', valueRaw: 10000, summary: 'Cloud credits for early-stage founders', tier: 'public', provider: 'DigitalOcean', providerColor: '#1e6efa', expires: 'Dec 31, 2026', category: 'Cloud', claimed: 2104 },
  { slug: 'msft-startups', name: 'Microsoft for Startups', value: '$150,000', valueRaw: 150000, summary: 'Azure credits + GitHub + Visual Studio', tier: 'pro', provider: 'Microsoft', providerColor: '#5200ff', expires: 'Mar 31, 2027', category: 'Cloud', claimed: 1240 },
  { slug: 'aws-activate', name: 'AWS Activate', value: '$5,000', valueRaw: 5000, summary: 'AWS credits for accelerator-backed startups', tier: 'pro', provider: 'AWS', providerColor: '#ff6b35', expires: 'Dec 31, 2026', category: 'Cloud', claimed: 4012 },
  { slug: 'vercel-pro', name: 'Vercel Pro', value: '$10,000', valueRaw: 10000, summary: '12 months of Vercel Pro on us', tier: 'pro', provider: 'Vercel', providerColor: '#fafafa', expires: 'Jun 30, 2026', category: 'Cloud', claimed: 821 },
  { slug: 'gcp-startup', name: 'Google for Startups', value: '$200,000', valueRaw: 200000, summary: 'GCP credits over 2 years', tier: 'pro', provider: 'Google', providerColor: '#1e6efa', expires: 'Dec 31, 2026', category: 'Cloud', claimed: 2102 },
  { slug: 'linear-startup', name: 'Linear Startup', value: '50% off', valueRaw: 600, summary: '6 months off Linear Standard plan', tier: 'public', provider: 'Linear', providerColor: '#5200ff', expires: 'Sep 30, 2026', category: 'Productivity', claimed: 4210 },
  { slug: 'stripe-atlas', name: 'Stripe Atlas', value: '$5,000', valueRaw: 5000, summary: 'Free incorporation + $5K AWS credits', tier: 'member', provider: 'Stripe', providerColor: '#5200ff', expires: 'Dec 31, 2026', category: 'Productivity', claimed: 1820 },
];

window.NEWS = [
  { slug: 'opus-47-price-cut', kind: 'breaking', headline: 'Claude Opus 4.7 input price dropped 30% today', source: 'auto', time: '2h ago', summary: 'Anthropic cut input pricing from $5/M to $3/M tokens. Output unchanged at $15/M.', topics: ['Models'], variant: 'mint', auto: true },
  { slug: 'cursor-05x-agents', kind: 'releases', headline: 'Cursor 0.5x ships background agents that work async', source: 'Cursor blog', time: '14h ago', summary: 'New agent mode runs in the background while you keep coding. Reads from a local queue.', topics: ['Cursor','Models'], variant: 'dark' },
  { slug: '21st-agents-sdk', kind: 'ecosystem', headline: '21st.dev ships an agents SDK for component generation', source: '21st.dev', time: '1d ago', summary: 'Programmable component generation from a natural-language brief. Available for Pro tier.', topics: ['Components'], variant: 'uv' },
  { slug: 'gemini-31-released', kind: 'releases', headline: 'Gemini 3.1 Pro lands with 2M-token context', source: 'Google blog', time: '2d ago', summary: 'New flagship from Google. Cheaper than 2.5 Pro, faster on the same evals.', topics: ['Models','Google'], variant: 'dark' },
  { slug: 'mcp-spec-1-1', kind: 'ecosystem', headline: 'Model Context Protocol spec 1.1 introduces resource subscriptions', source: 'modelcontextprotocol.io', time: '3d ago', summary: 'Long-running tools can now stream updates back to clients. Backwards compatible.', topics: ['MCPs'], variant: 'dark' },
  { slug: 'qwen-3-coder', kind: 'releases', headline: 'Qwen 3 Coder 32B beats GPT-4.1 on SWE-Bench Verified', source: 'Alibaba', time: '4d ago', summary: 'New open-weights coding model from Alibaba. Apache-2.0 licensed.', topics: ['Models','Open weights'], variant: 'yellow' },
  { slug: 'tutorial-ollama-cursor', kind: 'tutorials', headline: 'How to run Qwen 3 Coder locally and pipe it into Cursor', source: 'Vibe Coder Hub guides', time: '5d ago', summary: 'Five-step guide: Ollama install, model pull, Cursor custom endpoint, latency tuning.', topics: ['Open weights','Cursor'], variant: 'dark' },
  { slug: 'oped-vibe-coding', kind: 'op-eds', headline: 'Vibe coding isn\'t just a meme — it\'s the new abstraction layer', source: 'Vibe Coder Hub editorial', time: '1w ago', summary: 'A short essay on why one-shot agents change the unit of work in software.', topics: [], variant: 'pink' },
];

window.GUIDES = [
  { slug: 'install-qwen-mac', resourceSlug: 'qwen-3-coder-32b', title: 'Install Qwen 3 Coder 32B on macOS via Ollama', kind: 'GET STARTED', difficulty: 'Beginner', duration: '5 min', os: ['macOS'], steps: 4 },
  { slug: 'connect-supabase-cursor', resourceSlug: 'supabase-mcp', title: 'Wire Supabase MCP to Cursor in 90 seconds', kind: 'GET STARTED', difficulty: 'Beginner', duration: '2 min', os: ['macOS','Linux','Windows'], steps: 3 },
  { slug: 'agent-loops-claude-code', resourceSlug: 'claude-code', title: 'Agent loops in Claude Code: when to break out', kind: 'ADVANCED', difficulty: 'Intermediate', duration: '12 min', os: ['macOS','Linux'], steps: 7 },
  { slug: 'gpt5-jsonmode-fix', resourceSlug: 'gpt-5', title: 'When GPT-5 JSON mode fails: a 30-second fix', kind: 'TROUBLESHOOT', difficulty: 'Beginner', duration: '3 min', os: [], steps: 2 },
  { slug: 'migrate-3-to-3-1', resourceSlug: 'gemini-3-1-pro', title: 'Migrate from Gemini 2.5 to 3.1 — what changed', kind: 'MIGRATE', difficulty: 'Intermediate', duration: '8 min', os: [], steps: 5 },
  { slug: 'scaling-mcp-servers', resourceSlug: 'github-mcp', title: 'Scaling MCP servers behind a gateway', kind: 'ADVANCED', difficulty: 'Advanced', duration: '20 min', os: [], steps: 9 },
];

window.STATS = {
  resources: 12407,
  ides: 47,
  models: 357,
  dealsValue: '4.2M',
};

// Default user stack
window.DEFAULT_STACK = {
  clients: ['cursor', 'claude-code'],
  tags: ['Next.js', 'React', 'TypeScript', 'Supabase'],
  hardware: { platform: 'Apple Silicon', chip: 'M3 Max', ram: '36 GB' },
};
