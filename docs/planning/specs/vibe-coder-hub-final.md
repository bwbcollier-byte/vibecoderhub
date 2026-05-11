# Vibe Coder Hub — Build & Design Prompt

> **For Claude Code (build) and Claude Design (design).**
> Read this entire document before you start. It contains the product brief, full feature scope, page architecture, complete database schema, design direction, and acceptance criteria. Don't skip sections — the schema choices are deliberate and the page list is the build order.

---

## 1. Product Brief

We're building a horizontal directory and discovery hub for the vibe-coding ecosystem — a single place where AI-assisted developers and "vibe coders" find every primitive they need: UI components, MCP servers, agent skills, subagents, plugins, hooks, slash commands, rules, prompt recipes, scripts, starter kits, IDEs/agents, models, and showcase projects.

**Positioning:** Smithery + 21st.dev + cursor.directory + buildwithclaude.com, unified — but with deeper categorisation, real install/usage telemetry instead of GitHub stars, and stack/client compatibility filters that nobody else has nailed.

**Primary users:** Indie hackers, founders building MVPs, AI-first developers, design engineers, and non-technical builders shipping with Cursor / Claude Code / Windsurf / Lovable / Bolt / v0.

**The wedge:** Every competitor is either broad-but-shallow (long lists, no metadata) or deep-but-narrow (one resource type only). We do both. One unified resource model with type-specific extension tables, universal search, and "works with my stack + my IDE" filtering.

---

## 2. Full Resource Type Catalogue (24 types)

Every type is a row in the same `resources` table with a `type_slug`. Each has a dedicated index page, dedicated detail page, and type-specific metadata table.

### Original 4
1. **Components** — UI components à la 21st.dev (React, Vue, Svelte, Solid). Tailwind/shadcn-friendly with copy-paste install commands.
2. **MCP Servers** — Model Context Protocol servers. Stdio/SSE/HTTP transports, OAuth-aware.
3. **Skills** — Agent skills in the open SKILL.md format (Claude Code, Codex, ChatGPT compatible).
4. **Scripts** — Standalone scripts and CLIs that vibe coders run alongside their agents.

### First 10 additions (from prior turn)
5. **Rules** — `.cursorrules`, `.windsurfrules`, `CLAUDE.md`, `AGENTS.md`, project rules. Filterable by stack and IDE.
6. **Subagents** — Claude Code subagents with their own YAML frontmatter, tool permissions, and model assignments.
7. **Plugins** — Bundles of skills + MCPs + commands + hooks + agents distributed as one installable unit.
8. **Marketplaces** — GitHub repos that act as plugin registries (you subscribe and pull plugins from them). Index the marketplaces themselves, not just their contents.
9. **Hooks** — Lifecycle hooks: `pre_tool_use`, `post_tool_use`, `session_start`, `stop`, etc.
10. **Slash Commands** — Reusable `.claude/commands/*.md` files. Lightest-weight extension type.
11. **Starter Kits & Boilerplates** — SaaS templates pre-configured with rules files for vibe coding (Next.js + Supabase, T3, Convex, Expo, etc).
12. **Prompt Recipes** — Proven multi-turn workflows. Not rules, not skills — composable prompts ("Generate a landing page from a Figma URL", "Refactor a React class to hooks").
13. **Tools (IDEs / Agents / App Builders)** — Cursor, Windsurf, Zed, Cline, Roo, Aider, Kiro, Continue, Codex, Claude Code, Gemini CLI, Bolt, Lovable, v0, Replit Agent, Base44, Tempo, Emergent, Rosebud.
14. **Models / Inference Providers** — Claude, GPT, Gemini, Grok, Kimi, Qwen, plus OpenRouter/Together/Groq/Fireworks. Pricing per million tokens, context window, tool-use, structured outputs, vision.

### 10 more (new this round)

15. **Sandboxes & Compute** — E2B, Modal, Daytona, Vercel Sandbox, Cloudflare Workers, Fly.io. *Critical because production-grade Claude Code agents need persistent runtimes — not API calls.* Filter by: cold-start latency, max session length, GPU support, filesystem persistence, OS image.

16. **Observability & Eval Tools** — Braintrust, Langfuse, Helicone, PostHog LLM Analytics, Arize, LangSmith. *Vibe-coded apps fail silently — error handling and business logic were the top-2 failure modes in the DAPLab study of Cline/Claude/Cursor/Replit/V0.* This category is how builders catch those failures.

17. **Auth / DB / Backend Kits** — Supabase, Convex, Clerk, BetterAuth, Neon, Firebase, Turso, PlanetScale, Stripe, Polar, Resend, Loops. *Every vibe-coded app needs roughly the same backend stack; surface the canonical choices.* Filter by: pricing model, free tier limits, AI-IDE rule files included.

18. **Design Assets** — Icon sets (Lucide, Phosphor, Tabler), illustration packs, fonts, shaders, Lottie files, gradients, 3D assets. *21st.dev sort-of covers this but it's component-shaped — there's a gap for raw assets.* Filter by: license, format, style.

19. **Showcase / Built-With Gallery** — Live projects shipped with vibe-coding tools, with their tool stack tagged. Drives discovery, SEO, and aspiration. Each entry links back to the components/starters/tools used.

20. **Docs-for-LLMs (llms.txt registry)** — `llms.txt` files, Context7 entries, structured docs feeds. *The llms.txt standard now has 60k+ projects and is what fixes the "the AI is using outdated API docs" problem.* This is genuinely undeserved — no major directory indexes it.

21. **Specs & Templates (Spec-Driven Development)** — PRDs, feature specs, AGENTS.md templates, architecture specs designed to be fed to coding agents. *Karpathy's vibe-coding loop and addyosmani's "Agent Experience" guidance both put the spec at the centre.* Curate proven spec formats with examples.

22. **Workflows / Playbooks** — End-to-end recipes that chain multiple primitives: "Solo SaaS MVP in a weekend with Cursor + supastarter + Supabase + Stripe." Each workflow lists the exact resources used in order, with the prompts and gotchas. *This is the "Pinterest board for shipping" — and the highest-engagement content type on every developer-tool blog right now.*

23. **Stacks** — Curated bundles users can save and share: "Ben's Next.js + Claude Code + Convex stack." Like collections, but first-class and shareable as a public URL. Doubles as the cold-start onboarding ("which stack do you build with?" → seed their feed).

24. **Eval / Benchmark Sets** — Test suites and benchmarks for evaluating coding agents: SWE-Bench, AGENTbench, custom golden tasks. *As the agent ecosystem matures, "which agent ships the bug fix correctly" becomes the deciding question — and there's no central place to compare.* Index the benchmarks themselves and link to leaderboards.

> **Optional v2 types** (don't build now, leave the schema open): Voice/audio kits, mobile-only resources (Expo/React Native specific), web3/onchain primitives, browser extensions for AI workflows.

---

## 3. Information Architecture (pages to build)

### Top-level routes

```
/                                  Home — featured + trending across all types, stack-based feed
/search                            Universal search (cross-type)
/components                        Index page for type
/components/[slug]                 Detail page
/mcps
/mcps/[slug]
/skills
/skills/[slug]
/subagents
/subagents/[slug]
/scripts
/scripts/[slug]
/rules
/rules/[slug]
/prompts
/prompts/[slug]
/plugins
/plugins/[slug]
/marketplaces
/marketplaces/[slug]
/hooks
/hooks/[slug]
/commands
/commands/[slug]
/starters
/starters/[slug]
/tools
/tools/[slug]
/models
/models/[slug]
/sandboxes
/sandboxes/[slug]
/observability
/observability/[slug]
/backend                           (auth/db/backend kits)
/backend/[slug]
/assets                            (design assets)
/assets/[slug]
/showcase
/showcase/[slug]
/docs-for-llms
/docs-for-llms/[slug]
/specs
/specs/[slug]
/workflows
/workflows/[slug]
/stacks
/stacks/[slug]
/evals
/evals/[slug]

/u/[username]                      User profile (their submissions, collections, stacks)
/u/[username]/[collection-slug]    A collection
/submit                            Submission flow (auto-import from GitHub URL)
/dashboard                         Logged-in user's hub
/categories/[type]/[category]      Category landing pages (SEO)
```

### Detail page anatomy (consistent across all 24 types)

```
┌─────────────────────────────────────────────────────────────┐
│  Hero                                                        │
│   • Name, tagline, type badge, verification badge            │
│   • One-click install command (copy button)                  │
│   • Compatible-clients row (Cursor, Claude Code, etc — icons)│
│   • Stack chips (Next.js, React, Python, etc)                │
│   • Live preview / demo / playground (when applicable)       │
├─────────────────────────────────────────────────────────────┤
│  Stats strip: ↑ score · ⬇ installs (7d) · ★ avg rating       │
│              · last updated · author                         │
├─────────────────────────────────────────────────────────────┤
│  Tabs:                                                       │
│  [Overview] [Install] [Source] [Reviews] [Related]           │
├─────────────────────────────────────────────────────────────┤
│  Type-specific block:                                        │
│   • Component → live preview + raw code + dependencies       │
│   • MCP → tool list + config schema + transport              │
│   • Skill → SKILL.md rendered + triggers + allowed tools     │
│   • Model → pricing table + context window + capability matrix│
│   • Workflow → ordered list of steps (each linked to resource)│
│   ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  Reviews + comments                                          │
├─────────────────────────────────────────────────────────────┤
│  Related resources (same type + cross-type via tags)         │
└─────────────────────────────────────────────────────────────┘
```

### Index page anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  Header: type name, count, brief description                 │
├─────────────────────────────────────────────────────────────┤
│  Filters (sticky sidebar on desktop, drawer on mobile):     │
│   • Category (type-specific tree)                            │
│   • Compatible client (multi-select)                         │
│   • Stack (multi-select)                                     │
│   • Tags                                                     │
│   • Pricing model                                            │
│   • Verified / official only                                 │
│   • Sort: trending / newest / top / most installed          │
├─────────────────────────────────────────────────────────────┤
│  Featured strip (3 cards)                                    │
├─────────────────────────────────────────────────────────────┤
│  Grid of cards (infinite scroll)                             │
│   Each card: thumbnail, name, tagline, score,                │
│              compatible-client icons, install count          │
└─────────────────────────────────────────────────────────────┘
```

### Home page

- Hero: search bar + "build with [Cursor / Claude Code / Windsurf]" stack picker (cookies their preference, filters everything site-wide)
- "Trending this week" carousel (cross-type)
- One curated row per type ("Top components", "Top MCPs", etc) — collapsed by default for type rows beyond the user's interests
- Featured stacks (curated bundles)
- Showcase strip (visual eye-candy)
- "New this week"

### Cross-cutting features

- **Universal search** with type filters; full-text search across `name + description + readme`.
- **Stack/client filter persists site-wide** via cookie (huge UX win — competitors don't do this).
- **Bookmarks → Collections → Stacks** progression (private save → curated list → shareable bundle).
- **One-click install** with telemetry: clicking "Install" copies the command AND records an install event (for trending/ranking).
- **Submit flow** auto-imports from a GitHub URL (parse README, package.json, infer type, prefill the form).
- **API + RSS feeds** per type and per category (developer-friendly, drives backlinks).
- **Auth:** GitHub OAuth (primary), Google OAuth (secondary). No passwords.

---

## 4. Database Schema

> Postgres syntax. Maps cleanly to Supabase. Single `resources` spine + per-type extension tables.

```sql
-- =========================================================
-- USERS & ACCOUNTS
-- =========================================================
create table users (
  id              uuid primary key default gen_random_uuid(),
  username        text unique not null,
  email           text unique not null,
  avatar_url      text,
  bio             text,
  github_handle   text,
  twitter_handle  text,
  website_url     text,
  preferred_clients text[],         -- ['cursor','claude-code'] — drives feed
  preferred_stacks  text[],         -- ['nextjs','supabase']
  is_verified     boolean default false,
  is_admin        boolean default false,
  created_at      timestamptz default now()
);

-- =========================================================
-- TAXONOMY
-- =========================================================
create table resource_types (
  slug   text primary key,
  label  text not null,
  icon   text,
  description text,
  sort_order int default 0
);

-- Seed 24 types (see §2). Examples:
-- ('component','Components','grid','UI components for AI-friendly stacks',10)
-- ('mcp','MCP Servers','plug','Model Context Protocol servers',20)
-- ('skill','Skills','sparkles','Agent skills in SKILL.md format',30)
-- ('subagent','Subagents','users','Specialised Claude Code subagents',40)
-- ('script','Scripts','terminal','Standalone scripts & CLIs',50)
-- ('rule','Rules','file-text','Rules files for AI IDEs',60)
-- ('prompt','Prompt Recipes','message-square','Proven multi-turn prompts',70)
-- ('plugin','Plugins','package','Bundled extensions',80)
-- ('marketplace','Marketplaces','store','Plugin registries',90)
-- ('hook','Hooks','zap','Lifecycle hooks',100)
-- ('command','Slash Commands','slash','Reusable slash commands',110)
-- ('starter','Starter Kits','rocket','Boilerplates for vibe coding',120)
-- ('tool','Tools','wrench','IDEs, agents, app builders',130)
-- ('model','Models','brain','LLMs & inference providers',140)
-- ('sandbox','Sandboxes','box','Compute & sandboxes for agents',150)
-- ('observability','Observability','activity','Eval & monitoring',160)
-- ('backend','Backend Kits','database','Auth/DB/payments/email',170)
-- ('asset','Design Assets','image','Icons, illustrations, fonts',180)
-- ('showcase','Showcase','star','Built-with gallery',190)
-- ('llmsdoc','Docs for LLMs','book','llms.txt registry',200)
-- ('spec','Specs','clipboard','Spec & template files',210)
-- ('workflow','Workflows','git-branch','End-to-end playbooks',220)
-- ('stack','Stacks','layers','Curated tool bundles',230)
-- ('eval','Evals','target','Benchmarks & test sets',240)

create table categories (
  id           bigserial primary key,
  type_slug    text references resource_types(slug),
  slug         text not null,
  label        text not null,
  description  text,
  parent_id    bigint references categories(id),
  sort_order   int default 0,
  unique (type_slug, slug)
);

create table tags (
  id    bigserial primary key,
  slug  text unique not null,
  label text not null
);

create table clients (
  slug    text primary key,         -- 'cursor','claude-code','windsurf','cline','roo','aider','codex','zed','continue','copilot','jetbrains','gemini-cli','kiro','warp','lovable','bolt','v0','replit','base44'
  label   text not null,
  website text,
  icon    text,
  sort_order int default 0
);

create table stacks_taxonomy (       -- renamed to avoid collision with 'stacks' resource type
  slug    text primary key,         -- 'nextjs','react','vue','svelte','solid','python','rust','go','expo','flutter','tailwind','supabase','convex','firebase','postgres'
  label   text not null,
  icon    text,
  category text                      -- 'framework','language','database','styling','platform'
);

-- =========================================================
-- CORE: every resource is a row here
-- =========================================================
create table resources (
  id              uuid primary key default gen_random_uuid(),
  type_slug       text not null references resource_types(slug),
  slug            text not null,
  name            text not null,
  tagline         text,
  description     text,             -- markdown
  author_id       uuid references users(id),
  source_url      text,             -- github, gist
  homepage_url    text,
  install_cmd     text,
  install_method  text,             -- 'npx','npm','pip','git','curl','manual','plugin-install'
  license         text,
  is_official     boolean default false,
  is_featured     boolean default false,
  is_verified     boolean default false,
  status          text default 'published',  -- 'draft','published','archived','flagged'
  preview_url     text,
  thumbnail_url   text,
  readme          text,
  version         text,
  pricing_model   text,             -- 'free','freemium','paid','byok','open-source'
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (type_slug, slug)
);

create index on resources (type_slug, status);
create index on resources (created_at desc);
create index on resources using gin (
  to_tsvector('english',
    coalesce(name,'') || ' ' ||
    coalesce(tagline,'') || ' ' ||
    coalesce(description,'')
  )
);

-- =========================================================
-- JOIN TABLES
-- =========================================================
create table resource_categories (
  resource_id  uuid references resources(id) on delete cascade,
  category_id  bigint references categories(id) on delete cascade,
  primary key (resource_id, category_id)
);

create table resource_tags (
  resource_id uuid references resources(id) on delete cascade,
  tag_id      bigint references tags(id) on delete cascade,
  primary key (resource_id, tag_id)
);

create table resource_clients (
  resource_id uuid references resources(id) on delete cascade,
  client_slug text references clients(slug) on delete cascade,
  primary key (resource_id, client_slug)
);

create table resource_stacks (
  resource_id uuid references resources(id) on delete cascade,
  stack_slug  text references stacks_taxonomy(slug) on delete cascade,
  primary key (resource_id, stack_slug)
);

-- A resource can reference other resources (e.g. plugin bundles skills,
-- workflow chains components/starters/MCPs, showcase entries link to tools used)
create table resource_dependencies (
  parent_id    uuid references resources(id) on delete cascade,
  child_id     uuid references resources(id) on delete cascade,
  relation     text not null,         -- 'bundles','requires','recommends','used-in','built-with','step'
  position     int,                   -- ordered relations (workflow steps)
  note         text,
  primary key (parent_id, child_id, relation)
);

-- =========================================================
-- TYPE-SPECIFIC EXTENSION TABLES
-- =========================================================
create table component_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  framework       text,              -- 'react','vue','svelte','solid'
  styling         text,              -- 'tailwind','css','styled-components'
  registry        text,              -- 'shadcn','21st','custom'
  code            text,              -- raw component source
  dependencies    jsonb,
  responsive      boolean,
  dark_mode       boolean,
  accessibility   text                -- short description of a11y status
);

create table mcp_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  transport       text,                -- 'stdio','sse','http'
  config_schema   jsonb,
  tool_count      int,
  oauth_supported boolean default false,
  hosted_url      text,                -- for remote MCPs
  source_lang     text                  -- 'typescript','python','go'
);

create table skill_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  skill_md        text,
  triggers        text[],
  allowed_tools   text[],
  invocation_mode text                -- 'auto','manual','both'
);

create table subagent_meta (
  resource_id      uuid primary key references resources(id) on delete cascade,
  agent_md         text,
  model            text,                -- 'sonnet','opus','haiku','inherit'
  tools            text[],
  use_proactively  boolean default false,
  context_isolated boolean default true
);

create table script_meta (
  resource_id   uuid primary key references resources(id) on delete cascade,
  language      text,                  -- 'bash','python','typescript','rust'
  entrypoint    text,
  args_schema   jsonb
);

create table rule_meta (
  resource_id   uuid primary key references resources(id) on delete cascade,
  rule_format   text,                  -- 'cursorrules','mdc','windsurfrules','claude-md','agents-md'
  rule_text     text,
  globs         text[],
  scope         text                   -- 'global','project','subdirectory'
);

create table prompt_meta (
  resource_id    uuid primary key references resources(id) on delete cascade,
  prompt_text    text,
  variables      jsonb,
  example_output text,
  steps_count    int                   -- multi-turn workflow length
);

create table plugin_meta (
  resource_id      uuid primary key references resources(id) on delete cascade,
  marketplace_id   uuid references resources(id),  -- ref to a 'marketplace' resource
  bundled_skills   int default 0,
  bundled_mcps     int default 0,
  bundled_commands int default 0,
  bundled_agents   int default 0,
  bundled_hooks    int default 0
);

create table marketplace_meta (
  resource_id  uuid primary key references resources(id) on delete cascade,
  add_command  text,                   -- '/plugin marketplace add user/repo'
  plugin_count int default 0,
  curator      text
);

create table hook_meta (
  resource_id  uuid primary key references resources(id) on delete cascade,
  event        text,                   -- 'pre_tool_use','post_tool_use','session_start','stop','user_prompt_submit'
  script       text,
  matcher      jsonb                   -- which tools/events it matches
);

create table command_meta (
  resource_id  uuid primary key references resources(id) on delete cascade,
  command_md   text,
  args_schema  jsonb,
  invokes_subagent boolean default false
);

create table starter_meta (
  resource_id      uuid primary key references resources(id) on delete cascade,
  framework        text,
  database         text,
  auth             text,
  payments         text,
  email            text,
  deploy_target    text,
  has_rules_file   boolean default false,
  has_agents_md    boolean default false,
  demo_url         text
);

create table tool_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  tool_category   text,                -- 'ide','app-builder','cli-agent','extension','terminal'
  platforms       text[],
  pricing_url     text,
  free_tier       boolean,
  byok_supported  boolean,
  models_supported text[],
  open_source     boolean default false
);

create table model_meta (
  resource_id          uuid primary key references resources(id) on delete cascade,
  provider             text,
  model_id             text,             -- 'claude-opus-4-7','gpt-5','gemini-2.5-pro'
  context_window       int,
  output_window        int,
  input_cost_per_mtok  numeric(10,4),
  output_cost_per_mtok numeric(10,4),
  cached_input_cost    numeric(10,4),
  supports_tools       boolean,
  supports_vision      boolean,
  supports_streaming   boolean,
  supports_structured_output boolean,
  knowledge_cutoff     date
);

create table sandbox_meta (
  resource_id        uuid primary key references resources(id) on delete cascade,
  cold_start_ms      int,
  max_session_min    int,
  gpu_supported      boolean,
  filesystem_persistent boolean,
  os_image           text,
  pricing_per_hour   numeric(10,4),
  free_tier_minutes  int
);

create table observability_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  features        text[],              -- 'tracing','evals','prompt-mgmt','dashboards','a-b-testing'
  self_hostable   boolean,
  free_tier       boolean,
  integrations    text[]               -- which model providers/frameworks
);

create table backend_meta (
  resource_id    uuid primary key references resources(id) on delete cascade,
  backend_kind   text,                  -- 'auth','db','payments','email','storage','realtime','search','full-stack'
  free_tier      boolean,
  pricing_url    text,
  has_rules_file boolean default false,
  primary_lang   text
);

create table asset_meta (
  resource_id  uuid primary key references resources(id) on delete cascade,
  asset_kind   text,                    -- 'icon-set','illustration','font','shader','lottie','3d','gradient'
  asset_count  int,
  format       text[],                  -- ['svg','png','json']
  license      text,                    -- 'mit','cc0','cc-by','commercial'
  preview_grid_url text
);

create table showcase_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  built_with_ids  uuid[],                -- references to other resources
  live_url        text,
  screenshot_url  text,
  screenshot_dark_url text,
  category        text                   -- 'saas','ecommerce','tool','game','content'
);

create table llmsdoc_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  llms_txt_url    text,
  llms_full_url   text,                  -- 'llms-full.txt' variant
  context7_id     text,
  package_name    text,
  doc_kind        text                   -- 'library','framework','api','platform'
);

create table spec_meta (
  resource_id  uuid primary key references resources(id) on delete cascade,
  spec_kind    text,                     -- 'prd','feature-spec','agents-md','architecture','data-model'
  spec_text    text,
  example_project text
);

create table workflow_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  duration_label  text,                   -- 'weekend','one-day','one-hour'
  difficulty      text,                   -- 'beginner','intermediate','advanced'
  outcome         text,                   -- 'saas-mvp','landing-page','automation','game'
  step_count      int                     -- denormalised count of resource_dependencies
);

create table user_stack_meta (              -- for the 'stack' resource type (curated bundles)
  resource_id     uuid primary key references resources(id) on delete cascade,
  primary_client  text references clients(slug),
  use_case        text                     -- 'saas','content','automation','game','data'
);

create table eval_meta (
  resource_id     uuid primary key references resources(id) on delete cascade,
  benchmark_kind  text,                   -- 'swe-bench','agentbench','custom','golden-tasks'
  task_count      int,
  leaderboard_url text,
  reproducible    boolean default true
);

-- =========================================================
-- SOCIAL & ENGAGEMENT
-- =========================================================
create table votes (
  user_id      uuid references users(id) on delete cascade,
  resource_id  uuid references resources(id) on delete cascade,
  value        smallint check (value in (-1,1)),
  created_at   timestamptz default now(),
  primary key (user_id, resource_id)
);

create table reviews (
  id           uuid primary key default gen_random_uuid(),
  resource_id  uuid references resources(id) on delete cascade,
  user_id      uuid references users(id) on delete cascade,
  rating       smallint check (rating between 1 and 5),
  body         text,
  created_at   timestamptz default now()
);

create table comments (
  id           uuid primary key default gen_random_uuid(),
  resource_id  uuid references resources(id) on delete cascade,
  user_id      uuid references users(id) on delete cascade,
  parent_id    uuid references comments(id),
  body         text not null,
  created_at   timestamptz default now()
);

-- Personal saved lists (private by default)
create table collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  slug        text not null,
  name        text not null,
  description text,
  is_public   boolean default true,
  created_at  timestamptz default now(),
  unique (user_id, slug)
);

create table collection_items (
  collection_id uuid references collections(id) on delete cascade,
  resource_id   uuid references resources(id) on delete cascade,
  position      int,
  note          text,
  primary key (collection_id, resource_id)
);

-- Bookmarks are lightweight saves (the "want to try later" pile)
create table bookmarks (
  user_id      uuid references users(id) on delete cascade,
  resource_id  uuid references resources(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (user_id, resource_id)
);

-- =========================================================
-- TELEMETRY (powers trending + analytics)
-- =========================================================
create table install_events (
  id           bigserial primary key,
  resource_id  uuid references resources(id),
  user_id      uuid references users(id),
  client_slug  text references clients(slug),
  source       text,                   -- 'cli','web','api'
  created_at   timestamptz default now()
);

create table view_events (
  id           bigserial primary key,
  resource_id  uuid references resources(id),
  user_id      uuid references users(id),
  referrer     text,
  created_at   timestamptz default now()
);

create index on install_events (resource_id, created_at desc);
create index on view_events (resource_id, created_at desc);

-- =========================================================
-- DERIVED METRICS
-- =========================================================
create materialized view resource_stats as
select
  r.id                                    as resource_id,
  count(distinct ie.id)                   as install_count,
  count(distinct ie.id) filter (
    where ie.created_at > now() - interval '7 days'
  )                                       as install_count_7d,
  count(distinct ve.id)                   as view_count,
  count(distinct ve.id) filter (
    where ve.created_at > now() - interval '7 days'
  )                                       as view_count_7d,
  coalesce(sum(v.value), 0)               as score,
  count(distinct rv.id)                   as review_count,
  coalesce(avg(rv.rating)::numeric(3,2),0) as avg_rating
from resources r
left join install_events ie on ie.resource_id = r.id
left join view_events ve   on ve.resource_id = r.id
left join votes v          on v.resource_id  = r.id
left join reviews rv       on rv.resource_id = r.id
group by r.id;

create unique index on resource_stats (resource_id);

-- Refresh nightly + on-demand:
-- refresh materialized view concurrently resource_stats;
```

### Schema rationale (don't skip)

- **One `resources` table** drives universal search, the home page, trending, and the global API. Splitting across 24 tables would make every cross-type query painful.
- **Per-type extension tables** keep the spine narrow while letting each type carry its own fields (a model needs `context_window`; a component doesn't).
- **`resource_clients` and `resource_stacks`** power the killer "works with my stack + my IDE" filter that's the product's differentiator. Index aggressively — these joins fire on every list view.
- **`resource_dependencies`** does multi-duty: workflows ordered by `position`, plugins bundling skills, showcases listing what they're built with, starters recommending MCPs. One table, several semantic relations via the `relation` column.
- **`install_events` and `view_events`** give real signal for trending (Smithery's competitive edge). GitHub stars lag and game easily; install clicks are honest.
- **`bookmarks` vs `collections` vs `stacks`** is intentional progressive disclosure: bookmark (one click, private) → add to collection (curated, share-able) → publish as a stack (first-class resource). The "stack" type is *both* a resource row and a user-generated piece of content. This ladder is the retention loop.
- **Tags vs categories vs stacks_taxonomy:** categories are type-specific trees (curated by us); tags are flat user-applied; `stacks_taxonomy` is a shared cross-type vocabulary for tech.

---

## 5. Design Direction (for Claude Design)

### Mood
Modern developer-tool aesthetic. Think Linear × Vercel × Raycast. Confident, dense, fast. Dark-first but with a polished light mode. Avoid the over-glassy shadcn-default look — we're shipping at 21st.dev tier, not template tier.

### Visual rules

- **Type system:** Inter or Geist for UI. JetBrains Mono or Geist Mono for code.
- **Density:** information-dense lists, generous whitespace around hero blocks. No "marketing fluff" sections on detail pages.
- **Cards:** consistent across types, but the *content shape* varies (component cards show a live mini-preview; model cards lead with pricing; workflow cards show step count + duration label).
- **Compatible-clients row:** always rendered as small monochrome icons, hover to reveal the client name. This is the most-glanced-at element on every detail page — make it readable at 16px.
- **Code blocks:** syntax-highlighted with a copy button that animates "copied" feedback. For install commands, the copy button is the hero CTA, not an afterthought.
- **Stack/client filter:** persistent pill bar near the top, not buried in a sidebar. State persists site-wide.
- **Empty states:** every empty state suggests an action (submit a resource, browse adjacent type, see the showcase).
- **Loading states:** skeleton screens, not spinners. Use the actual card layout shape.
- **Search:** Cmd-K palette is mandatory. Results grouped by type, with type badges. Recent searches saved.

### Page-specific notes

- **Home:** the stack picker is the centrepiece. Once a user picks "Cursor + Next.js + Supabase", the entire feed reshapes. This is the experience to nail.
- **Detail page hero:** install command is *visually dominant* — bigger than the title. That's what people came for.
- **Showcase:** masonry grid, screenshots are the content. Hover reveals the built-with stack as overlapping chips.
- **Workflows:** rendered as a vertical stepper with each step linking to the resource it uses. Time-to-complete badge top-right.
- **Models:** comparison-table view is a first-class option (not just card grid). Sortable columns: cost, context, capabilities.

### Accessibility
- All interactive elements keyboard-navigable.
- Focus rings visible (don't suppress them in CSS resets).
- Colour contrast AA minimum, AAA for body text.
- Code blocks have a "view as plain text" affordance.

### Brand stub (placeholder for designer)
Logo: clean monogram or wordmark, lowercase. Pick one accent colour that works on both dark and light. Avoid gradients in the logo itself.

---

## 6. Tech Stack (recommended for Claude Code)

- **Framework:** Next.js 15 (App Router) + TypeScript
- **DB / Auth:** Supabase (Postgres + Auth + Storage). The schema above is Postgres-native.
- **ORM:** Drizzle (clean migrations, types align with the schema)
- **Styling:** Tailwind CSS v4 + shadcn/ui as the base — but customise away from shadcn defaults so we don't look like every other AI tool directory.
- **Search:** Postgres full-text initially, upgrade to Meilisearch or Typesense once data volume justifies it. The GIN index in the schema is the v1 search.
- **Caching:** Vercel edge cache for static index pages, ISR with 60s revalidation.
- **Analytics:** PostHog (eat our own dog-food — observability is one of our categories).
- **Background jobs:** Inngest for the GitHub auto-import, materialised-view refresh, and trending calculation.
- **Deploy:** Vercel.
- **Auth providers:** GitHub OAuth (primary, since users come from dev tools), Google OAuth (secondary).

---

## 7. Build Order (for Claude Code)

Build in this order — each phase produces a shippable slice.

**Phase 1 — Foundation (week 1)**
1. Next.js + Supabase + Drizzle scaffolded.
2. Schema migrated. Seed `resource_types`, `clients`, `stacks_taxonomy` from §2.
3. Auth (GitHub OAuth) working end-to-end.
4. Generic `resources` CRUD with type-aware forms (driven by `type_slug`).

**Phase 2 — Core directory (week 2–3)**
5. Index page + detail page templates that work for any type (driven by metadata).
6. Filter sidebar with stack/client/category/tag/sort.
7. Universal search (Postgres full-text).
8. Cmd-K palette.
9. Submit flow with GitHub URL auto-import.

**Phase 3 — First 8 types (week 3–4)**
10. Components, MCPs, Skills, Subagents, Rules, Tools, Models, Starters. Seed each with 20+ real entries pulled from the directories I researched (21st.dev, Smithery, cursor.directory, buildwithclaude, vibecoding.app).

**Phase 4 — Social + telemetry (week 4–5)**
11. Votes, reviews, comments, bookmarks.
12. `install_events` and `view_events` wired up.
13. Trending algorithm (weighted combo of installs, votes, recency).
14. Materialised view refresh job.

**Phase 5 — Remaining 16 types (week 5–6)**
15. Scripts, Plugins, Marketplaces, Hooks, Commands, Prompts, Sandboxes, Observability, Backend, Assets, Showcase, Docs-for-LLMs, Specs, Workflows, Stacks, Evals.

**Phase 6 — Power features (week 6+)**
16. Collections + public sharing.
17. Stacks (the user-generated curated bundles, both as a feature and a resource type).
18. Public API + RSS feeds.
19. Category landing pages for SEO.

---

## 8. Acceptance Criteria

- A user lands on `/`, picks "Cursor + Next.js + Supabase", and the entire site reshapes around that selection within one click.
- A user types `cmd-k`, types "auth", and sees: top backend kits (Clerk, BetterAuth), top starters (those with auth), top MCPs (Auth0 MCP), top skills, all grouped by type.
- A user clicks "Install" on an MCP server detail page → command copies to clipboard, install event records, trending score updates within 60s.
- A submitter pastes a GitHub URL → form pre-fills name, description, install command, source language, license. They edit and publish.
- A user adds 5 resources to a collection → can publish as a public stack at `/u/their-username/stack-slug`.
- The site is fast: index pages render in under 200ms TTFB on cache, under 500ms cold.
- Zero broken type-specific detail pages (every type has its dedicated rendering block).

---

## 9. What this product is *not*

- Not another tutorial site. We index resources; we don't write 2,000-word "what is vibe coding" posts.
- Not a code generator. We point at the tools that generate; we don't compete with them.
- Not a marketplace with payments (yet). Resources are free or link out to paid options.
- Not opinionated about which IDE/agent to use. The whole point of the stack picker is meeting users where they are.

---

## 10. Notes for Claude Code

- The schema in §4 is the source of truth. If you find yourself adding a column, ask first whether it belongs in `resources` (cross-type) or in a `*_meta` extension table (type-specific). Default to extension table.
- When seeding, use real data from the major directories, not placeholders. The product needs to feel populated from day one.
- The stack/client filter is the most important UX decision in the build. Make sure it's a global cookie-backed state, not page-local.
- Telemetry is not optional — `install_events` and `view_events` aren't analytics nice-to-haves, they're the input to ranking. Wire them in Phase 2.
- Don't ship without the Cmd-K palette. It's table stakes for a developer-tool directory in 2026.

## 11. Notes for Claude Design

- The product brief is specific about positioning: Linear × Vercel × Raycast. Don't drift toward Product Hunt / Awwwards aesthetics.
- The detail page hero is the highest-value real estate. The install command should be the most prominent element after the title — bigger than the description, bigger than the buttons.
- 24 resource types is a lot. Design one system that flexes, don't design 24 page variations. The variation is *what's inside the type-specific block on the detail page*, not the page layout.
- The compatible-clients row is the second-highest-value element. Treat it like a first-class component with a dedicated design pattern (icon row, hover names, clickable filter).
- Workflow detail pages are the most distinct — they need a real stepper component, not a generic list.
- Make a comparison-table view for models. People will compare 3 LLMs side-by-side and you want them to do it on our site, not paste tabs into a spreadsheet.
-e 

---


# Vibe Coder Hub — Addendum: 10 Depth Features

> **Append this to the master prompt.** It adds 10 features that make the existing 24 resource types meaningfully better — not new categories, but capabilities that turn a flat directory into a sticky product. Each section includes the schema delta needed.

---

## Why depth, not breadth, this round

The first 24 types give us coverage. The next moat is *what users can do once they find a resource*. Every competitor stops at "browse a list." We're going to make installation, evaluation, and re-use first-class. Each feature below is something the major directories (Smithery, 21st.dev, cursor.directory, buildwithclaude) either don't do or do badly.

---

## Feature 25 — One-Click Install via Deeplinks & Managed Endpoints

**The problem:** Today, "install this MCP" means copy a JSON blob, find the right config file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS — most users don't know that path), paste, restart. Windsurf supports one-click MCP installation through deeplinks like `windsurf://windsurf-mcp-registry?serverName=github-mcp-server`. Cursor has the deepest MCP integration of any IDE — `cursor://anysphere.cursor-deeplink/mcp/install?name=github&config=<base64>` opens Cursor and installs in one click.

**The build:** Every MCP detail page generates a tailored install button per detected client. We host the deeplink generation, base64-encode the config, and the user clicks once. For non-deeplink-supporting clients (Claude Desktop), we auto-open the right config file path with the JSON pre-filled in a copy-ready block. Same idea for Claude Code skills: a single CLI command that detects their setup and installs. Same for shadcn-style components: the install command pre-resolves the registry URL.

**Schema delta:**
```sql
create table install_targets (
  resource_id   uuid references resources(id) on delete cascade,
  client_slug   text references clients(slug),
  install_kind  text not null,           -- 'deeplink','json-snippet','cli','npx','manual'
  payload       jsonb not null,          -- deeplink URL, JSON config, CLI command, etc
  config_path   text,                    -- e.g. '~/Library/Application Support/Claude/claude_desktop_config.json'
  requires_restart boolean default false,
  notes         text,
  primary key (resource_id, client_slug, install_kind)
);
```

This table lets us render *the right* install path per (resource, client) pair. One MCP might support deeplink for Cursor, JSON for Claude Desktop, CLI for Claude Code, and a `mcp-remote` proxy command for Windsurf — all from one detail page.

---

## Feature 26 — Live Component Playgrounds (Sandpack-Powered)

**The problem:** 21st.dev shows code + a static screenshot. To actually evaluate a component you have to copy it into your project. Sandpack is a component toolkit for creating live-running code editing experiences powered by CodeSandbox, with built-in support for Next.js, Remix, Vite, Astro, and React.

**The build:** Component detail pages embed a live Sandpack playground with the component running, editable, with the right Tailwind/shadcn dependencies pre-installed. Users tweak props in real time. "Open in StackBlitz" and "Open in CodeSandbox" buttons on every component. For non-component types where it makes sense (skills with example invocations, prompts with variable substitution), embed appropriate playgrounds too.

**Schema delta:**
```sql
create table playgrounds (
  id            uuid primary key default gen_random_uuid(),
  resource_id   uuid references resources(id) on delete cascade,
  provider      text not null,            -- 'sandpack','stackblitz','codesandbox','custom'
  template      text,                     -- 'react','nextjs','vite','vue','svelte'
  files         jsonb not null,           -- {"App.tsx": "...", "package.json": "..."}
  dependencies  jsonb,
  entry_file    text default 'App.tsx',
  preview_only  boolean default false,
  created_at    timestamptz default now()
);
```

---

## Feature 27 — Compatibility Matrix & Verified-Working Badges

**The problem:** Every directory says "works with Cursor / Claude Code / Windsurf" but nobody verifies it. Users install, hit errors, lose trust in the directory.

**The build:** A nightly job that runs each MCP / skill / plugin in a sandboxed container against each major client and records pass/fail. Detail pages show a colored matrix: ✅ tested working, ⚠️ tested with caveats, ❓ not yet tested, ❌ confirmed broken. Users can also report status manually with "this worked for me / didn't work" votes. Verified badges weight ranking.

**Schema delta:**
```sql
create table compatibility_checks (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  client_slug     text references clients(slug),
  client_version  text,
  status          text not null,          -- 'pass','warn','fail','untested'
  test_method     text,                   -- 'automated','user-report','curator'
  evidence_url    text,                   -- log file, screenshot, etc
  notes           text,
  checked_at      timestamptz default now()
);
create index on compatibility_checks (resource_id, client_slug, checked_at desc);

create table compatibility_reports (        -- user-submitted "worked for me"
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  user_id         uuid references users(id),
  client_slug     text references clients(slug),
  worked          boolean not null,
  notes           text,
  created_at      timestamptz default now()
);
```

---

## Feature 28 — Version History & Changelogs

**The problem:** When an MCP or skill is updated and breaks, users have no recourse. GitHub releases are scattered. Cursor rules in particular evolve frequently and there's no rollback.

**The build:** Snapshot every published version of every resource. Detail page has a version dropdown — pick any past version to install. Show a changelog auto-generated from diffs (or from the user's release notes if provided). For rules and skills (text-heavy), show the diff inline. For models, this is huge: "GPT-5 today" vs "GPT-5 last week" — pricing and capability changes get tracked.

**Schema delta:**
```sql
create table resource_versions (
  id            uuid primary key default gen_random_uuid(),
  resource_id   uuid references resources(id) on delete cascade,
  version       text not null,             -- semver or date-based
  released_at   timestamptz default now(),
  changelog     text,
  is_current    boolean default false,
  install_cmd   text,                       -- in case install differs by version
  source_ref    text,                       -- git tag/commit/sha
  metadata_snapshot jsonb,                  -- snapshot of the type-specific meta at this version
  unique (resource_id, version)
);
create index on resource_versions (resource_id, released_at desc);
```

---

## Feature 29 — Resource Forks & Remixes

**The problem:** Skill / rule / prompt files are inherently remixable — but right now there's no lineage. Someone tweaks a `.cursorrules` for Next.js into one for SvelteKit and the connection is lost. 21st.dev's tagline is literally "Discover, share & craft perfect UI components — with AI support for effortless generation and remixing" but there's no remix graph.

**The build:** Every text-based resource (skills, rules, prompts, commands, hooks, specs, agents) has a "Fork" button. Forking creates a new resource with `forked_from_id` set, opens an inline editor, lets the user save under their account. Detail pages show the fork tree. Popular forks float to the top. This turns the directory into a creative tool, not just a catalogue.

**Schema delta:**
```sql
alter table resources add column forked_from_id uuid references resources(id);
alter table resources add column fork_count int default 0;
create index on resources (forked_from_id) where forked_from_id is not null;
```

The fork count is a simple counter trigger. Forking just inserts a new `resources` row with `forked_from_id` and copies the relevant `*_meta` row.

---

## Feature 30 — In-Browser MCP Tool Inspector

**The problem:** You can't tell what an MCP actually *does* until you install it. Tool list, schemas, sample inputs are all opaque on every existing directory. Glama is for the serious infrastructure crowd with a built-in inspector and security scanning — that's the bar.

**The build:** For HTTP/SSE-transport MCPs (the modern, hostable kind), connect from our backend, enumerate tools, render each tool's input schema as an interactive form, let users invoke it with sample inputs and see the response — without installing anything. For stdio MCPs, we run them in a hosted sandbox (E2B, Modal) on demand. This is genuinely defensible: it's hard to build, and once we have it, we're the only place where users can *try* MCPs before committing.

**Schema delta:**
```sql
create table mcp_tools_introspected (
  id            uuid primary key default gen_random_uuid(),
  resource_id   uuid references resources(id) on delete cascade,
  tool_name     text not null,
  description   text,
  input_schema  jsonb,
  output_schema jsonb,
  is_destructive boolean default false,    -- writes/deletes/sends?
  requires_auth boolean default false,
  introspected_at timestamptz default now()
);
create index on mcp_tools_introspected (resource_id);

create table mcp_tool_invocations (        -- track "try this tool" events for usage analytics
  id            bigserial primary key,
  resource_id   uuid references resources(id),
  tool_name     text,
  user_id       uuid references users(id),
  succeeded     boolean,
  duration_ms   int,
  created_at    timestamptz default now()
);
```

---

## Feature 31 — AI-Powered Search & "Find Me Something That…"

**The problem:** Tag-based filtering hits a ceiling. Users describe what they want in natural language: "an MCP that lets Claude post to my company Slack but only with approval", "a skill that catches when I'm about to commit secrets". Postgres full-text won't find these.

**The build:** Embed every resource's `name + tagline + description + readme` with an embedding model. Vector search via `pgvector` (Supabase native). The search bar accepts natural language and returns semantically relevant results across all 24 types, ranked by a blend of similarity, install velocity, and verified status. Add a "What problem are you solving?" entry on the home page that generates a curated stack (collection of resources) on the fly using Claude.

**Schema delta:**
```sql
create extension if not exists vector;

alter table resources add column embedding vector(1536);
create index on resources using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Computed once at publish time and on description/readme update
-- Use Claude or text-embedding-3-large to generate

create table ai_curated_stacks (              -- generated on-demand "stack for X"
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id),
  prompt          text not null,
  generated_at    timestamptz default now(),
  resource_ids    uuid[],
  rationale       jsonb                       -- why each was picked
);
```

---

## Feature 32 — Telemetry-Backed Trust Signals (Real Data Beats Stars)

**The problem:** GitHub stars lag and game easily. Smithery shows detailed usage metrics — requests/minute, latency, error rates, and that's their advantage. We need to match and exceed.

**The build:** Aggregate per-resource health metrics from real usage. For MCPs, latency p50/p95, error rate, uptime — pulled from our gateway proxy (see Feature 33). For skills, "successful invocations" rate via opt-in telemetry from Claude Code. For components, "added to project then removed within 24 hours" as a churn signal. Detail pages display a health card. Power-users sort by health, not stars.

**Schema delta:**
```sql
create table resource_health (
  id              bigserial primary key,
  resource_id     uuid references resources(id) on delete cascade,
  bucket_at       timestamptz not null,         -- hourly bucket
  invocations     int default 0,
  successes       int default 0,
  failures        int default 0,
  p50_latency_ms  int,
  p95_latency_ms  int,
  uptime_pct      numeric(5,2),
  unique (resource_id, bucket_at)
);
create index on resource_health (resource_id, bucket_at desc);

create materialized view resource_health_summary as
select
  resource_id,
  sum(invocations)                    as invocations_30d,
  case when sum(invocations) = 0 then null
       else (sum(successes)::numeric / sum(invocations)) * 100 end as success_rate_30d,
  avg(p95_latency_ms)::int            as avg_p95_latency_ms_30d,
  avg(uptime_pct)::numeric(5,2)       as avg_uptime_30d
from resource_health
where bucket_at > now() - interval '30 days'
group by resource_id;
create unique index on resource_health_summary (resource_id);
```

---

## Feature 33 — Hosted Gateway / Proxy Layer (Run It Without Installing)

**The problem:** Local MCP servers run on your machine — you install them with npx or pip, configure environment variables, manage API keys in plaintext config files, and restart your client every time you change something. This works for experimentation. It doesn't work for production — because there's no DLP, no audit trail, and your API keys sit in a JSON file on your laptop. Same problem applies to running scripts, hooks, and skills. The next era is hosted execution.

**The build:** Optional hosted gateway. Users connect once with a single URL (`https://gateway.<our-domain>/<token>/<resource-slug>`). We proxy MCP calls, track usage, vault their secrets, and let them disable a misbehaving server with one click — without touching their config file. Free tier with rate limits. This is also how we get the telemetry that powers Feature 32. This is the durable business model — directory is the funnel, gateway is the SaaS.

**Schema delta:**
```sql
create table gateway_subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  resource_id     uuid references resources(id) on delete cascade,
  endpoint_token  text unique not null,         -- the unique URL token
  is_active       boolean default true,
  vault_secret_id uuid,                          -- encrypted secrets reference
  rate_limit_rpm  int default 60,
  created_at      timestamptz default now(),
  unique (user_id, resource_id)
);

create table gateway_secrets (                    -- encrypted, never returned in plaintext via API
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  name            text not null,                 -- e.g. 'GITHUB_TOKEN'
  encrypted_value bytea not null,
  created_at      timestamptz default now()
);

create table gateway_call_log (
  id              bigserial primary key,
  subscription_id uuid references gateway_subscriptions(id) on delete cascade,
  tool_name       text,
  status_code     int,
  duration_ms     int,
  bytes_in        int,
  bytes_out       int,
  error_message   text,
  created_at      timestamptz default now()
);
create index on gateway_call_log (subscription_id, created_at desc);
```

---

## Feature 34 — Auto-Update Bots, Submission Pipelines & Author Tools

**The problem:** Directories rot. Stuff goes stale, links break, the author updates on GitHub but the directory doesn't notice. Submitting a new resource is also high-friction across every existing platform.

**The build:** For every resource with a GitHub source URL, a nightly bot pulls the latest README, version, dependencies, checks for breaking changes, and either auto-updates (low-risk fields) or opens a "needs review" task for the author. Authors get a dashboard at `/u/me/submissions` showing their resources, install metrics, gateway revenue (if applicable), pending updates, broken-link alerts, and analytics. We also offer a GitHub Action they can drop into their repo that auto-publishes on tag.

**Schema delta:**
```sql
create table resource_imports (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id),
  source_kind     text,                          -- 'github','npm','pypi','cargo'
  source_repo     text,                          -- 'owner/repo'
  last_synced_at  timestamptz,
  last_commit_sha text,
  sync_status     text,                          -- 'ok','stale','broken','pending-review'
  diff_summary    jsonb                          -- what changed since last sync
);

create table submission_queue (
  id              uuid primary key default gen_random_uuid(),
  submitted_by    uuid references users(id),
  source_url      text not null,
  detected_type   text references resource_types(slug),
  parsed_data     jsonb,                         -- what we auto-extracted
  status          text default 'pending',        -- 'pending','approved','rejected','published'
  reviewed_by     uuid references users(id),
  review_notes    text,
  created_at      timestamptz default now(),
  reviewed_at     timestamptz
);

create table author_payouts (                     -- if/when we monetise
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id),
  period_start    date,
  period_end      date,
  amount_cents    int,
  status          text,                          -- 'pending','paid','failed'
  created_at      timestamptz default now()
);
```

---

## Updated home page

The depth features change the home page. New surfaces to add:

1. **"Try it now" hero on selected resources** — For top MCPs, the hero embeds the live tool inspector (Feature 30). User can fire a real call without leaving the page.
2. **"What are you trying to build?" prompt box** — Feature 31's natural-language entry, generates an AI-curated stack inline.
3. **"Health-checked & verified working today"** row — Real data, real freshness, beats every competitor.
4. **"Recently updated"** strip — Powered by `resource_versions`, makes the directory feel alive.

---

## Updated detail page anatomy

Replace the version in the master prompt with this:

```
┌─────────────────────────────────────────────────────────────┐
│  Hero                                                        │
│   • Name, tagline, type badge, verified badge                │
│   • Compatibility matrix (✅✅✅⚠️ across clients)            │
│   • One-click install button (auto-detects user's client)    │
│   • Live playground OR tool inspector inline                 │
├─────────────────────────────────────────────────────────────┤
│  Stats strip:                                                │
│   ↑ score · ⬇ installs (7d) · ★ avg rating · 🟢 99.2% uptime │
│   · ⏱ p95 240ms · ⚡ updated 3 days ago · 🍴 142 forks        │
├─────────────────────────────────────────────────────────────┤
│  Tabs: [Overview] [Try It] [Install] [Source] [Versions]    │
│        [Compatibility] [Reviews] [Forks] [Analytics]         │
├─────────────────────────────────────────────────────────────┤
│  Type-specific block (component preview, MCP tool inspector, │
│  skill-md viewer with fork button, model pricing table…)     │
├─────────────────────────────────────────────────────────────┤
│  Reviews + comments                                          │
├─────────────────────────────────────────────────────────────┤
│  Related resources + fork tree                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Updated build order (additions)

These slot into the existing 6-phase plan:

- **Phase 2 add:** install_targets table + per-client install button rendering (Feature 25). This is mandatory for the v1 launch — it's the headline UX win.
- **Phase 4 add:** version snapshots, fork mechanics, AI search via pgvector (Features 28, 29, 31).
- **Phase 5 add:** Sandpack playground for components, MCP tool introspection (Features 26, 30).
- **Phase 7 (new):** Compatibility checking infrastructure, hosted gateway MVP, telemetry pipelines (Features 27, 32, 33).
- **Phase 8 (new):** Auto-update bots, author dashboards, submission pipeline (Feature 34).

---

## Updated acceptance criteria (additions)

- A user lands on an MCP detail page, clicks "Install for Cursor", Cursor opens, user confirms — *zero JSON editing*.
- A user lands on a component detail page, immediately edits the props in an embedded Sandpack, sees the change, clicks "open in StackBlitz" to continue.
- A user types "I need a Claude Code skill that catches secrets before commit" into the home search → returns relevant skills ranked by similarity + install velocity.
- A user views an MCP detail page and sees: ✅ Cursor, ✅ Claude Code, ⚠️ Windsurf (with note), ❌ Claude Desktop. Each badge is clickable and shows when/how it was tested.
- A user forks a `.cursorrules` for Next.js, edits the framework references to SvelteKit, saves it under their account. The original shows the fork in its tree.
- An MCP author logs into their dashboard and sees: 1,247 installs this week, 99.4% uptime via gateway, 3 user reports of an auth issue, a pending GitHub update awaiting review.

---

## What this turns the product into

Without these depth features, we're a better-organised directory.

With them, we're:
- The **install layer** for the agent ecosystem (one-click, every client).
- The **trust layer** (verified compatibility, real telemetry, version history).
- The **gateway** (hosted execution, secret vault, observability).
- The **remix substrate** (forks, lineage, AI-curated stacks).

That's a SaaS, not a directory. Directory is the top of funnel. Gateway + author monetisation is the engine. The 24 categories give us ubiquity; the 10 depth features give us defensibility.
-e 

---


# Vibe Coder Hub — Addendum 3: Deals, News, Models & Price Tracker

> **Append to the master prompt.** Adds four new top-level pages, each a standalone product surface, plus the schema, jobs, and design notes to wire them in.

---

## Why this round matters

The first 24 types are the catalogue. The 10 depth features make each entry sticky. This third pass adds **destination pages** that pull people back daily even when they're not browsing for a specific resource. Each one is also a known competitor category we can absorb:

- **Deals page** competes with FounderPass ($3M in deals, 350+ tools, $99/year) and Fin's Startup Pack ($500K+ in credits)
- **News section** competes with TLDR AI, Ben's Bites, AI Tool Report
- **Model price tracker** competes with pricepertoken.com (300+ models), llmpricecheck.com, llmpricecompare.com, Helicone's calculator
- **Model database** competes with Artificial Analysis (357 models, intelligence index), Vellum's leaderboard, BenchLM (228 models, 186 benchmarks), llm-stats.com (298 canonical models)

Each of those is a successful standalone site. Building them inside our directory means a vibe coder lands on us for any of them and stays for the rest. The cross-product graph (a model's detail page links to the MCPs that work with it, the deals on it, the news mentioning it) is the moat.

---

## Feature 35 — Deals & Perks Page

**The build:** A dedicated `/deals` page surfacing free credits, discounts, lifetime deals, and member perks across the vibe-coding stack. Three tiers:

1. **Public deals** — Free for anyone (e.g. "Anthropic startup program: $5K Claude credits"). SEO bait.
2. **Member deals** — Free signup unlocks (e.g. "Cursor 50% off first 6 months for our members"). Conversion driver.
3. **Pro deals** — Paid tier ($99/year) unlocks the high-value stuff (e.g. "$10K DigitalOcean credits", "$150K Azure via Microsoft for Startups"). Revenue.

Each deal links back to the resource it's for — the AWS deal lives on the AWS-as-backend page, the Cursor deal on Cursor's tool page, the Anthropic deal on Claude's model page. **Two surfaces, one data source.**

Negotiate exclusive offers as we grow. Start by aggregating known programs (AWS Activate, Google for Startups Cloud Program with up to $200K in credits over 2 years, Microsoft for Startups Founders Hub with up to $150K Azure, Anthropic startup program, Stripe Atlas, Notion for Startups, MongoDB for Startups). Verify eligibility, write redemption guides, eat the manual work — that's exactly what FounderPass and Get AI Perks do.

**Schema:**

```sql
create table deals (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,  -- which tool/model/backend this deal is for
  title           text not null,                  -- "Up to $200K in Google Cloud credits"
  tagline         text,                           -- "For startups in the Cloud Program"
  body            text,                           -- markdown: details, redemption, eligibility
  deal_kind       text not null,                  -- 'credits','discount','lifetime','free-tier','exclusive'
  value_cents     int,                            -- monetary value in USD cents (for sorting/aggregation)
  value_label     text,                           -- "$200,000 credits" / "50% off" / "1 year free"
  redemption_url  text,
  redemption_kind text,                           -- 'application','code','signup-link','partner-form'
  promo_code      text,                           -- if applicable
  eligibility     text,                           -- "Pre-seed to Series A, less than 5 years old"
  expires_at      timestamptz,                    -- null = ongoing
  access_tier     text not null,                  -- 'public','member','pro'
  is_exclusive    boolean default false,          -- negotiated specifically for our community
  is_verified     boolean default false,
  status          text default 'active',          -- 'active','expired','paused'
  curator_notes   text,                           -- our internal notes (eligibility tips, gotchas)
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index on deals (status, expires_at);
create index on deals (resource_id);
create index on deals (access_tier, status);

-- Track who claimed what (for analytics, partner reporting, prevent abuse)
create table deal_claims (
  id              bigserial primary key,
  deal_id         uuid references deals(id) on delete cascade,
  user_id         uuid references users(id),
  claimed_at      timestamptz default now(),
  status          text default 'started',        -- 'started','approved','rejected','redeemed'
  partner_ref     text                            -- partner's reference ID if reported back
);

-- For pro-tier subscribers
create table user_subscriptions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references users(id) on delete cascade,
  tier              text not null,                -- 'free','member','pro'
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  status            text,                          -- 'active','past_due','canceled'
  created_at        timestamptz default now()
);

-- A resource on the directory can have many deals over time (different programs, expirations)
-- A deal always belongs to exactly one resource (the thing being discounted)
```

**Pages:**
- `/deals` — Main deals index. Filter by category (cloud, AI APIs, dev tools, productivity), value, access tier.
- `/deals/[slug]` — Detail page with full eligibility, redemption walkthrough, "claim" button (records `deal_claims`).
- `/deals/featured` — Curated weekly picks.
- `/u/me/claimed` — User's claimed deals dashboard.

**Cross-surfaces:** A "💰 Deal available" badge on any resource detail page that has an active public/member deal. Pro deals show a locked badge with a "Become a Pro member to unlock" CTA.

---

## Feature 36 — News & Changelog

**The build:** A dedicated `/news` page that aggregates four kinds of content into one chronological + filtered feed:

1. **Ecosystem news** — Curated weekly picks from official blogs (Anthropic, OpenAI, Cursor, Vercel, Supabase, etc). Editorial summaries, not blog reposts.
2. **Resource updates** — Auto-generated from the version history (Feature 28). "Cursor 0.50 ships background agents", "Claude Opus 4.7 released with new pricing".
3. **Price changes** — Auto-generated from the model price tracker (Feature 37). "GPT-5 input cost dropped 30% today".
4. **Community posts** — Curators publish op-eds, tutorials, comparison pieces.

Three formats: a homepage strip, a dedicated `/news` index, and a weekly email digest. The digest is the retention loop — it pulls people back even if they don't visit the site.

**Schema:**

```sql
create table news_items (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  summary         text,                            -- 1–2 sentence editorial summary
  body            text,                            -- markdown, optional (some items are just headlines + link)
  kind            text not null,                   -- 'ecosystem','release','price-change','tutorial','op-ed','community'
  source_kind     text,                            -- 'official-blog','our-editorial','user-submitted','auto-generated'
  source_url      text,                            -- canonical link to the original
  source_name     text,                            -- "Anthropic Blog", "Vercel Changelog"
  hero_image_url  text,
  author_id       uuid references users(id),       -- who wrote/curated this entry
  published_at    timestamptz default now(),
  pinned          boolean default false,
  is_breaking     boolean default false,           -- shows in the breaking strip
  status          text default 'published',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index on news_items (status, published_at desc);
create index on news_items (kind, published_at desc);

-- Many-to-many: a news item can be about multiple resources
create table news_resources (
  news_id     uuid references news_items(id) on delete cascade,
  resource_id uuid references resources(id) on delete cascade,
  primary key (news_id, resource_id)
);

create table news_tags (
  news_id  uuid references news_items(id) on delete cascade,
  tag_id   bigint references tags(id) on delete cascade,
  primary key (news_id, tag_id)
);

-- Newsletter
create table newsletter_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references users(id),
  email         text not null,
  frequency     text default 'weekly',             -- 'daily','weekly','breaking-only'
  topics        text[],                             -- which kinds the user wants
  is_active     boolean default true,
  confirmed_at  timestamptz,
  unsubscribed_at timestamptz,
  unique (email)
);

create table newsletter_issues (
  id            uuid primary key default gen_random_uuid(),
  issue_number  int unique not null,
  subject       text not null,
  sent_at       timestamptz,
  item_ids      uuid[],                             -- snapshot of news_items included
  recipient_count int,
  open_rate     numeric(5,2),
  click_rate    numeric(5,2)
);
```

**Auto-generation logic:**

```
nightly cron:
  for each resource_versions row created in the last 24h:
    if change is significant (new major version, new pricing, breaking change):
      insert news_items (kind='release', source_kind='auto-generated',
                          title=auto, body=changelog, source_url=resource_url)
      link news_resources

  for each model_meta change in pricing in the last 24h:
    insert news_items (kind='price-change', source_kind='auto-generated',
                        title="GPT-5 input cost: $5/1M → $3.50/1M (-30%)",
                        body=detailed table)
    link news_resources to the model
```

**Pages:**
- `/news` — Main feed, filterable by kind.
- `/news/[slug]` — Article view.
- `/news/feed.rss` and `/news/feed.atom` — RSS/Atom for power users.
- `/newsletter` — Public archive of weekly issues.

---

## Feature 37 — Model Price Tracker

**The build:** Track every model's pricing over time and surface the changes. Artificial Analysis tracks 357 models, BenchLM tracks 228 across 186 benchmarks — we don't need to outdo their depth on day one. We need to **track the right models for vibe coders** (the 30–50 they actually use) and **show the time-series**, which Artificial Analysis only does at the leaderboard level.

Per-model price history charts. Cross-model comparison view. Alerts: a user picks a model, gets emailed when input or output cost drops. Bonus: a "cost calculator" that takes a workload spec (tokens/day, ratio of input:output, cache hit rate) and shows the monthly cost across all comparable models — Helicone, llmpricecheck, and pricepertoken.com all do versions of this; we make ours stack-aware (knows you're on Claude Code so suggests cost-equivalent models).

**Schema (extends `model_meta` from the master prompt):**

```sql
-- Time-series of every pricing change for every model
create table model_pricing_history (
  id                    bigserial primary key,
  resource_id           uuid references resources(id) on delete cascade,
  effective_at          timestamptz not null default now(),
  input_cost_per_mtok   numeric(10,4),
  output_cost_per_mtok  numeric(10,4),
  cached_input_cost     numeric(10,4),
  reasoning_cost_per_mtok numeric(10,4),       -- separate cost for reasoning tokens (o1/o3 style)
  batch_input_cost      numeric(10,4),         -- batch API discounts
  batch_output_cost     numeric(10,4),
  source_url            text,                   -- where we scraped it from
  source_kind           text,                   -- 'official-pricing-page','api-response','manual-entry'
  detected_change       jsonb,                  -- {"input": -0.30, "output": 0.0} for change events
  unique (resource_id, effective_at)
);

create index on model_pricing_history (resource_id, effective_at desc);

-- Per-provider hosting (a model can be hosted on multiple providers at different prices)
create table model_provider_pricing (
  id                  uuid primary key default gen_random_uuid(),
  resource_id         uuid references resources(id) on delete cascade,  -- the model
  provider_slug       text not null,            -- 'anthropic','openrouter','together','groq','fireworks','bedrock','vertex'
  provider_model_id   text,                     -- the provider's internal name for this model
  input_cost          numeric(10,4),
  output_cost         numeric(10,4),
  context_window      int,
  output_window       int,
  rate_limit_rpm      int,
  rate_limit_tpm      int,
  is_official_host    boolean default false,
  url                 text,
  last_verified_at    timestamptz default now()
);

create index on model_provider_pricing (resource_id);

-- Price-drop alerts
create table price_alerts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  resource_id     uuid references resources(id) on delete cascade,  -- the model
  trigger_kind    text not null,                -- 'any-drop','threshold-input','threshold-output','new-provider'
  threshold_pct   numeric(5,2),                  -- e.g. 10.00 for "alert if input drops 10%"
  is_active       boolean default true,
  last_triggered  timestamptz,
  created_at      timestamptz default now()
);

-- User-defined workloads for the cost calculator (saved across sessions)
create table cost_workloads (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references users(id) on delete cascade,
  name              text,                         -- "My SaaS chatbot"
  input_tokens_per_call  int,
  output_tokens_per_call int,
  reasoning_tokens_per_call int,
  calls_per_day     int,
  cache_hit_rate    numeric(5,2),
  notes             text,
  created_at        timestamptz default now()
);
```

**Pages:**
- `/models/pricing` — Sortable table of every model's current pricing across every provider.
- `/models/pricing/calculator` — The interactive cost calculator. Save workloads. Get permalinks.
- `/models/[slug]/pricing` — Per-model pricing tab on the detail page, with the time-series chart.
- `/models/changes` — A "what changed today" feed. Powers Feature 36's price-change news items.

**Cron:**

```
hourly:
  for each model with model_meta:
    fetch official pricing page (or API endpoint)
    compare to last entry in model_pricing_history
    if changed: insert new row + insert news_items + fire price_alerts emails
```

---

## Feature 38 — Model Database & Capability Matrix

**The build:** This is the page that turns us into the canonical source for "which model should I use?" — the question every vibe coder asks weekly. The existing competitors split this into two pieces:

- **Pricing-only:** llmpricecheck, pricepertoken
- **Benchmark-only:** Artificial Analysis (intelligence index, 357 models), Vellum, BenchLM, llm-stats

We unify them and add the unique angle nobody has: **how does this model behave inside Cursor / Claude Code / Windsurf / Cline?** Claude Opus 4.7 might top intelligence benchmarks but cost twice as much per Cursor session as Sonnet because of how Cursor invokes it. That's the comparison developers actually need.

**The model detail page becomes:**
- Header: name, provider, version, current pricing, intelligence rank
- Live capability matrix: tools, vision, audio, structured output, prompt caching, batch API, fine-tuning, context window, output window, knowledge cutoff
- Benchmark scores: SWE-Bench, AIME, GPQA Diamond, HumanEval, MMLU-Pro (we pull from public sources, link out)
- Provider availability: a row per provider with their price + rate limits + is-official badge
- **Real-world performance row:** average tokens-per-vibe-coding-session in Cursor / Claude Code (collected from Feature 33's gateway telemetry)
- Pricing history chart (Feature 37)
- News mentioning this model (Feature 36)
- Active deals on this model (Feature 35)
- Compatible MCPs / skills (filtered by `resource_clients` overlap)

**Schema (extends `model_meta`):**

```sql
-- Capability flags per model (extends model_meta)
alter table model_meta add column capabilities jsonb default '{}'::jsonb;
-- capabilities example:
-- {
--   "tools": true, "parallel_tools": true, "vision": true, "audio_input": false,
--   "audio_output": false, "structured_output": true, "json_mode": true,
--   "prompt_caching": true, "batch_api": true, "fine_tuning": false,
--   "thinking": true, "interleaved_thinking": true, "computer_use": false,
--   "pdf_input": true, "web_search": false, "code_execution": true
-- }

-- Benchmark scores (sourced, not generated)
create table model_benchmarks (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  benchmark_slug  text not null,                -- 'swe-bench','aime-2025','gpqa-diamond','humaneval','mmlu-pro','livecodebench'
  score           numeric(6,2),                  -- normalized score
  raw_score       text,                          -- the original format (e.g. "76.4%")
  source_url      text,
  source_kind     text,                          -- 'official','third-party','community'
  measured_at     date,
  notes           text,
  unique (resource_id, benchmark_slug, source_kind)
);

create index on model_benchmarks (benchmark_slug, score desc);

create table benchmarks (
  slug          text primary key,
  label         text not null,
  category      text,                            -- 'coding','reasoning','knowledge','math','agentic','vision'
  description   text,
  authoritative_url text,
  is_saturated  boolean default false             -- e.g. MMLU is saturated; deprioritise display
);

-- Real-world session metrics from gateway telemetry (Feature 33)
create table model_session_stats (
  id                  bigserial primary key,
  resource_id         uuid references resources(id),
  client_slug         text references clients(slug),  -- 'cursor','claude-code','windsurf'
  bucket_at           date not null,                  -- daily bucket
  sessions            int,
  avg_input_tokens    int,
  avg_output_tokens   int,
  avg_cost_usd        numeric(10,4),
  avg_duration_sec    int,
  unique (resource_id, client_slug, bucket_at)
);
```

**Pages:**
- `/models` — The unified model database. Sortable / filterable on every column.
- `/models/compare` — Pick 2-4 models, see them side-by-side across all dimensions (capabilities, prices, benchmarks, real-world cost).
- `/models/[slug]` — The full detail page described above.
- `/models/leaderboard/[category]` — Category leaderboards (best for coding, best for reasoning, best free, best under $1/Mtok).

**The "which model should I use?" wizard:**
A 4-question quiz on `/models/wizard`:
1. What client are you using? (Cursor / Claude Code / Windsurf / API direct)
2. What's your primary task? (coding / chat / agents / data extraction / vision)
3. Budget? (under $1/Mtok / $1–10 / $10+ / cost-no-object)
4. Hard requirements? (tool use / vision / 1M+ context / open-weights)

→ returns a ranked list with reasoning and direct links to provider pricing pages. Saves to `cost_workloads` if logged in.

---

## Cross-feature wiring

These four features are most powerful when they reference each other. Add to the schema:

```sql
-- A unified change log that feeds the news system from any source
create table change_events (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id),
  event_kind      text not null,                  -- 'price-drop','price-rise','new-version','new-provider','new-deal','deal-expired','new-benchmark'
  payload         jsonb,
  occurred_at     timestamptz default now(),
  notified        boolean default false           -- has this been turned into a news_item / alert email yet?
);

create index on change_events (notified, occurred_at desc);
create index on change_events (resource_id, occurred_at desc);
```

The pipeline:

```
hourly cron:
  scrape pricing → write to model_pricing_history → if delta, write change_event
  poll GitHub → write to resource_versions → if major, write change_event
  partner deal feeds → write to deals → if new, write change_event

every 15 min:
  for each unnotified change_event:
    auto-create news_items
    fire price_alerts / deal_alerts to subscribed users
    mark notified
```

---

## Updated home page

Adds:

1. **"💰 Featured deals" strip** — 3 high-value deals, swappable. Public ones first to seed value before the membership pitch.
2. **"📰 Today" headlines** — top 5 news items from the past 24h, mixing release / price-change / ecosystem.
3. **"📉 Price moves" mini-widget** — sparkline showing the biggest price drops of the week. Click → model price tracker.
4. **"🤔 Which model should I use?" CTA** — links to the wizard.

---

## Updated build order

Phase 9 (new):
- Build `/models` and `/models/[slug]` with the unified detail page.
- Build the model price scraper + history table.
- Build `/models/compare` and the wizard.

Phase 10 (new):
- Build `/news` with auto-generated items from versions and price changes.
- Build the newsletter subscription + send infrastructure (Resend / Loops).

Phase 11 (new):
- Build `/deals` with the three access tiers.
- Stripe integration for the Pro tier subscription.
- Manually source and verify the first 50 deals (cloud, AI APIs, dev tools, productivity).

Phase 12:
- Cross-feature wiring: change_events, deal-on-resource badges, news-mentions widgets, model-on-deal references.

---

## Updated acceptance criteria

- A user lands on `/models`, filters to "supports tools + under $5/Mtok output + vision", sees 12 models, sorts by SWE-Bench score, picks Claude Sonnet 4.6, lands on its detail page.
- The detail page shows: pricing time-series chart with two visible drops in the last 6 months, a "💰 Anthropic offers $5K credits for startups" deal badge, 3 news items mentioning this model, 14 compatible MCPs, real-world session cost in Cursor: $0.42 average.
- A user sets a price alert for Claude Opus 4.7 input price drop of 10%. Two weeks later, Anthropic drops pricing 15%. The user gets an email within 15 minutes. The drop also appears as a `news_items` row, in the next newsletter, and in the homepage "Price moves" widget.
- A free user clicks a Pro deal ($10K DigitalOcean credits) and hits a paywall with one-click upgrade to $99/year. After paying, they're returned to the deal page with the redemption link unlocked.
- A logged-in user opens `/models/wizard`, answers four questions, gets a ranked recommendation with cost projections per month based on a workload they configured. They save the workload, share its permalink with a teammate.
- A weekly newsletter goes out every Tuesday with: top 3 ecosystem stories, top 3 release updates, top 3 price moves, top 1 deal of the week. Open rate logs to `newsletter_issues`.

---

## Why these four features compound

Standalone:
- Deals page = side hustle, real revenue
- News = retention engine, SEO, email list
- Price tracker = SEO destination, "cheapest model" queries
- Model database = canonical reference, every vibe coder bookmarks it

Together, with the cross-wiring above, they form a flywheel:
- **Price drop → news item → newsletter → user clicks → lands on model page → sees deals → claims one → starts using the model → increases gateway usage → telemetry feeds back into the model page.**

That's the loop. Every other vibe-coding directory is missing at least three of these four corners. Building all four under one roof, with a single resource graph linking them, is the moat.
-e 

---


# Vibe Coder Hub — Addendum 4: The Model Detail Page

> **Append to the master prompt.** This document is dedicated to the model detail page (`/models/[slug]`) — the single highest-traffic page on the site. Every block, every tab, every widget. Build this once and right.

---

## Why this page deserves its own document

The model detail page is the answer to *"should I use this?"* — the most-asked question in the vibe-coding ecosystem. People land here from search, from comparisons, from news, from price alerts, from deal pages, from MCP detail pages. They arrive with one of about a dozen specific questions in mind. Get those twelve questions answered well and we own the slot Artificial Analysis, OpenRouter rankings, Vellum, BenchLM, llm-stats, llmpricecheck, and pricepertoken are competing for — but with the vibe-coding angle nobody has.

This document specifies every block we ship on this page.

---

## The questions a vibe coder is actually asking

Ranked by frequency:

1. **What does it cost me, really?** (not "per million tokens", per *my* workflow)
2. **Is it good at coding?** (and which kind — components, agents, refactoring)
3. **Does it work with my IDE/agent?** (Cursor / Claude Code / Windsurf / Cline)
4. **Will it handle my context size?** (1M effective vs 1M advertised — they're not the same)
5. **Is it fast enough for my use?** (chat needs throughput; agents need latency; batch doesn't care)
6. **Can it use tools? Vision? Caching?** (the capability checklist)
7. **Where can I host it?** (first-party vs OpenRouter vs Bedrock vs Vertex — at what price?)
8. **What changed recently?** (new version, price drop, capability shift)
9. **What's the catch?** (rate limits, content policy, regional availability)
10. **What do other vibe coders actually pick?** (real usage signal, not just benchmarks)
11. **Is there a cheaper near-equivalent?** (the "downgrade path")
12. **Can I try it right now without signing up?**

The page is structured to answer these in order.

---

## Page structure (top to bottom)

```
┌────────────────────────────────────────────────────────────────┐
│  1. HERO                                                        │
├────────────────────────────────────────────────────────────────┤
│  2. STATS STRIP                                                 │
├────────────────────────────────────────────────────────────────┤
│  3. TRY IT NOW (inline playground)                              │
├────────────────────────────────────────────────────────────────┤
│  4. PRICING — Live + History + Cost Calculator                  │
├────────────────────────────────────────────────────────────────┤
│  5. CAPABILITIES MATRIX                                         │
├────────────────────────────────────────────────────────────────┤
│  6. PROVIDER AVAILABILITY (where you can run it)                │
├────────────────────────────────────────────────────────────────┤
│  7. BENCHMARKS                                                  │
├────────────────────────────────────────────────────────────────┤
│  8. REAL-WORLD VIBE CODING PERFORMANCE                          │
├────────────────────────────────────────────────────────────────┤
│  9. CONTEXT WINDOW QUALITY (effective vs advertised)            │
├────────────────────────────────────────────────────────────────┤
│  10. RATE LIMITS & QUOTAS                                       │
├────────────────────────────────────────────────────────────────┤
│  11. ABOUT — Description, training data, knowledge cutoff       │
├────────────────────────────────────────────────────────────────┤
│  12. NEWS & RELEASES (RSS-fed)                                  │
├────────────────────────────────────────────────────────────────┤
│  13. ACTIVE DEALS                                               │
├────────────────────────────────────────────────────────────────┤
│  14. WORKS WELL WITH (compatible MCPs / skills / tools)         │
├────────────────────────────────────────────────────────────────┤
│  15. COMPARE WITH (side-by-side launcher)                       │
├────────────────────────────────────────────────────────────────┤
│  16. ALTERNATIVES (cheaper / faster / open-weights equivalents) │
├────────────────────────────────────────────────────────────────┤
│  17. COMMUNITY VERDICT (reviews, ratings, "I picked this")      │
├────────────────────────────────────────────────────────────────┤
│  18. PROMPTING TIPS & QUIRKS                                    │
├────────────────────────────────────────────────────────────────┤
│  19. SAFETY, POLICY, REGIONAL AVAILABILITY                      │
├────────────────────────────────────────────────────────────────┤
│  20. DEVELOPER REFERENCE (code snippets in 6 SDKs)              │
├────────────────────────────────────────────────────────────────┤
│  21. TIMELINE (every version, price, capability change)         │
├────────────────────────────────────────────────────────────────┤
│  22. SOURCES & METHODOLOGY                                      │
└────────────────────────────────────────────────────────────────┘
```

---

## Every block, specified

### 1. Hero

- Model name, version, provider logo
- Provider link (e.g. "by Anthropic")
- Status badges: `🟢 Available`, `⚡ New`, `🧠 Reasoning`, `👁️ Vision`, `🔧 Tool use`, `📦 Open weights`
- One-line tagline (curated, not the provider's marketing)
- Primary CTAs (in order):
  - **Try it now** → scrolls to playground
  - **Compare** → opens the comparison drawer
  - **Set price alert** → opens alert form
  - **Add to my stack** → adds to user's stack

### 2. Stats strip (always-visible)

A horizontal row of 6–8 metrics, designed to be scannable at a glance:

- **Intelligence rank** (cross-provider, e.g. "#3 of 357")
- **Cost** (blended $/Mtok, with delta vs 30 days ago)
- **Output speed** (tokens/sec)
- **Latency** (TTFT in seconds)
- **Context** (advertised + effective in parens, e.g. "1M (eff. 200K)")
- **Knowledge cutoff**
- **Released** (relative time, e.g. "released 6 weeks ago")

Hover any metric → tooltip explaining methodology and link to source.

### 3. Try It Now — inline playground

Embedded chat window, pre-configured to call this model. Three modes:

- **Free trial** — 10 messages/day per IP, no signup. Routes through our own gateway with a small subsidy. (Loss-leader for conversion.)
- **BYO key** — paste an Anthropic / OpenAI / OpenRouter key, runs unlimited. Key stored in `localStorage` only, never sent to our server.
- **Saved on account** — logged-in users can store keys encrypted server-side and use them across sessions.

Pre-loaded with a "vibe-coding starter prompt" relevant to the model (e.g. "Refactor this React class to hooks: ...") so the playground is useful in 5 seconds, not 5 minutes.

Compare side-by-side: a "+ Add model" button splits the playground into two panes running the same prompt against two different models. OpenRouter's chat playground compares LLMs on a single prompt with 400+ AI models in one chat interface — match that, and make our split UX better.

### 4. Pricing — Live, History, Calculator

Three sub-sections in one card:

**4a. Current pricing (table)**
- Input cost / Mtok
- Output cost / Mtok
- Cached input cost / Mtok (if supported)
- Reasoning token cost / Mtok (separate column for reasoning models like o1/o3 style)
- Batch API cost (if supported, usually 50% off)
- All costs shown in USD by default, with a currency toggle (GBP, EUR, AUD, INR, JPY)

**4b. Price history chart**
A 90-day line chart of input + output cost. Annotated with version releases (e.g. "Claude 3.5 → 3.7" marker on the date the price changed). Hover any point → exact prices that day, link to source. pricepertoken.com runs a weekly newsletter on pricing changes; we own this view inline.

**4c. Cost calculator (inline)**
Sliders for:
- Input tokens per call
- Output tokens per call
- Reasoning tokens per call (if reasoning model)
- Calls per day
- Cache hit rate %

Outputs:
- Daily cost
- Monthly cost
- Annual cost
- Cost vs 3 named alternatives (the model's nearest competitors at similar quality)

Workload presets: "Chatbot (light)", "Chatbot (heavy)", "Agentic coding (Cursor-style)", "Agentic coding (Claude Code-style)", "Batch summarisation", "RAG pipeline". One click loads sensible defaults. Helicone's calculator estimates costs for 300+ models across 10+ providers; we make ours stack-aware and presets-driven.

Save the workload to the user's account (uses `cost_workloads` from Addendum 3). Generate a permalink.

### 5. Capabilities matrix

A clean checklist grid (✅ / ❌ / ⚠️ partial / 💰 paid add-on):

| Capability | Status | Notes |
|---|---|---|
| Tool use / function calling | ✅ | Up to 128 tools per request |
| Parallel tool calls | ✅ | |
| Vision (image input) | ✅ | PNG, JPEG, WebP, GIF |
| Audio input | ❌ | |
| Audio output | ❌ | |
| PDF input | ✅ | Up to 100 pages |
| Structured output / JSON mode | ✅ | strict mode supported |
| Prompt caching | ✅ | 90% discount, 5min default TTL |
| Batch API | ✅ | 50% discount, 24hr SLA |
| Streaming | ✅ | |
| Computer use | ⚠️ | Beta only |
| Web search built-in | ❌ | use external MCP |
| Code execution built-in | ❌ | |
| Fine-tuning | ❌ | |
| Reasoning / thinking mode | ✅ | Adaptive, visible via API param |
| Interleaved thinking | ✅ | |

Each row's "Notes" column includes provider-specific quirks. This is real, hard-won information — not duplicated elsewhere. DeepSeek offers an OpenAI-compatible API, making it easy to switch from OpenAI or use existing OpenAI SDK integrations; 5 of 6 models on DeepSeek support JSON mode for structured output — that kind of detail belongs here.

### 6. Provider availability

A table answering "where can I run this model?" with one row per host:

| Provider | Price (in / out) | Context | Rate limit | Latency p50 | Status |
|---|---|---|---|---|---|
| Anthropic (official) | $3 / $15 | 1M | 50K rpm | 380ms | 🟢 |
| Amazon Bedrock | $3 / $15 | 1M | 100 rpm (default) | 720ms | 🟢 |
| Google Vertex | $3.30 / $16.50 | 1M | 60 rpm | 510ms | 🟢 |
| OpenRouter | $3 / $15 | 1M | varies | 410ms | 🟢 |

Each row is sortable. The cheapest visible default is highlighted.

For open-weights models, this section also includes self-hosted options (Together, Fireworks, Groq, Cerebras, DeepInfra) with their pricing. On Cloudflare, Llama 3.1 8B is the fastest at 211 t/s, with prices varying up to 11x across models from $0.15 to $1.71 per 1M tokens — that kind of cross-provider variance is exactly what this table surfaces.

### 7. Benchmarks

Score table for a curated set of *useful, non-saturated* benchmarks. Vellum features results from non-saturated benchmarks, excluding outdated ones like MMLU — we follow the same principle.

| Benchmark | Score | Rank | Source |
|---|---|---|---|
| SWE-Bench Verified | 76.4% | #4 of 89 | [provider claim] |
| AIME 2025 | 89.2% | #2 of 67 | [community] |
| GPQA Diamond | 84.5% | #5 of 102 | [Artificial Analysis] |
| Humanity's Last Exam | 21.4% | #3 of 51 | [HF leaderboard] |
| LiveCodeBench | 72.1% | #6 of 78 | [community] |
| Terminal-Bench Hard | 64.2% | #3 of 31 | [Artificial Analysis] |

Each score → links to source with date measured. Confidence indicator (1-4 dots) showing how much sourced data backs each score; BenchLM uses confidence indicators where models with no non-generated benchmark coverage are marked as estimated.

A small "What do these mean?" expandable explains each benchmark in two sentences for non-experts.

### 8. Real-world vibe coding performance ⭐

**This block is the unique angle.** Powered by gateway telemetry from Feature 33 (the hosted MCP gateway in Addendum 2). For each major client, we show:

- **Cursor**: avg session cost, avg tokens/session, avg session duration, % of sessions that completed without error
- **Claude Code**: same dimensions
- **Windsurf**: same
- **Cline / Roo / Aider**: same

Side-by-side bars or a small radar chart. This answers *"will this be expensive in my actual workflow?"* — which no benchmark does. Telemetry is opt-in, anonymised, and aggregated; users running through our gateway feed the data.

If we don't yet have enough telemetry for this model + client, the block shows "Not enough data yet — be the first" with a link to set up the gateway. (Even the empty state drives gateway adoption.)

### 9. Context window quality

Advertised vs effective. For long-document workloads, providers vary in how well they actually use the upper end of their advertised windows — this is critical for vibe coders who pack their entire codebase into context.

Two metrics:

- **Advertised context** (what the provider claims, e.g. 1M tokens)
- **Effective context** (recall accuracy at full depth — community-sourced, with methodology link)

Visualised as a horizontal bar with the green effective region inside the grey advertised region. A "needle in haystack" mini-chart shows recall % at 25%, 50%, 75%, 100% of the advertised window.

### 10. Rate limits & quotas

A compact table of what the user actually hits in practice:

- Default tier limits (RPM, TPM, RPD)
- How to request increases (link to the provider's form)
- Burst behaviour
- Whether limits scale with payment tier
- Free-tier limits if applicable

For users on our gateway: their *current usage* against this model's limits, in real time.

### 11. About

The narrative section. Two paragraphs:

- **Provider's pitch** (paraphrased — we never reproduce marketing copy verbatim)
- **Our editorial take** — what's it actually good at, what's the tradeoff, who is it for

Plus structured fields:
- Architecture (transformer, MoE, dense, etc — when public)
- Parameter count (when public)
- Training data cutoff date
- Tokenizer family
- License (for open-weights)
- Release date
- Provider's official documentation URL
- Provider's API reference URL

### 12. News & releases (RSS-fed)

The last 10 news items linked to this model, pulled from `news_resources` (Addendum 3). Each item is from one of:
- Provider's official blog/changelog
- Auto-generated price-change item
- Auto-generated version-release item
- Editorial coverage from us

Plus an RSS feed URL: `/models/[slug]/feed.rss` — for power users who want this in their reader.

A "Subscribe" button → opens email-frequency picker (instant / daily / weekly).

### 13. Active deals

If any active rows exist in `deals` for this model, render as cards with redemption CTAs. A locked row appears for Pro-tier deals with the upgrade prompt.

For Anthropic models, that might be:
- **Anthropic Startup Program** — $5K Claude credits + priority rate limits (public)
- **AWS Activate** — $10K AWS credits including Bedrock access (member)
- **Google for Startups** — Up to $200K Google Cloud credits including Vertex (pro)

### 14. Works well with

A grid of resources from our directory that pair well with this model:

- **MCPs known to work** — filtered by `resource_clients` overlap with this model's primary clients
- **Skills built around this model** — e.g. skills that explicitly use Claude's interleaved thinking
- **Tools that ship with this as default** — e.g. Cursor uses GPT-5.x by default
- **Starters that pre-configure this model** — e.g. starters with `.cursorrules` calling this model
- **Prompt recipes optimised for this model** — those marked with this `model_id` in `prompt_meta`

This is the cross-product graph — the moat. No competitor has it because no competitor indexes the other primitives.

### 15. Compare with

A pre-populated "compare" launcher. Three buttons:

- **vs the previous version** (e.g. Claude Sonnet 4.6 → 4.7)
- **vs the cheaper alternative** (computed from `model_meta` + benchmarks)
- **vs the smarter alternative** (computed from `model_meta` + benchmarks)
- **+ Custom** → opens the full comparison page

Artificial Analysis lets users compare any two AI language models side-by-side across intelligence scores, pricing, output speed, latency, context window sizes, and more. We match this and add capabilities + real-world performance + alternatives.

### 16. Alternatives — the downgrade/upgrade path

A small ranked list:

- **Cheaper near-equivalent** — same intelligence band ±3%, lowest price
- **Faster equivalent** — same intelligence band, highest output speed
- **Open-weights closest** — best open model with similar capabilities (for self-host fans)
- **The premium upgrade** — next intelligence tier up, with cost delta

Each one is a one-line card with key stats and a "compare" link. This block alone answers "is there something better/cheaper?" — the most common follow-up question.

### 17. Community verdict

- Star rating (1–5)
- Number of reviews
- Top tags from review submissions ("great for backend", "expensive at scale", "struggles with images")
- 3 most-helpful reviews, expandable to all
- "I picked this" counter — how many of our users have this in their saved stacks

This section uses the `reviews` and `comments` tables from the master schema.

### 18. Prompting tips & quirks

The single most underserved section across all model pages today. A community-edited list of things you only learn after using the model:

- "Don't put system instructions inside the user message — Claude follows the system role strictly"
- "Reasoning models work better with sparse, declarative prompts"
- "Vision is dramatically better when you describe what you want extracted *before* attaching the image"
- "Tool descriptions over 1024 chars get truncated"

Every entry has an upvote count, a contributor, and is markdown-rendered. A "submit a tip" button lets logged-in users add their own — moderated before going live.

**Schema for this:**

```sql
create table model_tips (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,  -- model
  author_id       uuid references users(id),
  body            text not null,
  category        text,                          -- 'prompting','tooling','vision','reasoning','quirk','workaround'
  upvotes         int default 0,
  status          text default 'pending',        -- 'pending','approved','rejected'
  created_at      timestamptz default now()
);
create index on model_tips (resource_id, status, upvotes desc);
```

### 19. Safety, policy, regional availability

Practical compliance info that gets buried in provider docs:

- Content policy summary (3–5 bullet points: what's blocked, what triggers warnings)
- Data retention policy (zero retention available? abuse monitoring?)
- HIPAA / SOC2 / ISO eligibility (yes/no/conditional)
- Regional availability (which AWS regions / Azure regions / Vertex regions support it)
- Sanctioned-country availability
- EU AI Act tier (when applicable)

Sourced from provider docs with a "last verified" date. This is unsexy but exactly what enterprise vibe coders are about to graduate to need.

### 20. Developer reference

Code snippets in 6 SDK languages — Python, TypeScript, Go, Rust, Curl, OpenAI-SDK-compatible — to call this model. Each snippet:

- Pre-fills the correct `model_id` for this exact model
- Shows the cheapest first-party endpoint by default
- Has a "switch to OpenRouter" toggle
- Has "show with tools", "show with vision", "show with caching" toggles

Code is rendered with syntax highlighting and a one-click copy. DeepSeek offers an OpenAI-compatible API, making it easy to switch from OpenAI or use existing OpenAI SDK integrations — we surface this kind of compatibility prominently in the snippet header.

A floating "Run in playground" button on each snippet reuses the inline playground from Block 3.

### 21. Timeline

Every change to this model since we started tracking it, sorted reverse-chronological:

- **2026-04-15** — Input price dropped 30% ($5 → $3.50/Mtok)
- **2026-04-10** — Vision capability added
- **2026-03-20** — Released as `claude-opus-4-7`
- **2026-02-01** — Beta version available to select customers

Each entry is a `change_events` row (from Addendum 3). Click any entry → news article or source URL. This is the audit trail, the "what's the catch with the latest version" answer.

### 22. Sources & methodology

The boring-but-essential trust signal. A collapsed accordion at the bottom listing:

- Where we sourced pricing (link to provider page, date last fetched)
- Where benchmark scores came from (linked, with date)
- How we calculate the "blended price" (input:output:cache ratio)
- How "effective context" is measured
- How "real-world vibe coding performance" is collected (gateway telemetry, opt-in, anonymised)
- Last full data refresh date

This is what separates us from sites that copy stats without attribution. Builds trust with the engineers we want to keep.

---

## Right rail / sticky sidebar (desktop only)

While scrolling the long page, a sticky sidebar shows:

- **TL;DR card** — 4 bullets answering "is this for me?"
- **Quick actions:** Try it, Compare, Set alert, Add to stack, Share
- **Mini stats** — cost, intelligence, speed, context (always visible)
- **"Best alternatives" mini-list** — 3 names with one-line stats
- **Subscribe** — RSS / email digest

On mobile, this collapses into a sticky bottom-bar with [Try] [Compare] [Save] icons.

---

## Schema deltas (model-detail-specific)

Most of what's needed already exists in earlier addenda. New additions:

```sql
-- From Block 18: community-edited tips
create table model_tips (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  author_id       uuid references users(id),
  body            text not null,
  category        text,
  upvotes         int default 0,
  status          text default 'pending',
  created_at      timestamptz default now()
);
create index on model_tips (resource_id, status, upvotes desc);

-- From Block 9: effective context measurements
create table model_context_quality (
  resource_id     uuid primary key references resources(id) on delete cascade,
  advertised_tokens int,
  effective_tokens int,                   -- where recall starts dropping noticeably
  recall_at_25pct numeric(5,2),
  recall_at_50pct numeric(5,2),
  recall_at_75pct numeric(5,2),
  recall_at_100pct numeric(5,2),
  source_url      text,
  measured_at     date
);

-- From Block 10: rate limits
create table model_rate_limits (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  provider_slug   text not null,
  tier            text,                   -- 'free','tier-1','tier-2','enterprise'
  rpm             int,                    -- requests per minute
  tpm             int,                    -- tokens per minute
  rpd             int,                    -- requests per day
  tpd             int,                    -- tokens per day
  notes           text
);

-- From Block 19: safety, policy, regional
create table model_compliance (
  resource_id     uuid primary key references resources(id) on delete cascade,
  data_retention_days int,                -- 0 means zero retention
  abuse_monitoring boolean,
  hipaa_eligible  boolean,
  soc2_eligible   boolean,
  iso27001_eligible boolean,
  eu_ai_act_tier  text,                   -- 'minimal','limited','high','prohibited'
  available_regions text[],               -- iso country codes or cloud regions
  blocked_regions text[],
  content_policy_summary text,
  last_verified_at date
);

-- From Block 17: aggregate "I picked this" signal (the "saved-in-stack" count)
-- Already implicit via collection_items joining stacks, but we add a fast-read view:
create materialized view model_adoption as
select
  r.id as resource_id,
  count(distinct ci.collection_id) as saved_in_stacks,
  count(distinct rv.id) as review_count,
  coalesce(avg(rv.rating)::numeric(3,2), 0) as avg_rating
from resources r
left join collection_items ci on ci.resource_id = r.id
left join reviews rv on rv.resource_id = r.id
where r.type_slug = 'model'
group by r.id;
create unique index on model_adoption (resource_id);
```

---

## Block-by-block build order

**Phase A (week 1) — the spine.** Blocks 1, 2, 4 (current pricing only), 5, 6, 11. These are the table-stakes blocks. With just these, the page is already on par with Artificial Analysis and OpenRouter.

**Phase B (week 2) — what they don't have.** Blocks 3 (try it now), 14 (works well with), 16 (alternatives), 17 (community verdict), 20 (developer reference). These are unique to us.

**Phase C (week 3) — the data depth.** Blocks 4b/4c (price history + calculator), 7 (benchmarks), 9 (context quality), 10 (rate limits), 19 (compliance), 21 (timeline), 22 (sources).

**Phase D (week 4) — the moat.** Block 8 (real-world vibe coding performance). This requires the gateway from Feature 33 to be pumping telemetry first. Without it, the block stays in empty-state mode driving gateway adoption.

**Phase E (ongoing) — the community layers.** Block 15 (compare), 18 (tips & quirks). Tips need moderation; comparison needs the comparison UI from `/models/compare`.

---

## Acceptance criteria for the model detail page

- A user can scroll the page and answer all 12 of the "questions a vibe coder is actually asking" without leaving the page.
- The page renders with skeleton states under 200ms on cache; full data in under 800ms cold.
- The inline playground returns a first token in under 2 seconds.
- The cost calculator updates results in real time as sliders move (no debounce > 100ms).
- The capability matrix is 100% accurate against the provider's official docs as of last verification (date shown).
- Every external claim (benchmark score, price, capability) has a click-through source link.
- The "works well with" grid shows at least 6 resources for any model used by 100+ of our users.
- The page generates `application/ld+json` structured data for SEO (SoftwareApplication + Product schemas) so it ranks for "GPT-5 pricing", "Claude Opus 4.7 vs Gemini 3.1 Pro", etc.
- An RSS feed at `/models/[slug]/feed.rss` returns the last 20 news items + price changes + version releases for the model.

---

## Why this page is the moat

Existing model directories each pick 2–3 of these blocks:

- **Artificial Analysis** — blocks 2, 4a, 5 (partial), 7, 21 (partial). No try-it, no calculator, no real-world performance, no community.
- **OpenRouter** — blocks 3, 4a, 6, 7 (rankings only), 17 (rankings only). No pricing history, no compliance, no tips.
- **Vellum / BenchLM** — blocks 7, 15. Heavy on benchmarks, light on everything else.
- **llmpricecheck / pricepertoken** — blocks 4 only.
- **Helicone calculator** — block 4c.

We ship all 22 in one page, with a unified resource graph linking out to MCPs, skills, tools, deals, news, and starters that are also on our site. **That cross-product graph is the moat that none of them can copy without rebuilding the whole catalogue first.**

The model detail page isn't just a page. It's the centre of gravity for the whole product.
-e 

---


# Vibe Coder Hub — Addendum 5: Open-Source Models, "Best For" & Install Guides

> **Append to the master prompt.** Three things the previous addenda underspecified: open-weights/local models (a fundamentally different flow from cloud APIs), structured "best for" and "alternative to" relationships (currently buried inline), and installation/usage guides (entirely missing as a first-class system).

---

## Why these three together

They're connected. A vibe coder picking Qwen 3 32B Coder over GPT-5 needs to know:
- **Hardware they need to run it** (open-source flow)
- **What it's best for** (structured, queryable, not buried in description)
- **How to actually install it** (step-by-step, OS-aware, runtime-aware)

Today, none of the major directories cover this trio:
- **Artificial Analysis** treats open-weights and closed-source the same — no hardware sizing, no install path
- **Hugging Face** has model cards but no "what runs it" surface
- **Ollama's library** has install commands but no benchmarks, no comparisons, no prompting tips
- **OpenRouter** routes to hosted open-weights but doesn't help you run them yourself

The combined gap is exactly where a vibe coder lives: *"I want to run an open model on my MacBook for free, what works and how do I do it?"*

---

## Feature 39 — Open-Source / Local Model Flow

### The architectural decision

Open-weights models are the same `model_meta` rows we already have, just with `is_open_weights = true`. But the **detail page renders differently** when that flag is set, because the questions are different:

- Cloud model: how much per token? what providers? rate limits?
- Open model: what hardware do I need? which quantization? which runtime?

Same database, different view template. Treat it like the type-specific blocks we already do for components vs MCPs vs models — open-weights is a sub-template of `model`.

### Schema additions

Extend `model_meta` with:

```sql
alter table model_meta add column is_open_weights boolean default false;
alter table model_meta add column license text;                    -- 'apache-2.0','mit','llama-3-community','custom'
alter table model_meta add column license_url text;
alter table model_meta add column commercial_use_allowed boolean;
alter table model_meta add column param_count_b numeric(8,2);      -- 8.0, 32.0, 405.0
alter table model_meta add column architecture text;               -- 'dense','moe','mamba'
alter table model_meta add column moe_active_params_b numeric(8,2); -- for MoE models
alter table model_meta add column hf_repo text;                    -- 'meta-llama/Llama-3.1-8B-Instruct'
alter table model_meta add column gguf_available boolean default false;
alter table model_meta add column awq_available boolean default false;
alter table model_meta add column gptq_available boolean default false;
alter table model_meta add column mlx_available boolean default false;          -- Apple Silicon
```

New table for the quantization × runtime grid:

```sql
create table model_quantizations (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  quant_label     text not null,                    -- 'Q2_K','Q4_K_M','Q5_K_M','Q6_K','Q8_0','FP16','BF16','MLX-4bit','AWQ-4bit','GPTQ-4bit'
  quant_family    text,                              -- 'gguf','awq','gptq','mlx','exl2','fp'
  bits_per_weight numeric(4,2),
  vram_required_gb numeric(6,2),                     -- estimated VRAM for inference (no context overhead)
  ram_required_gb numeric(6,2),                      -- if running on CPU
  quality_tier    text,                              -- 'minimal-loss','recommended','aggressive','extreme'
  download_size_gb numeric(6,2),
  source_url      text,                              -- where the file lives (HF repo, Ollama tag, etc)
  is_recommended  boolean default false,             -- "this is the one most people should use"
  notes           text
);
create index on model_quantizations (resource_id, vram_required_gb);
```

New table for runtime support:

```sql
create table runtimes (
  slug    text primary key,                          -- 'ollama','lm-studio','llama-cpp','vllm','jan','gpt4all','mlx','tgi','tabby','exllamav2','localai','openllm'
  label   text not null,
  website text,
  icon    text,
  category text,                                     -- 'cli','gui','server','library'
  os_support text[],                                 -- ['mac','linux','windows']
  gpu_support text[],                                -- ['nvidia','amd','apple-silicon','cpu']
  api_compatible text[],                             -- ['openai-chat','openai-completions','anthropic-messages']
  beginner_friendly boolean,
  description text
);

create table model_runtime_support (
  resource_id     uuid references resources(id) on delete cascade,
  runtime_slug    text references runtimes(slug),
  install_cmd     text,                              -- 'ollama pull qwen2.5-coder:32b'
  config_url      text,                              -- direct link to a Modelfile / config recipe
  performance_note text,                              -- 'best supported runtime', 'limited tool support', etc
  primary key (resource_id, runtime_slug)
);
```

### New blocks on the model detail page (when `is_open_weights = true`)

Insert these between Block 5 (Capabilities) and Block 6 (Provider availability) on the existing model detail page from Addendum 4:

**5b. Hardware sizing calculator**

The killer block for open-weights. A user picks their hardware (or auto-detects via JS), and we tell them which quantization runs:

```
What's your hardware?
  ◯ Apple Silicon  [pick chip: M2 / M3 / M4 / Ultra]   [pick RAM: 16 / 24 / 32 / 64 / 128 / 192 / 512 GB]
  ◯ NVIDIA GPU     [pick card: RTX 3060 / 3090 / 4070 / 4090 / 5090 / A100 / H100]
  ◯ AMD GPU        [pick card: RX 7900 XTX / W7900]
  ◯ CPU only       [pick RAM: 16 / 32 / 64 / 128 GB]
```

Output table:

| Quant | VRAM needed | Quality | Speed (est) | Recommended? |
|---|---|---|---|---|
| Q2_K | 5.2 GB | aggressive loss | 35 t/s | ❌ |
| Q4_K_M | 7.8 GB | minimal loss | 28 t/s | ✅ |
| Q5_K_M | 9.4 GB | minimal loss | 24 t/s | ✅ |
| Q6_K | 11.1 GB | near-FP16 | 19 t/s | ⚠️ tight |
| Q8_0 | 13.5 GB | near-FP16 | 16 t/s | ❌ won't fit |
| FP16 | 25.3 GB | full | n/a | ❌ won't fit |

Speed estimates pull from `model_session_stats` (real telemetry from users on the same hardware, when available) or fall back to community benchmarks. Quantization rule of thumb: ~0.6-0.7 GB per billion parameters at Q4_K_M, ~0.4 GB at Q2 with significant quality cost — we use real measurements where we have them, this formula as fallback.

The auto-detection uses JS APIs (`navigator.deviceMemory`, `navigator.gpu` for WebGPU detection, the user-agent for chip family on Apple) plus a "I'm not sure" → opens a hardware quiz.

**5c. Runtime selector**

Pick how you want to run it:

```
Beginner-friendly:
  [📦 Ollama]    [🎨 LM Studio]    [🪟 Jan]
Server-grade:
  [⚙️ vLLM]      [⚡ llama.cpp]    [🚀 TGI]
Apple Silicon optimised:
  [🍎 MLX]       [📦 Ollama]
IDE integration:
  [💻 Continue.dev]  [💻 Cursor (custom endpoint)]
```

Each option expands to install instructions for that exact (model × runtime) combo. Sourced from `model_runtime_support`.

**5d. License & commercial use**

A clear, plain-English summary nobody else writes well:

- **License:** Apache 2.0
- **Commercial use:** ✅ Allowed
- **Attribution required:** ✅ Yes
- **Restrictions:** None
- **Can I fine-tune and redistribute?** Yes
- **Full license text:** [link]

For Llama-style "community licenses" with usage caps and acceptable-use clauses, surface those clauses prominently — most users don't read past the headline.

**5e. Hugging Face integration**

Pull the latest from Hugging Face's Inference API and surface:
- Model card excerpt
- Top community fine-tunes (links)
- GGUF/AWQ/GPTQ availability badges (which formats are uploaded)
- Most-downloaded quantization
- Spaces using this model

This block is a thin wrapper around HF's API — we're not duplicating their data, we're contextualising it inside our cross-product graph.

### Tweaks to existing blocks for open-weights

- **Block 4 (Pricing):** flips to "Cost to run" with electricity-cost estimate ($/month at average inference duty cycle and your local kWh price) instead of API pricing. Still shows hosted-API alternatives below (Together, Fireworks, Groq, Cerebras pricing for the same model).
- **Block 6 (Provider availability):** becomes "Where to run it" — splits into "Self-host" (Ollama, LM Studio, etc.) and "Hosted API" (Together, Fireworks, Groq, Cerebras, OpenRouter).
- **Block 10 (Rate limits):** mostly N/A for self-hosted; for hosted-open-weights, shows per-provider limits.
- **Block 8 (Real-world vibe coding performance):** still applies — but adds "running on M3 Max 36GB" context to the data.

### New page: `/models/by-hardware`

A reverse lookup. User picks their hardware, gets ranked open models that fit:

> **MacBook Pro M3 Max 36GB**
> Best general-purpose: Qwen 3 32B (Q4_K_M, 18.2GB)
> Best for coding: Qwen 2.5 Coder 32B (Q4_K_M, 18.2GB)
> Best small/fast: Llama 3.1 8B (Q5_K_M, 5.7GB)
> Best long-context: Llama 4 Scout (Q4_K_M, fits)
> Cheapest hosted alternative: Qwen 3 32B on Together at $0.18/Mtok

This is a high-traffic SEO page. Every "best LLM for [hardware]" search lands here.

---

## Feature 40 — Best For / Alternative To (Structured Relationships)

### The problem

Today our `resource_dependencies` table has a `relation` column with values like 'bundles', 'requires', 'used-in'. We're missing the most asked-for relationships:

- "What's the **best model for** writing React components?"
- "What's a **cheaper alternative to** Claude Opus 4.7?"
- "What's the **fastest alternative to** GPT-5.5?"
- "What's the **best free alternative to** Cursor?"
- "What's the **open-source alternative to** v0?"

These need to be first-class structured data, not buried in description text.

### Schema additions

Extend `resource_dependencies.relation` with new values, and add a dedicated table for human-curated "best for" tags:

```sql
-- The relation column already exists. Add these allowed values via app-level enum:
-- 'best-for'        — "Best for X use-case"
-- 'alternative-to'  — generic alternative
-- 'cheaper-than'    — same job, lower cost
-- 'faster-than'     — same job, lower latency
-- 'smarter-than'    — same job, higher capability
-- 'lighter-than'    — open-source: smaller model with similar performance
-- 'open-alt-to'     — open-source equivalent of a closed-source thing
-- 'self-hosted-alt' — self-hostable equivalent
-- 'free-alt-to'     — free equivalent

-- Use cases that "best-for" can map to (curated taxonomy)
create table use_cases (
  slug         text primary key,
  label        text not null,
  description  text,
  category     text,                                 -- 'coding','creative','data','agentic','vision','audio','enterprise'
  example_prompts text[],
  sort_order   int default 0
);
-- Seed: 'react-components', 'python-data-analysis', 'sql-generation', 'code-review',
--       'long-context-refactor', 'agentic-tools', 'fast-chat', 'vision-extraction',
--       'pdf-parsing', 'creative-writing', 'translation', 'roleplay-character',
--       'mobile-app-builder', 'landing-page', 'saas-mvp', 'browser-automation', etc.

-- Best-for is its own table because it has score + use_case + ranking semantics
create table best_for (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  use_case_slug   text references use_cases(slug),
  score           numeric(4,2),                      -- 0–10 community + editorial score
  rank            int,                                -- 1 = top pick for this use case
  rationale       text,                               -- why this is best for this use case
  evidence_url    text,                               -- benchmark link, real-world test, etc.
  contributed_by  uuid references users(id),
  is_editorial    boolean default false,             -- our team's pick vs community
  upvotes         int default 0,
  status          text default 'published',
  created_at      timestamptz default now()
);
create index on best_for (use_case_slug, rank);
create index on best_for (resource_id);

-- Alternatives are pairwise + typed
create table alternatives (
  id              uuid primary key default gen_random_uuid(),
  source_id       uuid references resources(id) on delete cascade,    -- "alternative TO this"
  target_id       uuid references resources(id) on delete cascade,    -- "this is the alternative"
  alt_kind        text not null,                      -- 'cheaper','faster','smarter','lighter','open','self-hosted','free','direct'
  delta_summary   text,                               -- "60% cheaper, 5% lower benchmark"
  delta_metrics   jsonb,                              -- {"price_pct": -60, "speed_pct": +12, "intel_pct": -5}
  rationale       text,
  contributed_by  uuid references users(id),
  is_editorial    boolean default false,
  upvotes         int default 0,
  status          text default 'published',
  created_at      timestamptz default now(),
  unique (source_id, target_id, alt_kind)
);
create index on alternatives (source_id, alt_kind, upvotes desc);
create index on alternatives (target_id, alt_kind);
```

### How it surfaces

**On every resource detail page:**

A new block called **"Best for / Alternatives"** sits above the existing community verdict. It shows:

- **"Best for these use cases"** — top 3 use-case tags this resource ranks well in (with rank #s)
- **"Cheaper alternatives"** — top 3 with delta_summary
- **"Faster alternatives"** — top 3
- **"Smarter alternatives"** — top 3 (the upgrade path)
- **"Open-source alternative"** — if applicable
- **"Self-hostable alternative"** — if applicable

Each link goes to the alternative's detail page with the alternative's strength highlighted.

**New page: `/best-for`**

A directory of use cases. Each use case has its own page like `/best-for/react-components` listing the top 10 resources for that job, with scores, rationale, and prompts to test them.

**New page: `/alternatives/[source-slug]`**

Every resource auto-generates an alternatives page: `/alternatives/cursor`, `/alternatives/claude-opus-4-7`, `/alternatives/v0`. These pages are massive SEO drivers — "alternatives to Cursor" is searched thousands of times a month.

The page structure is:

```
"Alternatives to Cursor"
   [intro: 2 sentences about Cursor and why people seek alternatives]

Cheaper alternatives (3)
Faster alternatives (3)
Open-source alternatives (3)
Free alternatives (3)
Direct competitors (3)

→ each card shows: name, tagline, key delta vs Cursor, "best for" tags, install link
```

### Workflow for keeping this fresh

- **Editorial:** every new resource we feature, we tag its top-3 use cases and link 3 alternatives manually. Takes 5 minutes per resource at submission time.
- **Community:** logged-in users can suggest a "best for" or "alternative" with rationale; goes into a moderation queue.
- **Auto:** for models, we auto-generate `cheaper-than`, `faster-than`, `smarter-than` rows nightly from `model_meta` (price/speed/intelligence within ±20% bands). The auto rows get `is_editorial = false` and lower display priority than human-curated ones.
- **Voting:** upvotes determine display order within each kind on the page.

---

## Feature 41 — Installation & Usage Guides

### The huge gap

Currently the master prompt has `install_cmd` as a single text field on `resources`. That's fine for a one-liner, but the real installation experience is multi-step, OS-aware, runtime-aware, and post-install verification matters as much as the install itself. Nobody in the directory space has built this well — Ollama's library has install commands, Hugging Face has model cards, but nothing combines structured guides with "did it work?" verification.

This is also where we earn enterprise-friendly credibility: a directory that has *real install guides* for everything is fundamentally more useful than one that just lists commands.

### Schema

Treat guides as a first-class entity, not just a column:

```sql
create table guides (
  id              uuid primary key default gen_random_uuid(),
  resource_id     uuid references resources(id) on delete cascade,
  slug            text not null,                     -- 'install-on-mac','use-with-cursor','first-mcp-call'
  guide_kind      text not null,                     -- 'install','quickstart','usage','troubleshoot','migrate','tutorial'
  title           text not null,
  summary         text,
  difficulty      text,                              -- 'beginner','intermediate','advanced'
  duration_min    int,                               -- estimated time to complete
  prerequisites   text[],                            -- ['Node 18+','Cursor 0.45+']
  applies_to_os   text[],                            -- ['mac','linux','windows','any']
  applies_to_clients text[],                         -- ['cursor','claude-code','windsurf'] for usage guides
  applies_to_runtimes text[],                        -- ['ollama','vllm','llama-cpp']
  body_md         text not null,                     -- the actual guide content
  is_official     boolean default false,
  author_id       uuid references users(id),
  upvotes         int default 0,
  view_count      int default 0,
  status          text default 'published',
  last_verified_at timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (resource_id, slug)
);
create index on guides (resource_id, guide_kind);
create index on guides (applies_to_os);

-- Step-by-step structure (so guides aren't just markdown blobs)
create table guide_steps (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid references guides(id) on delete cascade,
  position        int not null,
  step_kind       text,                              -- 'command','config','navigate','verify','warning','note'
  title           text,
  body_md         text,
  command         text,                              -- raw command to copy
  expected_output text,                              -- what success looks like
  troubleshoot_hints jsonb,                          -- {"error_string": "fix"}
  unique (guide_id, position)
);

-- Track failed installs to improve guides
create table guide_completions (
  id              uuid primary key default gen_random_uuid(),
  guide_id        uuid references guides(id) on delete cascade,
  user_id         uuid references users(id),
  completed_steps int[],                             -- [1,2,3,5] — they skipped 4
  failed_at_step  int,
  failure_reason  text,
  total_duration_min int,
  created_at      timestamptz default now()
);
```

### Guide types we ship for every resource

A resource isn't "complete" in our system until it has at least one of each:

1. **Install guide** — get it running on your machine (or in your account).
2. **Quickstart guide** — "your first call" / "your first component" / "your first MCP tool invocation". Five minutes, demonstrable result.
3. **Usage guide(s)** — one per major client. e.g. "Use Sequential Thinking MCP with Cursor", "Use it with Claude Code", "Use it with Windsurf". Each is a separate row.
4. **Troubleshooting guide** — common errors with fixes. Auto-populated from `guide_completions.failure_reason` over time.

Optional but high-value:

5. **Migration guide** — "moving from X to this resource". For models: "Migrate from GPT-5 to Claude Opus 4.7". For tools: "Migrate from Cursor to Windsurf".
6. **Tutorial / project guide** — "Build X in 30 minutes using this resource". These are workflow-style content, marketing-aligned.

### How guides render on detail pages

A new tab on every detail page: **"Guides"** with the count badge.

Inside, the guides are grouped:

```
GET STARTED
  ▸ Install on macOS (5 min · beginner)
  ▸ Install on Linux (5 min · beginner)
  ▸ Install on Windows (8 min · beginner)
  ▸ Quickstart: your first call (3 min · beginner)

USAGE
  ▸ Use with Cursor (4 min · beginner)
  ▸ Use with Claude Code (3 min · beginner)
  ▸ Use with Windsurf (4 min · beginner)

ADVANCED
  ▸ Custom Modelfile for prompt caching (12 min · intermediate)
  ▸ Run on multi-GPU server with vLLM (25 min · advanced)

TROUBLESHOOT
  ▸ "Failed to fetch model" error (3 min)
  ▸ Out-of-memory on M-series (5 min)

MIGRATE
  ▸ From OpenAI Chat Completions API (8 min · intermediate)
```

Clicking a guide opens it in a focused reader view at `/[resource-slug]/guides/[guide-slug]` with:

- Sticky progress sidebar showing the steps
- Each step is a card with copy-to-clipboard for commands
- "Mark this step done" checkbox (logged-in users — feeds `guide_completions`)
- "Verify it worked" buttons that run a shell-side check (when applicable, via the gateway) or guide the user to run it themselves
- Inline troubleshooting drawer that opens if the user marks a step as "didn't work"
- "Help improve this guide" — submit a fix/edit, goes into editorial queue

### The interactive verifier (the magic feature)

For installable things (MCPs, skills, runtimes, CLI tools), guides ship with a verifier:

After "Install Ollama and pull qwen2.5-coder:32b", the verifier offers to:
1. **Run a probe locally** — opens an inline terminal that runs `ollama list | grep qwen2.5-coder` and confirms.
2. **Or** check via our gateway if the user has connected their machine via the gateway agent.

For cloud installs (e.g. "set up an MCP server in Claude Desktop"), the verifier opens a deep-link to Claude Desktop's settings and shows what success looks like with an annotated screenshot.

This is a meaningfully different UX than "copy this command and hope" — the user knows it worked.

### Generating guides at scale

We don't write 10,000 guides by hand. Process:

- **Auto-draft on submission:** when a resource is published, an LLM drafts an install + quickstart + one-per-client usage guide from the readme + source code. These go into `status = 'draft'`.
- **Editorial pass:** team or community curators review and promote drafts to `published`.
- **Living updates:** when `resource_versions` shows a new version, the draft guide is regenerated and flagged "needs review" — never silently overwritten.
- **Failure-driven improvements:** the `guide_completions.failure_reason` field is mined weekly; the most common failures get a new troubleshoot section auto-suggested.

### New top-level page: `/guides`

A directory of guides themselves. Filter by:
- Guide kind (install / quickstart / usage / troubleshoot / migrate / tutorial)
- Difficulty
- OS
- Client
- Runtime
- Duration ("got 5 minutes? show me 5-min guides")

This is another massive SEO surface — every "how to install [resource]" search lands here.

---

## Wiring it all together

### Updated detail page tab structure

The existing model detail page tabs (from Addendum 4) become:

```
[Overview] [Try It] [Guides] [Pricing] [Compatibility] [Reviews] [Versions] [Forks] [Analytics]
```

`Guides` is new and prominent. For non-model resources, it's the same — every resource gets a Guides tab.

### Updated home page

Add:

- **"Run locally" strip** — featured open-weights models with hardware fit suggestions ("Run on your M3 MacBook for free"). Ties to Feature 39.
- **"Best for…" mini-quiz** — a one-question prompt: "What are you building?" → routes to the right `/best-for/[use-case]` page. Ties to Feature 40.
- **"Get started" rail** — featured guides for the highest-traffic resources. Ties to Feature 41.

### Cross-feature graph payoffs

- A new Qwen 3 release → news item → version snapshot → auto-drafted install guides for Mac/Linux/Windows × Ollama/LM Studio/llama.cpp → linked from a `/best-for/coding` page → triggers price-alert emails for users tracking it on Together/Fireworks → adds an `alternative-to` row vs Claude Opus 4.7 (cheaper-than) → shows up on Claude's detail page in "open alternatives".

That single ingestion event surfaces in seven places, all linked.

---

## Updated build order

- **Phase 9 add:** open-weights schema + the hardware sizing block (Feature 39's 5b). This earns us a place in the "run locally" search corpus immediately.
- **Phase 10 add:** `best_for` and `alternatives` tables + the unified detail-page block + the `/alternatives/[slug]` SEO pages.
- **Phase 11 (new):** Guides system end-to-end. Auto-draft from readme + editorial review queue + interactive verifier MVP (just for MCPs and skills initially).
- **Phase 12:** `/models/by-hardware`, `/best-for`, `/guides` index pages.
- **Phase 13:** Guide-completion analytics → mine failures → suggest troubleshoot sections.

---

## Updated acceptance criteria

- A user with a MacBook M3 36GB lands on `/models/by-hardware`, picks Apple Silicon + 36GB, and sees a ranked list of open models that fit, each with a "click to install via Ollama" deeplink and a "run on Together for $0.18/Mtok" hosted-API alternative.
- A user lands on `/alternatives/cursor` (organic search), sees Windsurf, Zed, Cline, and Aider with delta_summary for each ("free, terminal-based" / "open-source"). They click Aider, land on its detail page, see *its* "alternatives" block highlighting Cursor as the smarter-than and Continue.dev as the comparable-free alternative.
- A user clicks "Install on macOS" for Qwen 2.5 Coder 32B. Step 1: install Ollama (with copy button + verifier "I have it"). Step 2: pull the model (copy button + 4-min download timer). Step 3: verify with a sample prompt (one-click verifier returns the expected output). The user marks complete; we record `guide_completions`.
- A vibe coder asks "what's the best model for React components?" — types it into our search, lands on `/best-for/react-components`, sees Claude Sonnet 4.6 ranked #1 with rationale, with each entry linked to its detail page, prompting tips, and a "try it on this prompt" playground pre-loaded with a real React-component task.
- An open-weights model on its detail page shows: "Cost to run: ~$1.40/month at 2hr/day inference on your M3 Max" alongside "Cost on Together: $0.18/Mtok" — letting users decide whether to self-host or use a hosted API.
- An author submits a new MCP server. Within 5 minutes, the system has auto-drafted: an install guide for Cursor, an install guide for Claude Code, an install guide for Windsurf, and a quickstart for the first tool invocation. The author reviews and approves them; they go live.

---

## Why these three features compound

Standalone:
- Open-weights flow = capturing the privacy-conscious / cost-sensitive segment that's currently locked into Hugging Face + Ollama
- Best-for / alternatives = capturing every "alternatives to X" search, plus turning the directory into a recommendation engine
- Install guides = becoming the install layer (which is what Smithery aspires to be for MCPs alone)

Together:
- A user lands on `/alternatives/claude-opus-4-7`, sees "Open-source alternative: Qwen 3 32B"
- Clicks through, sees the model detail page in open-weights mode
- Sees the hardware sizing block — "fits on your M3 Max"
- Sees the `Guides` tab with "Install Qwen 3 32B on macOS via Ollama" (5 min · beginner)
- Completes the guide, the verifier confirms, telemetry feeds back into "real-world performance on M3 Max"
- The next user on M3 Max sees that benchmark, increasing conversion

Every step strengthens the next. Cross-product graphs aren't a feature — they're the product.
