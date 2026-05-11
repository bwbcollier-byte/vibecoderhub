# Vibe Coder Hub — Complete Spec Bundle

_This file concatenates all six canonical spec files into a single document._
_Each section is delimited by its filename header._
_Claude Code: parse this bundle, treat each section as the corresponding spec file, then proceed with Phase A._

## Files included

1. `vibe-coder-hub-final.md` — 2821 lines
2. `vibe-coder-hub-design-prompt.md` — 1255 lines
3. `vibe-coder-hub-detail-pages.md` — 2130 lines
4. `vibe-coder-hub-schema.sql` — 1831 lines
5. `vibe-coder-hub-data-sourcing.md` — 873 lines
6. `vibe-coder-hub-master-plan.md` — 519 lines

---

## File 1 of 6: `vibe-coder-hub-final.md`

~~~~~~~~~~vibe-coder-hub-final.md
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

~~~~~~~~~~

---

## File 2 of 6: `vibe-coder-hub-design-prompt.md`

~~~~~~~~~~vibe-coder-hub-design-prompt.md
# Vibe Coder Hub — Design Prompt for Claude Design

> Design the complete visual system, every screen, every state, every modal, every empty state, and every responsive breakpoint for a directory + SaaS product called **Vibe Coder Hub**. This document is self-contained — you do not need to read the 2,800-line build spec. Everything you need to design is here.

---

## 1. The product in one paragraph

Vibe Coder Hub is the canonical directory and SaaS layer for the vibe-coding ecosystem. Indie hackers, founders, design engineers, and AI-first developers come here to find UI components, MCP servers, agent skills, subagents, plugins, slash commands, hooks, rules files, prompt recipes, starter kits, IDEs, AI models, sandboxes, observability tools, backend kits, design assets, and more — across **24 resource types**, all queryable by IDE compatibility and tech stack. The product also runs a **deals page** for credits and discounts, a **news section** with a weekly newsletter, a **model price tracker**, an **install guide system**, an **alternatives engine** (`/alternatives/cursor` etc.), and a **hosted gateway** that runs MCPs and agents on behalf of users (the SaaS revenue layer).

**Personality:** Linear × Vercel × Raycast. Confident, dense, fast. **Not** Product Hunt, not Awwwards, not glassy-shadcn-default. Dark-first with a polished light mode.

**Critical UX bet:** the user picks their stack and IDE once at first visit ("I build with Cursor + Next.js + Supabase"), and the entire site reshapes around that selection — every list filtered, every recommendation ranked, every install command tailored. This decision is the centrepiece of the design.

---

## 2. Brand & visual system

### Logo
- A clean lowercase wordmark plus a geometric monogram. The monogram is a 24×24 mark that works at favicon size.
- Avoid gradients in the mark itself.
- Pick a single accent colour that survives both dark and light mode and isn't claimed by a major dev tool (skip Vercel-black, Cursor-purple, Anthropic-orange, Linear-purple).
- Suggest two accent options for review (e.g. acid-lime + electric-blue) before committing.

### Type
- **UI:** Inter or Geist Sans
- **Code & monospace:** Geist Mono or JetBrains Mono
- **Headings:** the same UI face — no display fonts, no serifs

### Colour
- **Dark mode is default.** Background `#0a0a0c` to `#0f0f12`. Primary text near-white but not `#fff` (use `#fafafa`-ish to avoid eye-strain). Borders 6–8% white.
- **Light mode** uses the same hierarchy inverted, with borders 6–8% black.
- **Six semantic colours:** success (green), warning (amber), danger (red), info (blue), accent (your brand), neutral.
- **Type badges** — each of the 24 resource types gets a unique tinted background + icon. They're scanning aids, used everywhere. Keep them subtle: 8% saturation, no full-colour fills.
- **No gradient backgrounds** on cards or buttons. Gradients reserved for hero illustrations and the brand mark only.

### Density
- 8px base grid. Cards have generous internal padding but tight outer rhythm — this is a directory, density matters.
- Information-dense lists. **No marketing fluff sections** on detail pages. Every block earns its place.
- Compare to: Linear's issue list, Vercel's project dashboard, Raycast's command palette. Avoid: Product Hunt (too marketing-y), Awwwards (too animated), default shadcn (too template-y).

### Iconography
- **Lucide** as the base set. One stroke weight throughout (1.5px).
- **Brand logos** for tools/clients/models — render at 16px monochrome in compatibility rows, full-colour on detail pages.

### Motion
- Reductive. Most transitions 120–180ms ease-out.
- Cards have a subtle hover lift (1px y-translate, slight border brighten).
- **Skeleton screens, never spinners** for loading states. Use the actual card layout shape.
- Cmd-K palette opens with a 50ms fade-in — feels instant.

### Accessibility
- AA colour contrast minimum on body, AAA on copy text.
- All interactive elements keyboard-navigable; focus rings visible (don't suppress them).
- Code blocks have a "view as plain text" affordance.
- Every icon-only button has an aria-label.

---

## 3. Top-level navigation

### Desktop layout

A persistent top navigation bar:

```
[Logo]  [Components ▾] [Models] [MCPs] [Tools] [Deals] [News] [Guides]   [⌘K Search]   [Stack: Cursor·Next·Supabase ▾]   [Avatar / Sign in]
```

- The first 7 items are primary navigation. Components, Models, MCPs, Tools are most-clicked — give them prime placement. Deals / News / Guides slot next.
- "More" dropdown shelters the other 20 resource types (Skills, Subagents, Rules, Prompts, Plugins, Marketplaces, Hooks, Commands, Starters, Sandboxes, Observability, Backend Kits, Assets, Showcase, Docs-for-LLMs, Specs, Workflows, Stacks, Evals, Scripts).
- The **Stack chip** ("Cursor · Next · Supabase") is always visible and clickable — opens the stack picker modal. This is non-negotiable; it's the single most-used UI element after search.
- **⌘K Search** is a button that opens the command palette.
- **Avatar** opens the user menu (Profile, My Stacks, Bookmarks, Submissions, Settings, Sign out). Logged-out users see a **"Sign in"** ghost button + a primary **"Get started"** filled button.

### Mobile layout

- Hamburger top-left, logo centre, search icon top-right.
- Bottom nav with 5 icons: Home, Search, Bookmarks, News, Profile.
- Stack chip becomes a sticky banner under the header on mobile, dismissable per session.
- Every detail page gets a **sticky bottom action bar** on mobile (Try / Compare / Save / Share icons).

---

## 4. The complete page list

Design these screens. Every page needs hover, focus, loading, empty, error, and (where relevant) paywalled states. Every page is responsive at 375px / 768px / 1024px / 1440px breakpoints.

### Marketing & onboarding
1. Landing page (`/`) — for logged-out visitors
2. Sign up (`/signup`) — modal + dedicated page
3. Sign in (`/signin`) — modal + dedicated page
4. Forgot password (`/auth/forgot`)
5. Email verification (`/auth/verify`)
6. Welcome onboarding flow (3 steps after first sign-up)
7. Pricing page (`/pricing`)
8. About / Manifesto (`/about`)
9. Contact (`/contact`)

### Home & discovery
10. Home (logged in) (`/`) — different from the landing page
11. Universal search results (`/search?q=…`)
12. Cmd-K palette (overlay, not a page)

### Resource directory (24 type index pages, 24 type detail pages)
13. Type index — generic template that renders for all 24 types (Components / MCPs / Skills / Subagents / Scripts / Rules / Prompts / Plugins / Marketplaces / Hooks / Commands / Starters / Tools / Models / Sandboxes / Observability / Backend / Assets / Showcase / Docs-for-LLMs / Specs / Workflows / Stacks / Evals)
14. Type detail — generic template, with type-specific blocks switched in
15. Model detail (`/models/[slug]`) — special, longest page, 22 distinct content blocks
16. Open-weights model detail variant
17. Component detail (with live Sandpack playground)
18. MCP detail (with tool inspector)
19. Showcase detail (built-with-this gallery item)

### Cross-product features
20. Stack picker modal (the most-used modal)
21. Compare drawer (right-rail slide-in for "compare 2 of these")
22. Compare full-page (`/models/compare`) — side-by-side up to 4 models
23. Best-for landing pages (`/best-for/[use-case]`)
24. Alternatives landing pages (`/alternatives/[resource-slug]`)
25. By-hardware page (`/models/by-hardware`)

### Deals
26. Deals index (`/deals`)
27. Deal detail (`/deals/[slug]`)
28. Claim flow (modal)
29. Locked Pro deal state with paywall

### News
30. News index (`/news`)
31. News article (`/news/[slug]`)
32. Newsletter signup (modal + dedicated page)
33. Newsletter archive (`/newsletter`)

### Guides
34. Guides index (`/guides`)
35. Guide reader (`/[resource-slug]/guides/[guide-slug]`)
36. Step-by-step verifier UI (inline within guide reader)

### User dashboard
37. Profile public page (`/u/[username]`)
38. User stacks public list (`/u/[username]/stacks`)
39. User stack detail public (`/u/[username]/[stack-slug]`)
40. Dashboard home (`/dashboard`)
41. My bookmarks (`/dashboard/bookmarks`)
42. My collections (`/dashboard/collections`)
43. My stacks (private + draft) (`/dashboard/stacks`)
44. My submissions (`/dashboard/submissions`)
45. My alerts (`/dashboard/alerts`) — price alerts, deal alerts, news subscriptions
46. My claimed deals (`/dashboard/deals`)
47. My gateway subscriptions (`/dashboard/gateway`)
48. My API keys (`/dashboard/api-keys`)
49. Author dashboard (`/dashboard/author`) — for resource authors

### Settings
50. Settings overview (`/settings`)
51. Account (`/settings/account`)
52. Profile (`/settings/profile`)
53. Stack & client preferences (`/settings/stack`)
54. Notifications (`/settings/notifications`)
55. Billing & subscription (`/settings/billing`)
56. Connected accounts (`/settings/connections`) — GitHub, Google, etc
57. Privacy & data (`/settings/privacy`)
58. Theme & appearance (`/settings/appearance`)

### Submission flow
59. Submit a resource (`/submit`)
60. GitHub URL auto-import step
61. Type detection + form prefill step
62. Preview & publish step

### Try It / Playgrounds / Inspector
63. Inline model playground (lives in model detail)
64. Multi-model split playground (`/playground`)
65. MCP tool inspector (lives in MCP detail)
66. Component live preview (lives in component detail)

### Legal & utility
67. 404 page
68. 500 page
69. Maintenance page
70. Terms (`/terms`)
71. Privacy (`/privacy`)
72. Cookie banner (overlay)

---

## 5. Component library to design first

Build these as a design system *before* assembling pages. Each needs default, hover, focus, active, disabled, loading, and error states.

### Layout primitives
- Page shell (header + main + optional right rail + footer)
- Section heading (with optional CTA)
- Two-column with sticky sidebar
- Three-column dense grid
- Masonry grid (showcase only)
- Right-rail drawer (compare, claim deal, etc)
- Bottom sheet (mobile equivalent of drawer)

### Cards (one per resource type)
- **Generic resource card** — 240px tall, 320–400px wide. Contains: thumbnail, type badge, name, tagline, score, install count, compatible-clients icon row, 1–3 stack chips, save bookmark icon (top-right corner).
- **Component card variant** — replaces thumbnail with a live Sandpack mini-preview.
- **Model card variant** — leads with cost + intelligence rank instead of thumbnail.
- **Workflow card variant** — shows step count + duration label.
- **Stack card variant** (user-created bundles) — shows the 3–5 resources inside as overlapping chips.
- **Deal card** — shows deal value (`$5K credits`), provider logo, expiry, redeem CTA.
- **News card** — title, source, summary, hero image, kind badge, time-ago.
- **Guide card** — kind badge, title, difficulty, duration, OS badges.

### Interactive controls
- Buttons: primary, secondary, ghost, destructive, icon-only — three sizes.
- One-click install button: special component, see §11 below.
- Stack chip (dismissible / clickable / dropdown variants).
- Compatibility matrix cell (the ✅ ⚠️ ❌ ❓ glyph + tooltip).
- Type badge (24 variants, one per type).
- Tag pill (filter chip).
- Toggle / switch.
- Slider (with two-handle range variant for the cost calculator).
- Search input (inline + cmd-K variant).
- Filter dropdown (multi-select with checkboxes).
- Code block with copy-to-clipboard button (animated "copied!" confirmation).
- File-tree component (for guide step lists, version history).
- Vertical stepper (for guides and workflows).
- Table — sortable, with sticky header and "show more rows" expansion.
- Sparkline chart (price history).
- Bar / line / radar chart (capability comparisons).
- Status pill (`🟢 Available`, `⚡ New`, `🧠 Reasoning`, `👁️ Vision`, `🔧 Tools`, `📦 Open weights`).

### Overlays
- Modal (centred, 480px / 640px / 800px / fullscreen variants).
- Drawer (right slide-in, 480px desktop / fullscreen mobile).
- Popover (small contextual menus).
- Tooltip.
- Toast notification.
- Cmd-K palette.
- Cookie banner.
- Paywall overlay (special, see §12).

### Feedback
- Skeleton screens for every card type.
- Empty state component (illustration slot + heading + description + primary action).
- Error state component (with retry).
- Inline form validation (red border + helper text).
- Progress indicators (linear + radial for guide completion).

---

## 6. The Stack Picker (the most important UI element)

Triggered from the header chip, the welcome onboarding, and an "It looks like you build with X — want to set this as your stack?" prompt that fires after a session of behavioral signal.

**Layout:** centred modal, 640px wide, 3 sections:

```
┌────────────────────────────────────────┐
│   What's your setup?                    │
│   We'll tailor everything to it.        │
├────────────────────────────────────────┤
│   AI client(s)              [+ Add]    │
│   ☑ Cursor                              │
│   ☑ Claude Code                         │
│   ☐ Windsurf  ☐ Cline  ☐ Aider  ...     │
├────────────────────────────────────────┤
│   Tech stack               [+ Add]    │
│   ☑ Next.js  ☑ React  ☑ TypeScript     │
│   ☑ Supabase  ☐ Convex  ...             │
├────────────────────────────────────────┤
│   Hardware (for local models)          │
│   [ Apple Silicon ▾ ] [ M3 Max ▾ ]     │
│   [ 36 GB ▾ ]                           │
├────────────────────────────────────────┤
│   [Skip for now]      [Save my stack]  │
└────────────────────────────────────────┘
```

- Multi-select pills with brand logos. Most-popular options appear first; "+ Add" reveals the long tail.
- **Visual feedback while saving:** the page behind the modal *previews* the change — chips light up as items are added, the home feed silently re-orders. This makes the value tangible.
- **Persistence:** logged-in users save to their account. Logged-out users save to a cookie; we prompt to save permanently after their second visit.
- **Edit anytime** via the header chip.

---

## 7. The Home Page (logged-in version)

This is the landing pad for returning users. Build it around the user's saved stack.

```
[Header]
─────────────────────────────────────────────────────────────────────
HERO STRIP — "Welcome back, [name]"
"15 new resources match your stack since Tuesday"
[Browse new]                                       [Update my stack →]
─────────────────────────────────────────────────────────────────────
PRIMARY ROW — "For your stack"
A horizontal scroll of 8 mixed-type cards, ranked by stack relevance.
Each card has a "Why this?" tooltip on hover.
─────────────────────────────────────────────────────────────────────
TWO-COLUMN
┌───────────────────────────┬────────────────────────────────────┐
│ TRENDING                   │ TODAY                               │
│ A vertical list of 10      │ Top 5 news headlines:               │
│ trending resources across  │   • Claude Opus 4.7 price cut 30%   │
│ all types, with score and  │   • New Cursor 0.5x ships agents    │
│ compatible-clients icons.  │   • 21st.dev ships agents SDK       │
│                            │   ...                                │
│                            │ [See all news →]                    │
└───────────────────────────┴────────────────────────────────────┘
─────────────────────────────────────────────────────────────────────
"WHAT ARE YOU BUILDING?" PROMPT BOX
Single-line input + send button.
"Tell us what you're working on — we'll generate a stack."
(Routes to /best-for or AI-curated stack on submit.)
─────────────────────────────────────────────────────────────────────
TYPE ROWS — collapsed by default for types outside the user's interests
▸ Top components (8 cards)
▸ Top models (8 cards)
▸ Top MCPs (8 cards)
▾ Top skills, subagents, rules, plugins (collapsed)
─────────────────────────────────────────────────────────────────────
PRICE MOVES WIDGET (compact)
Sparkline ribbons showing biggest LLM price drops this week.
[Track a model →]
─────────────────────────────────────────────────────────────────────
DEALS STRIP
3 featured deal cards, mix of Public/Member/Pro tiers.
─────────────────────────────────────────────────────────────────────
RECENTLY UPDATED
Strip of 6 small cards showing freshly updated resources.
─────────────────────────────────────────────────────────────────────
SHOWCASE STRIP
Visual eye-candy: 4 large screenshots of vibe-coded projects.
─────────────────────────────────────────────────────────────────────
[Footer]
```

**Empty state** (new user with no stack saved): the home becomes a guided onboarding instead, with the stack picker prominent and "Try the demo" CTAs on three featured resources.

---

## 8. The Landing Page (logged out)

Marketing-grade. Sells the product to first-time visitors.

```
HERO
   "Every primitive a vibe coder needs.
    One directory. One install."
   [Sign up free] [Browse anonymously]
   Animated demo: a Cmd-K palette searches across types
   and one-click installs to "your" stack.

LIVE STATS BAR
   12,400 resources · 47 IDEs supported · 357 models tracked · $4.2M in deals

THREE-PILLAR EXPLAINER
   1. Find  →  cross-type search, real install metrics
   2. Try   →  inline playgrounds, MCP tool inspector
   3. Ship  →  one-click install to Cursor / Claude Code / Windsurf

LIVE RESOURCE WALL
   30 cards in a masonry grid showing real resources, animating in.

TESTIMONIAL ROW
   3 quotes from named users (with stacks shown next to their photo).

CALCULATOR TEASER
   Embedded mini cost-calculator: "How much would your AI bill be?"
   Drives sign-up at result.

DEAL TEASER
   "Members unlock $4M+ in deals. Including:"
   3 deal cards (with Pro deals locked).

PRICING SECTION
   Free / Member / Pro three-column.

FAQ accordion.

FOOTER (substantial — every page link, sitemap-grade).
```

Hero animation: the Cmd-K demo runs in a constant loop showing the stack picker, search, and install in 8 seconds. Pause-able and replayable.

---

## 9. Universal search & Cmd-K

### Cmd-K palette (the power-user surface)

Triggered by ⌘K / Ctrl+K from anywhere. Modal centred, 640px wide, max 60vh tall.

```
┌──────────────────────────────────────────────────────┐
│ 🔍  Search resources, news, guides, deals...        │
├──────────────────────────────────────────────────────┤
│ RECENT                                                │
│   ⏱ Claude Opus 4.7                          [Model]  │
│   ⏱ Auth0 MCP                                  [MCP]  │
│                                                       │
│ COMPONENTS                                            │
│   📦 Animated dropdown menu                          │
│   📦 Pricing card with toggle                        │
│   📦 Hero with text gradient                         │
│                                                       │
│ MODELS                                                │
│   🧠 Claude Opus 4.7              $3/$15  ★4.7      │
│   🧠 Gemini 3.1 Pro               $1.25/$5  ★4.6    │
│                                                       │
│ ACTIONS                                               │
│   ➤ Open my dashboard                                │
│   ➤ Update my stack                                  │
│   ➤ Submit a resource                                │
├──────────────────────────────────────────────────────┤
│ ↑↓ navigate · ↵ open · ⌘↵ install · esc close       │
└──────────────────────────────────────────────────────┘
```

- Fuzzy search across all types.
- Results grouped by type, scrollable.
- Type filter shortcuts: type `>m` to filter to models, `>c` to components, etc.
- Up/down to navigate. Enter to open. Cmd+Enter to install (if installable).
- "Recent" shows the last 5 visited resources (per user, persisted).
- "Actions" runs commands (Update stack, Submit resource, Sign out, Switch theme).
- Empty query state: "Recent" + curated "Trending now" + "Try ⌘K shortcuts" tips.

### Full search results page (`/search?q=…`)

For long queries and richer browsing.

```
[Header with search input pre-filled]

Results for "auth"  •  47 results across 8 types

FILTERS (left rail, sticky)            RESULTS (centre)
  Type
  ☐ All (47)
  ☑ Components (6)                     [Card]
  ☑ MCPs (4)                           [Card]
  ☐ Backend Kits (12)                  [Card]
  ☐ Models (0)                         [Card]
  ...
  Compatible client                    [Card]
  ☑ Cursor                             [Card]
  ☑ Claude Code                        ...
  ...
  Stack
  ☑ Next.js
  ☑ Supabase
  ...
  Pricing
  ☐ Free only
  ☐ Open source only
  ...
  Sort by
  ◉ Relevance
  ◯ Trending
  ◯ Newest
  ◯ Most installed
```

- AI search toggle: "Use natural language" — switches from full-text to semantic search via embeddings.
- Save search → creates an alert (notify when new resources match this query).

---

## 10. Resource detail page (generic template)

This template renders for 22 of the 24 types (Models and Stacks are special). Component / MCP variations are noted inline.

```
┌───────────────────────────────────────────────────────────────────┐
│  HERO                                                              │
│  ┌──────────────┐  Type Badge  Status pills (🟢 ⚡ 🧠 👁️ 🔧)        │
│  │  Thumbnail / │  Name (very large)                                │
│  │  Component   │  Tagline (one line)                                │
│  │  preview     │  By [author] · v2.3.1 · MIT                        │
│  │  240×240     │  Compatible: [Cursor] [Claude Code] [Windsurf]    │
│  └──────────────┘  Stack: [Next.js] [Tailwind] [TypeScript]         │
│                                                                     │
│  ╔══════════════════════════════════════════════╗                  │
│  ║ One-click install                            ║  [Try]   [Save]  │
│  ║ npx shadcn add @site/component-name          ║  [Compare]       │
│  ║                                          [⎘] ║                  │
│  ╚══════════════════════════════════════════════╝                  │
│                                                                     │
│  Stats strip:                                                       │
│  ↑ 1.2K  ⬇ 4.3K installs (7d)  ★ 4.8 (89)  🟢 99.2% verified       │
│  ⚡ updated 3d ago  🍴 142 forks                                    │
├───────────────────────────────────────────────────────────────────┤
│  TABS                                                               │
│  [Overview] [Try it] [Guides] [Install] [Source] [Compatibility]   │
│  [Reviews] [Versions] [Forks] [Analytics]                          │
├───────────────────────────────────────────────────────────────────┤
│  TYPE-SPECIFIC BLOCK (this is what varies between types)           │
│                                                                     │
│  • Component → live Sandpack playground, code, dependencies         │
│  • MCP → tool inspector with form-driven invocations                │
│  • Skill → SKILL.md viewer with fork button                         │
│  • Subagent → agent.md viewer, model assignment, tool access        │
│  • Rule → diff viewer, scope rules, "fork to my version"            │
│  • Prompt → playground with variable inputs                         │
│  • Plugin → bundled-resource list with install matrix               │
│  • Hook → script block with event matchers                          │
│  • Command → command preview, args schema, "test it" runner         │
│  • Starter → live demo iframe, framework chips, deploy buttons      │
│  • Tool → screenshots gallery, pricing table, "open in tool" link   │
│  • Sandbox → cold-start chart, OS image, pricing                    │
│  • Observability → integrations grid, dashboard screenshots         │
│  • Backend kit → service cards (DB / Auth / Payments etc)           │
│  • Asset → preview grid, license, download formats                  │
│  • Showcase → big screenshot, built-with row, live URL              │
│  • Docs-for-LLMs → llms.txt preview, package metadata               │
│  • Spec → spec text, example project, fork button                   │
│  • Workflow → vertical stepper of resources, time-to-complete       │
│  • Eval → benchmark methodology, leaderboard table                  │
│                                                                     │
├───────────────────────────────────────────────────────────────────┤
│  BEST FOR / ALTERNATIVES                                            │
│  Best for these use cases:                                          │
│    [Browser automation #1]  [Web scraping #3]  [E2E testing #4]    │
│  Cheaper alternatives (3 cards · delta_summary on each)            │
│  Faster alternatives (3 cards)                                      │
│  Smarter alternatives (3 cards)                                     │
│  Open-source alternative (1 card, if applicable)                    │
├───────────────────────────────────────────────────────────────────┤
│  WORKS WELL WITH                                                    │
│  Cross-resource grid: top MCPs, skills, tools, starters that pair.  │
├───────────────────────────────────────────────────────────────────┤
│  GUIDES (count badge)                                               │
│  Grouped: GET STARTED · USAGE · ADVANCED · TROUBLESHOOT · MIGRATE  │
├───────────────────────────────────────────────────────────────────┤
│  COMMUNITY VERDICT                                                  │
│  Star rating, top tags, 3 most-helpful reviews (expandable).        │
├───────────────────────────────────────────────────────────────────┤
│  PROMPTING TIPS & QUIRKS (community-curated, upvoted)              │
├───────────────────────────────────────────────────────────────────┤
│  NEWS & RELEASES (RSS-fed)                                         │
│  Last 10 items mentioning this resource.                            │
├───────────────────────────────────────────────────────────────────┤
│  ACTIVE DEALS (cards, including locked Pro tier)                    │
├───────────────────────────────────────────────────────────────────┤
│  TIMELINE                                                           │
│  Reverse-chronological version + price + capability changes.        │
├───────────────────────────────────────────────────────────────────┤
│  SOURCES & METHODOLOGY (collapsed accordion)                        │
└───────────────────────────────────────────────────────────────────┘

RIGHT RAIL (sticky, desktop only)
  TL;DR (4 bullets)
  Quick actions: Try / Compare / Set alert / Add to stack / Share
  Mini stats (always visible)
  Best alternatives (3-name list)
  Subscribe (RSS / email)

MOBILE BOTTOM BAR (sticky)
  [Try] [Compare] [Save] [Share]
```

The hero install command should be the **most visually dominant element** after the title. Bigger than the description, bigger than the buttons. People came here for the install.

---

## 11. The model detail page (special — 22 blocks)

This page deserves its own design pass because it's the highest-traffic page on the site.

The 22 blocks, in order:

1. **Hero** — name, version, provider logo, tagline, status pills, primary CTAs (Try / Compare / Set alert / Add to stack)
2. **Stats strip** — 6–8 metrics at a glance: intelligence rank, blended cost (with delta), output speed, latency, context window (advertised + effective), knowledge cutoff, released date
3. **Try It Now** — embedded chat playground; 3 modes: free trial / BYO key / saved on account; pre-loaded with a vibe-coding starter prompt; "+ Add model" button to compare side-by-side
4. **Pricing** — current pricing table + 90-day history sparkline + cost calculator with workload presets (sliders + permalinks)
5. **Capabilities matrix** — clean checklist grid (✅/❌/⚠️/💰) for tools, parallel tools, vision, audio, PDF, JSON mode, prompt caching, batch API, fine-tuning, reasoning, computer use, etc.
6. **Provider availability** — table: provider, price (in/out), context, rate limit, latency, status
7. **Benchmarks** — sortable table with confidence indicators (1–4 dots), source links, "what does this mean?" expandable
8. **Real-world vibe coding performance** ⭐ — bars or radar chart per client (Cursor / Claude Code / Windsurf): avg session cost, avg tokens/session, success rate. (Empty state: "Be the first — set up the gateway.")
9. **Context window quality** — advertised vs effective, with needle-in-haystack mini-chart at 25/50/75/100% depth
10. **Rate limits & quotas** — practical info per tier; for gateway users, current usage in real time
11. **About** — narrative + structured fields (architecture, params, cutoff, tokenizer, license)
12. **News & releases** — RSS-fed last 10 items, subscribe button
13. **Active deals** — cards, gating Pro tier
14. **Works well with** — compatible MCPs / skills / tools / starters / prompts (cross-product graph)
15. **Compare with** — pre-populated launchers (vs previous version, vs cheaper, vs smarter, +Custom)
16. **Alternatives** — cheaper / faster / smarter / open-weights / premium upgrade
17. **Community verdict** — rating, tags, top reviews, "I picked this" counter
18. **Prompting tips & quirks** — community-edited, upvoted
19. **Safety, policy, regional availability** — content policy, data retention, HIPAA/SOC2/ISO, regions, EU AI Act tier
20. **Developer reference** — code snippets in 6 SDKs (Python/TS/Go/Rust/Curl/OpenAI-compat), with toggles for tools/vision/caching, "Run in playground"
21. **Timeline** — every change since tracking started (price drops, version releases, capability adds)
22. **Sources & methodology** — boring but essential trust signal; collapsed accordion

### Open-weights variant — additional blocks

For models with `is_open_weights = true`, insert between blocks 5 and 6:

- **5b. Hardware sizing calculator** — user picks hardware (or auto-detects); output table shows quantizations × VRAM × est. speed × recommended badge.
- **5c. Runtime selector** — Ollama / LM Studio / Jan / vLLM / llama.cpp / MLX / Continue / Cursor (custom endpoint); each expands to install instructions.
- **5d. License & commercial use** — plain-English summary.
- **5e. Hugging Face integration** — model card excerpt, top fine-tunes, GGUF/AWQ/GPTQ availability badges.

For open-weights, **Block 4** flips to "Cost to run" with electricity-cost estimate alongside hosted-API alternatives. **Block 6** becomes "Where to run it" split into Self-host and Hosted API.

---

## 12. The one-click install button (signature component)

Auto-detects the user's primary client from their saved stack and renders the right install path.

**Default state:**

```
╔════════════════════════════════════════════════════════════╗
║  Install for Cursor                                    ⌄   ║
║  └ Click to add to Cursor (cursor:// deeplink)             ║
╚════════════════════════════════════════════════════════════╝
```

The chevron opens a dropdown with all supported install methods:

```
┌──────────────────────────────────────────┐
│ ★ Install for Cursor (deeplink)         │ ← default for this user
│   Install for Claude Code (CLI)          │
│   Install for Windsurf (deeplink)        │
│   Install for Claude Desktop (config)    │
│   Copy JSON snippet                      │
│   View all install options →             │
└──────────────────────────────────────────┘
```

**States:**
- Default (idle).
- Hover (slight lift, accent border).
- Click → loading shimmer for 200ms, then success animation: button briefly shows "✓ Installing in Cursor..." with a progress hint.
- Success → "✓ Installed in Cursor" for 3 seconds, then back to default.
- Error → "Couldn't open Cursor. [Show JSON] [Copy command]".
- For Claude Desktop and other config-file clients: clicking opens a modal with the JSON snippet, the file path, and "Open the config file" if the user has the desktop helper installed.

This component appears on every detail page hero. It's the most-clicked button on the entire site — design it like the "Add to cart" of an e-commerce store.

---

## 13. The MCP Tool Inspector (signature component)

Lives in the type-specific block on MCP detail pages.

```
┌───────────────────────────────────────────────────────────┐
│ Try this MCP — no installation                            │
├───────────────────────────────────────────────────────────┤
│ Tools (12)                          [Connection: 🟢 Live] │
│ ├─ search_files                                            │
│ ├─ read_file                                               │
│ ├─ write_file ⚠️ destructive                               │
│ ├─ list_directory                                          │
│ └─ ...                                                     │
├───────────────────────────────────────────────────────────┤
│ search_files                                               │
│ Searches files matching a pattern.                         │
│                                                            │
│ Input                                                      │
│   pattern *      [____________________]                   │
│   path           [____________________]                   │
│   max_results    [_10_]                                   │
│                                                            │
│   [Run] [Reset]                                           │
├───────────────────────────────────────────────────────────┤
│ Result                                                     │
│   {                                                        │
│     "matches": [                                          │
│       "src/auth/oauth.ts",                                │
│       "src/auth/session.ts"                               │
│     ]                                                      │
│   }                                                        │
│                                  [⎘ Copy] [⤴ Open in app] │
└───────────────────────────────────────────────────────────┘
```

- Destructive tools (write, delete, send) get an ⚠️ badge and a confirmation dialog before invocation.
- Free trial: 10 invocations per IP per day, then prompt to BYO key or upgrade.
- Successful invocations record telemetry that feeds the resource's health score.

---

## 14. The compare experience

Two surfaces:

### Compare drawer (right slide-in)
- Triggered from the "Compare" button in any detail page hero.
- 480px wide, sticky as the user scrolls.
- Shows a mini-table comparing the current resource with up to 3 others (added via "+ Add" search).
- Resource names are sticky at the top; scrolling the drawer scrolls the comparison rows.
- "Open full compare" → goes to the dedicated comparison page.

### Compare full-page (`/models/compare?ids=…`)
- Up to 4 columns, one per model.
- Sticky model headers with logos, names, prices.
- Rows grouped: Pricing, Capabilities, Benchmarks, Real-world performance, Provider availability.
- Visual diff: cells that differ get subtle colour highlighting (winner in green).
- Save comparison → permalink + add to user's saved comparisons.
- "Try side-by-side" button → opens multi-model split playground.

---

## 15. The cost calculator (inline + dedicated)

Lives in the model detail page block 4, plus a dedicated `/models/pricing/calculator` page.

```
┌────────────────────────────────────────────────────────┐
│ Cost calculator — Claude Opus 4.7                      │
├────────────────────────────────────────────────────────┤
│ Workload preset                                         │
│   [▼ Agentic coding (Cursor-style)        ]            │
│                                                         │
│   ◉ Chatbot (light)        ◯ Chatbot (heavy)          │
│   ● Agentic coding (Cursor) ◯ Agentic coding (Claude)  │
│   ◯ Batch summarisation     ◯ RAG pipeline             │
│   ◯ Custom                                              │
├────────────────────────────────────────────────────────┤
│ Input tokens per call           [════════● 8,500]      │
│ Output tokens per call          [══● 1,200]            │
│ Reasoning tokens per call       [● 3,400]              │
│ Calls per day                   [══════● 1,200]        │
│ Cache hit rate                  [════● 60%]            │
├────────────────────────────────────────────────────────┤
│ Daily cost              $14.20                         │
│ Monthly cost            $432.00     ▲ 5% vs last month │
│ Annual cost             $5,184                         │
│                                                         │
│ Compared to alternatives:                               │
│   Claude Sonnet 4.6     $172/mo    -60% (similar quality)│
│   Gemini 3.1 Pro        $268/mo    -38%                 │
│   Qwen 3 32B (self-host) ~$2/mo + hardware              │
│                                                         │
│ [Save workload]   [Set alert at $300]   [Share link]   │
└────────────────────────────────────────────────────────┘
```

- Sliders update results in real time (no debounce > 100ms).
- Permalink format: `/models/claude-opus-4-7/calc?in=8500&out=1200&calls=1200&cache=60`.

---

## 16. Deals page

### Deals index (`/deals`)

```
[Header]
─────────────────────────────────────────────
HERO STRIP
"$4.2M+ in credits & deals across the vibe-coding stack"
[Browse all]   [What's new this week →]
─────────────────────────────────────────────
TABS  [All] [AI APIs] [Cloud] [Dev tools] [Productivity] [Featured]
FILTERS  [Tier ▾] [Value ▾] [Provider ▾]
SORT     [Most valuable] [Most claimed] [Newest] [Expiring soon]
─────────────────────────────────────────────
GRID OF DEAL CARDS

┌────────────────────────────┐  ┌────────────────────────────┐
│ Anthropic Startup Program  │  │ Cursor Pro 50% off          │
│ $5,000 in Claude credits   │  │ 6 months                    │
│                            │  │                             │
│ [PUBLIC]   Apply now ▸     │  │ [MEMBER]  🔒 Sign in to claim│
└────────────────────────────┘  └────────────────────────────┘

┌────────────────────────────┐  ┌────────────────────────────┐
│ DigitalOcean Hatch         │  │ Microsoft for Startups      │
│ $10,000 in cloud credits   │  │ $150,000 Azure credits      │
│                            │  │                             │
│ [PRO]  🔒 Upgrade ↗        │  │ [PRO]  🔒 Upgrade ↗         │
└────────────────────────────┘  └────────────────────────────┘
```

### Locked Pro deal card (paywall pattern)

```
┌───────────────────────────────────┐
│ Microsoft for Startups            │
│ $150,000 Azure credits            │
│                                    │
│  ┌─────────────────────────────┐  │
│  │   🔒 Pro deal                │  │
│  │                              │  │
│  │   Unlock with Pro ($99/yr)   │  │
│  │   This single deal pays for  │  │
│  │   itself 1500x over.          │  │
│  │                              │  │
│  │   [Upgrade to Pro]           │  │
│  └─────────────────────────────┘  │
│                                    │
│  Pro members also get $5K AWS,    │
│  $10K Vercel, $200K Google Cloud  │
│  + 47 more deals worth $4M+.      │
└───────────────────────────────────┘
```

The blur effect on the locked card body is a strong visual cue. Show one or two pixels of the deal underneath through the blur — make the paywall feel like a window, not a wall.

### Deal claim flow (modal)

3 steps:
1. **Eligibility check** — "This deal requires: pre-seed to Series A, less than 5 years old, less than 50 employees. [Confirm I'm eligible]"
2. **Apply** — opens the partner's application form in a new tab AND shows our redemption guide inline (eligibility tips, common gotchas, average approval time).
3. **Track** — claimed deals appear in the user's dashboard with status (started → approved → redeemed).

---

## 17. News page

### News index (`/news`)

Two-column on desktop:

```
[Header]
─────────────────────────────────────────────
HERO  Latest in the vibe-coding ecosystem.
      [Subscribe to weekly digest →]
─────────────────────────────────────────────
FILTERS (left rail)            FEED (centre)
  Kind                           ┌──────────────────────────────┐
  ☑ Ecosystem (245)              │ 🔥 BREAKING                   │
  ☑ Releases (1,204)             │ Claude Opus 4.7 input price   │
  ☑ Price changes (89)           │ dropped 30% today.            │
  ☑ Tutorials (47)               │ — auto-generated · 2h ago     │
  ☑ Op-eds (12)                  └──────────────────────────────┘
                                  ┌──────────────────────────────┐
  Topics                          │ [Hero image]                  │
  ☐ Cursor                        │ Cursor 0.5x ships background  │
  ☐ Claude Code                   │ agents that work async        │
  ☐ Models                        │ — Cursor blog · 14h ago       │
  ☐ MCPs                          │ Editorial summary: ...         │
                                  └──────────────────────────────┘
                                  ...
```

- A "🔥 BREAKING" pinned item at the top when applicable.
- Auto-generated items have a small "🤖 auto" badge and link straight to the underlying resource.
- RSS feed URL surfaced in the page header.

### Newsletter signup (modal)

```
┌────────────────────────────────────────────┐
│ Weekly digest                               │
│ One email every Tuesday morning.            │
│ Top releases, biggest price moves, top deal.│
│                                             │
│ Email  [______________________]            │
│                                             │
│ Frequency                                   │
│   ◉ Weekly digest                           │
│   ◯ Daily roundup                           │
│   ◯ Breaking only                           │
│                                             │
│ Topics (optional)                           │
│   ☑ Models     ☑ Tools     ☐ Components    │
│                                             │
│ [Subscribe]                                 │
│                                             │
│ Unsubscribe with one click anytime.         │
└────────────────────────────────────────────┘
```

---

## 18. Guides system

### Guide reader (`/[resource-slug]/guides/[guide-slug]`)

Two-column layout, focused reading mode:

```
[Header — minimal during guide reading]
─────────────────────────────────────────────
LEFT (sticky, 280px)                CENTRE (max 720px reading width)
                                     ─────────────────────────────────
Install Qwen 2.5 Coder 32B           Install Qwen 2.5 Coder 32B
on macOS via Ollama                  ⏱ 5 min · 🟢 beginner
                                     
PROGRESS  ▓▓▓░░░ 50%                  ## Step 1: Install Ollama
                                     [body markdown]
✓ Step 1 — Install Ollama            
✓ Step 2 — Pull the model            ```bash
○ Step 3 — Run a test query          curl -fsSL https://ollama.com/install.sh | sh
○ Step 4 — Connect to Cursor         ```                              [⎘ copy]
                                     
                                     **Verify:** run `ollama --version`
                                     
                                     [▶ Run check]    Expected: 0.x.x or higher
                                     
                                     ─────────────────────────────────
                                     ## Step 2: Pull the model
                                     ...
                                     
                                     [Mark step complete]
                                     [Step didn't work? →]
─────────────────────────────────────────────
[Help improve this guide → submit edit]
```

- Each step's "Mark complete" feeds `guide_completions` telemetry.
- "Step didn't work?" opens a troubleshooting drawer with common fixes mined from past failures.
- The verifier ("Run check") executes a probe — either via the connected gateway agent (if user has it) or guides the user to run it manually with copy-clipboard support and an "I ran it; the output looks like…" textarea.
- Sticky progress sidebar shows step list with completed checks.
- Reading mode dims the rest of the site — only the guide is visible.

### Guides index (`/guides`)

Same layout pattern as resource directory: filters on left, card grid on right. Filters are kind / difficulty / OS / client / runtime / duration.

---

## 19. User dashboard

The signed-in home for a returning user. Tabbed layout.

```
[Header]
─────────────────────────────────────────────
"Welcome back, [name]"  [@handle]
[Overview] [Bookmarks] [Collections] [Stacks] [Submissions] [Alerts] [Deals] [Gateway] [API keys]
─────────────────────────────────────────────
OVERVIEW

┌──────────────────────┬──────────────────────────────────┐
│ ACTIVITY                                                 │
│ • 4 resources you bookmarked got updated this week       │
│ • Claude Opus 4.7 hit your $300/mo alert (saved $48)     │
│ • New Pro deal: Anthropic Startup Program                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────────────┐
│ MY STACK              │  │ MY ALERTS (3 active)         │
│ Cursor + Claude Code  │  │ 2 price drops triggered       │
│ Next.js + Supabase    │  │ 1 deal expires in 14d         │
│ Apple Silicon (M3 36) │  │ [Manage →]                    │
│ [Edit →]              │  └──────────────────────────────┘
└──────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ RECENT INSTALLS                                            │
│ 12 resources installed via this site this week            │
│ [view all →]                                               │
└──────────────────────────────────────────────────────────┘
```

Each tab is its own list view with type-specific actions (rename, delete, share, export).

---

## 20. Auth flows

### Sign up

Modal-first (less disruptive than redirecting to a page); dedicated page for direct links.

```
┌─────────────────────────────────────────┐
│ Create your account                      │
├─────────────────────────────────────────┤
│ [ 🐙 Continue with GitHub ]             │ ← primary, since users come from dev
│ [ 🇬 Continue with Google ]              │
│ ──── or with email ────                  │
│ Email     [_____________________]       │
│ Password  [_____________________]       │
│ Username  [_____________________]       │
│                                          │
│ ☐ I agree to Terms and Privacy           │
│                                          │
│ [ Create account ]                       │
│                                          │
│ Already have an account? Sign in         │
└─────────────────────────────────────────┘
```

### Welcome onboarding (3 steps after first sign-up)

1. **Stack picker** (the modal from §6 — the "save my stack" of this is the sign-up's success state)
2. **What are you building?** A single optional textbox; on submit we route to `/best-for/[inferred-use-case]` with curated recommendations.
3. **Subscribe to weekly digest** (optional). Pre-checked but easy to opt out.

Each step has a skip-able CTA. Don't make people do all three to enter the product.

### Sign in

Same modal pattern. "Forgot password?" inline link.

### Email verification & forgot password

Standard transactional pages. Logo, message, single CTA. Make the success state delightful (a small celebration micro-interaction).

---

## 21. Settings

A two-column layout: nav on left, content on right.

```
[Header]
─────────────────────────────────────────────
SETTINGS                          [Account]
                                  ─────────────
Account                           Email
Profile                           ben@example.com  [Change]
Stack & client preferences        
Notifications                     Username
Billing & subscription            @benhope          [Change]
Connected accounts                
Privacy & data                    Password
Theme & appearance                ●●●●●●●●●●●     [Change]
                                  
Support                           Two-factor auth
Sign out                          ☐ Enable 2FA
                                  
                                  Danger zone
                                  [ Delete account ]
─────────────────────────────────────────────
```

Each section is its own page. Notifications has granular controls: per-resource alerts, per-deal-expiry, per-newsletter-frequency.

---

## 22. Submission flow

Three-step wizard at `/submit`:

### Step 1: Source URL
```
What are you submitting?
[ Paste a GitHub URL or npm/pypi link ]
                                       [Detect →]

Or pick the type manually:
[ Component ] [ MCP ] [ Skill ] ... (24 types)
```

### Step 2: Auto-prefill
After detection, we show the form pre-filled with everything we could extract. Editable. The user fills the gaps.

```
We detected:                          
  Type     MCP server  [change]      
  Name     Auth0 MCP  [edit]         
  Source   github.com/auth0/mcp-auth0
  License  MIT (from package.json)
  ...
  
Things we couldn't auto-detect:
  Tagline  [_______________________]
  Compatible clients (multi-select chips)
  Stack tags (multi-select chips)
```

### Step 3: Preview & publish
Final preview that renders the detail page exactly as it will appear publicly. Three buttons:

```
[ Save as draft ]    [ Publish ]    [ Submit for review ]
```

Resources from verified authors auto-publish; new authors go through review.

---

## 23. Empty, loading, and error states

Design these explicitly for every list view.

### Empty states (with personality)

- **Bookmarks empty:** illustration of a hovering bookmark; "Save things you'll want later. Click the bookmark icon on any resource."
- **Search results empty:** illustration of a magnifying glass over a blank page; "Nothing matches '[query]'. Try a broader term, or [submit it →] if you want to add it."
- **Filter result empty:** "No resources match these filters. Try removing one of: [clear filter buttons]."
- **No alerts yet:** "Set price alerts on models you care about. Two clicks on any model page."
- **No claimed deals yet:** "Browse $4M+ in deals →"
- **New user dashboard:** the dashboard is mostly empty for new users. Replace cards with onboarding nudges ("Complete your stack", "Subscribe to the digest", "Bookmark your first resource").

### Loading states

- Skeleton card layout that matches each card type's actual shape.
- Cmd-K palette opens with skeleton results that fade in real results — no jank.
- Detail pages render the hero skeleton + tabs skeleton + body skeletons in parallel.

### Error states

- **Network failure:** card-shaped error component with "Couldn't load. [Retry]" — keep the page layout, don't full-screen the error.
- **404:** illustrated empty state, "We couldn't find that resource. It may have been removed. [Browse trending →] [Search →]"
- **500:** "Something broke on our end. Our team's been notified. [Try again →] [Status page →]"
- **Rate limited:** "You're going faster than we can keep up. Try again in 30s. Or [upgrade to Pro] for unlimited."

---

## 24. Paywalled features summary

Make these clear in the UI. Locked features show a lock icon + plan tier badge.

### Free tier
- Browse all resources
- Cmd-K search
- 5 bookmarks
- 1 collection
- Stack picker (1 saved stack)
- View public deals
- Read all news
- Basic guides
- Try-it playgrounds (10 calls/day per IP)
- Sign up for weekly digest

### Member tier (free, requires sign-up)
- Unlimited bookmarks & collections
- Up to 5 saved stacks
- Member deals unlocked
- Submit resources
- Reviews and comments
- Set up to 10 price alerts
- BYO key for unlimited playground
- Save searches as alerts
- Fork rules / skills / prompts to your account

### Pro tier ($99/year)
- All Pro deals unlocked ($4M+ value)
- Unlimited price alerts
- Gateway access (managed MCP/skill execution)
- Hosted secrets vault
- Priority gateway rate limits
- Author tools dashboard (for resource authors)
- Advanced analytics on submitted resources
- Compare up to 6 resources side-by-side (vs 4)
- API access (read-only)

### Paywall design rules
- Locked Pro features show a small 🔒 + badge; click → opens the upgrade modal.
- Upgrade modal is **value-led, never desperate**: shows the user the specific deal/feature they're trying to unlock, calculates the ROI ("This deal alone is 1500x the cost of Pro"), and offers a 14-day money-back guarantee.
- Never gate browsing or search behind any paywall. The directory itself is free forever.

---

## 25. Notification system

Three surfaces:

### In-app toast
- Bottom-right (desktop), top of screen (mobile).
- Slides in, auto-dismisses after 4s, dismissable manually.
- Variants: success (green tint), info (blue), warning (amber), error (red).
- Examples: "Bookmark saved", "Price alert set", "Failed to install — see details".

### Notification centre
- Bell icon in header, badge with unread count.
- Dropdown: last 20 notifications grouped by today / this week / older.
- Each notification: icon, title, body, timestamp, "view" link, "dismiss" button.
- "Mark all as read" + "Notification settings" links at the bottom.

### Email
- Transactional: signup confirm, password reset, deal claim approved, alert triggered, weekly digest.
- All branded consistently with the site. No "donotreply@" — responses go to a real inbox.
- Every email has a one-click unsubscribe link.

---

## 26. Theme & responsiveness

### Theme support
- **System / Light / Dark** (system default, persisted per user).
- Theme switch is a 3-state pill in the user menu and in `/settings/appearance`.
- Light mode is a true alternative, not an afterthought — it has the same hierarchy and density, just inverted.
- Code blocks adopt theme too (Shiki or similar with light + dark variants).

### Responsive breakpoints
- 375px (mobile) — single column, bottom nav, sticky bottom action bar on detail pages
- 768px (tablet) — two-column where it makes sense, side rails appear
- 1024px (desktop) — full layout, all rails visible
- 1440px (wide) — content max-width 1280px, generous gutters
- 1920px+ (ultra-wide) — content stays at 1280px, no infinite-stretch

Mobile-specific patterns:
- Filter sidebars become bottom sheets.
- Compare drawer becomes fullscreen modal.
- Cmd-K palette is fullscreen.
- Hover-only affordances have tap equivalents (e.g. compatibility matrix tooltips become tap-to-open).
- Long detail pages get an in-page section index at the top (jump links).

---

## 27. Cookie banner

```
┌──────────────────────────────────────────────────────────┐
│  We use cookies for essential features and (with your     │
│  permission) analytics that help us improve.              │
│                                                            │
│  [Accept all]  [Essential only]  [Customise →]           │
└──────────────────────────────────────────────────────────┘
```

Bottom-anchored banner, dismissable. "Customise" opens a modal with toggles per category (essential / functional / analytics / marketing). No dark patterns — "Essential only" is as easy to click as "Accept all".

---

## 28. Voice & microcopy

- **Tone:** confident, concise, slightly opinionated. Treat users as peers (because they are — vibe coders).
- Avoid: "amazing", "magical", "AI-powered" (unless literally describing AI), "revolutionary".
- Use: imperatives ("Install this", "Compare these", "Try it"), specifics ("3 reviews", "12 installs/week"), real numbers.
- Empty states get a touch of warmth, not desperation. "Nothing here yet" is fine. "Oh no, your bookmarks are empty :(" is not.
- Error messages name the cause and suggest a fix. Never just "Something went wrong".
- Never use emoji in body copy except in playful empty-state illustrations and as visual aids in stat strips (🟢 ⚡ 🧠 etc).

---

## 29. What you (Claude Design) should deliver

A structured Figma file (or equivalent) with:

1. **Foundations page** — colour, type, spacing, iconography, motion specs.
2. **Component library page** — every component from §5, all states.
3. **Page library** — every page from §4, all responsive breakpoints, all states (default/loading/empty/error/paywalled where applicable).
4. **Modals & overlays page** — every modal/drawer/sheet from across the app.
5. **Brand assets page** — logo lockups, app icons, social cards.
6. **Two themes throughout** — dark and light modes for everything above.

Annotations should call out:
- Interactive behaviours (hover, click, keyboard shortcut).
- Responsive transformations (where mobile differs from desktop).
- Animation specs (duration, easing, what triggers).
- Data states (what changes when this resource has zero installs vs 10k).
- Paywall and auth gates (which states require sign-in / Pro).

---

## 30. What this product is *not*

So you don't accidentally drift toward it:

- **Not a marketplace with payments inside.** Resources link out for paid options; we don't process resource sales (yet). The Pro subscription is the only thing we charge for.
- **Not a tutorial site.** We index resources; we don't write 2,000-word "what is vibe coding" posts.
- **Not opinionated about which IDE to use.** The whole point of the stack picker is meeting users where they are. Don't lean into Cursor or Claude Code visually more than the others.
- **Not a code generator.** We point at the tools that generate; we're the directory above them.
- **Not Product Hunt for AI.** Discovery is a side effect, not the loop. The loop is install → use → return.

---

## 31. Two reference moods, in one sentence each

- **Linear:** ruthless density, considered typography, everything keyboard-navigable, subtle motion that respects the user's attention.
- **Vercel:** dark by default, monospace where it should be, code blocks as first-class UI, marketing pages that read like documentation.

If a screen would feel out of place in either of those products, it's wrong for ours.

~~~~~~~~~~

---

## File 3 of 6: `vibe-coder-hub-detail-pages.md`

~~~~~~~~~~vibe-coder-hub-detail-pages.md
# Vibe Coder Hub — Detail Page Design Prompt

> **Standalone design prompt for Claude Design.** Specifies every detail page that opens when a user clicks a listing across all 27 resource types. Pair this with `vibe-coder-hub-design-prompt.md` (the system-wide design prompt). This document goes one level deeper: it tells you what fills the page once a user is *on* it.

> Read the shared anatomy in §1 carefully. Sections §2–§28 then define every type-specific page. Each section describes what's shown, what the user does there, dummy data to populate the design, and what makes that page the best in its category.

---

## §1 Shared anatomy — every detail page

Every type detail page is built from the same chassis. **Nine zones.** Type-specific blocks slot into Zone 5.

```
ZONE 1  — HERO              (always)  — name, tagline, install button, badges
ZONE 2  — STATS STRIP       (always)  — 6–8 metrics at a glance
ZONE 3  — TAB BAR           (always)  — Overview, Try It, Guides, Install, Source, Compatibility, Reviews, Versions, Forks, Analytics
ZONE 4  — RIGHT RAIL        (desktop) — TL;DR, quick actions, mini stats, alternatives
ZONE 5  — TYPE-SPECIFIC     (varies)  — the heart of the page; defined per type below
ZONE 6  — BEST FOR / ALTS   (always)  — best-for use cases, cheaper/faster/smarter alternatives
ZONE 7  — WORKS WELL WITH   (always)  — cross-product graph
ZONE 8  — SOCIAL & TIPS     (always)  — reviews, prompting tips, comments
ZONE 9  — META              (always)  — news mentions, deals, timeline, sources
```

**Mobile:** sticky bottom action bar with [Try] [Compare] [Save] [Share]. Right rail collapses into a fold-out section above Zone 6.

**Universal hero anatomy:**

```
┌────────────────────────────────────────────────────────────────┐
│  [Thumbnail/Preview]  TYPE BADGE  ⚡New  🟢Verified  📦Open     │
│  240×240              Resource Name (very large)                │
│                       One-line tagline                          │
│                       By @author · v2.3.1 · MIT                 │
│                       Compatible: [Cursor][Claude Code]…        │
│                       Stack:      [Next.js][Tailwind][TS]       │
│                                                                 │
│  ╔═══════════════════════════════════════════════╗              │
│  ║ One-click install                             ║  [Try]       │
│  ║ npx shadcn add @site/auth-form                ║  [Compare]   │
│  ║                                          [⎘]  ║  [Save]      │
│  ╚═══════════════════════════════════════════════╝              │
└────────────────────────────────────────────────────────────────┘
```

**Universal stats strip** (8 cells):
- ↑ score (votes)
- ⬇ install count (7-day delta)
- ★ avg rating (review count)
- 🟢 verified-working badge
- ⚡ last updated (relative time)
- 🍴 forks
- 👁 views (7-day)
- 💬 reviews

Type-specific pages override 1–3 of these cells with metrics that matter for that type (model pages swap two for cost + intelligence rank; sandboxes swap one for cold-start latency).

**Universal tab bar:**
`[Overview] [Try It] [Guides] [Install] [Source] [Compatibility] [Reviews] [Versions] [Forks] [Analytics]`

For types where a tab is N/A (e.g. Showcase doesn't have a "Source" tab), it's omitted. Don't grey it out.

---

## §2 Components — `/components/[slug]`

### What this page is for
A vibe coder lands here from search, the components index, or a recommendation. They want to (a) see the component running, (b) copy it into their project. The page must answer "does this look right and how do I install it?" in under 30 seconds.

### Hero specifics
- Thumbnail is replaced by a **live Sandpack mini-preview** at 240×240. The component runs inline.
- Install button reads: `npx shadcn add @vch/auth-form-with-oauth` (auto-resolves to the right registry URL).
- Badges: framework chip (`React`/`Vue`/`Svelte`), styling chip (`Tailwind`/`CSS`), `Responsive`, `Dark mode`, `A11y AA`.

### Zone 5 — type-specific blocks

**Live playground (full-width, the heart of the page)**

A Sandpack editor at full width, ~520px tall:
- Left pane: editable file tree (App.tsx, component.tsx, package.json, tailwind.config.js).
- Right pane: live preview with viewport toggle (mobile / tablet / desktop).
- Top bar: theme switcher (light / dark — to test the component in both), reset button, "Open in StackBlitz", "Open in CodeSandbox", "Fork to my account".
- Below: a **prop explorer** rendering the component's props as form controls. Toggle a `disabled` prop, watch it change. Pick from variant enums.

**Code & dependencies card**

Tabs: `Source` / `Dependencies` / `Tailwind config` / `Types`.
- `Source`: syntax-highlighted full file with line numbers and inline copy.
- `Dependencies`: `lucide-react@0.383`, `framer-motion@11.x`, `class-variance-authority@0.7` — each as a chip with version + npm/jsr link.
- `Tailwind config`: extra theme tokens needed (e.g. custom colours).
- `Types`: TypeScript prop interface.

**Variants gallery**
A horizontal scroll of 4–8 visual variants of the same component (e.g. for an auth form: with social, password-only, magic-link, code-input, OAuth-grid). Click any to swap into the playground.

**Visual design notes**
A short editorial section: "Why this component looks the way it does." Contrast ratios, animation timing rationale, inspiration credits. Differentiates us from "just another shadcn list."

### Best-in-class moves
- The viewport toggle isn't fake: it actually re-renders the component at iPhone, iPad, and desktop widths.
- "Test it with my real data" — a button that reveals a JSON textarea where the user can paste their own data shape and watch the component re-render.
- "Add this entire suite to my project" if the component belongs to a family (e.g. all auth components).

### Dummy data
- **Name:** "Auth form with OAuth grid"
- **Tagline:** "Email/password + 6 OAuth providers. Animated, accessible, zero config."
- **Author:** @sergeicodes
- **Variants:** Email-only, Email + Google, Magic link, OAuth grid (default), Passkey-first, Two-step
- **Used by:** 4,231 projects · 14 forks · ★ 4.8 (89 reviews)
- **Compatible:** all React-based clients (Cursor, Claude Code, Windsurf, v0, Lovable, Bolt)
- **Tags:** `auth` `forms` `oauth` `accessibility` `dark-mode`

---

## §3 Models — `/models/[slug]`

### What this page is for
The single highest-traffic detail page. Users arrive asking *"should I use this?"*. The page must answer 12 questions in scrollable order: cost, coding ability, IDE compatibility, context capacity, speed, capabilities, hosting, what changed, the catch, real usage signal, alternatives, and "can I try it now?"

### Hero specifics
- Provider logo + version (e.g. `claude-opus-4-7`).
- Status pills cluster: 🟢 Available · ⚡ New · 🧠 Reasoning · 👁 Vision · 🔧 Tool use · 📦 Open weights (when applicable).
- Primary CTAs: **Try it now** (anchor scroll) · **Compare** · **Set price alert** · **Add to my stack**.

### Stats strip (model-specific override)
- Intelligence rank (e.g. "#3 of 357")
- Blended cost ($/Mtok with 30-day delta)
- Output speed (tokens/sec)
- Latency (TTFT)
- Context (advertised + effective in parens)
- Knowledge cutoff
- Released (relative)
- Provider count (how many host it)

### Zone 5 — 22 blocks

This is the only page in the product with a 22-block type-specific zone. Build them in order (described in `vibe-coder-hub-final.md` §11) but the visual structure is:

1. Try It Now playground (BYO key + free trial + saved-on-account modes)
2. Pricing — current table + 90-day history sparkline + cost calculator with workload presets and permalinks
3. Capabilities matrix (16-row checklist with notes)
4. Provider availability table (sortable, with cheapest highlighted)
5. Benchmarks table (with confidence dots and source links)
6. Real-world vibe coding performance (radar chart per client — Cursor / Claude Code / Windsurf)
7. Context window quality (advertised vs effective + needle-in-haystack at 25/50/75/100%)
8. Rate limits & quotas (per tier; live for gateway users)
9. About (narrative + structured fields)
10. News & releases (RSS-fed last 10)
11. Active deals
12. Works well with
13. Compare with (pre-populated launchers: vs previous, vs cheaper, vs smarter)
14. Alternatives (cheaper / faster / smarter / open-weights / premium upgrade)
15. Community verdict
16. Prompting tips & quirks (community, upvoted)
17. Safety, policy, regional availability (HIPAA/SOC2/ISO/EU AI Act/regions)
18. Developer reference (snippets in 6 SDKs with toggles)
19. Timeline (price drops + version releases + capability changes)
20. Sources & methodology
21. (Open-weights only) Hardware sizing calculator
22. (Open-weights only) Runtime selector

### Best-in-class moves
- The Try It Now playground supports **side-by-side comparison** — "+ Add model" splits it into two panes running the same prompt.
- The cost calculator updates in real time and links to a permalink the user can share.
- The "Real-world vibe coding performance" block is unique to us — pulled from gateway telemetry, no competitor has this.

### Dummy data
- **Name:** "Claude Opus 4.7"
- **Provider:** Anthropic
- **Tagline:** "The smartest Claude. Built for agents, hard reasoning, and long sessions."
- **Pricing:** $3 in / $15 out / $0.30 cached / $15 reasoning / 50% batch discount
- **Context:** 1M advertised, ~720K effective
- **Capabilities:** Tools ✅, Vision ✅, PDF ✅, Caching ✅, Batch ✅, Reasoning ✅, Computer use ⚠️ beta
- **Intelligence rank:** #3 of 357 (Intelligence Index 57)
- **Hosted on:** Anthropic, Bedrock, Vertex, OpenRouter (with prices ranging $3–$3.30 in)
- **Real-world Cursor avg:** $0.42/session, 11.2K tokens/session, 94% success
- **Top tip (community):** "Don't put system instructions inside the user message — Claude follows the system role strictly."

---

## §4 MCP Servers — `/mcps/[slug]`

### What this page is for
A user is choosing between several MCPs that solve a similar problem (e.g. five GitHub MCPs). They need to compare tools each one exposes, see them work without installing, and one-click install to their client.

### Hero specifics
- Transport badge: `stdio` / `SSE` / `HTTP`.
- Auth badge: `OAuth` / `API key` / `No auth`.
- Tool count badge: `12 tools`.
- Source language: TypeScript / Python / Go.
- One-click install button with per-client deeplinks (Cursor / Claude Code / Windsurf / Claude Desktop).

### Stats strip overrides
- Replace "score" cell with **🛠 12 tools** count
- Replace "rating" with **⏱ p95 240ms** (latency from gateway telemetry)
- Replace "forks" with **🟢 99.4% uptime**

### Zone 5 — type-specific blocks

**Tool Inspector (full-width, the heart of the page)**

```
┌─────────────────────────────────────────────────────────┐
│ Try this MCP — no installation              🟢 Live    │
├─────────────────┬───────────────────────────────────────┤
│ Tools (12)      │ search_files                          │
│ ▸ search_files  │ Searches files matching a pattern.    │
│   read_file     │                                       │
│   write_file ⚠  │ Input                                 │
│   list_dir      │   pattern *  [______________]         │
│   ...           │   path       [______________]         │
│                 │   max_results [10]                    │
│                 │   [▶ Run]   [Reset]                   │
│                 ├───────────────────────────────────────┤
│                 │ Result                                │
│                 │   { matches: [...] }    [⎘] [↗ App]   │
└─────────────────┴───────────────────────────────────────┘
```

- Destructive tools (write/delete/send) marked ⚠️, require confirmation before invocation.
- Free trial: 10 invocations/day per IP. Then BYO key or upgrade.
- Each invocation feeds the resource's health score.

**Configuration card**

JSON config with per-client tab swapping:

```
[Cursor mcp.json]  [Claude Desktop]  [Windsurf]  [Claude Code]
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
[⎘ Copy]  [Open my config file]  [Install via deeplink →]
```

**Schema browser**

For each tool: input schema rendered as a structured form with field types, required flags, and descriptions. Output schema rendered the same way. Click any tool name in the inspector to jump here.

**Authentication walkthrough**

If `OAuth`: a step-by-step illustrated guide showing what the user will see in their browser, what scopes they'll grant, what data is visible to the MCP. Trust signal — most MCPs don't surface this and users are rightly cautious.

### Best-in-class moves
- Tool Inspector is *interactive* before install. No competitor offers this.
- Per-client install paths — Cursor gets a deeplink, Claude Desktop gets a JSON snippet with config-file path, Claude Code gets a one-line CLI command.
- Health metrics live (uptime, p95 latency) from our gateway telemetry.

### Dummy data
- **Name:** "GitHub MCP"
- **Tagline:** "12 tools for repos, issues, PRs, and Actions. Official server by GitHub × Anthropic."
- **Tools:** `search_files`, `read_file`, `create_issue`, `list_pull_requests`, `merge_pull_request` ⚠, `dispatch_workflow`, `get_repo`, `add_comment`, `assign_reviewer`, `create_branch`, `push_files`, `delete_branch` ⚠
- **Transport:** stdio + HTTP
- **Auth:** OAuth (GitHub App) or PAT
- **Health:** 99.4% uptime, p50 180ms, p95 410ms
- **Compatible:** all major clients
- **Sample successful invocation cached:** "List the 5 most recent issues in `vercel/next.js`" → resolves to JSON

---

## §5 Tools (IDEs / Agents / App Builders) — `/tools/[slug]`

### What this page is for
Users are deciding between AI IDEs (Cursor / Windsurf / Zed / Cline / Roo / Aider) or app builders (Lovable / Bolt / v0 / Replit Agent). The page must show what it looks like, what makes it different, who it's for, and what it costs.

### Hero specifics
- Big screenshot or a 15-second auto-playing screencast of the tool in action.
- Tool category chip: `IDE` / `App builder` / `CLI agent` / `Extension` / `Terminal`.
- Pricing pill: `Free`, `$20/mo`, `BYOK`, `Open source`.
- Platform chips: 🍎 Mac · 🪟 Windows · 🐧 Linux · 🌐 Web · 📱 iOS · 🤖 Android.

### Zone 5 — type-specific blocks

**Screenshots gallery**

Horizontal scrollable strip of 6–10 high-res screenshots showing different views (file editor, agent panel, MCP integration, settings). Click any → lightbox.

**"What it does" three-pillar block**

Three short cards: how it edits, how it agents, how it integrates. 1 sentence each, with a screenshot snippet.

**Pricing table**

```
┌────────────────────────────────────────────────────┐
│ Free                Pro              Team           │
│ $0                  $20/mo            $40/user/mo   │
│                                                     │
│ Limited completions  Unlimited        Unlimited     │
│ Cursor Tab           Background agents Background   │
│ —                    Agent Composer    Composer     │
│ —                    1,500 fast/mo     Unlimited fast│
│ —                    Premium models    Premium      │
│ Community support    Priority email    SSO + Admin  │
└────────────────────────────────────────────────────┘
```

**Models supported**

A grid of model logos showing which the tool supports natively, plus "BYOK supported" / "OpenRouter supported" badges.

**Open in tool button**

If we can deep-link the tool to itself: `cursor://` or `code://` etc. Otherwise a download button with platform auto-detection.

**Real-world performance**

Telemetry-sourced per-task averages from our gateway: average tokens per session, average cost per session, average session duration. Same chart that appears on model pages, inverted (model → tool instead of tool → model).

**Comparison strip**

Side-by-side: name, primary differentiator, pricing, top model. "Cursor (this) vs Windsurf vs Zed vs Cline."

### Best-in-class moves
- Pricing table is honest about what each tier actually unlocks (no marketing fog).
- Real-world performance: actual telemetry, not vendor claims.
- "Models supported" grid clickable — go to model page and back.

### Dummy data
- **Name:** "Cursor"
- **Tagline:** "The AI code editor. Forked from VS Code, rebuilt for agents."
- **Category:** IDE
- **Platforms:** Mac, Windows, Linux
- **Pricing:** Free / Pro $20 / Business $40 / Enterprise contact
- **Default models:** GPT-5, Claude Opus 4.7, Sonnet 4.6, Gemini 3.1 Pro
- **BYOK:** ✅
- **Open source:** ❌
- **Telemetry avg:** $0.41/session, 8.2K tokens, 12 min duration

---

## §6 Deals — `/deals/[slug]`

### What this page is for
Users arrived from the deals index, a news article, or organic search ("AWS startup credits"). They want to know: am I eligible, what do I do, what's the catch, and how long do I have?

### Hero specifics
- Massive value statement: **$10,000** in DigitalOcean credits.
- Provider logo + name.
- Tier badge: `PUBLIC` / `MEMBER` / `PRO`.
- Expiry: "Expires Jan 31, 2027" or "Ongoing".
- Primary CTA: `[Apply now ↗]` (opens partner form in new tab AND records claim).

### Stats strip (deal-specific)
- 💰 Value
- 👥 Claims (lifetime)
- ✅ Approval rate (community-reported)
- ⏱ Avg approval time
- 📅 Expires in
- 🏷 Tier

### Zone 5 — type-specific blocks

**Eligibility checklist**

```
Are you eligible?
  ☐ Pre-seed to Series A
  ☐ Less than 5 years old
  ☐ Less than $5M raised
  ☐ Less than 50 employees
  ☐ Have not previously claimed this deal

[All boxes checked? → Apply now]
[Not sure? → Read full requirements]
```

The checkboxes don't *enforce* — they're informational. But they help users self-qualify before they spend 20 minutes on a partner application.

**Step-by-step redemption guide**

```
1. Click [Apply now] — opens DigitalOcean's startup form.
2. Fill out company info (5 min).
3. Use referral code: VCH-2026 (auto-applied via our link).
4. Submit. Approval typically takes 3–5 business days.
5. Once approved, you'll get $10K credits posted within 24h.
   Use within 12 months.

⚠️ Common reasons applications get rejected:
   • Personal email instead of company domain
   • Missing company website
   • Already claimed via another partner
```

**What you get**

A list breakdown:
- $10,000 in DigitalOcean credits
- Free Droplet for first month (any size)
- Priority support during evaluation
- Access to DO startup community Slack

**Other deals from this provider**

A strip of cards showing what else this provider offers (e.g. AWS Activate has tiers).

**Reviews from members who claimed**

Short testimonials: "Approved in 4 days. Used $4K in the first month for our staging cluster."

### Best-in-class moves
- Eligibility self-check upfront saves wasted applications.
- Redemption guide demystifies the partner's process — most deal sites just dump a link.
- Tracking the user's claim through stages (started → approved → redeemed) so we can email them when it expires.

### Locked Pro deal state

If the user is on Free or Member tier and this is a Pro deal:

```
┌────────────────────────────────────────┐
│ DigitalOcean Hatch                      │
│ $10,000 in cloud credits                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     🔒 Pro deal                    │  │
│  │                                    │  │
│  │  Unlock with Pro — $99/year        │  │
│  │  This deal alone is 100x the cost. │  │
│  │  + $4M+ in other Pro deals.        │  │
│  │                                    │  │
│  │  [Upgrade to Pro]                  │  │
│  │  14-day money-back guarantee.      │  │
│  └───────────────────────────────────┘  │
└────────────────────────────────────────┘
```

The blur effect on the locked card body shows 1–2 pixels of the deal underneath — like a window, not a wall.

### Dummy data
- **Title:** "DigitalOcean Hatch — $10K cloud credits"
- **Provider:** DigitalOcean
- **Value:** $10,000
- **Tier:** PRO
- **Eligibility:** Pre-seed to Series A, <5y old, <$5M raised
- **Approval rate:** 78% (from 412 community reports)
- **Avg approval time:** 3.2 days
- **Expires:** Ongoing
- **Claims this month:** 89

---

## §7 News — `/news/[slug]`

### What this page is for
A news item is one of: ecosystem story, auto-generated release note, auto-generated price-change item, editorial op-ed. The page renders the content with full citations and links to every resource mentioned.

### Hero specifics
- Hero image (16:9 ratio, with sensible cropping).
- Kind badge: `Ecosystem` / `Release` / `Price change` / `Tutorial` / `Op-ed`.
- Source badge: official blog (with logo) / our editorial / auto-generated 🤖.
- Published date + reading time.
- Primary CTAs: `[Read original ↗]` (only on ecosystem stories) and `[Subscribe to digest]`.

### Zone 5 — type-specific blocks

**Article body**

Markdown-rendered, max 720px reading width, generous line-height. Inline images, code blocks with syntax highlighting, callouts for important quotes, embedded charts where data appears.

**Resources mentioned**

A sidebar (right rail on desktop, fold-out on mobile) listing every resource referenced in the article. Each is a small card with one-click "View" or "Install".

**For price-change stories specifically**

Auto-rendered price comparison chart inside the article body:

```
GPT-5 input cost — last 30 days
$5 ────────────────────────────────────
   ╲
$4  ╲___
        ╲
$3       ╲╱╲___╲___ ← today $3.50
$2 ────────────────────────────────────
        Apr 15           May 8
```

**For release stories specifically**

Auto-rendered release notes with version diff vs previous, capability changes highlighted.

**Newsletter promo (inline)**

Mid-article, a single-line promo: "Get this kind of news weekly. → Subscribe."

**Comments**

Threaded discussion on the article, ordered by upvotes.

### Best-in-class moves
- Auto-generated stories cite their data sources in the article body, so readers can verify numbers.
- Resources-mentioned sidebar lets readers act on the news immediately, not weeks later.
- Inline newsletter promo without being annoying.

### Dummy data
- **Title:** "Anthropic drops Claude Opus 4.7 input pricing 30%"
- **Kind:** Price change
- **Source kind:** auto-generated 🤖
- **Published:** 2 hours ago
- **Reading time:** 1 min
- **Body:** "Anthropic's Claude Opus 4.7 input cost dropped from $5/Mtok to $3.50/Mtok today, a 30% reduction. Output and cached pricing remain unchanged. The change brings Opus 4.7 to within 12% of Gemini 3.1 Pro on blended cost…"
- **Resources mentioned:** Claude Opus 4.7 (model), Anthropic API (provider)

---

## §8 Guides — `/[resource-slug]/guides/[guide-slug]`

### What this page is for
A user just landed in install or usage mode. They want to follow steps, copy commands, verify each step worked, and finish. The page is a focused-reading environment, not a directory page.

### Layout
Different from other detail pages — this is the only type that uses **focused-reading mode**. The site header dims, the page becomes two columns (sticky 280px sidebar + 720px reading column).

### Hero specifics
- Title.
- Difficulty badge (`🟢 Beginner` / `🟡 Intermediate` / `🔴 Advanced`).
- Duration estimate (`⏱ 5 min`).
- Prerequisites (collapsible): "Node 18+, macOS 13+".
- Last verified by us (`Verified working as of May 8, 2026`).

### Zone 5 — type-specific blocks

**Sticky progress sidebar**

```
Install Qwen 2.5 Coder 32B
on macOS via Ollama

PROGRESS  ▓▓▓░░░  3/6 steps

✓ 1. Install Ollama
✓ 2. Pull the model
✓ 3. Run a test query
○ 4. Connect to Cursor
○ 5. Configure your rules
○ 6. Verify it works

[Mark step complete]
[Step didn't work? →]
```

**Step-by-step body (centre column)**

Each step is a card:

```
## Step 1: Install Ollama

Ollama is a CLI tool that runs LLMs locally. Open Terminal
and run:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```                                            [⎘ Copy]

**Verify it worked:** run `ollama --version`

[▶ Run check via gateway]      Expected: 0.x.x or higher

[ Mark step complete ]   [ Step didn't work? ]
```

**Run check** is the verifier:
- If user has connected the gateway agent: runs the probe, returns the result inline.
- Otherwise: shows expected output, asks user to paste their result for matching.

**"Step didn't work?" drawer**

A right-rail drawer slides in with troubleshooting. Common errors mined from `guide_completions.failure_reason` table — e.g. "If you see `command not found: ollama`, your PATH may not include `/usr/local/bin`. Try…"

**Help improve this guide**

Bottom of page: "Found a step that's outdated? → Submit a fix" — opens an editorial form.

### Best-in-class moves
- Real-time verifier separates working installs from "looks fine but isn't."
- Troubleshooting drawer with crowdsourced fixes — gets smarter the more it's used.
- Crowdsourced edits keep guides fresh as resources update.

### Dummy data
- **Title:** "Install Qwen 2.5 Coder 32B on macOS via Ollama"
- **Difficulty:** Beginner
- **Duration:** 5 min
- **Prerequisites:** macOS 13+, 24GB RAM minimum, 20GB disk
- **Steps:** Install Ollama → Pull model (4 min download) → Run test query → Connect to Cursor → Configure rules → Verify
- **Completions:** 1,247 (94% completed all steps)

---

## §9 Skills — `/skills/[slug]`

### What this page is for
A user wants a reusable agent skill (SKILL.md format). They need to see the skill content, understand when it triggers, fork it, and install it to their `.claude/skills/` directory.

### Hero specifics
- Skill name in monospace.
- Invocation mode badges: `Auto-invoke` / `Manual` / `Both`.
- Allowed-tools chips: `Read`, `Write`, `Bash`, `WebFetch`.
- Compatible clients: which agents support SKILL.md format (Claude Code, Codex, ChatGPT, Cursor experimental).
- Install button: `claude skill install @vch/secret-detector` (one-line CLI for Claude Code; per-client variants for others).

### Zone 5 — type-specific blocks

**SKILL.md viewer (full-width, the heart of the page)**

```
─── frontmatter ─────────────────────────
name: secret-detector
description: Catches secrets before commit
disable-model-invocation: false
allowed-tools: Read, Bash
─── content ─────────────────────────────
You are a security-aware reviewer. Before
any git commit, scan staged files for...
─────────────────────────────────────────
```

Rendered with markdown formatting, syntax highlighting on the frontmatter, and inline copy.

**Triggers**

What makes this skill auto-fire:
- "When user runs `git commit`"
- "When user asks about staging files"
- "When agent is about to write to .env files"

**Fork to my account button**

Big, prominent. Clicking forks the skill into the user's namespace, opens an inline editor for tweaking, saves under their account.

**Pairs well with subagents**

A grid showing which subagents commonly use this skill (forked from `resource_dependencies`).

**Test the skill**

A mini playground that runs Claude Code with this skill enabled, on a sample task:

```
Try this skill on:
  ◉ "Commit my staged files"
  ◯ "Review src/auth/oauth.ts"
  ◯ "Custom prompt: [_______________]"

[▶ Run]
─────────────────────────────────────────
[claude] reading staged files...
[claude] DETECTED: API key on line 24 of .env
[claude] Refusing commit. Suggestion: ...
```

### Best-in-class moves
- Test the skill before installing — competitor skill directories don't.
- Fork mechanism with full lineage (`forked_from_id` from schema).
- Triggers are explicit, not buried in description.

### Dummy data
- **Name:** "secret-detector"
- **Tagline:** "Catches secrets in staged files before commit. Saved my bacon 12 times this month."
- **Author:** @sergeicodes
- **Triggers:** git commit · staging files · .env writes
- **Allowed tools:** Read, Bash
- **Compatible:** Claude Code (native), Codex, ChatGPT
- **Forks:** 47
- **Installs (7d):** 612

---

## §10 Rules — `/rules/[slug]`

### What this page is for
A user wants a `.cursorrules` / `.windsurfrules` / `CLAUDE.md` / `AGENTS.md` file. They need to see exactly what rules are in there, fork to tweak, and install (drop into their project root).

### Hero specifics
- Rule format badge: `cursorrules` / `mdc` / `windsurfrules` / `claude-md` / `agents-md`.
- Scope: `Global` / `Project` / `Subdirectory`.
- Globs (if applicable): `**/*.tsx`, `src/**/*`.
- Stack chips: which frameworks this rules file targets (Next.js + Tailwind + Convex).
- Install button: drops the file into the user's project (gateway-assisted) or copies content + path to clipboard.

### Zone 5 — type-specific blocks

**Diff viewer (full-width)**

```
.cursorrules                              [⎘ Copy file]
─────────────────────────────────────────
You are a TypeScript-first React developer
working on a Next.js 15 + Convex project.

CODING STYLE:
- Use server components by default
- Mark client components with 'use client'
+ Always use convex/react hooks (NEW)
- Tailwind v4 utilities only, no @apply
- Zod for all schema validation
─────────────────────────────────────────
```

Show as a diff vs the closest "vanilla" cursorrules so users see what's customised.

**Compatible IDEs grid**

Each rule format works with specific IDEs. Show which:

```
✅ Cursor (.cursorrules)        — works as-is
⚠️ Windsurf (.windsurfrules)   — needs minor edit
✅ Claude Code (CLAUDE.md)      — works as-is via /init
❌ Cline                        — doesn't support this format yet
```

**Fork to my account**

Same as skills. Edit inline, save under user.

**Real-world feedback**

"Users with this rule file report 23% fewer 'wrong-framework' suggestions from Cursor compared to no rules." (Sourced from `compatibility_reports` and `install_events` from schema.)

**Pairs well with starter kits**

Cross-link to starter kits that come pre-configured with this rules file.

### Best-in-class moves
- Diff viewer vs vanilla makes the rule's value obvious.
- Real-world impact data sets us apart from cursor.directory's flat list.
- Per-IDE compatibility matrix — most rules don't translate cleanly across IDEs.

### Dummy data
- **Name:** "Next 15 + Convex + Tailwind v4"
- **Tagline:** "Battle-tested rules for the modern T3-style stack."
- **Format:** cursorrules
- **Compatible:** Cursor ✅, Windsurf ⚠️, Claude Code ✅
- **Lines:** 142
- **Forks:** 89
- **Stars:** 1.4K
- **Real impact:** "23% fewer wrong-framework suggestions"

---

## §11 Plugins — `/plugins/[slug]`

### What this page is for
A user wants a bundle of skills + MCPs + commands + hooks distributed as one installable unit. They need to see what's inside, install it via marketplace command, and understand what it adds to their setup.

### Hero specifics
- Plugin name in monospace.
- Marketplace badge linking to source marketplace (e.g. `from buildwithclaude`).
- Bundle counts: `4 skills · 2 MCPs · 6 commands · 3 hooks · 1 agent`.
- Install button: `claude plugin install @marketplace/plugin-name`.

### Stats strip overrides
- 📦 Bundled count (e.g. "16 components")
- 🍴 Forks
- 🟢 Verified
- ⚡ Updated

### Zone 5 — type-specific blocks

**Bundled resources grid**

Five sub-grids — one per bundled type:

```
SKILLS (4)
[skill card] [skill card] [skill card] [skill card]

MCPS (2)
[mcp card] [mcp card]

COMMANDS (6)
[/refactor] [/test] [/deploy] [/scaffold] [/audit] [/release]

HOOKS (3)
[pre-commit] [post-tool] [session-start]

AGENTS (1)
[code-reviewer subagent]
```

Each card links to its own detail page within the plugin context (so user can read the skill spec, fork a hook, etc.).

**Install matrix**

Per-client install paths. Plugins differ from MCPs — they install via Claude Code marketplace command, not deeplinks:

```
Claude Code      `claude plugin install @bwc/full-stack-orchestration`
Cursor           Manual install per resource (no plugin format)
Windsurf         Manual install per resource (no plugin format)
```

**What this plugin adds to your setup**

Visual diagram (conceptual ASCII or designed graphic) showing: "Before plugin: 4 things in your `.claude/`. After plugin: 16 things, organised into 4 commands and 1 agent."

**License & attribution**

Plugins often bundle resources with mixed licenses. Surface this clearly: "This plugin contains 4 MIT-licensed components and 1 Apache-2.0 component."

### Best-in-class moves
- Visual diff of "before / after" install — most users have no idea what a plugin actually changes.
- License surfacing is a unique differentiator for enterprise users.
- Each bundled item is browsable individually.

### Dummy data
- **Name:** "full-stack-orchestration"
- **Marketplace:** buildwithclaude
- **Tagline:** "Multi-agent workflows for full-stack apps. Includes 4 specialised agents and 16 skills."
- **Bundled:** 4 skills, 2 MCPs, 6 commands, 3 hooks, 1 agent
- **Compatible:** Claude Code only (plugin format)
- **Installs (7d):** 1,247
- **License:** MIT (with 1 Apache-2.0 component)

---

## §12 Hooks — `/hooks/[slug]`

### What this page is for
A user wants a lifecycle hook (pre/post tool use, session start/stop, user prompt submit). They need to see the script, understand which events it matches, and install it.

### Hero specifics
- Event badge: `pre_tool_use` / `post_tool_use` / `session_start` / `stop` / `user_prompt_submit`.
- Matcher rules: which tools this hook responds to (`Bash`, `Edit`, `Write` — or all).
- Script language: `bash` / `python` / `node`.
- Compatible clients: typically Claude Code (other clients have limited hook support).

### Zone 5 — type-specific blocks

**Event flow diagram**

```
┌──────────┐    ┌─────────┐    ┌──────────────┐    ┌──────────┐
│ User msg │ → │ Pre-hook │ → │ Tool runs    │ → │ Post-hook│
└──────────┘    │  (this)  │    │ (e.g. Edit) │    └──────────┘
                └─────────┘    └──────────────┘
```

The hook's position in the lifecycle, visually obvious.

**Script viewer**

Full script with syntax highlighting and inline copy:

```bash
#!/usr/bin/env bash
# pre-tool-use hook: prevent edits to .env files

if [[ "$1" == *.env* ]]; then
  echo "BLOCKED: Refusing to edit .env files."
  exit 1
fi
exit 0
```

**Matcher configuration**

Show the JSON config that registers the hook:

```json
{
  "hooks": {
    "pre_tool_use": [{
      "matcher": { "tool": "Edit|Write", "path": "*.env*" },
      "command": "./hooks/no-env-edit.sh"
    }]
  }
}
```

**Test in sandbox**

A mini sandbox: paste a sample tool call, the hook runs against it, you see whether it'd be blocked or allowed.

```
Test this hook
Tool:    [Edit ▾]
Path:    [.env.local]
[▶ Test]

Result: 🛑 BLOCKED — "Refusing to edit .env files."
```

**Pairs well with**

Other hooks in the same lifecycle stage; skills that complement this hook.

### Best-in-class moves
- Visual lifecycle position — most hook docs are confusing about *when* a hook fires.
- Test sandbox before installing — users see exactly what gets blocked.
- Matcher config rendered separately from the script for clarity.

### Dummy data
- **Name:** "no-env-edit"
- **Tagline:** "Block any tool from writing to `.env` files. Five lines, one peace of mind."
- **Event:** pre_tool_use
- **Matcher:** Edit | Write, paths matching `*.env*`
- **Language:** bash
- **Installs (7d):** 234

---

## §13 Starters — `/starters/[slug]`

### What this page is for
A user wants a SaaS boilerplate. They need to see what's in it, deploy a demo, fork to GitHub, and install rules files for their AI IDE.

### Hero specifics
- Live demo iframe (320×200 thumbnail in hero, full-width below).
- Stack chips: framework + database + auth + payments + email + deploy target.
- Has-rules badges: `✅ .cursorrules` `✅ CLAUDE.md` `❌ AGENTS.md`.
- Deploy buttons: `Deploy to Vercel`, `Deploy to Netlify`, `Clone to Replit`, `Open in StackBlitz`.

### Zone 5 — type-specific blocks

**Live demo (full-width iframe, 16:9)**

The actual deployed demo runs inline. Users click around in the demo without leaving our page.

**What's included**

A structured tree showing the project structure:

```
my-saas-starter/
├── app/                  ← Next.js 15 App Router
│   ├── auth/             ← Better Auth integration
│   ├── (dashboard)/      ← Protected routes
│   └── api/
├── convex/               ← Convex backend
├── components/           ← shadcn-styled
├── .cursorrules          ✅ Pre-configured
├── CLAUDE.md             ✅ Pre-configured
├── package.json
└── README.md
```

**Stack details**

Per-service breakdown:
- **Framework:** Next.js 15 (App Router)
- **Database:** Convex (free tier covers MVP)
- **Auth:** Better Auth (with email + Google + GitHub OAuth)
- **Payments:** Stripe (subscriptions)
- **Email:** Resend (with React Email templates)
- **Deploy:** Vercel (one-click)
- **Cost to run:** $0/mo on free tiers, ~$20/mo with paid Convex when you hit scale

Each chip clickable to that backend kit's detail page.

**Time to first deploy**

Honest timer: "Most users go from clone to deployed in **9 minutes**." Median pulled from `guide_completions`.

**Pairs well with**

The rules file that comes pre-configured (also lives as its own resource), MCPs that match this stack, components from the directory that drop in, prompt recipes optimised for this stack.

**Recent deploys**

A small public log: "Deployed 14 times in the past 24 hours." Trust signal that this thing works.

### Best-in-class moves
- Live demo iframe — no other directory does this for starters.
- "Time to first deploy" with real telemetry.
- Stack details show *cost to run*, not just service names.

### Dummy data
- **Name:** "Next 15 + Convex SaaS Starter"
- **Tagline:** "Auth, payments, email, dashboard. Deploy in 10 minutes."
- **Stack:** Next.js 15, Convex, Better Auth, Stripe, Resend, Vercel
- **Has rules:** `.cursorrules`, `CLAUDE.md`
- **Stars:** 4.7K
- **Deploys (24h):** 14
- **Time to first deploy median:** 9 min

---

## §14 Observability — `/observability/[slug]`

### What this page is for
A user is choosing a tool to monitor or evaluate their LLM/agent app. They need to see features, integrations, and pricing.

### Hero specifics
- Feature chips: `Tracing`, `Evals`, `Prompt mgmt`, `Dashboards`, `A/B testing`.
- Self-hostable badge if applicable.
- Free-tier badge if applicable.
- Integrations chips: which model providers and frameworks it supports.

### Zone 5 — type-specific blocks

**Dashboard screenshots**

A horizontal carousel of 4–6 high-res screenshots of the actual dashboard. Each captioned with the feature it shows.

**Features matrix**

```
                          This tool   Alt 1   Alt 2
Tracing                       ✅       ✅      ✅
Evals (LLM judges)            ✅       ⚠️       ❌
Prompt management             ✅       ❌      ✅
A/B testing                   ✅       ❌      ⚠️
User feedback capture         ⚠️       ✅      ❌
Self-hostable                 ✅       ❌      ✅
Free tier                     ✅       ✅      ✅
SOC2 compliant                ✅       ✅      ⚠️
```

**Integrations grid**

Logo grid of: model providers (Anthropic, OpenAI, Google, AWS), frameworks (LangChain, LlamaIndex, Vercel AI SDK), and observability targets (DataDog, Slack, PagerDuty).

**Pricing**

Identical pattern to the Tools page (free / pro / team / enterprise tiers).

**Quick-start integration**

Inline code snippet showing how to add this tool to an existing project:

```typescript
import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  publicKey: "pk-...",
  secretKey: "sk-...",
});

// Wrap your LLM calls
langfuse.trace({ name: "user-query", input: prompt })
```

**Real-world performance**

If we have telemetry through our gateway: "Users running this tool see X% lower error rates after 2 weeks."

### Best-in-class moves
- Features matrix vs alternatives — competitive truth, not vendor self-praise.
- Quick-start snippet right on the detail page; click to copy.
- Integration grid is clickable — go to the related model/framework page.

### Dummy data
- **Name:** "Langfuse"
- **Tagline:** "LLM engineering platform. Open-source observability and prompt management."
- **Features:** Tracing, Evals, Prompts, Datasets, Playground
- **Self-hostable:** ✅
- **Free tier:** Up to 50K observations/mo
- **Integrations:** Anthropic, OpenAI, LangChain, LlamaIndex, Vercel AI SDK, Mistral
- **Pricing:** Free / Core $59/mo / Pro $199/mo / Enterprise

---

## §15 Backend Kits — `/backend/[slug]`

### What this page is for
A user is choosing the building blocks of their app: auth, database, payments, email. They need to see what it does, what it costs, and whether it ships with rules files for their AI IDE.

### Hero specifics
- Backend-kind badge: `Auth` / `DB` / `Payments` / `Email` / `Storage` / `Realtime` / `Search` / `Full-stack`.
- Free-tier badge.
- Has-rules badge: `✅ Ships with .cursorrules` (a unique differentiator for AI-aware backends).
- Primary language chip.

### Zone 5 — type-specific blocks

**What it replaces**

A clear "instead of" framing:

```
This replaces:
  • Auth0 / Clerk (for auth)
  • RDS / DynamoDB (for database)
  • S3 (for file storage)

For projects under 100K MAU, all of the above can be replaced
by this one service for $0–$25/mo.
```

**Pricing tiers**

Honest breakdown with real-usage examples:

```
Free       $0       50K MAU, 500MB DB, unlimited requests
Pro        $25/mo   100K MAU, 8GB DB, daily backups
Team       $599/mo  500K MAU, 100GB DB, priority support
```

**Code examples**

Tabbed snippets: connect, query, mutate, listen-to-changes. Copy-friendly, language-toggleable (TS / Python / Go).

**Compatible AI IDEs**

If this backend ships with rules files, surface the link:

```
✅ Ships with .cursorrules pre-configured
✅ Ships with CLAUDE.md pre-configured
   → View rules file
```

**Pairs well with**

Starter kits that use this backend (cross-linked).

**Real-world cost calculator**

Inline calculator: "If you have X users making Y requests/day, this costs $Z/mo." Same UX as the model cost calculator but for SaaS scaling.

**Migration guides**

"Migrating from Firebase? → 12-min guide." "Migrating from Supabase? → 8-min guide." Cross-link to guides.

### Best-in-class moves
- "What it replaces" framing matches how vibe coders think.
- Real-world cost calculator with workload presets.
- Migration guides surfaced prominently — most users are already on something else.

### Dummy data
- **Name:** "Convex"
- **Tagline:** "The reactive backend for vibe-coded apps. Database + functions + auth + storage."
- **Kind:** Full-stack
- **Free tier:** ✅ (1GB DB, unlimited reads, 1M function calls/mo)
- **Ships with rules:** `.cursorrules`, `CLAUDE.md`, `AGENTS.md`
- **Languages:** TypeScript, Python (preview)
- **Pricing:** Free / Pro $25/mo / Team $599/mo
- **Used by:** 14,200 projects in our directory

---

## §16 Assets — `/assets/[slug]`

### What this page is for
A user wants design assets — icons, illustrations, fonts, Lottie files, gradients, 3D meshes. They need to see them, download them, and use them with confidence on the licensing.

### Hero specifics
- Asset-kind badge: `Icon set` / `Illustration` / `Font` / `Shader` / `Lottie` / `3D` / `Gradient`.
- Asset count: "1,847 icons in 4 styles".
- Format chips: `SVG`, `PNG`, `Figma`, `Sketch`, `Lottie JSON`.
- License badge: `MIT` / `CC0` / `CC-BY` / `Commercial`.

### Zone 5 — type-specific blocks

**Preview grid (full-width, the heart of the page)**

For an icon set: a giant searchable grid of icons.
- Search bar at top: "search 1,847 icons".
- Filter chips: stroke (thin / regular / bold), category (UI / commerce / weather…).
- Each icon hoverable; click → opens a modal with: SVG preview at large size, the SVG code, copy buttons (SVG / JSX / Vue / React component), download formats.

For an illustration pack: a masonry grid of full illustrations.
For a font: a typography specimen sheet — every weight, every glyph table.
For Lottie: a row of animated previews playing in loop.
For a 3D pack: WebGL previews rotating slowly.
For gradients: a grid of gradient swatches with copy-CSS-to-clipboard.

**License clarity**

```
License: MIT
✅ Use commercially
✅ Modify and redistribute
✅ Use in client work
❌ Resell as-is

Attribution required: No (but appreciated).

Read full license →
```

This is far better than competitors' vague licensing.

**How to install**

Asset-specific install paths:
- Icon set: `npm install lucide-react` + import snippet.
- Font: download `.woff2` files + `@font-face` snippet OR Google Fonts `<link>`.
- Illustration pack: download as ZIP or import via Figma plugin.
- Lottie: download JSON or use CDN URL.

**Pairs well with**

Components that ship with this asset already (e.g. components using Lucide icons).

### Best-in-class moves
- Searchable preview grid for icon sets — most asset directories show 12 icons and force a download to see the rest.
- Per-icon copy as JSX/Vue/React component — saves the user converting SVG manually.
- License clarity unique vs sites that bury the license in a footer.

### Dummy data
- **Name:** "Lucide"
- **Tagline:** "1,847 carefully crafted open-source icons. Successor to Feather."
- **Kind:** Icon set
- **Count:** 1,847 icons, 4 stroke weights
- **Formats:** SVG, React, Vue, Svelte, Solid, Preact, Flutter, Font
- **License:** ISC (essentially MIT)
- **Used by:** 23,000+ projects in our directory

---

## §17 Docs-for-LLMs — `/docs-for-llms/[slug]`

### What this page is for
A user wants up-to-date docs feed for an LLM (`llms.txt`, Context7 entry, or structured docs). They need to see what's in the docs, install the URL into their AI's rules, and trust that it's fresh.

### Hero specifics
- Doc-kind badge: `Library` / `Framework` / `API` / `Platform`.
- Package name in monospace.
- Last updated: "Auto-refreshed 4h ago".
- Coverage badge: "Covers 247 doc pages, 1.2M tokens".
- Install button: copies the `llms.txt` URL or `Context7` ID to clipboard with a "Add to my .cursorrules" suggestion.

### Zone 5 — type-specific blocks

**Coverage breakdown**

```
What this docs feed includes
  ✅ API reference (89 pages)
  ✅ Quickstart guides (12 pages)
  ✅ Tutorials (34 pages)
  ✅ Examples (47 pages)
  ⚠️ Blog posts (last 90 days only)
  ❌ Videos (not parsed)

Last full re-crawl: 4 hours ago
Total tokens: 1.2M
```

**Sample preview**

A scrollable preview of the first ~5KB of the `llms.txt` file. Renders as plaintext with syntax highlighting where appropriate.

**Add to my AI IDE**

Per-IDE install instructions:

**Cursor:** Add this to your `.cursorrules`:
```
Always use Context7 when I need Convex documentation.
Use library ID: /convex-dev/convex
```

**Claude Code:** Add this MCP server: `[Install Context7 MCP →]`

**Direct fetch:** `curl https://context7.com/convex-dev/convex/llms.txt`

**Freshness signal**

A timeline showing the last 7 re-crawls and their delta sizes. Trust signal that this isn't stale.

**Pairs well with**

The MCP server (Context7 itself), rules files that reference this doc, models that benefit from this context.

### Best-in-class moves
- Coverage breakdown removes ambiguity about what's actually in the feed.
- Per-IDE install with specific snippets — most directories just show the URL.
- Freshness timeline as trust signal.

### Dummy data
- **Name:** "Convex llms.txt"
- **Tagline:** "Always-fresh Convex docs for your AI IDE. Auto-refreshed 6× per day."
- **Kind:** Framework
- **Package:** convex-dev/convex
- **Coverage:** 247 pages, 1.2M tokens
- **Last refresh:** 4h ago
- **Provider:** Context7

---

## §18 Workflows — `/workflows/[slug]`

### What this page is for
A user wants an end-to-end recipe — "Solo SaaS MVP in a weekend with Cursor + supastarter + Supabase + Stripe." They follow the steps, install resources along the way, and ship.

### Hero specifics
- Outcome chip: `SaaS MVP` / `Landing page` / `Automation` / `Game` / `Content`.
- Difficulty: `🟢 Beginner` / `🟡 Intermediate` / `🔴 Advanced`.
- Duration: `Weekend` / `One day` / `One hour`.
- Step count: `12 steps`.

### Zone 5 — type-specific blocks

**Vertical stepper (full-width, the heart of the page)**

```
1 ── Pick a starter kit
     [Next 15 + Convex SaaS Starter]  ← embedded resource card
     ⏱ 2 min · "Clone to your machine"

2 ── Add the AI rules
     [.cursorrules for Next + Convex]  ← embedded resource card
     ⏱ 1 min

3 ── Set up auth
     [Better Auth backend kit]  ← embedded resource card
     ⏱ 5 min · "Run npx better-auth init"

4 ── Wire up payments
     [Stripe backend kit]  ← embedded
     [stripe-payments MCP]  ← embedded MCP
     ⏱ 10 min

...

12 ── Deploy
      [Deploy to Vercel] button
      ⏱ 2 min · "First deploy is the easiest"
```

Each step is a card containing:
- Step number + title
- An embedded resource card (the resource the user will install at this step)
- Duration estimate
- A short instruction
- "Mark step complete" / "Skipped this step" buttons (logged-in users — feeds telemetry)

**Time to complete**

A horizontal timeline showing where users typically slow down. "Most users finish steps 1–6 in 47 minutes. Step 7 (Stripe webhooks) is where 23% pause." Sourced from `guide_completions`.

**The prompts that worked**

Specific prompts to paste into Cursor / Claude Code / Windsurf at each step:

```
Step 4 prompt for Cursor:
"Create a Stripe subscription flow with monthly/yearly billing.
 Use the Stripe MCP I just installed. Generate the webhook handler,
 the customer portal page, and the pricing component."
```

**Real outcomes**

A strip of showcase cards: "Things people built with this workflow." Each links to its showcase page.

### Best-in-class moves
- Embedded resource cards mean the user installs as they go — no tab-switching.
- Telemetry-driven "where people pause" is a unique value-add.
- Specific prompts per step — most workflows are vague about *what to ask the AI*.

### Dummy data
- **Title:** "Solo SaaS MVP in a Weekend"
- **Outcome:** SaaS MVP
- **Difficulty:** Intermediate
- **Duration:** Weekend (12–18 hours)
- **Steps:** 12
- **Resources used:** 1 starter, 2 rules files, 4 backend kits, 3 MCPs, 6 prompts
- **Completions:** 1,247 (78% finish all steps)
- **Median time:** 14h 22m

---

## §19 Evals — `/evals/[slug]`

### What this page is for
A user (often technical, often building AI products) wants to find a benchmark or eval set. They need to see the methodology, the leaderboard, and how to reproduce it on their own model.

### Hero specifics
- Benchmark-kind badge: `SWE-Bench` / `AGENTbench` / `Custom` / `Golden tasks`.
- Task count: "303 tasks".
- Reproducibility badge: `🟢 Reproducible` / `⚠️ Closed`.
- Leaderboard URL link.

### Zone 5 — type-specific blocks

**Leaderboard table**

Top 20 models on this benchmark, sortable. Each row: model name (with link to model page), score, methodology variant, date measured, source link.

```
Rank  Model              Score   Method          Date         Source
#1    GPT-5.5 (xhigh)    71.4%   Pass@1          Apr 2026     [link]
#2    Claude Opus 4.7    68.2%   Pass@1          Apr 2026     [link]
#3    Gemini 3.1 Pro     66.8%   Pass@1          Apr 2026     [link]
...
```

**Methodology**

Plain-English explanation of what's measured, with the official paper / technical report linked.

**Sample tasks**

3–5 sample tasks from the benchmark, fully shown. Builds trust that the benchmark is testing real things, not gaming.

```
Sample task #142
"Fix the bug where the test runner hangs on async fixtures
 in pytest-asyncio. Submit a PR that passes the existing
 regression test."

Repository: pytest-dev/pytest-asyncio
```

**Reproduce locally**

A code block showing how to run this benchmark on a model:

```bash
git clone https://github.com/swe-bench/SWE-bench
cd SWE-bench
python -m swebench.run --model claude-opus-4-7 --tasks 1-50
```

**Critique**

A short editorial section on where this benchmark fails — saturation, distribution shift, gaming patterns. Honest assessment, not just promotion.

### Best-in-class moves
- Live leaderboard pulled from sources, with source links per row.
- Sample tasks for transparency.
- "Critique" section is rare and valuable — gives users a real sense of how to weight this benchmark.

### Dummy data
- **Name:** "SWE-Bench Verified"
- **Kind:** SWE-Bench
- **Task count:** 500
- **Reproducible:** ✅
- **Last updated:** 3 weeks ago
- **Top score:** 71.4% (GPT-5.5 xhigh)
- **Methodology:** Pass@1 with verified solutions

---

## §20 Subagents — `/subagents/[slug]`

### What this page is for
A user wants a Claude Code subagent — a specialised agent with its own tool access, model assignment, and proactive behaviours. They need to see the agent.md, fork to tweak, and install.

### Hero specifics
- Model assignment: `Inherits from main` / `sonnet` / `opus` / `haiku`.
- Tool access chips: `Read`, `Write`, `Bash`, `WebFetch`.
- Proactive flag: `🤖 Use proactively`.
- Context isolation badge: `Isolated context` (most are).

### Zone 5 — type-specific blocks

**agent.md viewer (full-width)**

```
─── frontmatter ─────────────────────────
name: code-reviewer
description: Expert code review specialist.
  Proactively reviews code for quality,
  security, and maintainability.
tools: Read, Grep, Glob, Bash
model: inherit
─── system prompt ───────────────────────
You are a senior code reviewer ensuring
high standards of code quality...
─────────────────────────────────────────
```

**When to use this**

Plain-English: "Use this subagent for…" A bullet list of when Claude Code should delegate to it. This is where the proactive triggers from the agent's description get expanded with examples.

**Test the agent**

A mini playground: paste a code change, the agent reviews it. Shows the kind of feedback the user would get in their real workflow.

```
Test on this code change:
  +  function getUserById(id) {
  +    return db.query(`SELECT * FROM users WHERE id = ${id}`);
  +  }

[▶ Run code-reviewer]
─────────────────────────────────────────
[reviewer] Found 1 critical issue:
  • SQL injection risk on line 2. Use parameterised
    queries instead.
[reviewer] Found 1 suggestion:
  • Consider adding error handling for missing user.
```

**Fork to my account**

Same forking pattern as skills.

**Pairs well with**

Skills that this agent uses; commands that invoke this agent (e.g. `/review` invokes `code-reviewer`).

### Best-in-class moves
- Test-the-agent before installing.
- Plain-English "when to use" expanding the proactive description.
- Visual highlighting of which tools the agent has access to (security signal).

### Dummy data
- **Name:** "code-reviewer"
- **Tagline:** "Expert code review specialist. Proactive reviewer with security focus."
- **Tools:** Read, Grep, Glob, Bash
- **Model:** inherit
- **Use proactively:** ✅
- **Forks:** 89

---

## §21 Prompts — `/prompts/[slug]`

### What this page is for
A user wants a prompt recipe — a proven multi-turn workflow with variables. They paste it into their LLM, fill the variables, get the result.

### Hero specifics
- Steps count: `Single-turn` / `3-turn workflow` / `5-turn workflow`.
- Best-for tags: `coding` / `writing` / `research`.
- Variable count: `4 variables`.

### Zone 5 — type-specific blocks

**Prompt viewer with variable substitution**

The prompt rendered with `{variables}` highlighted. Below it, an inline form to fill them:

```
Prompt template
─────────────────────────────────────────
Generate a landing page for {{product_name}},
which solves {{pain_point}} for {{audience}}.

The page should include:
- A hero with {{cta_text}} as the primary CTA
- 3 feature cards
- A pricing section with monthly/yearly toggle
- Social proof (3 logos placeholder + 1 quote)

Use Tailwind v4 + shadcn/ui components.
─────────────────────────────────────────

Fill in the variables:
  product_name  [______________]
  pain_point    [______________]
  audience      [______________]
  cta_text      [______________]

[Preview] [Copy filled prompt] [Run in playground]
```

**Run in playground**

The "Run" button feeds the filled prompt into a model playground (model picker visible), shows the response inline.

**Example output**

Cached examples of what users got when they ran this prompt with sample inputs. 2–3 worked examples.

**Pairs well with**

Models known to work well with this prompt (some prompts perform better with reasoning models, others with non-reasoning).

**Variations**

Forks of this prompt with different framings ("more formal", "for a technical audience", "shorter version").

### Best-in-class moves
- Variable substitution form is interactive — most prompt directories show the prompt as plain text.
- Run-in-playground without leaving the page.
- Cached example outputs build trust.

### Dummy data
- **Title:** "Generate a landing page from positioning"
- **Steps:** Single-turn
- **Variables:** product_name, pain_point, audience, cta_text
- **Best for:** landing-page generation
- **Used:** 4,231 times this month
- **Avg user rating:** 4.7

---

## §22 Marketplaces — `/marketplaces/[slug]`

### What this page is for
A user wants to subscribe to a Claude Code marketplace — a GitHub repo that bundles plugins. They need to see what's inside, add it via CLI, and browse contained plugins.

### Hero specifics
- Curator name + GitHub handle.
- Plugin count: "57 plugins".
- Skill / MCP / command counts (aggregated from all bundled plugins).
- Add button: `claude plugin marketplace add davepoon/buildwithclaude`.

### Zone 5 — type-specific blocks

**Plugins grid**

A searchable grid of all plugins in this marketplace. Each card links to that plugin's detail page (within the marketplace context).

```
Showing 57 plugins  [search]  [filter by type]

[plugin card] [plugin card] [plugin card]
[plugin card] [plugin card] [plugin card]
...
```

**About the curator**

A short bio about who maintains this marketplace, why it exists, what philosophy guides plugin selection.

**How to subscribe**

```bash
> /plugin marketplace add davepoon/buildwithclaude
✓ Fetching marketplace registry...
✓ Adding buildwithclaude marketplace
Available plugins:
  • frontend-design-pro
  • nextjs-expert
  • interview
  • + 54 more

Run /plugin install <name> to install
```

**Recent additions**

A timeline of newly added plugins to this marketplace, last 30 days.

**Stats**

```
Plugins:   57
Skills:    131
Subagents: 117
Commands:  175
Hooks:     28
Subscribers: 4,231
Updated weekly
```

### Best-in-class moves
- Plugin grid searchable + filterable.
- "About the curator" section — trust signal.
- Recent additions timeline tells users this is alive.

### Dummy data
- **Name:** "Build with Claude"
- **Curator:** @davepoon
- **Plugins:** 57
- **Subscribers:** 4,231
- **Last update:** 2 days ago

---

## §23 Commands — `/commands/[slug]`

### What this page is for
A user wants a slash command — a reusable `.claude/commands/*.md` file. They paste it in, type `/the-command` in Claude Code, get the result.

### Hero specifics
- Slash command syntax: `/refactor`, `/test`, `/deploy`.
- Args schema: `<file-path> [--coverage]`.
- Invokes-subagent badge if applicable.

### Zone 5 — type-specific blocks

**Command file viewer**

Full markdown rendering of the command file, with frontmatter syntax-highlighted.

**Args schema**

Visual breakdown of arguments:

```
/refactor <file-path> [--style=tight|verbose] [--test]

  file-path     required    Path to the file to refactor
  --style       optional    Default: tight
  --test        optional    Generate tests after refactor
```

**Sample invocations**

```
> /refactor src/auth/oauth.ts
> /refactor src/auth/oauth.ts --style=verbose
> /refactor src/auth/oauth.ts --test
```

Each clickable to copy.

**What this command does**

Plain-English: "When you run this command, Claude Code will: 1. Read the target file. 2. Identify code smells. 3. Refactor without changing public API. 4. Optionally generate tests."

**Pairs well with**

The subagent it invokes (if any), skills it triggers, related commands in the same workflow.

### Best-in-class moves
- Args schema as a structured visual.
- Sample invocations as a copy-able list.
- "What this command does" makes the agent's behaviour transparent.

### Dummy data
- **Name:** "/refactor"
- **Tagline:** "Refactor a file without breaking its public API. Generates tests on demand."
- **Args:** `<file-path> [--style] [--test]`
- **Invokes subagent:** code-reviewer (after refactor)
- **Installs:** 2,341

---

## §24 Sandboxes — `/sandboxes/[slug]`

### What this page is for
A user wants ephemeral compute for running Claude Code agents, MCP servers, or scripts. They need to know cold-start times, persistence behaviour, and pricing.

### Hero specifics
- Cold-start chip: `~150ms cold start`.
- Max session: `Unlimited` / `8h max`.
- GPU support badge.
- Filesystem persistence badge.
- OS image chip: `Ubuntu 22.04` / `Alpine 3.18`.

### Zone 5 — type-specific blocks

**Cold-start latency chart**

A bar chart comparing this sandbox to alternatives on cold start time. Sourced from real measurements.

**What it can run**

```
✅ Claude Code agents (full filesystem)
✅ Long-running MCP servers
✅ Bash + Node + Python + Go
✅ Docker containers (nested)
⚠️ GPU workloads (paid tier only)
❌ Persistent state across sessions (use the persistence add-on)
```

**Pricing**

Honest hourly + monthly:

```
Free        100 hours/mo · 4 vCPU · 8GB RAM · 10GB disk
Pro         $0.18/hour · 8 vCPU · 16GB RAM · 50GB disk
Pro+GPU     $0.74/hour · with A10 GPU · 24GB VRAM
Enterprise  contact us
```

**Quickstart code**

Inline snippet showing how to spawn a sandbox session and run code in it:

```typescript
import { Sandbox } from "@e2b/code-interpreter";

const sandbox = await Sandbox.create();
const result = await sandbox.runCode("print('hello')");
```

**Use cases**

Short list of common patterns: "running Claude Code in production", "executing user-submitted code safely", "ephemeral agent runtimes".

**Real-world performance**

If we have telemetry: average session duration, average cost/session.

### Best-in-class moves
- Honest cold-start chart vs alternatives.
- "What it can run" is explicit about edge cases (GPU workloads, persistence).
- Quickstart snippet immediately copy-able.

### Dummy data
- **Name:** "E2B"
- **Tagline:** "Open-source secure sandboxes for AI code interpreters."
- **Cold start:** 150ms
- **Max session:** 24h
- **GPU:** Yes (paid)
- **OS:** Ubuntu 22.04
- **Pricing:** Free / $0.18/hr / $0.74/hr (GPU)

---

## §25 Showcase — `/showcase/[slug]`

### What this page is for
A user wants inspiration — they want to see real, shipped projects built with vibe-coding tools. They click through to the live site, but more importantly, they see the *stack* used and can replicate it.

### Hero specifics
- Big screenshot or video as the hero (16:9 or square).
- Live URL chip: `[Visit ↗]`.
- Built-with stack chips: 8–12 chips of every resource used.

### Zone 5 — type-specific blocks

**Screenshot gallery**

Lightbox-able grid of 4–8 screenshots showing different views of the project.

**Built with — full breakdown**

This is the value-add. A grid of every resource used:

```
FRAMEWORK                         AI TOOLS
[Next.js 15]                      [Cursor]
                                  [Claude Code]
DATABASE & AUTH
[Convex]                          MCPs USED
[Better Auth]                     [GitHub MCP]
                                  [Figma MCP]
PAYMENTS                          [Stripe MCP]
[Stripe]
                                  STARTERS
EMAIL                             [Next 15 + Convex SaaS]
[Resend]
                                  COMPONENTS
DEPLOYMENT                        [3 from our directory]
[Vercel]
```

Each clickable to that resource's detail page.

**Builder's notes**

A short editorial section by the builder: how they vibe-coded this, where they got stuck, what surprised them. Trust + relatability.

**Build timeline**

How long it took: "Built in 14 days, soft-launched on day 9."

**Stats (if shared)**

If the project has shared stats: MAU, revenue, traffic. Optional but powerful.

**Replicate this**

A "Replicate this stack" button that creates a new user stack pre-loaded with all the resources used. One click → ready to clone.

### Best-in-class moves
- "Built with" cross-references the entire directory — no other showcase site does this with our depth.
- "Replicate this" is the killer — converts inspiration into action.
- Builder's notes humanise the project.

### Dummy data
- **Name:** "MealMatch"
- **Tagline:** "Recipe-matching app. Built solo in 14 days."
- **Builder:** @bens-cooking
- **Live URL:** mealmatch.app
- **Stack:** Next.js 15, Convex, Better Auth, Stripe, Resend, Vercel
- **AI tools:** Cursor, Claude Code
- **MCPs:** GitHub, Figma, Stripe
- **Build time:** 14 days
- **MAU:** 4,200 (3 months in)

---

## §26 Specs — `/specs/[slug]`

### What this page is for
A user wants a spec template — PRD, AGENTS.md, architecture spec — designed to be fed to coding agents. They fork it, customise to their project, and use it as the source of truth.

### Hero specifics
- Spec-kind badge: `PRD` / `Feature spec` / `AGENTS.md` / `Architecture` / `Data model`.
- Length: "1,200 words".
- Best-for tags: which kinds of projects use this.

### Zone 5 — type-specific blocks

**Spec viewer**

Full markdown rendering of the spec content.

**Why this works**

Editorial section: "What makes this spec effective for AI agents." Cites Karpathy / Addy Osmani / Augment Code research where applicable.

**Fork to my project**

Same fork pattern. Forking opens an inline editor pre-filled with placeholders for the user to swap (`{your_project_name}`, `{your_stack}`, etc.).

**Example completed**

A worked example showing this spec filled in for a real project — gives users a sense of what their version should look like.

**Pairs well with**

Workflow guides that use this spec, prompt recipes that reference it.

### Best-in-class moves
- Worked example removes guesswork.
- Editorial "why this works" gives the spec credibility.
- Fork-with-placeholders is efficient.

### Dummy data
- **Name:** "AGENTS.md for SaaS MVP"
- **Tagline:** "Battle-tested AGENTS.md template that gets coding agents on the same page in 200 lines."
- **Kind:** AGENTS.md
- **Length:** 247 lines
- **Used by:** 1,400+ projects in our directory

---

## §27 Stacks — `/u/[username]/[stack-slug]`

### What this page is for
A user is browsing someone else's curated stack — "Ben's Next.js + Claude Code + Convex stack". They see what's in it, can adopt it as their own, and share it.

### Hero specifics
- Stack name + tagline.
- Curator: avatar + handle.
- Item count: "14 resources across 6 types".
- Privacy: 🌐 Public / 🔒 Private (only owner sees private).
- Primary CTA: `[Adopt this stack]` (copies into the viewing user's own stacks).

### Zone 5 — type-specific blocks

**Stack contents grid**

Resources grouped by type:

```
AI TOOLS (2)
[Cursor] [Claude Code]

FRAMEWORKS (3)
[Next.js 15] [Tailwind v4] [TypeScript 5.6]

BACKEND (3)
[Convex] [Better Auth] [Resend]

MCPS (4)
[GitHub MCP] [Convex MCP] [Figma MCP] [Stripe MCP]

RULES (1)
[Next 15 + Convex .cursorrules]

STARTERS (1)
[Next 15 + Convex SaaS Starter]
```

**Curator's notes**

The curator's commentary on why they picked these resources, what the trade-offs were.

**Discussion**

Threaded comments on the stack — recommendations for additions, questions, alternatives.

**Adopt this stack**

The killer button:

```
[Adopt this stack →]

This will:
  ✓ Add 14 resources to your bookmarks
  ✓ Update your stack picker preferences
  ✓ Save this stack to your profile
```

**Forks of this stack**

Other users who started from this stack and customised. Visual fork tree.

### Best-in-class moves
- Stacks are *both* a feature and a resource. They show up in the directory, get rankings, get votes — like a Spotify playlist for vibe coders.
- One-click adopt.
- Public stacks have their own SEO-friendly URLs.

### Dummy data
- **Name:** "Ben's Solo SaaS Stack"
- **Curator:** @bens-cooking
- **Resources:** 14 across 6 types
- **Adopters:** 247
- **Forks:** 23

---

## §28 Scripts — `/scripts/[slug]`

### What this page is for
A user wants a standalone script or CLI that runs alongside their AI workflow — anything from a setup script to a build helper.

### Hero specifics
- Language badge: `bash` / `python` / `typescript` / `rust` / `go`.
- Entrypoint: `./install.sh` or `python -m vch_helper`.
- Args schema (if applicable).

### Zone 5 — type-specific blocks

**Script viewer**

Full source with syntax highlighting and inline copy.

**What it does**

Plain-English breakdown of the script's behaviour. For longer scripts, a step-by-step.

**Args & flags**

Structured table of CLI arguments and flags.

**Run instructions**

Per-OS install + run instructions:

```bash
# macOS / Linux
curl -sSL https://vch.example/install.sh | bash

# Windows (PowerShell)
iwr https://vch.example/install.ps1 | iex
```

**Safety review**

Important for scripts: what permissions does this script need? What does it touch on the filesystem? This is a trust differentiator. Show the answer plainly:

```
This script:
  ✅ Installs in ~/.local/bin (no sudo)
  ✅ Touches only ~/.config/vch/
  ❌ Does not run sudo
  ❌ Does not phone home
```

**Pairs well with**

Workflow guides that use this script.

### Best-in-class moves
- Safety review unique among script directories — most scripts are "curl | bash" with no transparency.
- Per-OS run instructions.
- Clear args/flags schema.

### Dummy data
- **Name:** "vch-cli"
- **Tagline:** "Install, manage, and update Vibe Coder Hub resources from your terminal."
- **Language:** TypeScript
- **Entrypoint:** `vch`
- **Args:** `vch install <slug> [--client=cursor]`
- **Installs:** 8,420

---

## §29 Cross-cutting design notes

A few patterns that recur across all detail pages — design these once, reuse everywhere.

### The "Forks" tab pattern
For every resource type that supports forking (Skills, Rules, Prompts, Subagents, Commands, Specs, Stacks, Hooks), the Forks tab shows:
- Fork tree visualisation (vertical, with the original at the top, descendants flowing down)
- "Most popular fork" highlighted
- "Forks that are now bigger than the original" called out
- Each fork links to its detail page

### The "Versions" tab pattern
For every resource that ships in versions, the Versions tab shows:
- Reverse-chronological list of versions
- Each entry: version number, release date, changelog summary, "install this version" button
- Diff view between any two versions (text-based diff for code/skills/rules/specs; metadata diff for everything else)

### The "Compatibility" tab pattern
For every installable resource:
- Matrix of clients × test status (✅ ⚠️ ❌ ❓)
- Test method per cell (automated / user-report / curator)
- Last test date per cell
- "Submit a compatibility report" button for users who tried it

### The "Analytics" tab pattern
For every resource with usage data:
- 30/90/365-day install chart
- 30/90/365-day view chart
- Top 5 referrers (which pages drove installs)
- Top 5 client IDs (which IDEs are installing this)
- Author-only: revenue / gateway usage / paid tier conversions

---

## §30 Dummy data principles

When designing each detail page, populate with:
- **Realistic resource names** — not "Lorem Component", but names that match how the ecosystem actually names things ("AuthForm with OAuth grid", "Better Auth", "Next 15 + Convex SaaS Starter").
- **Realistic stat numbers** — install counts in the 10s to 10,000s, not millions. Reviews in the 5–500 range. Forks in the 0–500 range.
- **Plausible authors** — username-shaped, not fake-celebrity names.
- **Real tech stack chips** — Next.js 15, React 19, Tailwind v4, Convex, Better Auth, etc. Not "FrameworkA", "DatabaseX".
- **Real model versions** — Claude Opus 4.7, GPT-5.5, Gemini 3.1 Pro, Qwen 3 32B. Pricing within ~20% of current real prices for credibility.

---

## §31 Final checklist

For every detail page in §2–§28, deliver:

- [ ] Default state (with realistic dummy data populated)
- [ ] Loading state (skeleton matching the layout)
- [ ] Empty state (where applicable — e.g. zero reviews, zero forks)
- [ ] Error state (resource fetch failure, deleted resource)
- [ ] Mobile responsive variant (375px and 768px)
- [ ] Dark and light theme variants
- [ ] Logged-out variant (where features are gated)
- [ ] Pro-paywall variant (where applicable — see Models, Deals, MCPs with gateway)
- [ ] Author-owned variant (when the viewing user owns this resource — adds Edit / Analytics access)

---

## §32 What this delivers

After Claude Design completes this prompt, the team has:
- 27 fully designed detail page templates, each tuned to its resource type
- Consistent shared chassis (zones 1–4, 6–9) so the user always knows where they are
- Type-specific zone 5 that makes each page genuinely useful for *that* resource type
- 9 cross-cutting tab patterns (Overview, Try It, Guides, Install, Source, Compatibility, Reviews, Versions, Forks, Analytics) that work across all 27 types
- Dummy data that makes the designs credible during stakeholder review
- All states accounted for so engineering doesn't get blocked on missing edge cases

Each page is best-in-class for its category. Together, they form a directory experience nothing in the vibe-coding space currently offers.

~~~~~~~~~~

---

## File 4 of 6: `vibe-coder-hub-schema.sql`

~~~~~~~~~~vibe-coder-hub-schema.sql
-- ============================================================================
-- VIBE CODER HUB — SUPABASE SCHEMA
-- ============================================================================
-- A directory + SaaS for the vibe-coding ecosystem.
-- 27 resource types share one `resources` spine; type-specific data lives in
-- per-type extension tables. Cross-cutting features (deals, news, guides,
-- gateway, telemetry, social) get their own tables.
--
-- Conventions:
--   • All tables use UUID primary keys (gen_random_uuid()).
--   • All tables have created_at / updated_at timestamps.
--   • Soft-delete via deleted_at (null = live).
--   • RLS is enabled on every table; explicit policies follow each definition.
--   • Use citext for emails/usernames so case-insensitive lookups are free.
--   • Use jsonb for flexible metadata (we'll regret going too schema-rigid).
--   • Foreign keys cascade on delete unless noted.
--
-- Run order: extensions → enums → core → users → resources → type extensions
--          → social → deals → news → guides → gateway → telemetry
--          → indexes → functions → triggers → RLS policies → seed helpers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "citext";
create extension if not exists "pg_trgm";        -- fuzzy search on names
create extension if not exists "vector";         -- pgvector for AI search
create extension if not exists "btree_gin";      -- composite gin indexes
create extension if not exists "pg_stat_statements";

-- ----------------------------------------------------------------------------
-- 2. ENUMS
-- ----------------------------------------------------------------------------

-- The 27 resource types. The `type_slug` on resources points here.
create type resource_type as enum (
  'component',
  'mcp',
  'skill',
  'subagent',
  'script',
  'rule',
  'prompt',
  'plugin',
  'marketplace',
  'hook',
  'command',
  'starter',
  'tool',
  'model',
  'sandbox',
  'observability',
  'backend',
  'asset',
  'showcase',
  'docs_for_llms',
  'spec',
  'workflow',
  'eval',
  'stack',
  'guide',
  'deal',
  'news'
);

create type publish_status as enum ('draft', 'in_review', 'published', 'rejected', 'archived');
create type license_kind as enum ('mit', 'apache_2', 'gpl_3', 'agpl_3', 'bsd_3', 'isc', 'cc0', 'cc_by', 'cc_by_sa', 'commercial', 'proprietary', 'mixed', 'unknown');
create type compat_status as enum ('verified', 'partial', 'broken', 'unknown');
create type subscription_tier as enum ('free', 'member', 'pro');
create type deal_tier as enum ('public', 'member', 'pro');
create type deal_status as enum ('active', 'expired', 'paused');
create type claim_status as enum ('started', 'submitted', 'approved', 'rejected', 'redeemed', 'expired');
create type news_kind as enum ('ecosystem', 'release', 'price_change', 'tutorial', 'op_ed');
create type news_source_kind as enum ('editorial', 'auto_generated', 'rss_imported');
create type guide_kind as enum ('install', 'quickstart', 'usage', 'troubleshoot', 'migrate', 'tutorial');
create type difficulty as enum ('beginner', 'intermediate', 'advanced');
create type alert_kind as enum ('price_drop', 'version_release', 'capability_add', 'deal_expiring', 'resource_updated', 'saved_search');
create type alert_status as enum ('active', 'paused', 'triggered', 'expired');
create type install_method as enum ('deeplink', 'cli', 'manual_config', 'npm', 'pip', 'cargo', 'brew', 'docker', 'shadcn');
create type ai_client as enum ('cursor', 'claude_code', 'windsurf', 'cline', 'roo', 'aider', 'continue', 'zed', 'kiro', 'codex', 'gemini_cli', 'claude_desktop', 'bolt', 'lovable', 'v0', 'replit_agent', 'base44', 'tempo', 'emergent', 'rosebud', 'copilot', 'other');
create type alternative_kind as enum ('cheaper', 'faster', 'smarter', 'lighter', 'open_source', 'self_hosted', 'free', 'premium');
create type review_outcome as enum ('approved', 'rejected', 'needs_changes');
create type notification_channel as enum ('in_app', 'email', 'webhook');

-- ----------------------------------------------------------------------------
-- 3. USERS & ACCOUNTS
-- ----------------------------------------------------------------------------
-- Supabase auth.users is the source of truth for auth. profiles extends it.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext unique not null,
  display_name text,
  bio text,
  avatar_url text,
  github_handle citext,
  twitter_handle citext,
  website_url text,
  location text,
  is_verified_author boolean default false not null,
  subscription_tier subscription_tier default 'free' not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_expires_at timestamptz,
  pro_started_at timestamptz,
  total_resources_published int default 0 not null,
  total_installs_referred int default 0 not null,
  reputation_score int default 0 not null,
  email_notifications_enabled boolean default true not null,
  weekly_digest_enabled boolean default true not null,
  breaking_news_enabled boolean default false not null,
  daily_roundup_enabled boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  -- Constraints
  constraint username_format check (username ~* '^[a-z0-9_-]{2,32}$'),
  constraint github_format check (github_handle is null or github_handle ~* '^[a-z0-9-]{1,39}$')
);

-- A user's "stack" — what AI clients + tech + hardware they use.
-- Cookie-backed for logged-out users; stored here for logged-in.
create table user_stacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,                              -- "My main stack", "Work stack"
  is_default boolean default false not null,
  is_public boolean default false not null,
  slug text,                                        -- only set if public
  ai_clients ai_client[] default '{}' not null,
  tech_stack text[] default '{}' not null,         -- Next.js, Tailwind, Convex, etc
  hardware_profile jsonb default '{}'::jsonb,      -- {os, cpu, ram_gb, gpu, vram_gb}
  description text,
  curator_notes text,
  resource_ids uuid[] default '{}' not null,       -- ordered list of pinned resources
  adoption_count int default 0 not null,
  fork_count int default 0 not null,
  forked_from_id uuid references user_stacks(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint public_needs_slug check (is_public = false or slug is not null),
  constraint slug_format check (slug is null or slug ~* '^[a-z0-9-]{2,64}$')
);

create unique index user_stacks_user_slug_uniq on user_stacks(user_id, slug) where slug is not null;
create index user_stacks_user_idx on user_stacks(user_id) where deleted_at is null;
create index user_stacks_public_idx on user_stacks(is_public, adoption_count desc) where is_public = true and deleted_at is null;

-- API keys for Pro users (read-only API access).
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  key_prefix text not null,                        -- first 8 chars for display
  key_hash text not null,                          -- bcrypt of full key
  scopes text[] default '{read}' not null,
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now() not null
);

create index api_keys_user_idx on api_keys(user_id);
create unique index api_keys_hash_uniq on api_keys(key_hash);

-- ----------------------------------------------------------------------------
-- 4. RESOURCES (the spine)
-- ----------------------------------------------------------------------------
-- Every directory entry is a row here. Type-specific data lives in extension
-- tables that share this id as their primary key.

create table resources (
  id uuid primary key default gen_random_uuid(),
  type_slug resource_type not null,
  slug text not null,                              -- url-safe identifier
  name text not null,
  tagline text,
  description text,                                -- markdown
  thumbnail_url text,
  hero_image_url text,
  -- Authorship
  author_id uuid references profiles(id) on delete set null,
  author_handle text,                              -- denormalised for deleted users
  -- Source
  source_url text,                                 -- github / npm / pypi / docs
  homepage_url text,
  docs_url text,
  -- Versioning
  current_version text,                            -- e.g. "2.3.1"
  released_at timestamptz,                         -- date of current_version
  -- License
  license license_kind default 'unknown' not null,
  license_text text,                               -- full license if non-standard
  -- Compatibility (denormalised for fast filtering)
  compatible_clients ai_client[] default '{}' not null,
  stack_tags text[] default '{}' not null,         -- Next.js, Tailwind, etc
  -- Status
  status publish_status default 'draft' not null,
  is_featured boolean default false not null,      -- editor's pick
  is_open_weights boolean default false not null,  -- relevant for models only
  -- Metrics (denormalised for sort/filter performance)
  install_count_total int default 0 not null,
  install_count_7d int default 0 not null,
  install_count_30d int default 0 not null,
  view_count_total int default 0 not null,
  view_count_7d int default 0 not null,
  bookmark_count int default 0 not null,
  fork_count int default 0 not null,
  review_count int default 0 not null,
  rating_avg numeric(3,2),                         -- 0.00 to 5.00
  health_score numeric(3,2),                       -- gateway-derived 0.00 to 1.00
  trending_score numeric(10,4) default 0 not null, -- recomputed nightly
  intelligence_rank int,                           -- only used for models
  -- Lineage (forks)
  forked_from_id uuid references resources(id) on delete set null,
  is_official boolean default false not null,
  -- Admin
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  -- Search
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(tagline, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      array_to_string(stack_tags, ' ')
    )
  ) stored,
  embedding vector(1536),                          -- OpenAI ada-002 dimension
  -- Timestamps
  published_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  -- Constraints
  constraint slug_format check (slug ~* '^[a-z0-9][a-z0-9-]*[a-z0-9]$' or length(slug) = 1),
  constraint slug_length check (length(slug) between 1 and 80),
  constraint name_length check (length(name) between 1 and 200),
  constraint rating_range check (rating_avg is null or rating_avg between 0 and 5),
  constraint health_range check (health_score is null or health_score between 0 and 1)
);

-- A type can have its own slug namespace (so /components/foo and /mcps/foo coexist).
create unique index resources_type_slug_uniq on resources(type_slug, slug) where deleted_at is null;
create index resources_type_idx on resources(type_slug, status) where deleted_at is null;
create index resources_author_idx on resources(author_id) where deleted_at is null;
create index resources_trending_idx on resources(type_slug, trending_score desc) where status = 'published' and deleted_at is null;
create index resources_search_idx on resources using gin(search_vector);
create index resources_embedding_idx on resources using ivfflat(embedding vector_cosine_ops) with (lists = 100);
create index resources_compat_idx on resources using gin(compatible_clients);
create index resources_stack_idx on resources using gin(stack_tags);
create index resources_featured_idx on resources(type_slug, is_featured) where is_featured = true and deleted_at is null;
create index resources_open_weights_idx on resources(is_open_weights) where is_open_weights = true and deleted_at is null;

-- Resource versions (for resources that ship in versions).
create table resource_versions (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  version text not null,
  changelog text,                                  -- markdown
  released_at timestamptz default now() not null,
  is_breaking boolean default false not null,
  source_url text,
  install_command text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create unique index resource_versions_uniq on resource_versions(resource_id, version);
create index resource_versions_resource_idx on resource_versions(resource_id, released_at desc);

-- ----------------------------------------------------------------------------
-- 5. TYPE-SPECIFIC EXTENSION TABLES
-- ----------------------------------------------------------------------------
-- Each shares its id with the parent resources row.

-- Components (UI components)
create table components (
  id uuid primary key references resources(id) on delete cascade,
  framework text not null,                         -- react / vue / svelte / solid
  styling text,                                    -- tailwind / css / vanilla-extract
  has_dark_mode boolean default false not null,
  is_responsive boolean default false not null,
  is_accessible boolean default false not null,    -- WCAG AA
  source_code text,                                -- main file
  dependencies jsonb default '[]'::jsonb,          -- [{ name, version, registry }]
  variants jsonb default '[]'::jsonb,              -- [{ name, code, preview_url }]
  install_command text,                            -- npx shadcn add @vch/auth-form
  registry_url text,                               -- shadcn registry URL
  preview_url text,                                -- live demo
  sandpack_template text default 'react'           -- react / vue / vanilla
);

-- MCP servers
create table mcps (
  id uuid primary key references resources(id) on delete cascade,
  transport text[] default '{stdio}' not null,    -- stdio / sse / http
  auth_kind text default 'none' not null,         -- none / api_key / oauth
  source_language text,                            -- typescript / python / go / rust
  tool_count int default 0 not null,
  tools jsonb default '[]'::jsonb,                 -- [{ name, description, input_schema, output_schema, is_destructive }]
  install_configs jsonb default '{}'::jsonb,       -- { cursor: {...}, claude_desktop: {...}, windsurf: {...} }
  oauth_scopes text[] default '{}',
  uptime_pct numeric(5,2),                         -- gateway telemetry
  p50_latency_ms int,                              -- gateway telemetry
  p95_latency_ms int                               -- gateway telemetry
);

-- Models / inference providers
create table models (
  id uuid primary key references resources(id) on delete cascade,
  provider text not null,                          -- anthropic / openai / google / etc
  model_family text,                               -- claude / gpt / gemini
  context_window_advertised int,
  context_window_effective int,                    -- needle-in-haystack tested
  output_max_tokens int,
  knowledge_cutoff date,
  -- Pricing ($ per million tokens)
  price_input_per_mtok numeric(10,4),
  price_output_per_mtok numeric(10,4),
  price_cached_per_mtok numeric(10,4),
  price_reasoning_per_mtok numeric(10,4),
  batch_discount_pct numeric(5,2),
  blended_cost_per_mtok numeric(10,4),             -- computed for sorting
  -- Capabilities
  supports_tools boolean default false not null,
  supports_parallel_tools boolean default false not null,
  supports_vision boolean default false not null,
  supports_audio boolean default false not null,
  supports_pdf boolean default false not null,
  supports_json_mode boolean default false not null,
  supports_caching boolean default false not null,
  supports_batch boolean default false not null,
  supports_finetuning boolean default false not null,
  supports_reasoning boolean default false not null,
  supports_computer_use boolean default false not null,
  -- Performance
  output_tokens_per_second numeric(8,2),
  ttft_ms int,                                     -- time to first token
  intelligence_index numeric(5,2),                 -- e.g. ArtificialAnalysis index
  -- Open weights
  parameters_billions numeric(8,2),
  architecture text,
  tokenizer text,
  huggingface_id text,
  recommended_quantization text,
  -- Safety / compliance
  is_hipaa_compliant boolean default false not null,
  is_soc2_compliant boolean default false not null,
  data_retention_days int,
  available_regions text[] default '{}' not null,
  eu_ai_act_tier text
);

-- Pricing history (for the price tracker)
create table model_price_history (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id) on delete cascade,
  effective_at timestamptz not null,
  price_input_per_mtok numeric(10,4),
  price_output_per_mtok numeric(10,4),
  price_cached_per_mtok numeric(10,4),
  price_reasoning_per_mtok numeric(10,4),
  source text,                                     -- where we sourced this price
  created_at timestamptz default now() not null
);

create index model_price_history_model_idx on model_price_history(model_id, effective_at desc);

-- Provider availability (a model can be hosted by multiple providers)
create table model_providers (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id) on delete cascade,
  provider_name text not null,
  provider_url text,
  price_input_per_mtok numeric(10,4),
  price_output_per_mtok numeric(10,4),
  context_window int,
  rate_limit_rpm int,
  rate_limit_tpm int,
  latency_ms int,
  uptime_pct numeric(5,2),
  is_official boolean default false not null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create unique index model_providers_uniq on model_providers(model_id, provider_name);

-- Benchmarks
create table model_benchmarks (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id) on delete cascade,
  benchmark_name text not null,                    -- swe-bench-verified, mmlu, gpqa
  score numeric(8,4),
  score_kind text default 'percentage',            -- percentage / elo / index
  methodology text,                                -- "Pass@1", "Cons@10"
  source_url text,
  confidence int default 1,                        -- 1-4 dots
  measured_at date,
  created_at timestamptz default now() not null
);

create index model_benchmarks_model_idx on model_benchmarks(model_id);

-- Skills
create table skills (
  id uuid primary key references resources(id) on delete cascade,
  skill_md text not null,                          -- full SKILL.md content
  frontmatter jsonb default '{}'::jsonb,           -- parsed frontmatter
  allowed_tools text[] default '{}',               -- Read, Write, Bash, etc
  disable_model_invocation boolean default false not null,
  trigger_examples text[] default '{}'             -- when this skill auto-fires
);

-- Subagents
create table subagents (
  id uuid primary key references resources(id) on delete cascade,
  agent_md text not null,
  frontmatter jsonb default '{}'::jsonb,
  tools_allowed text[] default '{}',
  model_assignment text default 'inherit',         -- inherit / sonnet / opus / haiku
  use_proactively boolean default false not null,
  context_isolated boolean default true not null,
  trigger_examples text[] default '{}'
);

-- Scripts
create table scripts (
  id uuid primary key references resources(id) on delete cascade,
  language text not null,                          -- bash / python / typescript / go / rust
  source_code text not null,
  entrypoint text,                                 -- ./install.sh
  args_schema jsonb default '[]'::jsonb,           -- [{ name, required, description }]
  os_support text[] default '{}',                  -- macos / linux / windows
  permissions_required jsonb default '[]'::jsonb,  -- ["read ~/.config", "write ~/.local/bin"]
  install_method install_method[]
);

-- Rules files (.cursorrules, .windsurfrules, CLAUDE.md, AGENTS.md)
create table rules (
  id uuid primary key references resources(id) on delete cascade,
  format text not null,                            -- cursorrules / mdc / windsurfrules / claude_md / agents_md
  content text not null,
  scope text default 'project',                    -- global / project / subdirectory
  globs text[] default '{}',                       -- when scope = 'subdirectory'
  line_count int default 0 not null,
  per_ide_compatibility jsonb default '{}'::jsonb  -- { cursor: 'verified', windsurf: 'partial' }
);

-- Prompts (multi-turn workflows with variables)
create table prompts (
  id uuid primary key references resources(id) on delete cascade,
  prompt_template text not null,
  variables jsonb default '[]'::jsonb,             -- [{ name, type, required, description, default_value }]
  variation_kind text,                             -- single_turn / 3_turn / 5_turn
  best_for text[] default '{}',                    -- coding / writing / research
  example_outputs jsonb default '[]'::jsonb        -- [{ inputs, output, model }]
);

-- Plugins (bundles)
create table plugins (
  id uuid primary key references resources(id) on delete cascade,
  marketplace_id uuid references resources(id) on delete set null,
  bundled_resources uuid[] default '{}',           -- references to other resources
  bundled_skills_count int default 0 not null,
  bundled_mcps_count int default 0 not null,
  bundled_commands_count int default 0 not null,
  bundled_hooks_count int default 0 not null,
  bundled_agents_count int default 0 not null,
  install_command text                             -- claude plugin install @marketplace/name
);

-- Marketplaces
create table marketplaces (
  id uuid primary key references resources(id) on delete cascade,
  curator_handle text,
  github_repo text not null,                       -- davepoon/buildwithclaude
  add_command text,                                -- /plugin marketplace add ...
  plugin_count int default 0 not null,
  subscriber_count int default 0 not null,
  philosophy text                                  -- editorial: how plugins are selected
);

-- Hooks
create table hooks (
  id uuid primary key references resources(id) on delete cascade,
  event text not null,                             -- pre_tool_use / post_tool_use / session_start / stop / user_prompt_submit
  matcher jsonb default '{}'::jsonb,               -- { tool: 'Edit|Write', path: '*.env*' }
  language text not null,                          -- bash / python / node
  source_code text not null,
  config_snippet jsonb                             -- the JSON config block users paste
);

-- Slash commands
create table commands (
  id uuid primary key references resources(id) on delete cascade,
  command_syntax text not null,                    -- /refactor
  args_schema jsonb default '[]'::jsonb,           -- [{ name, required, description, default }]
  command_md text not null,                        -- the .md file content
  invokes_subagent_id uuid references resources(id) on delete set null,
  sample_invocations text[] default '{}'
);

-- Starter kits
create table starters (
  id uuid primary key references resources(id) on delete cascade,
  framework text not null,                         -- next / sveltekit / astro / expo
  has_cursorrules boolean default false not null,
  has_claude_md boolean default false not null,
  has_agents_md boolean default false not null,
  rules_file_id uuid references resources(id) on delete set null,
  bundled_backend_kit_ids uuid[] default '{}',
  deploy_targets text[] default '{}',              -- vercel / netlify / cloudflare / fly
  demo_url text,
  github_clone_url text,
  cost_to_run_per_month_usd numeric(8,2),
  time_to_first_deploy_median_minutes int,
  deploy_count_24h int default 0 not null
);

-- Tools (IDEs, agents, app builders)
create table tools (
  id uuid primary key references resources(id) on delete cascade,
  category text not null,                          -- ide / app_builder / cli_agent / extension
  platforms text[] default '{}',                   -- macos / windows / linux / web / ios / android
  pricing_tiers jsonb default '[]'::jsonb,         -- [{ name, price_monthly, features }]
  models_supported uuid[] default '{}',
  byok_supported boolean default false not null,
  is_open_source boolean default false not null,
  open_in_url_scheme text,                         -- cursor:// / code://
  download_urls jsonb default '{}'::jsonb          -- { macos: "...", windows: "..." }
);

-- Sandboxes / compute
create table sandboxes (
  id uuid primary key references resources(id) on delete cascade,
  cold_start_ms int,
  max_session_seconds int,                         -- null = unlimited
  has_gpu boolean default false not null,
  has_persistence boolean default false not null,
  os_image text,                                   -- "ubuntu:22.04"
  pricing_tiers jsonb default '[]'::jsonb,
  use_cases text[] default '{}',
  quickstart_snippet text
);

-- Observability tools
create table observability (
  id uuid primary key references resources(id) on delete cascade,
  features text[] default '{}',                    -- tracing / evals / prompts / dashboards / ab_testing
  is_self_hostable boolean default false not null,
  has_free_tier boolean default false not null,
  pricing_tiers jsonb default '[]'::jsonb,
  integrations text[] default '{}',                -- anthropic, openai, langchain, etc
  compliance_certs text[] default '{}'             -- soc2 / hipaa / iso27001
);

-- Backend kits
create table backend_kits (
  id uuid primary key references resources(id) on delete cascade,
  kind text not null,                              -- auth / db / payments / email / storage / realtime / search / full_stack
  has_free_tier boolean default false not null,
  ships_with_cursorrules boolean default false not null,
  ships_with_claude_md boolean default false not null,
  ships_with_agents_md boolean default false not null,
  rules_file_id uuid references resources(id) on delete set null,
  pricing_tiers jsonb default '[]'::jsonb,
  replaces text[] default '{}',                    -- "Auth0", "Clerk"
  primary_languages text[] default '{}'
);

-- Design assets
create table assets (
  id uuid primary key references resources(id) on delete cascade,
  kind text not null,                              -- icon_set / illustration / font / shader / lottie / 3d / gradient
  asset_count int default 1 not null,
  formats text[] default '{}',                     -- svg / png / figma / sketch / lottie_json
  download_url text,
  preview_url text,
  attribution_required boolean default false not null,
  commercial_use_allowed boolean default true not null
);

-- Showcase (built-with projects)
create table showcase (
  id uuid primary key references resources(id) on delete cascade,
  live_url text,
  built_with_resource_ids uuid[] default '{}',
  builder_notes text,
  build_time_days int,
  screenshots jsonb default '[]'::jsonb,
  stats_shared boolean default false not null,
  stats_data jsonb default '{}'::jsonb             -- { mau, revenue_monthly_usd, traffic_monthly }
);

-- Docs-for-LLMs (llms.txt feeds)
create table docs_for_llms (
  id uuid primary key references resources(id) on delete cascade,
  package_name text not null,                      -- e.g. convex-dev/convex
  doc_kind text,                                   -- library / framework / api / platform
  llms_txt_url text not null,
  total_pages int,
  total_tokens int,
  last_crawl_at timestamptz,
  crawl_frequency text,                            -- "every 6h"
  coverage jsonb default '{}'::jsonb,              -- { api_ref: 89, quickstart: 12, ... }
  provider text                                    -- context7, custom, etc
);

-- Specs (PRDs, AGENTS.md templates, architecture specs)
create table specs (
  id uuid primary key references resources(id) on delete cascade,
  spec_kind text not null,                         -- prd / feature_spec / agents_md / architecture / data_model
  content text not null,
  word_count int,
  example_filled_out text,
  best_for text[] default '{}'
);

-- Workflows (multi-step recipes)
create table workflows (
  id uuid primary key references resources(id) on delete cascade,
  outcome text,                                    -- saas_mvp / landing_page / automation / game / content
  difficulty difficulty default 'intermediate' not null,
  duration_label text,                             -- "weekend" / "one day" / "one hour"
  step_count int default 0 not null,
  steps jsonb default '[]'::jsonb,                 -- [{ order, title, resource_id, duration_minutes, instruction, prompt }]
  median_completion_minutes int,
  completion_count int default 0 not null
);

-- Evals / benchmarks
create table evals (
  id uuid primary key references resources(id) on delete cascade,
  benchmark_kind text,                             -- swe_bench / agentbench / custom / golden_tasks
  task_count int,
  is_reproducible boolean default false not null,
  leaderboard_url text,
  methodology text,
  sample_tasks jsonb default '[]'::jsonb,
  reproduce_command text,
  critique text                                    -- editorial: where this benchmark fails
);

-- ----------------------------------------------------------------------------
-- 6. SOCIAL & ENGAGEMENT
-- ----------------------------------------------------------------------------

create table reviews (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null,
  title text,
  body text,                                       -- markdown
  pros text[] default '{}',
  cons text[] default '{}',
  helpful_count int default 0 not null,
  unhelpful_count int default 0 not null,
  is_verified_user boolean default false not null, -- did they actually install it?
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint rating_range check (rating between 1 and 5)
);

create unique index reviews_resource_user_uniq on reviews(resource_id, user_id) where deleted_at is null;
create index reviews_resource_idx on reviews(resource_id, created_at desc) where deleted_at is null;
create index reviews_user_idx on reviews(user_id);

create table review_votes (
  user_id uuid references profiles(id) on delete cascade,
  review_id uuid references reviews(id) on delete cascade,
  is_helpful boolean not null,
  created_at timestamptz default now() not null,
  primary key (user_id, review_id)
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  news_id uuid,                                    -- forward-ref filled in below
  parent_comment_id uuid references comments(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  upvote_count int default 0 not null,
  downvote_count int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint comment_target check (resource_id is not null or news_id is not null)
);

create index comments_resource_idx on comments(resource_id) where deleted_at is null;
create index comments_news_idx on comments(news_id) where deleted_at is null;
create index comments_user_idx on comments(user_id);

create table prompting_tips (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  tip text not null,
  upvote_count int default 0 not null,
  is_curator_pinned boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index prompting_tips_resource_idx on prompting_tips(resource_id, upvote_count desc);

create table bookmarks (
  user_id uuid references profiles(id) on delete cascade,
  resource_id uuid references resources(id) on delete cascade,
  collection_id uuid,                              -- forward ref
  created_at timestamptz default now() not null,
  primary key (user_id, resource_id)
);

create index bookmarks_user_idx on bookmarks(user_id, created_at desc);

create table collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean default false not null,
  slug text,
  resource_count int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint public_needs_slug check (is_public = false or slug is not null)
);

create index collections_user_idx on collections(user_id) where deleted_at is null;

alter table bookmarks add constraint bookmarks_collection_fkey
  foreign key (collection_id) references collections(id) on delete set null;

-- Compatibility reports — users telling us "I tried X with Y, it worked / didn't"
create table compatibility_reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  client ai_client not null,
  client_version text,
  status compat_status not null,
  notes text,
  created_at timestamptz default now() not null
);

create index compatibility_reports_resource_idx on compatibility_reports(resource_id, client);

-- Resource dependencies (X works well with Y, X is part of plugin Y)
create table resource_dependencies (
  parent_id uuid references resources(id) on delete cascade,
  child_id uuid references resources(id) on delete cascade,
  relation text not null,                          -- bundles / pairs_with / replaces / requires / fork_of
  weight numeric(5,4) default 1.0 not null,        -- ranking signal
  created_at timestamptz default now() not null,
  primary key (parent_id, child_id, relation)
);

create index resource_dependencies_child_idx on resource_dependencies(child_id, relation);

-- Alternatives (cheaper / faster / smarter / etc)
create table resource_alternatives (
  resource_id uuid references resources(id) on delete cascade,
  alternative_id uuid references resources(id) on delete cascade,
  kind alternative_kind not null,
  delta_summary text,                              -- "30% cheaper, similar quality"
  weight numeric(5,4) default 1.0 not null,
  created_at timestamptz default now() not null,
  primary key (resource_id, alternative_id, kind)
);

create index resource_alternatives_kind_idx on resource_alternatives(resource_id, kind, weight desc);

-- "Best for" landing pages
create table use_cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                       -- "browser-automation", "rag-pipeline"
  name text not null,
  description text,
  hero_copy text,
  created_at timestamptz default now() not null,
  constraint slug_format check (slug ~* '^[a-z0-9-]+$')
);

create table best_for (
  resource_id uuid references resources(id) on delete cascade,
  use_case_id uuid references use_cases(id) on delete cascade,
  rank int not null,                               -- 1 = top pick
  reasoning text,
  created_at timestamptz default now() not null,
  primary key (resource_id, use_case_id)
);

create index best_for_use_case_idx on best_for(use_case_id, rank);

-- ----------------------------------------------------------------------------
-- 7. DEALS
-- ----------------------------------------------------------------------------

create table deals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text,
  provider_name text not null,
  provider_logo_url text,
  category text,                                   -- ai_apis / cloud / dev_tools / productivity
  tier deal_tier default 'public' not null,
  status deal_status default 'active' not null,
  -- Value
  value_amount_usd numeric(12,2),
  value_label text,                                -- "$10,000" or "6 months free"
  description text,                                -- markdown
  -- Eligibility
  eligibility_criteria jsonb default '[]'::jsonb,  -- [{ label, required }]
  approval_rate_pct numeric(5,2),
  avg_approval_days numeric(5,2),
  -- Redemption
  apply_url text not null,
  referral_code text,
  redemption_steps text,                           -- markdown
  common_rejection_reasons text[] default '{}',
  -- Linking
  related_resource_id uuid references resources(id) on delete set null,
  -- Metrics
  claim_count_total int default 0 not null,
  claim_count_30d int default 0 not null,
  -- Timing
  expires_at timestamptz,
  featured_until timestamptz,
  -- Admin
  is_featured boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint slug_format check (slug ~* '^[a-z0-9-]+$')
);

create index deals_status_idx on deals(status, tier) where deleted_at is null;
create index deals_featured_idx on deals(is_featured) where is_featured = true and deleted_at is null;
create index deals_category_idx on deals(category) where deleted_at is null;
create index deals_expires_idx on deals(expires_at) where status = 'active' and deleted_at is null;

create table deal_claims (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status claim_status default 'started' not null,
  approved_at timestamptz,
  redeemed_at timestamptz,
  approval_notes text,
  community_review_text text,
  community_review_rating int,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint rating_range check (community_review_rating is null or community_review_rating between 1 and 5)
);

create unique index deal_claims_user_deal_uniq on deal_claims(user_id, deal_id);
create index deal_claims_user_idx on deal_claims(user_id, created_at desc);
create index deal_claims_deal_idx on deal_claims(deal_id, status);

-- ----------------------------------------------------------------------------
-- 8. NEWS
-- ----------------------------------------------------------------------------

create table news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  body text,                                       -- markdown
  hero_image_url text,
  kind news_kind not null,
  source_kind news_source_kind not null,
  source_name text,                                -- "Cursor blog" / "Anthropic"
  source_url text,                                 -- original article
  published_at timestamptz default now() not null,
  reading_time_minutes int,
  is_breaking boolean default false not null,
  is_pinned boolean default false not null,
  pinned_until timestamptz,
  -- Linkage
  related_resource_ids uuid[] default '{}',
  topics text[] default '{}',                      -- cursor / claude_code / models / mcps
  -- Metrics
  view_count int default 0 not null,
  -- Admin
  author_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint slug_format check (slug ~* '^[a-z0-9-]+$')
);

create index news_published_idx on news(published_at desc) where deleted_at is null;
create index news_kind_idx on news(kind, published_at desc) where deleted_at is null;
create index news_breaking_idx on news(is_breaking, published_at desc) where is_breaking = true and deleted_at is null;
create index news_pinned_idx on news(is_pinned) where is_pinned = true and deleted_at is null;
create index news_topics_idx on news using gin(topics);

-- Forward-ref fill-in for comments → news
alter table comments add constraint comments_news_fkey
  foreign key (news_id) references news(id) on delete cascade;

-- Newsletter subscribers (in addition to email_notifications_enabled on profiles)
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  user_id uuid references profiles(id) on delete set null,
  frequency text default 'weekly' not null,        -- weekly / daily / breaking_only
  topics text[] default '{}',
  unsubscribe_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  unsubscribed_at timestamptz,
  last_sent_at timestamptz,
  bounce_count int default 0 not null,
  created_at timestamptz default now() not null
);

create index newsletter_subscribers_active_idx on newsletter_subscribers(frequency)
  where unsubscribed_at is null;

-- ----------------------------------------------------------------------------
-- 9. GUIDES
-- ----------------------------------------------------------------------------

create table guides (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  slug text not null,
  title text not null,
  kind guide_kind not null,
  difficulty difficulty default 'beginner' not null,
  duration_minutes int,
  prerequisites text,
  os_support text[] default '{}',                  -- macos / linux / windows
  client_support ai_client[] default '{}',
  runtime text,                                    -- ollama / lm_studio / vllm
  body text not null,                              -- markdown header + intro
  step_count int default 0 not null,
  view_count int default 0 not null,
  completion_count int default 0 not null,
  completion_rate_pct numeric(5,2),                -- denormalised
  last_verified_at timestamptz,
  verified_by uuid references profiles(id) on delete set null,
  is_published boolean default false not null,
  author_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  constraint slug_format check (slug ~* '^[a-z0-9-]+$')
);

create unique index guides_resource_slug_uniq on guides(resource_id, slug) where deleted_at is null;
create index guides_resource_idx on guides(resource_id) where deleted_at is null;
create index guides_kind_idx on guides(kind, difficulty);

create table guide_steps (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references guides(id) on delete cascade,
  step_order int not null,
  title text not null,
  body text not null,                              -- markdown
  command text,                                    -- shell command if any
  verifier_kind text,                              -- automated / manual / gateway
  verifier_command text,                           -- e.g. "ollama --version"
  verifier_expected_pattern text,                  -- regex
  estimated_seconds int,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create unique index guide_steps_uniq on guide_steps(guide_id, step_order);

create table guide_completions (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references guides(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  session_id uuid not null,                        -- track anon users via cookie
  steps_completed int default 0 not null,
  total_steps int not null,
  completed_at timestamptz,
  abandoned_at_step int,
  failure_reason text,
  duration_seconds int,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index guide_completions_guide_idx on guide_completions(guide_id, created_at desc);
create index guide_completions_user_idx on guide_completions(user_id);

-- ----------------------------------------------------------------------------
-- 10. INSTALL & EVENTS
-- ----------------------------------------------------------------------------

-- Every install / view / install attempt — drives metrics.
create table install_events (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  session_id uuid,
  client ai_client,
  install_method install_method,
  user_stack_id uuid references user_stacks(id) on delete set null,
  ip_hash text,                                    -- sha256(ip + salt) for dedup
  user_agent text,
  succeeded boolean default true not null,
  failure_reason text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index install_events_resource_idx on install_events(resource_id, created_at desc);
create index install_events_user_idx on install_events(user_id);
create index install_events_recent_idx on install_events(created_at desc);

create table view_events (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  news_id uuid references news(id) on delete cascade,
  guide_id uuid references guides(id) on delete cascade,
  deal_id uuid references deals(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  session_id uuid,
  referrer text,
  ip_hash text,
  created_at timestamptz default now() not null,
  constraint view_target check (
    (resource_id is not null)::int +
    (news_id is not null)::int +
    (guide_id is not null)::int +
    (deal_id is not null)::int = 1
  )
);

create index view_events_resource_idx on view_events(resource_id, created_at desc);
create index view_events_news_idx on view_events(news_id, created_at desc);

-- Track user activity history for "recent" lists
create table user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  resource_id uuid references resources(id) on delete cascade,
  activity_kind text not null,                     -- viewed / installed / bookmarked / forked / reviewed
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index user_activity_recent_idx on user_activity(user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 11. ALERTS & NOTIFICATIONS
-- ----------------------------------------------------------------------------

create table alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind alert_kind not null,
  resource_id uuid references resources(id) on delete cascade,
  deal_id uuid references deals(id) on delete cascade,
  search_query text,                               -- when kind = saved_search
  search_filters jsonb,
  threshold_value numeric(12,4),                   -- e.g. price < $X
  threshold_field text,                            -- which field to watch
  status alert_status default 'active' not null,
  triggered_at timestamptz,
  triggered_count int default 0 not null,
  channels notification_channel[] default '{in_app, email}' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz
);

create index alerts_user_idx on alerts(user_id) where status = 'active' and deleted_at is null;
create index alerts_resource_idx on alerts(resource_id) where status = 'active' and deleted_at is null;

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  alert_id uuid references alerts(id) on delete set null,
  kind text not null,
  title text not null,
  body text,
  link_url text,
  is_read boolean default false not null,
  read_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index notifications_user_unread_idx on notifications(user_id, created_at desc) where is_read = false;
create index notifications_user_all_idx on notifications(user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 12. CHANGE EVENTS (drives news + alerts + timeline)
-- ----------------------------------------------------------------------------

-- Every meaningful change to a resource generates a row here.
-- The news engine reads from this to auto-generate articles.
-- The alerts engine reads from this to fire price alerts.
create table change_events (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  deal_id uuid references deals(id) on delete cascade,
  kind text not null,                              -- price_change / version_release / capability_add / deal_added / deal_expired
  field_name text,                                 -- which field changed
  old_value jsonb,
  new_value jsonb,
  delta_pct numeric(8,4),                          -- for prices
  is_breaking boolean default false not null,
  generated_news_id uuid references news(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index change_events_resource_idx on change_events(resource_id, created_at desc);
create index change_events_kind_idx on change_events(kind, created_at desc);
create index change_events_recent_idx on change_events(created_at desc);

-- ----------------------------------------------------------------------------
-- 13. GATEWAY (the SaaS revenue layer)
-- ----------------------------------------------------------------------------
-- Pro users run MCPs / skills / agents through our gateway. We vault their
-- secrets, rate-limit, audit, and surface real usage telemetry.

create table gateway_secrets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,                              -- "GitHub PAT", "Stripe key"
  secret_kind text not null,                       -- api_key / oauth_token / pat
  encrypted_value text not null,                   -- KMS-encrypted
  encryption_key_id text not null,
  metadata jsonb default '{}'::jsonb,              -- scopes, expiry
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  revoked_at timestamptz
);

create unique index gateway_secrets_user_name_uniq on gateway_secrets(user_id, name) where revoked_at is null;
create index gateway_secrets_user_idx on gateway_secrets(user_id) where revoked_at is null;

create table gateway_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  resource_id uuid not null references resources(id) on delete cascade,
  config jsonb default '{}'::jsonb,                -- per-resource config
  rate_limit_rpm int default 60 not null,
  is_active boolean default true not null,
  total_invocations int default 0 not null,
  last_invocation_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create unique index gateway_subscriptions_user_resource_uniq on gateway_subscriptions(user_id, resource_id);
create index gateway_subscriptions_user_idx on gateway_subscriptions(user_id);

create table gateway_invocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  resource_id uuid not null references resources(id) on delete cascade,
  client ai_client,
  tool_name text,                                  -- which MCP tool
  input_tokens int,
  output_tokens int,
  cost_usd numeric(10,6),
  latency_ms int,
  succeeded boolean default true not null,
  failure_reason text,
  request_hash text,                               -- for caching
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index gateway_invocations_user_idx on gateway_invocations(user_id, created_at desc);
create index gateway_invocations_resource_idx on gateway_invocations(resource_id, created_at desc);
create index gateway_invocations_recent_idx on gateway_invocations(created_at desc);

-- ----------------------------------------------------------------------------
-- 14. SUBMISSIONS
-- ----------------------------------------------------------------------------

create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  resource_id uuid references resources(id) on delete set null,  -- null until published
  type_slug resource_type not null,
  source_url text,
  detected_metadata jsonb default '{}'::jsonb,     -- auto-extracted from source
  user_metadata jsonb default '{}'::jsonb,         -- form fields
  status publish_status default 'draft' not null,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  review_outcome review_outcome,
  rejection_reason text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index submissions_user_idx on submissions(user_id, created_at desc);
create index submissions_status_idx on submissions(status, created_at desc);

-- ----------------------------------------------------------------------------
-- 15. SAVED SEARCHES & COMPARISONS
-- ----------------------------------------------------------------------------

create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  query text,
  filters jsonb default '{}'::jsonb,
  alert_id uuid references alerts(id) on delete set null,
  created_at timestamptz default now() not null
);

create index saved_searches_user_idx on saved_searches(user_id);

create table comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  resource_ids uuid[] not null,
  type_slug resource_type not null,
  is_public boolean default false not null,
  share_token text unique default encode(gen_random_bytes(12), 'hex'),
  view_count int default 0 not null,
  created_at timestamptz default now() not null,
  constraint resource_count check (array_length(resource_ids, 1) between 2 and 6)
);

create index comparisons_user_idx on comparisons(user_id);
create index comparisons_token_idx on comparisons(share_token);

-- ----------------------------------------------------------------------------
-- 16. FUNCTIONS
-- ----------------------------------------------------------------------------

-- Universal updated_at trigger
create or replace function tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Recompute trending score (weighted: 60% installs/wk, 30% views/wk, 10% rating).
create or replace function fn_recompute_trending(target_resource_id uuid)
returns void language plpgsql as $$
declare
  v_score numeric;
begin
  select
    (coalesce(install_count_7d, 0) * 0.6) +
    (coalesce(view_count_7d, 0) * 0.3) +
    (coalesce(rating_avg, 0) * coalesce(review_count, 0) * 0.1)
  into v_score
  from resources where id = target_resource_id;

  update resources set trending_score = v_score where id = target_resource_id;
end;
$$;

-- Recompute rating average + count after a review insert/update/delete
create or replace function fn_recompute_resource_rating()
returns trigger language plpgsql as $$
declare
  v_resource_id uuid;
begin
  v_resource_id = coalesce(new.resource_id, old.resource_id);

  update resources set
    rating_avg = (
      select avg(rating)::numeric(3,2) from reviews
      where resource_id = v_resource_id and deleted_at is null
    ),
    review_count = (
      select count(*) from reviews
      where resource_id = v_resource_id and deleted_at is null
    )
  where id = v_resource_id;

  return coalesce(new, old);
end;
$$;

-- Increment install_count and create user_activity row on insert
create or replace function fn_after_install_event()
returns trigger language plpgsql as $$
begin
  -- Bump aggregate counters
  update resources set
    install_count_total = install_count_total + 1,
    install_count_7d = install_count_7d + 1,
    install_count_30d = install_count_30d + 1
  where id = new.resource_id;

  -- User activity (only for logged-in users)
  if new.user_id is not null then
    insert into user_activity(user_id, resource_id, activity_kind, metadata)
    values (new.user_id, new.resource_id, 'installed',
      jsonb_build_object('client', new.client, 'method', new.install_method));
  end if;

  return new;
end;
$$;

-- Generate news on big change events
create or replace function fn_after_change_event()
returns trigger language plpgsql as $$
declare
  v_resource record;
  v_news_id uuid;
  v_title text;
  v_kind news_kind;
begin
  -- Only auto-generate news for significant events
  if new.kind not in ('price_change', 'version_release', 'capability_add', 'deal_added') then
    return new;
  end if;

  -- For price changes, only if delta exceeds 10%
  if new.kind = 'price_change' and abs(coalesce(new.delta_pct, 0)) < 10 then
    return new;
  end if;

  if new.resource_id is not null then
    select * into v_resource from resources where id = new.resource_id;

    v_title = case new.kind
      when 'price_change' then v_resource.name || ' ' ||
        (case when new.delta_pct < 0 then 'price dropped' else 'price increased' end) ||
        ' ' || abs(new.delta_pct)::text || '%'
      when 'version_release' then v_resource.name || ' ' || (new.new_value->>'version') || ' released'
      when 'capability_add' then v_resource.name || ' adds ' || (new.new_value->>'capability')
      else v_resource.name || ' updated'
    end;

    v_kind = case new.kind
      when 'price_change' then 'price_change'::news_kind
      when 'version_release' then 'release'::news_kind
      else 'ecosystem'::news_kind
    end;

    insert into news(slug, title, summary, kind, source_kind, source_name,
                     published_at, related_resource_ids)
    values (
      lower(regexp_replace(v_title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' ||
        substring(gen_random_uuid()::text, 1, 8),
      v_title,
      'Auto-generated from ' || v_resource.name || ' change feed.',
      v_kind, 'auto_generated', 'Vibe Coder Hub auto-feed',
      now(), array[new.resource_id]
    )
    returning id into v_news_id;

    update change_events set generated_news_id = v_news_id where id = new.id;
  end if;

  return new;
end;
$$;

-- Bump bookmark count
create or replace function fn_after_bookmark()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update resources set bookmark_count = bookmark_count + 1 where id = new.resource_id;
  elsif (tg_op = 'DELETE') then
    update resources set bookmark_count = greatest(bookmark_count - 1, 0) where id = old.resource_id;
  end if;
  return coalesce(new, old);
end;
$$;

-- Tier check: is the user allowed to see/use this?
create or replace function fn_user_has_tier(check_tier subscription_tier)
returns boolean language sql stable as $$
  select case
    when auth.uid() is null then check_tier = 'free'
    else exists (
      select 1 from profiles
      where id = auth.uid()
        and (
          subscription_tier = 'pro' or
          (subscription_tier = 'member' and check_tier in ('free', 'member')) or
          (subscription_tier = 'free' and check_tier = 'free')
        )
        and (subscription_expires_at is null or subscription_expires_at > now())
    )
  end;
$$;

-- ----------------------------------------------------------------------------
-- 17. TRIGGERS
-- ----------------------------------------------------------------------------

-- updated_at on every table that has it
do $$
declare t text;
begin
  for t in
    select table_name from information_schema.columns
    where column_name = 'updated_at'
      and table_schema = 'public'
      and table_name not like 'pg_%'
  loop
    execute format(
      'drop trigger if exists tg_%I_updated_at on %I; ' ||
      'create trigger tg_%I_updated_at before update on %I ' ||
      'for each row execute function tg_set_updated_at();',
      t, t, t, t
    );
  end loop;
end $$;

create trigger tg_reviews_recompute_rating
  after insert or update or delete on reviews
  for each row execute function fn_recompute_resource_rating();

create trigger tg_install_events_after
  after insert on install_events
  for each row execute function fn_after_install_event();

create trigger tg_change_events_after
  after insert on change_events
  for each row execute function fn_after_change_event();

create trigger tg_bookmarks_after
  after insert or delete on bookmarks
  for each row execute function fn_after_bookmark();

-- ----------------------------------------------------------------------------
-- 18. ROW-LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- Default deny on every table; explicit allow policies below.

alter table profiles enable row level security;
alter table user_stacks enable row level security;
alter table api_keys enable row level security;
alter table resources enable row level security;
alter table resource_versions enable row level security;
alter table components enable row level security;
alter table mcps enable row level security;
alter table models enable row level security;
alter table model_price_history enable row level security;
alter table model_providers enable row level security;
alter table model_benchmarks enable row level security;
alter table skills enable row level security;
alter table subagents enable row level security;
alter table scripts enable row level security;
alter table rules enable row level security;
alter table prompts enable row level security;
alter table plugins enable row level security;
alter table marketplaces enable row level security;
alter table hooks enable row level security;
alter table commands enable row level security;
alter table starters enable row level security;
alter table tools enable row level security;
alter table sandboxes enable row level security;
alter table observability enable row level security;
alter table backend_kits enable row level security;
alter table assets enable row level security;
alter table showcase enable row level security;
alter table docs_for_llms enable row level security;
alter table specs enable row level security;
alter table workflows enable row level security;
alter table evals enable row level security;
alter table reviews enable row level security;
alter table review_votes enable row level security;
alter table comments enable row level security;
alter table prompting_tips enable row level security;
alter table bookmarks enable row level security;
alter table collections enable row level security;
alter table compatibility_reports enable row level security;
alter table resource_dependencies enable row level security;
alter table resource_alternatives enable row level security;
alter table use_cases enable row level security;
alter table best_for enable row level security;
alter table deals enable row level security;
alter table deal_claims enable row level security;
alter table news enable row level security;
alter table newsletter_subscribers enable row level security;
alter table guides enable row level security;
alter table guide_steps enable row level security;
alter table guide_completions enable row level security;
alter table install_events enable row level security;
alter table view_events enable row level security;
alter table user_activity enable row level security;
alter table alerts enable row level security;
alter table notifications enable row level security;
alter table change_events enable row level security;
alter table gateway_secrets enable row level security;
alter table gateway_subscriptions enable row level security;
alter table gateway_invocations enable row level security;
alter table submissions enable row level security;
alter table saved_searches enable row level security;
alter table comparisons enable row level security;

-- Profiles: anyone can read, only the owner can update.
create policy "profiles_public_read" on profiles
  for select using (deleted_at is null);
create policy "profiles_owner_update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_self_insert" on profiles
  for insert with check (auth.uid() = id);

-- User stacks: owner sees all theirs, public ones visible to all.
create policy "user_stacks_owner_all" on user_stacks
  for all using (auth.uid() = user_id);
create policy "user_stacks_public_read" on user_stacks
  for select using (is_public = true and deleted_at is null);

-- API keys: only the owner.
create policy "api_keys_owner_all" on api_keys
  for all using (auth.uid() = user_id);

-- Resources: published rows readable by anyone, owners see their drafts too.
create policy "resources_public_read" on resources
  for select using (status = 'published' and deleted_at is null);
create policy "resources_owner_read" on resources
  for select using (auth.uid() = author_id);
create policy "resources_owner_write" on resources
  for all using (auth.uid() = author_id);

-- Type-extension tables: same pattern — readable iff parent resource is readable.
do $$
declare t text;
begin
  for t in select unnest(array[
    'components','mcps','models','model_price_history','model_providers',
    'model_benchmarks','skills','subagents','scripts','rules','prompts',
    'plugins','marketplaces','hooks','commands','starters','tools',
    'sandboxes','observability','backend_kits','assets','showcase',
    'docs_for_llms','specs','workflows','evals','resource_versions'
  ])
  loop
    execute format($f$
      create policy "%1$s_public_read" on %1$I
        for select using (
          exists (select 1 from resources r where r.id = %1$I.id
                  and r.status = 'published' and r.deleted_at is null)
        );
      create policy "%1$s_owner_all" on %1$I
        for all using (
          exists (select 1 from resources r where r.id = %1$I.id and r.author_id = auth.uid())
        );
    $f$, t);
  end loop;
end $$;

-- Reviews: anyone reads, logged-in users write their own.
create policy "reviews_public_read" on reviews
  for select using (deleted_at is null);
create policy "reviews_owner_write" on reviews
  for all using (auth.uid() = user_id);

-- Bookmarks: only the owner.
create policy "bookmarks_owner_all" on bookmarks
  for all using (auth.uid() = user_id);

-- Collections: owner sees all theirs, public ones readable.
create policy "collections_owner_all" on collections
  for all using (auth.uid() = user_id);
create policy "collections_public_read" on collections
  for select using (is_public = true and deleted_at is null);

-- Comments: anyone reads non-deleted, owners write theirs.
create policy "comments_public_read" on comments
  for select using (deleted_at is null);
create policy "comments_owner_write" on comments
  for all using (auth.uid() = user_id);

-- Deals: public read of active. Pro deals visible to all but the apply_url
-- and redemption_steps should be filtered in the application layer based on tier.
create policy "deals_public_read" on deals
  for select using (deleted_at is null);

-- Deal claims: only the user.
create policy "deal_claims_owner_all" on deal_claims
  for all using (auth.uid() = user_id);

-- News: anyone reads.
create policy "news_public_read" on news
  for select using (deleted_at is null);

-- Newsletter subscribers: only via service role + the user themselves.
create policy "newsletter_self_read" on newsletter_subscribers
  for select using (auth.uid() = user_id);
create policy "newsletter_self_insert" on newsletter_subscribers
  for insert with check (true);  -- email-only signup ok

-- Guides: anyone reads published.
create policy "guides_public_read" on guides
  for select using (is_published = true and deleted_at is null);
create policy "guides_owner_all" on guides
  for all using (auth.uid() = author_id);

create policy "guide_steps_public_read" on guide_steps
  for select using (
    exists (select 1 from guides g where g.id = guide_steps.guide_id
            and g.is_published = true and g.deleted_at is null)
  );

create policy "guide_completions_owner_all" on guide_completions
  for all using (auth.uid() = user_id or user_id is null);

-- Install / view events: anyone can write, no read except service.
create policy "install_events_anyone_insert" on install_events
  for insert with check (true);
create policy "install_events_owner_read" on install_events
  for select using (auth.uid() = user_id);

create policy "view_events_anyone_insert" on view_events
  for insert with check (true);

-- User activity: only the owner.
create policy "user_activity_owner_read" on user_activity
  for select using (auth.uid() = user_id);

-- Alerts: only the owner.
create policy "alerts_owner_all" on alerts
  for all using (auth.uid() = user_id);

-- Notifications: only the owner.
create policy "notifications_owner_all" on notifications
  for all using (auth.uid() = user_id);

-- Change events: public read (drives news + timeline).
create policy "change_events_public_read" on change_events
  for select using (true);

-- Gateway secrets: only the owner.
create policy "gateway_secrets_owner_all" on gateway_secrets
  for all using (auth.uid() = user_id);

-- Gateway subscriptions: only the owner.
create policy "gateway_subscriptions_owner_all" on gateway_subscriptions
  for all using (auth.uid() = user_id);

-- Gateway invocations: only the owner reads, anyone (auth'd) inserts.
create policy "gateway_invocations_owner_read" on gateway_invocations
  for select using (auth.uid() = user_id);
create policy "gateway_invocations_owner_insert" on gateway_invocations
  for insert with check (auth.uid() = user_id);

-- Submissions: only the owner.
create policy "submissions_owner_all" on submissions
  for all using (auth.uid() = user_id);

-- Saved searches: only the owner.
create policy "saved_searches_owner_all" on saved_searches
  for all using (auth.uid() = user_id);

-- Comparisons: owner reads/writes their own, public ones readable.
create policy "comparisons_owner_all" on comparisons
  for all using (auth.uid() = user_id);
create policy "comparisons_public_read" on comparisons
  for select using (is_public = true);

-- Reference / lookup tables: anyone reads.
create policy "use_cases_public_read" on use_cases for select using (true);
create policy "best_for_public_read" on best_for for select using (true);
create policy "resource_alternatives_public_read" on resource_alternatives for select using (true);
create policy "resource_dependencies_public_read" on resource_dependencies for select using (true);
create policy "review_votes_public_read" on review_votes for select using (true);
create policy "review_votes_owner_write" on review_votes
  for insert with check (auth.uid() = user_id);
create policy "compatibility_reports_public_read" on compatibility_reports for select using (true);
create policy "compatibility_reports_owner_insert" on compatibility_reports
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "prompting_tips_public_read" on prompting_tips for select using (true);
create policy "prompting_tips_owner_write" on prompting_tips
  for all using (auth.uid() = user_id);
create policy "model_price_history_public_read" on model_price_history for select using (true);
create policy "model_providers_public_read" on model_providers for select using (true);
create policy "model_benchmarks_public_read" on model_benchmarks for select using (true);

-- ----------------------------------------------------------------------------
-- 19. STORAGE BUCKETS
-- ----------------------------------------------------------------------------
-- Run these via Supabase dashboard or storage admin client; included as a guide.
--
-- create bucket public/avatars                — user avatars (auth-only write, public read)
-- create bucket public/resource-thumbnails    — thumbnails (admin write, public read)
-- create bucket public/resource-screenshots   — galleries (admin write, public read)
-- create bucket public/showcase-screenshots   — showcase (auth write, public read)
-- create bucket public/news-hero-images       — news (admin write, public read)
-- create bucket private/gateway-secrets       — encrypted secrets (service role only)
-- create bucket private/submissions-temp      — submission drafts (owner-only)
--
-- Set bucket policies in supabase dashboard; storage RLS lives there separately.

-- ----------------------------------------------------------------------------
-- 20. SEED HELPERS
-- ----------------------------------------------------------------------------
-- Convenience function: insert a resource of any type with sane defaults.

create or replace function fn_seed_resource(
  p_type resource_type,
  p_slug text,
  p_name text,
  p_tagline text default null,
  p_author_handle text default 'system'
) returns uuid language plpgsql as $$
declare
  v_id uuid;
begin
  insert into resources(type_slug, slug, name, tagline, author_handle, status, published_at)
  values (p_type, p_slug, p_name, p_tagline, p_author_handle, 'published', now())
  returning id into v_id;

  return v_id;
end;
$$;

-- Example: seed the use_cases table with the 12 most common starter use cases.
insert into use_cases(slug, name, description) values
  ('saas-mvp', 'SaaS MVP', 'Auth, payments, dashboard, deploy. The full starter loop.'),
  ('landing-page', 'Landing page', 'Hero, features, pricing, CTA. Often vibe-coded in an evening.'),
  ('chatbot', 'AI chatbot', 'Chat UI, model integration, conversation memory.'),
  ('rag-pipeline', 'RAG pipeline', 'Retrieval-augmented generation with vector DB and embeddings.'),
  ('agent-system', 'Agent system', 'Multi-step autonomous workflows with tool use.'),
  ('browser-automation', 'Browser automation', 'Programmatic browser control via Playwright/Puppeteer.'),
  ('web-scraping', 'Web scraping', 'Structured data extraction from web pages.'),
  ('e2e-testing', 'E2E testing', 'End-to-end test automation for web apps.'),
  ('content-generation', 'Content generation', 'Bulk blog, marketing, or social content.'),
  ('code-review', 'Code review', 'Automated code analysis, security scans, refactor suggestions.'),
  ('data-analysis', 'Data analysis', 'CSV / database queries with natural-language interfaces.'),
  ('design-to-code', 'Design to code', 'Figma / sketch → React / HTML / Tailwind.')
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 21. VIEWS (read-optimised, used by the front-end)
-- ----------------------------------------------------------------------------

-- v_resource_card: everything needed to render a card without joining 6 tables.
create or replace view v_resource_card as
select
  r.id,
  r.type_slug,
  r.slug,
  r.name,
  r.tagline,
  r.thumbnail_url,
  r.compatible_clients,
  r.stack_tags,
  r.install_count_7d,
  r.rating_avg,
  r.review_count,
  r.bookmark_count,
  r.is_featured,
  r.health_score,
  r.updated_at,
  -- Author for display
  p.username as author_username,
  p.avatar_url as author_avatar_url,
  -- Type-specific badge fields (model only, surface for cards)
  m.blended_cost_per_mtok as model_blended_cost,
  m.intelligence_index as model_intelligence,
  m.context_window_advertised as model_context_window
from resources r
left join profiles p on p.id = r.author_id
left join models m on m.id = r.id and r.type_slug = 'model'
where r.status = 'published' and r.deleted_at is null;

-- v_trending_per_type: top 50 trending per resource type, refreshed nightly.
create materialized view v_trending_per_type as
select * from (
  select
    r.*,
    row_number() over (partition by r.type_slug order by r.trending_score desc) as type_rank
  from resources r
  where r.status = 'published' and r.deleted_at is null
) ranked
where type_rank <= 50;

create unique index v_trending_per_type_idx on v_trending_per_type(type_slug, type_rank);

-- v_news_feed: news with linked resource info pre-joined.
create or replace view v_news_feed as
select
  n.*,
  array(
    select jsonb_build_object('id', r.id, 'name', r.name, 'slug', r.slug, 'type_slug', r.type_slug)
    from resources r where r.id = any(n.related_resource_ids)
  ) as related_resources_data
from news n
where n.deleted_at is null;

-- ----------------------------------------------------------------------------
-- 22. SCHEDULED JOBS (run via pg_cron or supabase cron)
-- ----------------------------------------------------------------------------
-- Refresh trending materialised view nightly:
--   select cron.schedule('refresh-trending', '0 3 * * *',
--     'refresh materialized view concurrently v_trending_per_type');
--
-- Decay 7-day install counts hourly:
--   select cron.schedule('decay-install-counts', '0 * * * *',
--     'update resources set
--        install_count_7d = greatest(install_count_7d - install_count_7d / 168, 0),
--        install_count_30d = greatest(install_count_30d - install_count_30d / 720, 0)
--      where install_count_7d > 0 or install_count_30d > 0');
--
-- Generate weekly newsletter at Tuesday 9am UTC:
--   select cron.schedule('weekly-digest', '0 9 * * 2', 'select fn_generate_weekly_digest()');
--
-- Expire stale deals nightly:
--   select cron.schedule('expire-deals', '0 0 * * *',
--     'update deals set status = ''expired'' where expires_at < now() and status = ''active''');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

~~~~~~~~~~

---

## File 5 of 6: `vibe-coder-hub-data-sourcing.md`

~~~~~~~~~~vibe-coder-hub-data-sourcing.md
# Vibe Coder Hub — Data Sourcing Plan

> **Where every row in the database comes from, how often it refreshes, and what breaks when each source goes down.**

This plan maps every one of the 27 resource types plus deals, news, and guides to its actual data source. It distinguishes between:

- **Primary feeds** — APIs we read on a schedule
- **Mirrors** — registries we mirror in bulk
- **Scrapers** — sites without APIs, parsed with care
- **Webhooks** — push-based updates (cheaper than polling)
- **Manual editorial** — human-curated content
- **Community submissions** — user-contributed via `/submit`

Every source has a cron cadence, an owner, a fallback, and a degradation strategy.

---

## §1. The four-track data strategy

Don't try to do everything via API. Vibe Coder Hub's data needs split into four tracks with different economics:

**Track A — Real-time, machine-readable (cheap, reliable).** Models, MCPs, components, hardware. Sources have APIs or structured JSON. Update hourly to daily. ~70% of the database lives here.

**Track B — Scraped or RSS'd (medium cost, medium reliability).** News stories from vendor blogs, deal updates, guide source material. Update every 1-6 hours. Builds the "What's New" feed and feeds change events.

**Track C — Editorial (high cost, high quality).** Curated lists, alternatives mappings, "best for" rankings, deal verification, workflow recipes, prompting tips. Updated weekly by a small editorial team (1 person at start). The defensible moat.

**Track D — Community (low cost, high volume).** User submissions, reviews, compatibility reports, prompting tips, forks, stacks. Driven by the `/submit` flow and gated on a 24-hour review SLA for new authors, auto-publish for verified ones.

The mix matters. Pure aggregators (Smithery, OpenRouter) only do Track A and lose to whoever does B+C better. Editorial-only sites (Awesome lists) only do C and miss real-time signal. Vibe Coder Hub wins by being the only site doing all four.

---

## §2. Models — sources and schedule

The single most-visited page on the site needs the most accurate data. Pricing changes daily, benchmarks update weekly, new models drop weekly.

### Primary source: Artificial Analysis API v2

The authoritative source. Their `/api/v2/data/llms/models` endpoint returns full model metadata for 377+ models including:

- Intelligence Index v4.0 (composite of GDPval-AA, τ²-Bench, Terminal-Bench Hard, SciCode, AA-LCR, AA-Omniscience, IFBench, HLE, GPQA Diamond, CritPt)
- Coding Index, Math Index
- Per-benchmark scores (mmlu_pro, gpqa, hle, livecodebench, scicode, math_500, aime)
- Pricing: input, output, cached, blended (3:1 ratio)
- Median tokens/sec, median TTFT, end-to-end response time
- Context window, parameters (total + active)
- Release date, openness index (for open-weights)

**Cost:** API key required. Pricing not public — assume $200-500/month for our volume.
**Cadence:** Every 4 hours. Their data refreshes a few times per day.
**Maps to:** `models`, `model_benchmarks`, populates `resources` parent row.
**Fallback:** If down, we keep serving last cached values. Card stat strip shows "as of [timestamp]".

### Secondary source: OpenRouter Models API

OpenRouter's `/api/v1/models` endpoint lists 400+ models with pricing across providers. Free, no auth required.

**Use:** Provider-availability table (which providers host which models, at what price). This is what makes the `model_providers` table actually populate. Also catches models AA doesn't track yet.
**Cadence:** Every 6 hours.
**Maps to:** `model_providers` table, plus `models` records for anything AA missed.

### Tertiary: First-party provider APIs

For models from Anthropic, OpenAI, Google, Mistral, Cohere, xAI, Groq, Together, Fireworks — hit each provider's own model-list endpoint. Most expose `/v1/models`. Use these to:

- Catch capability flags AA doesn't track (e.g., audio support, computer use)
- Verify pricing matches what providers actually charge
- Pick up beta/preview models before AA indexes them

**Cadence:** Daily. Each provider gets its own scraper task.
**Maps to:** Capability flags on `models`, regional availability.

### For open-weights specifically: HuggingFace Hub API

`huggingface_hub` Python library, or the `/api/models?search={query}` REST endpoint.

**Use:** Pull HF model card, license, downloads count, recommended GGUF/AWQ quantizations. Populates the open-weights detail page blocks.
**Cadence:** Daily for already-tracked models, weekly full search to find new ones.
**Maps to:** `models.huggingface_id`, `models.parameters_billions`, `models.architecture`, `models.recommended_quantization`.

### Pricing history: our own change_events

Every time the AA poller sees a price differ from what's stored, write to `model_price_history` AND `change_events`. The change_events row triggers:

- `news` auto-generated story (if delta > 10%)
- All `alerts` for users watching this model
- The price sparkline on the model detail page

**No external dependency.** Pricing history is built by us, accumulating over time.

### Schedule summary

```
Every 4h    AA API poll        → models, benchmarks, pricing
Every 6h    OpenRouter poll    → model_providers, new models
Daily 02:00 Provider APIs      → capability verification
Daily 03:00 HuggingFace poll   → open-weights metadata
Weekly Sun  HF full search     → discover new open-weights models
```

---

## §3. MCP Servers — sources and schedule

The MCP ecosystem has three competing registries. We mirror all three and deduplicate.

### Primary: Official MCP Registry

`registry.modelcontextprotocol.io` — Anthropic-backed, this is becoming canonical. Has an API (under `/v0/`) and publishes daily snapshots.

**Use:** Source of truth for officially listed MCPs. ~500+ servers at launch, growing.
**Cadence:** Snapshot ingest every 6 hours. Diff against our store to find new/updated.
**Maps to:** `mcps`, parent `resources` row, `mcps.tools` array from server metadata.

### Secondary: Smithery Registry API

`GET https://registry.smithery.ai/servers` with semantic search and filters (`owner:`, `repo:`, `is:deployed`). 7,300+ servers, including local + hosted variants.

**Use:** Broader coverage including hosted servers we wouldn't otherwise see. The Smithery CLI is itself open source — we can mirror its registry index.
**Auth:** API key required for higher rate limits.
**Cadence:** Every 6 hours.
**Maps to:** New `mcps` records, `mcps.install_configs` (Smithery provides per-client install JSON).

### Tertiary: Glama

`glama.ai/mcp/servers` — third aggregator, lighter coverage but catches some not in the other two.

**Cadence:** Daily.

### Deduplication strategy

A canonical MCP is identified by its `source_url` (GitHub repo URL). When the same MCP appears in multiple registries, merge to one `resources` row and store registry-specific install configs in `mcps.install_configs`:

```jsonb
{
  "official": { "command": "npx", "args": ["..."] },
  "smithery_hosted": "https://server.smithery.ai/abc",
  "smithery_local": { "command": "...", ... },
  "cursor_deeplink": "cursor://anysphere.cursor-deeplink/mcp/install?...",
  "claude_desktop": { "mcpServers": { ... } }
}
```

### Tool extraction

For self-hosted (stdio) MCPs we can't inspect remotely. For Smithery-hosted MCPs, hit `https://server.smithery.ai/{id}/.well-known/mcp.json` to get the tool schema. For Official Registry entries, the schema is usually published in the registry record.

**Fallback for stdio MCPs:** Parse the GitHub README for tool descriptions. Imperfect but better than nothing. Mark `mcps.tools` with `source: 'readme_parsed'` so we know which entries to trust less.

### Schedule summary

```
Every 6h    Official Registry → mcps, resources
Every 6h    Smithery API      → mcps, install_configs
Daily       Glama scrape      → mcps backfill
Daily       Tool schema fetch → mcps.tools refresh
Weekly      README re-parse   → stdio-only MCP tools
```

---

## §4. Components — sources and schedule

Components are the most fragmented. Multiple competing registries with no unified API.

### Primary: shadcn/ui official registry

`https://ui.shadcn.com/r/{component}.json` — JSON registry following the shadcn schema. Plus the official directory at `/docs/directory` lists community registries.

**Use:** Ground truth for shadcn-style components.
**Cadence:** Daily.
**Maps to:** `components`, `resources`.

### Secondary: 21st.dev API

21st.dev is the biggest community marketplace (~5K components). They expose a JSON registry per component at `/r/{username}/{slug}` following the shadcn schema. The website itself has a sitemap we can crawl.

**Approach:** Pull their sitemap, queue each component URL, fetch the registry JSON, ingest.
**Cadence:** Daily for known components, weekly sitemap re-crawl to find new ones.
**Maps to:** `components`, with `install_command = "npx shadcn@latest add https://21st.dev/r/{...}"`.

### Tertiary: registry.directory aggregated list

`registry.directory` lists every known shadcn-compatible registry. Use it as a discovery feed — when it shows a new registry, add it to our crawl list.

**Cadence:** Weekly.

### Specific registries to mirror

Each is a JSON registry endpoint we can ingest as-is:

- MagicUI (`magicui.design/r/{component}.json`)
- Aceternity UI
- Origin UI
- AnimateUI
- Tremor
- KokonutUI
- skiper-ui
- shadcn-form-build
- Plus the ~30 others listed on registry.directory

For each: hit the registry index, mirror to our `components` table, store source URL for re-fetch.

### Live previews

The `preview_url` field on `components` should point to a working live demo. Three strategies:

1. **Sandpack-render in-browser** for components that work standalone. Best UX, free.
2. **Iframe to the source registry's preview page** (e.g., `https://21st.dev/preview/...`). Cheap, but breaks if source moves.
3. **Self-hosted preview deployment** on Cloudflare Pages for heavy components. Expensive, only worth it for editor's picks.

Pick strategy 1 by default. Fall back to 2.

### Schedule summary

```
Daily        shadcn registry      → components
Daily        21st.dev sitemap     → components (known)
Weekly Sun   21st.dev full crawl  → discover new
Weekly Mon   registry.directory   → discover new registries
Daily        Each known registry  → refresh components
```

---

## §5. Tools (IDEs, agents, app builders) — sources

Mostly editorial. There's no API for "all AI IDEs." This is Track C.

### Source: editorial + GitHub repos

For open-source tools (Cline, Aider, Continue, Zed, Roo, Cody), pull from their GitHub repos:
- `package.json` for name + description + version
- `README.md` for features
- `/releases` API for version history
- Latest release notes for changelog

For closed-source tools (Cursor, Windsurf, GitHub Copilot, Replit Agent, Lovable, Bolt, v0, Base44, Tempo, Emergent), pull from:
- Vendor pricing page (scraped)
- Vendor changelog page (RSS where available)
- App stores (Mac App Store, Microsoft Store) for download counts where exposed

### Schedule

```
Weekly Mon  Editorial review     → tools (pricing tier updates)
Daily       Vendor changelog RSS → change_events, news
Weekly      GitHub release polls → tools.versions
Monthly     Manual price audit   → tools.pricing_tiers
```

### List to maintain manually

Start with these 22 tools curated. Editorial team adds new entrants weekly:

`Cursor, Claude Code, Windsurf, Cline, Roo, Aider, Continue, Zed, Kiro, Codex, Gemini CLI, Claude Desktop, GitHub Copilot, Cody, Bolt, Lovable, v0, Replit Agent, Base44, Tempo, Emergent, Rosebud`

---

## §6. Skills, Subagents, Rules, Prompts, Commands, Hooks, Specs — sources

The "agent extension" categories. Heavy on community contributions.

### Primary: GitHub search

GitHub has the data. Run targeted searches:

```
# Find SKILL.md files
GET /search/code?q=filename:SKILL.md+language:markdown

# Find agent.md files
GET /search/code?q=filename:agent.md

# Find .cursorrules
GET /search/code?q=filename:.cursorrules

# Find CLAUDE.md
GET /search/code?q=filename:CLAUDE.md

# Find AGENTS.md
GET /search/code?q=filename:AGENTS.md

# Find slash commands
GET /search/code?q=path:.claude/commands+extension:md
```

**Rate limits:** 30 requests/minute authenticated. 10/min unauthenticated. Use an auth token.

**Process:** For each result, parse the file, extract frontmatter, store. Skip files in repos with < 5 stars to filter noise.

**Cadence:** Daily for incremental search (`pushed:>YYYY-MM-DD`), weekly for full re-scan.

### Secondary: cursor.directory

`cursor.directory` — the largest community rules directory. Has a JSON dump at `/api/rules`. Mirror it.

**Cadence:** Daily.
**Maps to:** `rules`.

### Tertiary: buildwithclaude marketplace

`buildwithclaude` is a Claude Code marketplace. Their plugins.json is on GitHub. Mirror it.

**Cadence:** Daily.
**Maps to:** `plugins`, `marketplaces`, all bundled `skills`/`subagents`/`commands`/`hooks`.

### Quaternary: dotcursorrules.com, rules.directory

Smaller registries. Mirror weekly.

### Frontmatter parsing pipeline

Each file type has a known frontmatter schema. Parse it strictly. If frontmatter is missing or malformed, mark the resource as `status = 'draft'` and queue for editorial review rather than auto-publishing garbage.

### Schedule summary

```
Daily        GitHub code search    → skills, subagents, rules, prompts, commands, hooks
Daily        cursor.directory      → rules
Daily        buildwithclaude       → plugins, marketplaces, bundled resources
Weekly Sat   GitHub full re-scan   → catch what daily search missed
Weekly Mon   Stale-content check   → mark unmaintained resources
```

### Quality filter

GitHub search returns millions of files. We can't index all of them. Apply these filters at ingestion:

- Repository has ≥ 5 stars OR resource has ≥ 3 forks OR file is in a curated marketplace
- Frontmatter is valid (parses cleanly)
- Description field is ≥ 20 characters
- File is not in a `.example/` or `/templates/` or `/test/` directory

Approve everything else through `/submit`.

---

## §7. Starters, Showcase, Workflows — sources

Mix of curated and community-submitted.

### Starters: GitHub repo search + editorial

Search GitHub for repos tagged `nextjs-starter`, `saas-starter`, `react-starter`, etc. Filter by:

- Has README mentioning AI IDE compatibility (Cursor, Claude Code, etc.)
- Has `.cursorrules` OR `CLAUDE.md` OR `AGENTS.md`
- ≥ 50 stars

**Auto-import metadata:** README parsing for stack, deploy targets, features. Editorial verifies pricing/cost-to-run.

### Showcase: community submissions + Twitter monitoring

Submitted via `/submit` for builders showcasing their projects. Verified by:

1. URL is reachable
2. Built-with claims spot-checked (e.g., "built with Cursor" — we ask for a screenshot of the project in Cursor)
3. Live URL is HTTPS, loads in <3 seconds

**Discovery:** Watch Twitter for tweets matching `("built with" OR "vibe coded") (cursor OR claude code OR windsurf)`. Editorial team triages weekly.

### Workflows: pure editorial

These are recipes. They take time to write and verify. Editorial team produces 1-2 per week. Outsource generation to vetted contributors paid per published workflow (~$200 each).

### Schedule summary

```
Weekly Mon   GitHub starter search → starters (candidates)
Weekly Tue   Editorial review      → starters (publish)
Daily        /submit queue review  → showcase, all types
Weekly Wed   Twitter showcase scan → showcase candidates
Weekly       Editorial workflow    → workflows (1-2 new per week)
```

---

## §8. Sandboxes, Observability, Backend Kits — sources

Small, slow-changing categories. Editorial primary.

### List to maintain (~50 entries total across the three types)

**Sandboxes:** E2B, Daytona, CodeSandbox, StackBlitz WebContainer, Modal, RunPod, fly.io machines, Replicate, BeamAI, Together compute, Cloudflare Workers/Containers.

**Observability:** Langfuse, Helicone, LangSmith, Braintrust, Weights & Biases (W&B), Datadog LLM Observability, Lunary, PromptLayer, Comet/Opik, Pezzo, Traceloop.

**Backend Kits:** Convex, Supabase, Firebase, Neon, PlanetScale, Better Auth, Clerk, Auth0, WorkOS, Stripe, Lemon Squeezy, Polar, Resend, Loops, Postmark, R2, S3, Cloudflare D1, Upstash.

### Approach

For each entry: editorial creates the row, populates pricing tiers, then maintains via:

- **RSS/changelog** for product updates → feed `change_events`
- **Pricing page scraper** weekly for `pricing_tiers` accuracy
- **GitHub releases poll** for version tracking

**Cadence:**
```
Weekly Mon   Pricing page audit       → backend_kits, observability, sandboxes
Daily        Vendor changelog RSS     → change_events
Daily        GitHub release polls     → version tracking
```

---

## §9. Assets — sources

The asset category covers icons, illustrations, fonts, Lottie, 3D, gradients.

### Source: known asset registries + editorial

**Open-source registries to mirror:**

- Lucide (`lucide.dev/api/icons`)
- Heroicons (`heroicons.com/api`)
- Phosphor Icons
- Tabler Icons
- Iconify (one API, 100+ icon sets)
- Google Fonts API
- Bunny Fonts
- LottieFiles (community API)

**Discovery:** Weekly scan of Awwwards "free assets" + Smashing Magazine releases + Twitter `#freeassets`.

### Schedule

```
Weekly       Asset registry mirror    → assets
Weekly       Editorial discovery scan → assets (candidates)
```

---

## §10. Docs-for-LLMs (llms.txt) — sources

### Primary: Context7

`context7.com` indexes thousands of libraries. They expose `/{library}/llms.txt` and `/{library}/llms-full.txt`. Mirror their index.

**Cadence:** Weekly to discover new libraries. Per-library refresh handled by Context7.

### Secondary: llmstxt.org directory

`llmstxt.org/listing` lists sites that publish their own llms.txt. Crawl it.

**Cadence:** Weekly.

### Tertiary: Direct site crawling

For sites not in either index but on our `must-have` list (Convex, Better Auth, our partner backends), check `{site}/llms.txt` directly weekly.

**Maps to:** `docs_for_llms` table with `coverage` JSONB populated from analyzing the llms.txt content.

---

## §11. Stacks — only user-generated

No external source. Stacks are created by users via the stack picker and stored in `user_stacks`. Public stacks become discoverable via the directory.

**Seeding strategy at launch:** Editorial team creates ~30 starter stacks under a `@vch-curated` account. "Solo SaaS Stack," "Marketing Site Stack," "AI Chatbot Stack," etc. These give early visitors something to adopt.

---

## §12. Scripts — sources

Same as Skills/Rules: GitHub code search for shell, Python, TS scripts in repos tagged `vibe-coding`, `claude-code`, `cursor`, etc.

**Safety filter at ingestion:**
- Static analysis on every script
- Flag scripts that: write outside `~/`, use `sudo`, `curl | bash` patterns, network calls to unknown domains
- Surface flags in the safety review block on the detail page
- Auto-reject scripts that look obviously malicious

---

## §13. Evals — sources

Editorial-only at launch. There are ~30 important benchmarks:

`SWE-Bench Verified, SWE-Bench Multimodal, Terminal-Bench Hard, BrowseComp, GDPval, τ²-Bench, AIDER Polyglot, Aider, HumanEval, BigCodeBench, LiveCodeBench, MMLU-Pro, GPQA Diamond, HLE, IFBench, AIME, MATH-500, CritPt, AA-Omniscience, AA-LCR, GPQA, KLER, RewardBench, Chatbot Arena, MTEB, SciCode, OSWorld, WebArena, BrowserUse-Bench, BrowserGym, Mind2Web, RE-Bench`

For each, populate manually. Pull leaderboard data from the benchmark's own website (mostly HF Spaces). Then auto-refresh via:

- HuggingFace Spaces API for HF-hosted leaderboards
- GitHub for benchmark repos (sample tasks, methodology)
- Twitter for new benchmark releases

**Cadence:**
```
Weekly      HF Spaces leaderboard polls    → model_benchmarks (refresh)
Weekly      Editorial benchmark review     → evals (new entries)
```

---

## §14. Deals — sources

Pure editorial + partnerships. This is the highest-margin part of the product (the Pro tier hook).

### Tier 1 — Public deals (everyone sees)

Public startup programs we can list without partnership:

- AWS Activate ($1K-$100K)
- Microsoft for Startups ($150K)
- Google Cloud for Startups ($200K)
- Anthropic Startup Program ($5K)
- OpenAI Startup ($150K)
- DigitalOcean Hatch ($10K)
- Hetzner startup credits
- Linode (Akamai) for Startups
- Vercel for Startups
- Cloudflare for Startups
- Fly.io free credits
- Supabase startup ($300-$5K)
- Convex startup ($500)
- MongoDB for Startups ($500-$2K)

These get a `deal` record with `tier = 'public'`. ~30 deals total.

### Tier 2 — Member deals (auth required)

Direct relationships with vendors. Cursor 50% off, Windsurf 50% off, Lovable Pro discounts, etc. We negotiate these.

### Tier 3 — Pro deals (paid subscription)

This is FounderPass-style. Exclusive negotiated deals for our Pro members. AWS via reseller, MongoDB via Atlas-for-startups partner, special Linear/Notion/Figma rates. Editorial sales effort.

### Maintenance

- **Weekly** — Audit eligibility (terms change), referral codes (sometimes burn out), expiry dates
- **Daily** — Track `deal_claims` status changes; users self-report
- **Monthly** — New deal acquisition (target 2-3 new deals per month)

### Schedule summary

```
Daily        deal_claims status check  → notifications
Weekly Wed   Eligibility/expiry audit  → deals
Monthly      New deal acquisition      → deals (target 2-3 new)
```

---

## §15. News — sources

Cross-cutting. Three flows:

### Flow A — Auto-generated from change_events

When `change_events` fires with `kind = 'price_change'` and `abs(delta_pct) > 10`, the existing trigger creates a news row. Same for version releases, capability additions, new deals. **Cost: zero.** This produces ~5-15 articles per week.

### Flow B — Editorial vendor blogs (RSS)

Subscribe to RSS feeds from every vendor we track. ~50 feeds:

**Model providers:** Anthropic, OpenAI, Google DeepMind, Mistral, xAI, Cohere, Together AI, Fireworks, Groq, Cerebras
**AI IDE vendors:** Cursor, Anthropic (Claude Code), Codeium (Windsurf), Cline, Continue, Zed, Aider
**Backend:** Convex, Supabase, Firebase, Neon, Better Auth, Clerk, Stripe, Resend, Vercel, Cloudflare, Fly.io
**Infra:** E2B, Modal, Daytona, Langfuse, Helicone, LangSmith
**Community:** Latent Space, Simon Willison, AI Engineer Foundation

**Ingestion:** Poll every 30 min. For each new item: extract title, summary, body, hero image. Match against tracked resources (resource_ids found in body) → populate `news.related_resource_ids`. Editorial reviews queue, publishes ~70% as-is, edits ~30%.

**Auto-publish thresholds:** If source is on a trusted-vendor list AND content has no obvious editorial issues (no marketing fluff, has substance), auto-publish. Else queue for human review.

### Flow C — Original editorial

Long-form pieces from us: deep dives, weekly digests, op-eds. ~1-2 per week, written by editorial team or paid contributors.

### Weekly digest assembly

Tuesday 9am UTC cron runs `fn_generate_weekly_digest()`:
- Top 5 news items by view_count over last 7 days
- Biggest 3 price moves
- Top 1 deal
- 1 editorial highlight
- Subscribers receive via Resend

### Schedule summary

```
Every 30min  RSS poll                  → news (review queue)
Hourly       Auto-publish trusted RSS  → news (published)
Daily 10am   Editorial review batch    → news (publish or kill)
Tuesday 9am  Weekly digest send        → email subscribers
Weekly Mon   Editorial planning        → news (assign 1-2 originals)
```

---

## §16. Guides — sources

### Primary: editorial

Workflow guides are written by the editorial team and paid contributors. The "How to install Qwen 2.5 Coder on macOS" type. Aim for 5 new guides per week initially.

### Secondary: GitHub README extraction

For every resource we ingest, parse its README for an "Installation" section. If present, auto-create a `guide` of `kind = 'install'` with the extracted steps. Mark `is_published = false` until editorial verifies it works.

### Tertiary: community submissions

The `/submit` flow allows users to submit guides for any resource. Verified-author submissions auto-publish; new authors go through review.

### Verification

Every guide has a `last_verified_at` date. If it's > 90 days old, surface a "needs verification" badge on the guide reader. Editorial team picks the most-viewed unverified guides each Monday and runs through them on a clean environment, updating `last_verified_at` and step content as needed.

### Schedule summary

```
On ingest    README parse              → guides (draft)
Daily        Editorial verify queue    → guides (publish)
Weekly Mon   Stale-guide audit         → guides (re-verify)
Weekly       Editorial new guides      → guides (5 per week)
```

---

## §17. Pricing history & benchmark history — strategy

These two need special attention because they're how we beat competitors.

### Pricing history

Every time we observe a price difference for a model, write to `model_price_history` with the new price, timestamp, source. Never overwrite.

**Why:** Builds the 90-day sparkline that no aggregator displays. Lets us send alert emails when a user's tracked model drops 20%. Powers "biggest movers this week" in the news.

### Benchmark history

When AA refreshes a benchmark score, append a new `model_benchmarks` row rather than updating in place. Use `measured_at` as the dedup key.

**Why:** Shows benchmark improvement over time. Detects when a model gets upgraded in place (e.g., "GPT-5.5 quietly improved on SWE-Bench from 71.4 to 73.2").

---

## §18. Telemetry → real-world performance

This is unique to us. No competitor has it.

### Sources

1. **Install events** — every `install_events` row gives us "X people installed this in the last 7 days, mostly from Cursor users."

2. **Gateway invocations** — every `gateway_invocations` row gives us "average tokens/session, average cost/session, success rate per resource per client."

3. **Guide completions** — every `guide_completions` row gives us "78% of users finished this guide; step 7 is where they get stuck."

### Aggregation

Nightly cron rolls up raw events into denormalized aggregates on `resources` (`install_count_7d`, `health_score`, etc.) and creates `model_benchmarks` rows for the "real-world vibe coding performance" block.

### Privacy

- Hash IPs (sha256 + salt) before storing
- Aggregates require ≥ 10 unique users before publishing (k-anonymity)
- Users can opt out via settings
- We never expose individual user installs to other users

---

## §19. The data pipeline architecture

How all this orchestrates in practice.

### Stack

- **Workers:** Trigger.dev for scheduled jobs (cron-friendly, retries built in, good observability) or Inngest as an alternative
- **Queue:** Postgres + pg_cron for simple jobs, BullMQ on Upstash Redis for bursty work
- **Storage:** raw JSON dumps to S3/R2 before parsing — gives us audit trail and ability to re-process
- **Parser:** TypeScript scripts running on Cloudflare Workers (cheap, fast) or Vercel Cron (simpler)
- **Embeddings:** OpenAI `text-embedding-3-small` (cheap) for `resources.embedding`, run on insert/update

### Flow per source

```
Schedule fires
     ↓
Worker fetches API/scrapes
     ↓
Raw response stored to R2 (audit trail)
     ↓
Parser extracts structured data
     ↓
Upsert into staging table
     ↓
Diff vs production resources
     ↓
On change → write change_events row
     ↓
Trigger fires: notify alerts, generate news, refresh denorm counters
     ↓
Done
```

### Failure modes

Every source has a `last_successful_run_at` timestamp. If a source hasn't succeeded in 24h, alert the team via Slack. If a source has been failing for 7 days, surface "Source: stale" on the resource detail page so users know.

### Rate limit budgets

```
GitHub API:        5,000 req/hr authenticated → 30 req/min comfortable budget
OpenRouter:        Unlimited /models endpoint  → poll every 5 min if needed
Artificial Analysis: per their plan            → 4-hourly is conservative
Smithery:          5,000 req/hr with key       → every 6h leaves headroom
HuggingFace:       1,000 req/hr unauth         → 30 req/min when scanning
```

### Cost estimate at launch scale

For a database of ~15K resources at launch growing to ~50K in year one:

```
Trigger.dev / Inngest scheduled jobs:    $20-40/mo (free tier covers MVP)
Cloudflare R2 raw-dump storage:          $5-15/mo (~500GB)
OpenAI embeddings (text-embedding-3-small): $20-50/mo
Postgres (Supabase Pro):                  $25/mo (already paying)
RSS aggregator service (optional):        $0 (build own with feedparser)
Artificial Analysis API:                  $200-500/mo (estimate)
GitHub API token:                         free
Smithery API:                             free tier likely sufficient
HuggingFace:                              free
                                         ─────────
TOTAL:                                    ~$270-630/mo at launch
```

The Artificial Analysis subscription is the biggest line item but it's the most defensible source. Cheap to operate overall.

---

## §20. Bootstrap order — what to do in week 1

If you're starting from zero, this is the sequence.

### Day 1-2: Foundation

- Set up Supabase with schema
- Provision Cloudflare R2 bucket for raw dumps
- Set up Trigger.dev account, GitHub auth token, Artificial Analysis API key

### Day 3-4: Models pipeline (highest user value)

- Ship AA API poller → seeds ~377 models
- Ship OpenRouter poller → enriches model_providers
- Ship pricing-history writer + change_events trigger
- Verify model detail page renders with real data

### Day 5-6: MCPs pipeline

- Ship Official MCP Registry mirror → seeds ~500 MCPs
- Ship Smithery API mirror → seeds 7,000+ MCPs
- Dedupe by source_url
- Verify MCP detail page renders

### Day 7-8: Components pipeline

- Ship shadcn registry mirror → seeds ~50 official
- Ship 21st.dev sitemap crawler → seeds ~5K community
- Verify component detail page renders with live Sandpack

### Day 9-10: Tools, deals, news seed

- Editorial: manually create 22 tools rows
- Editorial: manually create 30 public deals
- Set up 50 RSS feeds, point to news ingestion queue

### Day 11-14: Everything else + editorial review

- GitHub code search for skills, subagents, rules, prompts, commands, hooks → seeds ~5K resources
- Editorial review queue cleanup
- Set up the 4-hourly / 6-hourly / daily cron schedules
- Launch with ~15K resources

### Week 2+: maintenance mode

- Monitor source health daily
- Run editorial planning meetings weekly
- Track new ecosystem players and add sources as they emerge

---

## §21. Editorial team — what one person does

For solo founders, a realistic week-1-of-month for one editorial person:

```
Monday      Stale-guide audit + new guide planning (5h)
Tuesday     Pricing audit + deal eligibility check (3h)
Wednesday   New deal acquisition outreach (4h)
Thursday    /submit queue review (3h) + news editorial review (2h)
Friday      Weekly digest finalization + content planning (3h)
```

Roughly 20 hours/week. Augment with vetted paid contributors for:

- Workflow recipes ($200 per published recipe)
- Long-form news pieces ($300 per piece)
- Guide writing for specific stacks ($150 per guide)

Cost: ~$2,000-4,000/month in contributor pay at launch scale.

---

## §22. Defensibility — why this data is hard to copy

Worth being explicit about, because anyone could call OpenRouter's `/models` API:

1. **Multi-source dedup** — we mirror 3 MCP registries, 5+ component registries, every model provider. Building the dedup logic right takes weeks of edge cases.

2. **Pricing history accumulates** — competitor starts today, has 0 days of history. We started 6 months ago, have 180 days of price sparklines.

3. **Real-world telemetry is exclusive** — `gateway_invocations` data exists only for our users. Nobody else can show "Cursor users average $0.41/session on Opus 4.7."

4. **Editorial curation is rate-limited by people, not money** — Best-for tables, alternatives mappings, prompting tips. Takes time. Compounds.

5. **Community submissions create a moat** — once forks/comments/reviews live on our domain, users come back. Mirrored sites can't take that.

6. **The 27 types are the breadth bet** — Smithery only does MCPs. cursor.directory only does rules. We index everything; the search graph is more valuable than any single category.

---

## §23. What can go wrong

Common failure modes and how to handle them.

**Artificial Analysis raises prices or shuts off our access.** We've built model_providers from OpenRouter as a backup; we'd lose some intelligence-rank precision but pricing/capabilities stay accurate.

**A major MCP registry shuts down (Smithery, Glama).** We have three sources; losing one degrades but doesn't kill us. The Official Registry is most important to keep.

**GitHub rate-limits us during a search burst.** Authenticated tokens give 5K/hr. If we hit it, we slow scanners and serve stale data for a few hours.

**A vendor blocks our user agent on scraping.** Most don't. If one does, fall back to RSS or accept staleness for that vendor.

**Spam in /submit.** Auto-reject obvious garbage. Manual review queue for borderline. Verified-author flag bypasses review.

**Editorial bandwidth maxes out.** Outsource to paid contributors. Don't reduce quality bar; reduce velocity.

**One of the source APIs starts charging.** AA, Smithery — both could pivot. Budget for ~$1K/month in unforeseen API costs.

---

## §24. Checklist before launch

```
[ ] Schema deployed in Supabase
[ ] Trigger.dev / Inngest workspace set up
[ ] R2 bucket created for raw dumps
[ ] Artificial Analysis API key obtained
[ ] Smithery API key obtained
[ ] GitHub token created (read-only, no scope creep)
[ ] OpenAI key for embeddings
[ ] Resend account for newsletter
[ ] 8 ingestion workers shipped (models, mcps, components, rules, skills, news_rss, deals_audit, telemetry_rollup)
[ ] First seed run completed (15K+ resources)
[ ] First editorial pass complete (deals tier, tools list, starter stacks)
[ ] Source health monitoring dashboard live
[ ] Slack alerts wired for failed sources
[ ] Privacy policy mentions data sources we ingest
```

---

## §25. The single most important rule

**Never ship a data source without an `updated_at` and a publicly-visible "as of" timestamp on the front-end.**

Stale pricing = lost trust. Show users when data was last refreshed. If it's > 24h on a fast-moving field, surface that. Honesty about freshness is the difference between a credible directory and a vibe-coded weekend project.

~~~~~~~~~~

---

## File 6 of 6: `vibe-coder-hub-master-plan.md`

~~~~~~~~~~vibe-coder-hub-master-plan.md
# Vibe Coder Hub — Master Plan & Checklist

> The complete 12-month build sequence. Every item from the original spec and all 90 deep-dive items, dated and checkboxed. Group items by phase. Each item has: owner role (Eng / Ed / BD / You), effort estimate, dependencies, success metric.

**Roles**
- **Eng** — engineering (you or contractor)
- **Ed** — editorial (you, Claude agents, or contracted editor)
- **BD** — business development / partnerships (you or contractor)
- **You** — strategic / founder-only decisions
- **Agent** — Claude agent does the work (with human review)

**Effort key**: `1h` `1d` `3d` `1w` `2w` `1mo` `Q` `Y`

---

## Phase 0 — Pre-launch (Weeks -4 to 0)

This is the foundation. Skip nothing in this phase.

### Foundation infrastructure

- [ ] **Provision Supabase project** (Pro tier, $25/mo) — *Eng, 1d*
- [ ] **Run the schema migration** (`vibe-coder-hub-schema.sql`) — *Eng, 1h*
- [ ] **Enable extensions**: `pgvector`, `pg_cron`, `uuid-ossp` — *Eng, 1h*
- [ ] **Set up GitHub repo** with branch protection + CI — *Eng, 1d*
- [ ] **Configure Vercel deployment** for Next.js 15 app — *Eng, 1d*
- [ ] **Provision Cloudflare R2 bucket** for raw-dump storage (you already have this) — *Eng, 1h*
- [ ] **Configure Resend** for transactional email — *Eng, 1h*
- [ ] **Create environment variable management** (Vercel envs + GitHub secrets) — *Eng, 1d*
- [ ] **Set up error tracking** (Sentry free tier) — *Eng, 1h*
- [ ] **Set up analytics** (Plausible $9/mo or PostHog self-hosted) — *Eng, 1d*

### Auth + minimum data model

- [ ] **Implement GitHub OAuth** via Supabase Auth — *Eng, 1d*
- [ ] **Build /signup, /signin, /signout flows** — *Eng, 1d*
- [ ] **Build profile creation + edit page** — *Eng, 1d*
- [ ] **Seed `use_cases` table** (12 starting use cases from schema) — *Eng, 1h*
- [ ] **Seed 10 stack-picker presets** — *Ed, 1d*

### Brand + design system

- [ ] **Finalize brand name & domain** (vibecoderhub.com) — *You, 1d*
- [ ] **Buy domain + secondary domains** (vibecoder.dev, vchub.dev) — *You, 1h*
- [ ] **Set up logo + brand kit** (use Claude for design system .md) — *You + Agent, 1d*
- [ ] **Implement Tailwind v4 + shadcn customised** per design prompt — *Eng, 3d*
- [ ] **Build top-nav with mega-menu** for 27 resource types — *Eng, 2d*
- [ ] **Build the generic detail-page chassis** — *Eng, 3d*
- [ ] **Build Cmd-K palette skeleton** — *Eng, 2d*

### First data ingestion: Track A (Real-time APIs)

- [ ] **Source 1 (original sourcing plan): OpenRouter `/api/v1/models`** — *Eng, 1d*
- [ ] **Source 2: shadcn registry sync** — *Eng, 1d*
- [ ] **Source 3: 21st.dev sitemap crawl** — *Eng, 1d*
- [ ] **Source 4: MCP Official Registry** — *Eng, 1d*
- [ ] **Source 5: Smithery API mirror** — *Eng, 1d*
- [ ] **Source 6 (deep-dive #1): `quemsah/awesome-claude-plugins`** — *Eng, 1d*
- [ ] **Source 7 (deep-dive #2): `VoltAgent/awesome-agent-skills`** — *Eng, 1d*

### GitHub Actions infrastructure

- [ ] **Set up 7 cron workflows** for above sources (`.github/workflows/*.yml`) — *Eng, 1d*
- [ ] **Set up Slack notifications** on workflow failure — *Eng, 1h*
- [ ] **Set up secrets in GitHub** (Supabase service key, R2, etc.) — *Eng, 1h*
- [ ] **Verify first run succeeded for all 7 sources** — *Eng, 1d*

### Editorial seed content

- [ ] **Write `AGENT.md` for Workflow Author personality** — *You + Agent, 1d*
- [ ] **Write `AGENT.md` for News Editor personality** — *You + Agent, 1d*
- [ ] **Write `AGENT.md` for Guide Writer personality** — *You + Agent, 1d*
- [ ] **Write `AGENT.md` for Reviewer (QA pass) personality** — *You + Agent, 1d*
- [ ] **Seed 10 evergreen guides** — *Agent + You review, 1w*
- [ ] **Write the first newsletter issue** (manual, sets the voice) — *You, 1d*

### Phase 0 success criteria
- [ ] At least 5,000 resources in the database
- [ ] 7 ingestion jobs running daily without errors
- [ ] Site deployed to staging, full nav works
- [ ] 10 guides published
- [ ] Newsletter list set up, first issue ready to send
- [ ] Brand visual identity locked

---

## Phase 1 — Launch (Weeks 1-4 / Month 1)

Launch the directory publicly. Focus: shipping the core experience that turns visitors into bookmarkers into Pro subscribers.

### Week 1

- [ ] **Build /resources index page** (filterable, sortable, paginated) — *Eng, 3d*
- [ ] **Build /models index page** (with the model card from spec) — *Eng, 3d*
- [ ] **Build /mcps index page** — *Eng, 2d*
- [ ] **Build generic detail page rendering** for components, MCPs, models — *Eng, 3d*
- [ ] **Add OpenRouter + LMArena Elo to model detail pages** — *Eng, 1d*
- [ ] **Implement search (postgres tsvector first, pgvector later)** — *Eng, 2d*
- [ ] **Source 8 (original): GitHub code search for skills** — *Eng, 1d*
- [ ] **Source 9 (original): cursor.directory + buildwithclaude scrape** — *Eng, 1d*

### Week 2

- [ ] **Build /skills, /subagents, /rules, /plugins, /commands, /hooks index pages** — *Eng, 1w*
- [ ] **Build detail pages for top 6 types** per detail-pages spec — *Eng, 1w*
- [ ] **Build the Stack Picker modal** — *Eng, 2d*
- [ ] **Build user_stack creation + management** — *Eng, 2d*
- [ ] **Source 10 (deep-dive #11): arXiv API + awesome-ai-agent-papers** — *Eng, 1d*
- [ ] **Source 11 (deep-dive #6): Product Hunt RSS** — *Eng, 1d*

### Week 3

- [ ] **Build /news landing page** with auto-generated items from `change_events` — *Eng, 2d*
- [ ] **Build /deals landing page** with 3-tier reveal pattern — *Eng, 2d*
- [ ] **Build /guides reader page** — *Eng, 2d*
- [ ] **Build /showcase index page** — *Eng, 2d*
- [ ] **Build bookmarks + collections UX** — *Eng, 2d*
- [ ] **Source 12 (deep-dive #12): GitHub stargazer velocity** — *Eng, 1d*
- [ ] **Source 13 (deep-dive #7): Hacker News Algolia API** — *Eng, 1d*

### Week 4 — public launch

- [ ] **Build /best-for/[use-case] SEO pages** for top 12 use cases — *Eng, 2d*
- [ ] **Build /compare drawer** (2-4 resource comparison) — *Eng, 2d*
- [ ] **Build the "Adopt this stack" mechanic** — *Eng, 2d*
- [ ] **Implement Pro upgrade flow** (Stripe) — *Eng, 2d*
- [ ] **Build settings + dashboard** — *Eng, 2d*
- [ ] **Idea 1 (deep-dive): "Used by these projects" reverse lookup** — *Eng, 4h*
- [ ] **Idea 9 (deep-dive): real-time /firehose endpoint** — *Eng, 1d*
- [ ] **Idea 19 (deep-dive R2): public roadmap + changelog** — *Eng, 1d*
- [ ] **Plan 14 (deep-dive R2): launch the automated Pulse newsletter** — *Eng, 3d*
- [ ] **Submit to Hacker News, Product Hunt, relevant subs** — *You, 1d*
- [ ] **Announce on Twitter / X + Discord communities** — *You, 1d*

### Phase 1 success criteria
- [ ] Public site live with 27 resource types showing data
- [ ] 10,000+ resources in database from 13 sources
- [ ] 1,000+ unique visitors in launch week
- [ ] First 10 Pro subscribers
- [ ] Newsletter list crosses 500 subscribers
- [ ] First user-submitted resource

---

## Phase 2 — Compound (Months 2-3)

Launch is done. Now compound: more sources, more content, more features that drive depth.

### Month 2

#### Sources
- [ ] **Source: GHArchive on BigQuery** (deep-dive #13) — *Eng, 2d*
- [ ] **Source: HuggingFace datasets API** (deep-dive #14) — *Eng, 1d*
- [ ] **Source: Stack Overflow Data Explorer** (deep-dive #15) — *Eng, 1d*
- [ ] **Source: Discord widget endpoints** (deep-dive #16) — *Eng, 1d*
- [ ] **Source: Crunchbase funding RSS** (deep-dive #17) — *Eng, 1d*
- [ ] **Source: npm/PyPI downloads** (deep-dive #8) — *Eng, 1d*
- [ ] **Source: Reddit JSON endpoints** (deep-dive #9) — *Eng, 1d*

#### Features
- [ ] **Build the next 6 detail page types** (Skills/Subagents/Rules/Plugins/Hooks/Starters) per spec — *Eng, 2w*
- [ ] **Idea 3 (deep-dive): personalised weekly release notes (Pro)** — *Eng, 1d*
- [ ] **Idea 13 (deep-dive R2): stack quality score** — *Eng, 5d*
- [ ] **Idea 18 (deep-dive R2): "viewed this also viewed" heatmap** — *Eng, 1d*
- [ ] **Idea 15 (deep-dive R2): migrate-from-X-to-Y guides for top 6 tools** — *Eng, 5d*

#### Editorial
- [ ] **Publish 8 new guides** — *Agent + Ed, ongoing*
- [ ] **Launch monthly "VCH Index" report** (deep-dive plan #2) — *Ed, 1w*
- [ ] **Launch MCP Pulse weekly newsletter** (deep-dive plan #4) — *Ed, 4hrs/wk*

#### Operations
- [ ] **Reach out to first 5 awesome-list maintainers** (deep-dive plan #12) — *BD, 1w*
- [ ] **Identify first 10 sponsor candidates** (deep-dive plan #5) — *BD, 3d*
- [ ] **Reach out to first 3 awesome-claude-* maintainers** — *BD, 2d*

### Month 3

#### Sources
- [ ] **Source: YouTube Data API for tutorial volume** (deep-dive #10) — *Eng, 2d*
- [ ] **Source: Wayback Machine for pricing history** (deep-dive #18) — *Eng, 2d*
- [ ] **Source: GitHub code search for CLAUDE.md/.cursorrules** (deep-dive #19) — *Eng, 1d*
- [ ] **Source: Status-page aggregators** (deep-dive #20) — *Eng, 2d*
- [ ] **Source: AGENTS.md adoption survey** (deep-dive R3 #22) — *Eng, 2d*

#### Features
- [ ] **Build the next 8 detail page types** per spec — *Eng, 2w*
- [ ] **Idea 14 (deep-dive R2): in-browser MCP Tool Inspector** — *Eng, 1w*
- [ ] **Idea 16 (deep-dive R2): Sandpack live sandboxes** (top 5 types) — *Eng, 1w*
- [ ] **Idea 22 (deep-dive R3): custom personal feeds** — *Eng, 1w*
- [ ] **Plan: launch /design-systems library** (deep-dive plan #1) — *Eng + Ed, 3d*

#### Editorial
- [ ] **Publish 8 more guides** — *Agent + Ed, ongoing*
- [ ] **2nd monthly Index report** — *Ed, 1w*

#### Operations
- [ ] **Sign first 3 sponsors** — *BD, ongoing*
- [ ] **Set up affiliate revenue with 5 deal partners** (deep-dive plan #6) — *BD, 1w*
- [ ] **Define VCH Certified partner program criteria** (deep-dive R2 plan #13) — *You + BD, 3d*

### Phase 2 success criteria
- [ ] 30,000+ resources tracked
- [ ] 20+ detail page types complete
- [ ] 100+ Pro subscribers
- [ ] Newsletter list crosses 2,500
- [ ] First $1K MRR from sponsors + Pro
- [ ] 5 awesome-list inbound links secured

---

## Phase 3 — Authority (Months 4-6)

Phase 2 made the directory comprehensive. Phase 3 makes it authoritative — original research, certified partnerships, the CLI launch.

### Month 4

#### Sources
- [ ] **Source: Cloudflare/Vercel/Supabase reports** (deep-dive R3 #23) — *Eng, 1d*
- [ ] **Source: Translated docs trackers (i18n)** (deep-dive R3 #25) — *Eng, 1w*
- [ ] **Source: USPTO/EPO patent filings** (deep-dive R3 #27) — *Eng, 2d*
- [ ] **Source: Job postings analysis** (deep-dive R3 #28) — *Eng, 2d*

#### Features — the CLI launch
- [ ] **Build `vchctl` CLI v1** (deep-dive R3 idea #21) — *Eng, 2w*
  - [ ] `vchctl init`
  - [ ] `vchctl add <resource>`
  - [ ] `vchctl install <resource-id>` (cross-platform from Idea #25)
  - [ ] `vchctl audit`
  - [ ] `vchctl sync`
- [ ] **Set up opt-in telemetry receiver** (Cloudflare Worker) — *Eng, 3d*
- [ ] **Publish privacy policy + telemetry transparency page** — *You + Ed, 1d*

#### Editorial
- [ ] **Begin first Quarterly Survey** (deep-dive R2 plan #11) — *Ed, 3wk runtime*
- [ ] **Launch first "Consumer Reports" independent review** of Cursor (deep-dive R3 plan #28) — *Ed, 1w*

#### Operations
- [ ] **Launch VCH Certified partner program** (deep-dive R2 plan #13) — *BD, 1w*
- [ ] **Sign first 5 certified partners** — *BD, ongoing*
- [ ] **Macro-creator partnership outreach** (deep-dive R3 plan #23) — *BD, 1w*

### Month 5

#### Sources
- [ ] **Source: Conference talk transcripts** (deep-dive R3 #26) — *Eng, 1w*
- [ ] **Source: VC portfolio tracking** (deep-dive R3 #29) — *Eng, 2d*
- [ ] **Source: University/research-lab repos** (deep-dive R3 #30) — *Eng, 2d*

#### Features
- [ ] **Idea: one-shot scaffold agent (Pro)** (deep-dive R2 #14) — *Eng + Agent, 2w*
- [ ] **Idea: stack rental marketplace** (deep-dive R3 #28) — *Eng, 3d*
- [ ] **Idea: "Compare with Claude" agent chat** (deep-dive R3 #27) — *Eng + Agent, 1w*
- [ ] **Idea: live status indicators** (deep-dive R3 #29) — *Eng, 3d*

#### Editorial
- [ ] **Publish first Quarterly Survey results** — *Ed, 1w*
- [ ] **Publish first set of translated guides** (JA + CN) — *Ed + Agent, 2w*
- [ ] **Begin annual State of Vibe Coding report prep** (deep-dive R3 plan #24) — *Ed, ongoing*

#### Operations
- [ ] **Sign first macro-creator partnership** — *BD, ongoing*
- [ ] **Define industry vertical strategy** (deep-dive R3 plan #26) — *You + BD, 3d*
- [ ] **Reach out to first university/bootcamp partner** (deep-dive R3 plan #25) — *BD, 1w*

### Month 6

#### Sources
- [ ] **Source: vibe-coding platform output galleries** (deep-dive R3 #21) — *Eng, 1w*

#### Features
- [ ] **Idea: "what-if" stack simulator** (deep-dive R3 #30) — *Eng, 1w*
- [ ] **Idea: achievement system + leaderboard** (deep-dive R3 #23) — *Eng, 5d*
- [ ] **Idea: affiliate-link manager for creators** (deep-dive R3 #26) — *Eng, 1w*
- [ ] **Idea: browser-side API key vault** (deep-dive R2 #20) — *Eng, 1w*
- [ ] **Idea: embeddable comparison widget** (deep-dive R2 #12) — *Eng, 1w*

#### Editorial
- [ ] **Launch first industry vertical landing page (`/fintech`)** — *Eng + Ed, 1w*
- [ ] **Half-year recap newsletter** — *Ed, 2d*

#### Operations
- [ ] **VCH Certified milestone: 10 partners** — *BD*
- [ ] **Sponsor revenue milestone: $5K/mo** — *BD*
- [ ] **First enterprise white-label conversation** (deep-dive R2 plan #19) — *BD*

### Phase 3 success criteria
- [ ] **40,000+ resources tracked**
- [ ] **All 27 detail page types complete**
- [ ] **vchctl CLI shipped with 500+ daily users**
- [ ] **300+ Pro subscribers**
- [ ] **Newsletter list crosses 8,000**
- [ ] **$10K+ MRR**
- [ ] **10 certified partners**
- [ ] **First quarterly survey published with 1,000+ respondents**

---

## Phase 4 — Institution (Months 7-9)

The directory is the canonical reference. Phase 4 builds the institutions around it: research, capital, standards, education.

### Month 7

- [ ] **Plan: launch industry verticals 2-4** (`/healthcare`, `/gamedev`, `/edtech`) — *Eng + Ed, 1w each*
- [ ] **Plan: 10 definitive guides — first 3 published** (deep-dive R2 plan #20) — *Ed + Agent, 1mo*
- [ ] **Plan: open-source the directory schema + scrapers** (deep-dive R2 plan #15) — *Eng, 1w*
- [ ] **Plan: launch educational partnerships pilot** (deep-dive R3 plan #25) — *BD, ongoing*
- [ ] **Idea: cross-platform install with VCH** (formal launch, deep-dive R3 #25) — *Eng, 1w*

### Month 8

- [ ] **Plan: kick off State of Vibe Coding annual report** — *Ed, 2mo lead*
- [ ] **Plan: define awards categories** (deep-dive R1 plan #10 + R3 plan #29) — *You + Ed, 1w*
- [ ] **Plan: conference planning kickoff** (target: December) — *You + BD, 1mo*
- [ ] **Idea: "Resource of the day" homepage rotation** — *Eng, 2d*
- [ ] **Idea: "Build with AI" coaching mode (Pro)** (deep-dive R2 #17) — *Eng + Agent, 1w*

### Month 9

- [ ] **Sources: Quarterly survey #2 runs** — *Ed, 3wk*
- [ ] **Plan: launch fund / accelerator concept** (deep-dive R3 plan #27) — *You, 1mo*
- [ ] **Plan: standardisation initiative kickoff** (deep-dive R3 plan #30) — *You + BD, 1mo*
- [ ] **Plan: open ecosystem fund — first 2 investments** — *You, 2mo*

### Phase 4 success criteria
- [ ] 4 industry verticals launched
- [ ] 600+ Pro subscribers
- [ ] $20K+ MRR
- [ ] Newsletter list crosses 15,000
- [ ] First annual report production underway
- [ ] First standardisation RFC published
- [ ] 2 ecosystem fund investments closed
- [ ] First university partnership signed

---

## Phase 5 — Defining (Months 10-12)

The directory now defines the category. Phase 5 builds the moats that compound for years.

### Month 10

- [ ] **Conference final preparation** — *BD + Ed, 1mo*
- [ ] **State of Vibe Coding 2026 report finalisation** — *Ed, 3wk*
- [ ] **Awards voting opens** — *BD, 2wk*
- [ ] **Definitive guides 4-6 published** — *Ed + Agent*

### Month 11

- [ ] **Awards voting closes; results decided** — *BD + You*
- [ ] **State of Vibe Coding 2026 — public release** — *Ed + You*
- [ ] **Press push for annual report** — *BD, 2wk*
- [ ] **Conference promotion week** — *BD, 1wk*

### Month 12 — Annual peak

- [ ] **Run inaugural Vibe Coder Conference** (Plan 10) — *3d event*
- [ ] **Best of Vibe Coding 2026 Awards ceremony** at conference — *You*
- [ ] **OSS Contributor Stipends announced** (deep-dive R3 plan #29) — *You*
- [ ] **Year-end retrospective + year 2 planning** — *You, 1w*
- [ ] **Definitive guides 7-10 published** — *Ed + Agent*

### Phase 5 success criteria
- [ ] **First annual Vibe Coder Conference executed** (target: 500+ attendees)
- [ ] **State of Vibe Coding 2026 published with major press coverage**
- [ ] **1,000+ Pro subscribers**
- [ ] **$50K+ MRR** (Pro + sponsors + partners + enterprise + affiliate)
- [ ] **20+ certified partners**
- [ ] **3+ enterprise white-label deals signed**
- [ ] **Newsletter list crosses 25,000**
- [ ] **2 universities + 2 bootcamps in pipeline programs**
- [ ] **10 definitive guides published, ranking #1-3 for target keywords**
- [ ] **First standardisation RFC adopted by 2+ ecosystem vendors**

---

## Cross-cutting workstreams (always-on)

These don't fit neatly in phases — they run continuously.

### Editorial cadence

- [ ] **Weekly editorial newsletter** — *Ed, every Monday*
- [ ] **Automated Pulse newsletter** — *Eng cron, every Sunday*
- [ ] **MCP Pulse weekly** — *Ed, every Tuesday*
- [ ] **2-3 new guides per month** — *Ed + Agent*
- [ ] **1 independent product review per week** — *Ed*
- [ ] **Monthly Index report** — *Ed, 1st of month*

### Community

- [ ] **Discord moderation + engagement** — *You + community lead*
- [ ] **Weekly Twitter Spaces office hours** — *You, Fridays*
- [ ] **Reddit / HN engagement** — *You + Ed, ongoing*
- [ ] **Submission queue review** — *Ed + Agent + You, daily*

### Data quality

- [ ] **Daily health-check dashboard review** — *Eng, 5min*
- [ ] **Weekly schema migration review** — *Eng*
- [ ] **Monthly resource deprecation review** — *Ed*
- [ ] **Quarterly stale-content audit** — *Ed*

### Revenue ops

- [ ] **Monthly sponsor renewal check** — *BD*
- [ ] **Monthly certified-partner check-ins** — *BD*
- [ ] **Quarterly enterprise customer reviews** — *BD + You*
- [ ] **Monthly affiliate revenue payout** — *Eng + BD*

---

## KPI tracking — what to measure every week

Track these in a simple Notion dashboard or Supabase view:

```
WEEKLY SCORECARD                    MONTH 1   MONTH 3   MONTH 6   MONTH 12
─────────────────────────────────────────────────────────────────────────
Resources tracked                   10K       30K       40K       60K
Daily active visitors               300       2K        6K        20K
Unique weekly visitors              1.5K      8K        25K       80K
Newsletter subscribers              500       2.5K      8K        25K
Pro subscribers                     10        100       300       1000
MRR                                 $100      $1K       $10K      $50K
Sponsor MRR                         $0        $500      $5K       $15K
Certified partner MRR               $0        $0        $3K       $15K
Enterprise white-label MRR          $0        $0        $0        $10K
Affiliate revenue MRR               $0        $200      $1K       $5K
CLI daily active                    -         -         500       5K
Definitive guides ranking #1-3      0         0         3         10
Awesome-list inbound links          0         5         15        30+
Certified partners signed           0         3         10        20+
Press mentions / citations          0         5         20        100+
```

---

## Risk register

The plan is ambitious. These are the things most likely to go wrong, with mitigations.

### Risk: Ingestion source breakage
**Likelihood:** High. APIs change, sites add rate limits, scrapers fail.
**Mitigation:** Monitoring dashboard. GHA Slack alerts. Per-source retry + fallback. Weekly source-health review.

### Risk: Editorial output quality drift
**Likelihood:** Medium. Agent output can become formulaic.
**Mitigation:** Reviewer agent + human editor-in-chief. Quarterly voice audit. Mix human + agent content.

### Risk: Slow Pro conversion
**Likelihood:** Medium. Hard to predict adoption.
**Mitigation:** Multiple revenue streams (sponsor, affiliate, certified, enterprise) reduce reliance on Pro alone. Test pricing in month 3, adjust.

### Risk: Competitor moves
**Likelihood:** High. Cursor.directory, buildwithclaude, etc. could expand.
**Mitigation:** Move faster. Acquire (Plan 17). Build moats (CLI, original research, standards) that take >6 months to copy.

### Risk: Vendor dependence (Anthropic, Cursor, etc.)
**Likelihood:** Low. Reputation-grade institutions usually engage positively with independent directories.
**Mitigation:** Maintain editorial independence, attribution, fact-checking. Build relationships before they're needed.

### Risk: Conference fails / doesn't break even year 1
**Likelihood:** Medium.
**Mitigation:** Virtual format Year 1 (lower cost). Frame as "first annual" — Year 1 is for proof, Year 2 for ROI.

### Risk: Burnout
**Likelihood:** High. This is a 12-month sprint.
**Mitigation:** Hire help by month 3 (editorial), month 6 (BD). Use agents aggressively. Take quarterly weeks off.

---

## Hiring milestones

The plan is solo-feasible for the first 3 months. After that:

- **Month 3:** Part-time editorial reviewer ($1-2K/mo)
- **Month 6:** Part-time business development / partnerships ($2-4K/mo)
- **Month 9:** Full-time engineer (you + 1 = leverage)
- **Month 12:** Editor-in-chief (could be a contractor)

By end of year 1: team of 3-4. Revenue supports it.

---

## What success looks like at month 12

- **Brand**: "Vibe Coder Hub" is the canonical reference for the AI coding ecosystem
- **Traffic**: 80K+ unique weekly visitors. SEO-driven, compounding monthly.
- **Revenue**: $50-75K MRR across 5+ streams. Profitable.
- **Product**: 27 resource types covered. 60K resources. The CLI is daily-driver for 5K developers.
- **Editorial**: Multiple newsletters totalling 25K subscribers. Monthly Index, weekly Pulse, annual State-of-the-Ecosystem report — all citable.
- **Ecosystem**: 20+ certified partners. 5+ enterprise customers. 2+ ecosystem fund investments.
- **Authority**: First standardisation RFC adopted. Annual conference + awards launched. Featured in HN front-page, TechCrunch, podcasts.

This is no longer a side project. It's the canonical institution of the AI coding ecosystem.

---

## Immediate next steps (the first 14 days)

If you're ready to start tomorrow:

**Day 1-2:** Set up Supabase, GitHub, Vercel. Run the schema. Lock the brand.

**Day 3-5:** Build auth + minimum nav. Wire up first 3 sources (OpenRouter, shadcn, Smithery).

**Day 6-8:** Build /models and /mcps index pages. First content alive.

**Day 9-11:** Write first agent personality files. Generate first 5 guides.

**Day 12-14:** Polish, then soft-launch to a private list of 50 people for feedback before public launch.

Ship the rest from there, phase by phase, item by item, ticking off boxes as you go.

The plan is built. The schema is migrated. The sourcing is mapped. The features are scoped. The 90 deep-dive items give you a full year of compounding work.

Start with the first checkbox.

~~~~~~~~~~

---

_End of spec bundle. All six files included. Proceed with Phase A._