# PHASE_0_1_CHECKLIST.md

*Phase B artifact 6 (build-prompt B6). Every master-plan Phase-0 + Phase-1 checkbox, mapped to file paths from `DIRECTORY_TREE.md` + estimate + dependency note.*

> **Convention.** Each item lists: (file paths to create/modify), (estimate), (depends on). Items grouped by master-plan section. Sequenced per `DEPENDENCY_GRAPH.md` §6.

---

## §1 Phase 0 — Pre-launch (master plan §Phase 0)

### 1.1 Foundation infrastructure (10 items)

- [ ] **Provision Supabase project (Pro tier $25/mo)** — `Eng, 1d` — Ben (per MIGRATION_ORDER §2.1). Captures project URL + service-role key + anon key + connection strings. *Depends on:* nothing.
- [ ] **Run schema migration (`vibe-coder-hub-schema.sql`)** — `Eng, 1h` — `db/migrations/0001_initial.sql` (symlink) + run via `pnpm db:migrate`. *Depends on:* Supabase project.
- [ ] **Run operational table migrations (carve-out)** — `Eng, 30m` — `db/migrations/0002_rate_limit_buckets.sql`, `db/migrations/0003_ingestion_runs.sql` (only if not in canonical). Document in `BUILD_LOG.md`. *Depends on:* schema migration.
- [ ] **Enable extensions** (`pgvector`, `pg_cron`, `uuid-ossp`, `pg_net`, `pg_trgm`, `vector`, `btree_gin`, `pg_stat_statements`, `pgcrypto`, `citext`) — `Eng, 30m` — Most enabled by canonical migration; verify and add `pg_net` for cron-to-Edge-Function calls. *Depends on:* Supabase project.
- [ ] **Set up GitHub repo with branch protection + CI** — `Eng, 1d` — repo at `github.com/<org>/vibecoderhub-web`; `main` protected (no direct push, require CI green); `.github/workflows/ci.yml` (typecheck + lint + Vitest); `.github/workflows/e2e.yml` (Playwright on PR + main). *Depends on:* GitHub account.
- [ ] **Configure Vercel deployment for Next.js 15** — `Eng, 1d` — Vercel project linked, custom domain `vibecoderhub.com` configured, env vars populated per MIGRATION_ORDER §7.1. *Depends on:* GitHub repo + domain.
- [ ] **Provision Cloudflare R2 bucket** (already provisioned) — `Eng, 1h` — bucket `vch-raw-dumps`; R/W keys captured into Vercel env vars. *Depends on:* Cloudflare account.
- [ ] **Configure Resend for transactional email** — `Eng, 1h` — domain verified, SPF/DKIM/DMARC configured, API key + webhook secret captured. *Depends on:* Resend account + DNS access.
- [ ] **Create environment variable management** (Vercel envs + GitHub secrets) — `Eng, 1d` — per MIGRATION_ORDER §7. `.env.example` is the canonical list; `lib/env.ts` validates at boot. *Depends on:* all upstream services have keys.
- [ ] **Set up error tracking (Sentry free tier)** — `Eng, 1h` — `sentry.{client,server,edge}.config.ts`, `instrumentation.ts`, `lib/server/sentry.ts`. *Depends on:* Sentry account.
- [ ] **Set up analytics (PostHog)** — `Eng, 1d` — `components/analytics/PostHogProvider.tsx`, `lib/analytics/{events,capture,captureServer,identify,consent}.ts`. Per Q2.7 ruling. *Depends on:* PostHog account.

### 1.2 Auth + minimum data model (5 items)

- [ ] **Implement GitHub OAuth via Supabase Auth** — `Eng, 1d` — `lib/auth/{server,client,middleware,is-admin,return-to}.ts`, `app/auth/callback/route.ts`, OAuth app registered with GitHub. *Depends on:* Supabase project + DB migration.
- [ ] **Build sign-in / sign-up / sign-out flows** — `Eng, 1d` — `components/auth/AuthModal.tsx`, sign-out via `lib/actions/auth/signOut.ts`. Modal-first per design-prompt §20. *Depends on:* OAuth.
- [ ] **Build profile creation + edit page** — `Eng, 1d` — `app/(app)/settings/profile/page.tsx`, `lib/actions/settings/updateProfile.ts`, `lib/schemas/settings.ts`. *Depends on:* OAuth + auth middleware.
- [ ] **Seed `use_cases` table (12 starting use cases)** — `Eng, 1h` — Already in canonical schema seed (lines 1735-1748). Verify after migration. *Depends on:* schema migration.
- [ ] **Seed 10 stack-picker presets (initial)** — `Ed, 1d` — Ben writes outside Cowork; consumed by `db/seed/presets.ts` reading `editorial-seed/presets/*.json`. (Master plan says 10 here; Q3.5 ruling said 30 total — 10 may have been earlier estimate; build to 30 with first 10 being the launch-day must-haves.) *Depends on:* `editorial-seed/presets/` populated by Ben.

### 1.3 Brand + design system (7 items)

- [ ] **Finalize brand name & domain (`vibecoderhub.com`)** — `You, 1d` — done per Ben's pre-empt.
- [ ] **Buy domain + secondary domains** — `You, 1h` — done; `vibecoderhub.com` registered, secondaries TBD (`vibecoder.dev`, `vchub.dev` per master plan; defer).
- [ ] **Set up logo + brand kit** — `You + Agent, 1d` — Phase 1 uses Promptkit's mint "V" placeholder per Ben's pre-empt; real logo lands Phase 2. `components/shared/{Wordmark,BrandMonogram}.tsx` render the placeholder.
- [ ] **Implement Tailwind v4 + shadcn customised per design prompt** — `Eng, 3d` — `lib/tokens.ts`, `app/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`. Derived from `TOKEN_RECONCILIATION.md`. **Critical: NOT default shadcn theme.** *Depends on:* design tokens locked (done in Phase B).
- [ ] **Build top-nav with mega-menu for 24 resource types** — `Eng, 2d` — `components/layout/header/{Header,HeaderNav,HeaderMegaMenu,HeaderSearch,HeaderStackChip,HeaderUserMenu,HeaderAuthButtons}.tsx`. Mega-menu groups types: Extensions / Prompts / Infra / Content per design-prompt §3. *Depends on:* UI primitives + Stack provider.
- [ ] **Build the generic detail-page chassis** — `Eng, 3d` — `components/resources/{DetailChassis,DetailHero,DetailStatsStrip,DetailTabBar,DetailRightRail,DetailMobileBottomBar,DetailBestForAlternatives,DetailWorksWellWith,DetailSocialAndTips,DetailMeta}.tsx`. The 9-zone shared shell from detail-pages.md §1. *Depends on:* UI primitives + layout chrome + Drizzle queries.
- [ ] **Build Cmd-K palette skeleton** — `Eng, 2d` — `components/cmdk/{CommandPalette,CommandResults,CommandRecent,CommandTrending,CommandActions,CommandTypeFilter,CommandTipsHints}.tsx` + `components/ui/command.tsx` (cmdk wrapper). Skeleton ships in foundation slice; full semantic search wires in slice 4. *Depends on:* UI primitives + queries.

### 1.4 First data ingestion: Track A (7 sources, master plan §Phase 0)

- [ ] **Source 1: OpenRouter `/api/v1/models`** — `Eng, 1d` — `scripts/ingest/openrouter.ts`, `.github/workflows/ingest-openrouter.yml`. Cron every 6h. Populates `models` + `model_providers` rows. *Depends on:* DB schema, R2 bucket, GHA secrets.
- [ ] **Source 2: shadcn registry sync** — `Eng, 1d` — `scripts/ingest/shadcn.ts`, `.github/workflows/ingest-shadcn.yml`. Cron daily. Populates `components`. *Depends on:* DB.
- [ ] **Source 3: 21st.dev sitemap crawl** — `Eng, 1d` — `scripts/ingest/21st.ts`, `.github/workflows/ingest-21st.yml`. Cron daily incremental + weekly full re-crawl. Populates `components`. *Depends on:* DB.
- [ ] **Source 4: MCP Official Registry** — `Eng, 1d` — `scripts/ingest/mcp-registry.ts`, `.github/workflows/ingest-mcp-registry.yml`. Cron every 6h. Populates `mcps`. *Depends on:* DB.
- [ ] **Source 5: Smithery API mirror** — `Eng, 1d` — `scripts/ingest/smithery.ts`, `.github/workflows/ingest-smithery.yml`. Cron every 6h. Populates `mcps` + `mcps.install_configs`. *Depends on:* DB + Smithery API key.
- [ ] **Source 6: `quemsah/awesome-claude-plugins`** — `Eng, 1d` — `scripts/ingest/awesome-claude-plugins.ts`, GHA workflow. Cron daily. Populates `plugins` + `marketplaces` + bundled `skills`/`subagents`/`commands`/`hooks`. *Depends on:* DB.
- [ ] **Source 7: `VoltAgent/awesome-agent-skills`** — `Eng, 1d` — `scripts/ingest/awesome-agent-skills.ts`, GHA workflow. Cron daily. Populates `skills`. *Depends on:* DB.

### 1.5 GitHub Actions infrastructure (4 items)

- [ ] **Set up 7 cron workflows for sources above** — `Eng, 1d` — done as part of 1.4 above; consolidate `.github/workflows/ingest-*.yml`.
- [ ] **Set up Slack notifications on workflow failure** — `Eng, 1h` — `lib/ingestion/_shared/slack-notify.ts`; webhook URL via env var; called from `_shared/runner.ts` on `status='failed'`. *Depends on:* `SLACK_OPS_WEBHOOK_URL` env.
- [ ] **Set up secrets in GitHub** — `Eng, 1h` — per MIGRATION_ORDER §7.2. *Depends on:* all upstream services have keys.
- [ ] **Verify first run succeeded for all 7 sources** — `Eng, 1d` — manually trigger via `workflow_dispatch`, verify `ingestion_runs` rows show `status='success'` with non-zero `records_inserted`. Target: ≥5K total resources after first runs. *Depends on:* all 7 sources implemented.

### 1.6 Editorial seed content (6 items — Ben outside Cowork; build infra)

- [ ] **Write `AGENT.md` for Workflow Author personality** — `You + Agent, 1d` — Ben writes `editorial-seed/agents/workflow-author.md`. Build: `lib/news/auto-draft.ts` reads it.
- [ ] **Write `AGENT.md` for News Editor personality** — `You + Agent, 1d` — Ben writes `editorial-seed/agents/news-editor.md`. Build: same consumer.
- [ ] **Write `AGENT.md` for Guide Writer personality** — `You + Agent, 1d` — Ben writes `editorial-seed/agents/guide-writer.md`. Build: same consumer.
- [ ] **Write `AGENT.md` for Reviewer (QA pass) personality** — `You + Agent, 1d` — Ben writes `editorial-seed/agents/reviewer-qa.md`. Build: same consumer.
- [ ] **Seed 10 evergreen guides** — `Agent + You review, 1w` — Ben writes `editorial-seed/guides/*.md`. Build: `db/seed/seed.ts` reads + populates `guides` + `guide_steps`.
- [ ] **Write the first newsletter issue** — `You, 1d` — Ben writes `editorial-seed/newsletter/issue-001-launch.tsx` (React Email). Build: `lib/resend/send.ts` + `lib/resend/templates/_base/EmailLayout.tsx`.

### 1.7 Phase 0 success criteria (master-plan)

- [ ] At least 5,000 resources in the database — verified via `select count(*) from resources where status='published'` after first ingestion runs.
- [ ] 7 ingestion jobs running daily without errors — verified via `ingestion_runs` rows showing 7 distinct `source_slug` values with `status='success'` over last 24h.
- [ ] Site deployed to staging, full nav works — verified via Vercel preview URL; `/` loads, mega-menu works, every type link reaches an index page.
- [ ] 10 guides published — `select count(*) from guides where is_published=true` ≥10.
- [ ] Newsletter list set up, first issue ready to send — `newsletter_subscribers` table exists; `editorial-seed/newsletter/issue-001-launch.tsx` rendered + tested.
- [ ] Brand visual identity locked — `TOKEN_RECONCILIATION.md` approved (✓ done), Promptkit-derived components rendered consistently.

---

## §2 Phase 1 — Launch (master plan §Phase 1)

### 2.1 Week 1 (8 items)

- [ ] **Build `/resources` index page** — `Eng, 3d` — Per master plan, this is "filterable, sortable, paginated" — interpret as a cross-type resource view at `/search` (since per design-prompt §4 there's no single `/resources` page; rather, each of the 24 type indexes serves this). Defer `/resources` as a separate page; ship `/search?type=…` instead. — *Depends on:* foundation slice.
- [ ] **Build `/models` index page** — `Eng, 3d` — `app/models/page.tsx`, `app/models/loading.tsx`, `app/models/error.tsx`, `app/models/opengraph-image.tsx`, `app/models/components/{ModelsIndexHero,ModelsFilterRail,ModelsSortDropdown,ModelsCardGrid,ModelsEmptyState}.tsx`, `lib/queries/resources/listByType.ts`. *Depends on:* foundation slice + ResourceCard + ModelCard + FilterSidebar + ingestion (seeds models).
- [ ] **Build `/mcps` index page** — `Eng, 2d` — `app/mcps/page.tsx` + per-page components. *Depends on:* same as `/models`.
- [ ] **Build generic detail page rendering for components/MCPs/models** — `Eng, 3d` — `app/{components,mcps,models}/[slug]/page.tsx` + per-type Zone-5 blocks. The chassis already exists from Phase 0; this wires per-type pages. *Depends on:* DetailChassis + Drizzle queries + ResourceCard + InstallButton.
- [ ] **Add OpenRouter + LMArena Elo to model detail pages** — `Eng, 1d` — `lib/queries/models/getDetail.ts` joins `model_providers`, `model_benchmarks`. Phase 1 uses LMArena Elo as the "intelligence" column per Q1.4. Manual seed for top-12 model benchmarks. *Depends on:* `/models/[slug]` page.
- [ ] **Implement search (Postgres tsvector first, pgvector later)** — `Eng, 2d` — `lib/search/{tsvector,embedding,hybrid,ranker,prefetch}.ts`, `app/search/page.tsx`. Per Q1.3, both tsvector AND pgvector ship Phase 1; embedding-augmented overlay. *Depends on:* schema's tsvector column + embedding column populated.
- [ ] **Source 8: GitHub code search for skills** — `Eng, 1d` — `scripts/ingest/github-code-search.ts`, GHA workflow. *Depends on:* GitHub PAT.
- [ ] **Source 9: cursor.directory + buildwithclaude scrape** — `Eng, 1d` — `scripts/ingest/{cursor-directory,buildwithclaude}.ts`, GHA workflows.

### 2.2 Week 2 (6 items)

- [ ] **Build `/skills`, `/subagents`, `/rules`, `/plugins`, `/commands`, `/hooks` index pages** — `Eng, 1w` — 6 type folders × (page.tsx, loading.tsx, error.tsx, opengraph-image.tsx, feed.rss/route.ts, components/) = ~36 files. Use shared `<TypeIndexPage>` template extracted from `/models` → fast batch. *Depends on:* `/models` index pattern proven.
- [ ] **Build detail pages for top 6 types per detail-pages spec** — `Eng, 1w` — `/skills/[slug]`, `/subagents/[slug]`, `/rules/[slug]`, `/plugins/[slug]`, `/commands/[slug]`, `/hooks/[slug]`. Extract `<ExtensionResourceDetail>` shared template from `/skills/[slug]` first; others fast. *Depends on:* DetailChassis.
- [ ] **Build the Stack Picker modal** — `Eng, 2d` — `components/stack-picker/{StackPickerModal,StackPickerClients,StackPickerStack,StackPickerHardware,StackPickerPresets,StackPickerSavingPreview}.tsx`. Hardware is captured-now-used-later per Q2.3. *Depends on:* UI primitives + Stack provider.
- [ ] **Build `user_stack` creation + management** — `Eng, 2d` — `lib/actions/stacks/{save,adopt,publish,delete}.ts`, `app/(app)/dashboard/stacks/page.tsx`, `lib/queries/stacks/listUserStacks.ts`. *Depends on:* Stack Picker.
- [ ] **Source 10: arXiv API + awesome-ai-agent-papers** — `Eng, 1d` — `scripts/ingest/arxiv-papers.ts`. *Depends on:* nothing additional.
- [ ] **Source 11: Product Hunt RSS** — `Eng, 1d` — `scripts/ingest/product-hunt-rss.ts`. *Depends on:* nothing additional.

### 2.3 Week 3 (7 items)

- [ ] **Build `/news` landing page with auto-generated items** — `Eng, 2d` — `app/news/page.tsx` + components + `lib/queries/news/listFeed.ts`. Auto-drafts come from `fn_after_change_event` per Q2.2 ruling (drafts only, admin queue publishes). *Depends on:* schema (already wired) + `/admin/news-queue` (slice 21).
- [ ] **Build `/deals` landing page with 3-tier reveal pattern** — `Eng, 2d` — `app/deals/page.tsx` + `components/deals/DealLockedOverlay.tsx` (the blur paywall) + `lib/queries/deals/listActive.ts`. *Depends on:* `subscription_tier` aware queries.
- [ ] **Build `/guides` reader page** — `Eng, 2d` — `app/guides/page.tsx` (index) + `app/[resource-slug]/guides/[guide-slug]/page.tsx` (focused-reading reader) + `lib/queries/guides/{listAllPaginated,getDetail}.ts`. *Depends on:* DetailChassis-light (guides have a different layout — focused-reading mode per detail-pages §8).
- [ ] **Build `/showcase` index page** — `Eng, 2d` — `app/showcase/page.tsx` + `[slug]/page.tsx` + components. *Depends on:* `showcase` table + image moderation pipeline (slice 8 image upload).
- [ ] **Build bookmarks + collections UX** — `Eng, 2d` — `app/(app)/dashboard/{bookmarks,collections}/page.tsx`, `components/resources/BookmarkButton.tsx`, `lib/actions/bookmarks/{toggle,moveToCollection}.ts`, `lib/actions/collections/{create,update,delete}.ts`. *Depends on:* auth + ResourceCard.
- [ ] **Source 12: GitHub stargazer velocity** — `Eng, 1d` — `scripts/ingest/github-stargazer-velocity.ts`. Updates `resources.trending_score` directly (not a new resource — augments existing).
- [ ] **Source 13: Hacker News Algolia API** — `Eng, 1d` — `scripts/ingest/hn-algolia.ts`. Surfaces new resources mentioned in HN comments → into news draft queue.

### 2.4 Week 4 — public launch (12 items)

- [ ] **Build `/best-for/[use-case]` SEO pages for top 12** — `Eng, 2d` — `app/best-for/page.tsx` + `app/best-for/[slug]/page.tsx` + components. Editorial seed populates `best_for` rows (36 minimum). *Depends on:* `best_for` table + 12 use_cases (already seeded) + editorial bundle.
- [ ] **Build `/compare` drawer (2-4 resource comparison)** — `Eng, 2d` — `components/compare/{CompareDrawer,CompareTable,CompareDiffCell}.tsx`, `app/models/compare/page.tsx`. Tier-aware: 4 for Free/Member, 6 for Pro per Q3.6. *Depends on:* per-type pages (need data to compare).
- [ ] **Build the "Adopt this stack" mechanic** — `Eng, 2d` — `lib/actions/stacks/adopt.ts` (bookmark + fork dual mechanic per Q2.3) + `components/stack-picker/StackPickerPresets.tsx` (re-uses for the public stack adopt button). *Depends on:* user_stacks + bookmarks.
- [ ] **Implement Pro upgrade flow (Stripe)** — `Eng, 2d` — `app/(app)/settings/billing/page.tsx` (links to Customer Portal), `app/api/stripe/customer-portal/route.ts`, `app/api/webhooks/stripe/route.ts`, `components/pricing/{PricingTable,UpgradeModal,ProBadge,ComingSoonBadge}.tsx`, `lib/actions/stripe/{createCheckoutSession,createCustomerPortalSession,handleWebhook}.ts`, `lib/stripe/{prices,webhooks-handlers/*,tiers}.ts`. 14-day trial card-required per Q1.5. *Depends on:* Stripe wiring + auth.
- [ ] **Build settings + dashboard** — `Eng, 2d` — `app/(app)/dashboard/page.tsx` + `app/(app)/settings/{account,profile,stack,notifications,billing,connections,privacy,appearance}/page.tsx`. *Depends on:* auth + layouts.
- [ ] **"Used by these projects" reverse lookup (Idea 1, deep-dive)** — `Eng, 4h` — `lib/queries/showcase/usingResource.ts`; render block on each resource detail page. *Depends on:* showcase ingest having data.
- [ ] **Real-time `/firehose` endpoint (Idea 9, deep-dive)** — `Eng, 1d` — `app/api/firehose/route.ts` (SSE per Q2.4) + polling fallback. *Depends on:* Supabase Realtime subscription on `change_events`.
- [ ] **Public roadmap + changelog (Idea 19, deep-dive R2)** — `Eng, 1d` — `/changelog` page (under marketing group) + `/roadmap` page. Markdown-driven from `editorial-seed/`. *Depends on:* nothing additional.
- [ ] **Launch the automated Pulse newsletter (Plan 14, deep-dive R2)** — `Eng, 3d` — `supabase/functions/send-weekly-digest/index.ts`, `lib/resend/templates/WeeklyDigest.tsx`, `db/pg-cron/003-weekly-digest.sql` (already in MIGRATION_ORDER), `lib/actions/newsletter/{subscribe,confirm,unsubscribe}.ts`, `app/auth/{newsletter-confirm,unsubscribe}/page.tsx`. *Depends on:* Resend wiring + change_events history.
- [ ] **Submit to Hacker News, Product Hunt, relevant subs** — `You, 1d` — non-build work; Ben.
- [ ] **Announce on Twitter / X + Discord communities** — `You, 1d` — non-build work; Ben.

### 2.5 Phase 1 success criteria (master-plan)

- [ ] **Public site live with 24 resource types showing data** — every type's `/[type]` index renders with ≥10 resources from ingestion.
- [ ] **10,000+ resources in database from 13 sources** — `select count(*) from resources where status='published'` ≥10K.
- [ ] **1,000+ unique visitors in launch week** — PostHog dashboard.
- [ ] **First 10 Pro subscribers** — `select count(*) from profiles where subscription_tier='pro'` ≥10.
- [ ] **Newsletter list crosses 500 subscribers** — `select count(*) from newsletter_subscribers where unsubscribed_at is null` ≥500.
- [ ] **First user-submitted resource** — `select count(*) from submissions where status='published' and user_id != '<system-user-uuid>'` ≥1.

---

## §3 Mapping Master Plan → Slices (the slice catalogue)

Cross-reference between master-plan items and `DEPENDENCY_GRAPH.md` §6 slice numbers:

| Master plan section | Slices |
|---|---|
| Phase 0 §1.1 Foundation infra | Pre-Phase-C bootstrap (MIGRATION_ORDER §2-§3) + Slice F (Foundation) |
| Phase 0 §1.2 Auth + data model | Slice F (auth in foundation) + Slice 26 (settings finalisation) |
| Phase 0 §1.3 Brand + design system | Pre-Phase-C: TOKEN_RECONCILIATION, ARCHITECTURE; Phase C: Slice F (chrome) |
| Phase 0 §1.4 Track A ingestion (7 sources) | Slice 23 (interleaved) — start during Phase 0, finish during Phase 1 W3 |
| Phase 0 §1.5 GHA infra | Slice 23 |
| Phase 0 §1.6 Editorial seed | Ben's outside-Cowork work; consumed by Slices 12 (news), 14 (guides), 17 (best-for), 24 (newsletter) |
| Phase 1 W1 (`/models`, `/mcps`, search) | Slices 1, 2, 4, 15 |
| Phase 1 W1 (Sources 8-9) | Slice 23 |
| Phase 1 W2 (Stack Picker, /skills..hooks) | Slices 6, 7 (in foundation but separate detail track), Slice F finalised Stack Picker |
| Phase 1 W2 (Sources 10-11) | Slice 23 |
| Phase 1 W3 (/news, /deals, /guides, /showcase, bookmarks) | Slices 5, 12, 13, 14 |
| Phase 1 W3 (Sources 12-13) | Slice 23 |
| Phase 1 W4 (best-for, compare, adopt, Pro, dashboard, firehose, changelog, newsletter) | Slices 17, 16, 19, 20, 21 (admin), 22, 24, 25, 26, 28 |

---

## §4 Critical-path roll-up (estimate)

Per `DEPENDENCY_GRAPH.md` §7, the 8 critical-path slices sum to:

| Slice | Effort |
|---|---|
| F (Foundation) | 1 week |
| 1 (`/models`) | 1 week |
| 4 (Cmd-K full) | 0.5 week |
| 5 (Bookmarks) | 0.5 week |
| 20 (Pro upgrade) | 1 week |
| 23 (Ingestion — 13 sources, interleaved) | 2 weeks (parallel with above) |
| 24 (Newsletter) | 0.5 week |
| 30 (Legal pages) | 0.5 day |

**Critical-path total: ~5 weeks.** Master plan target: 4 weeks Phase 1. Reality: tight but achievable for the MVP-launch path; everything off the critical path is risk-buffered.

Full Phase C estimate (all 30 slices): **~6-8 weeks at solo pace.** Flagged in `RISK_REGISTER.md`.

---

## §5 What this document gates

- `DEFINITION_OF_DONE.md` (B7): defines per-feature acceptance criteria — slices declared "done" only when DoD passes.
- Phase C slice startup: each slice consults this checklist + the DoD before declaring start; updates `BUILD_LOG.md` with start/end timestamps + actual-vs-estimate variance.
- Phase D Pass 2: walks every checked box and verifies the underlying functionality.
