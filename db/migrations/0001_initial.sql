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
