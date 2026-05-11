# SESSION_HANDOFF.md

*Live document. Last thing produced before any session ends. First thing the next session reads.*

> **Pacing target.** End each session with ~20% context to spare. Better to ship a clean baton than to crash mid-slice with nothing usable.

---

## Current state — end of Session 11

**Session phase:** Phase C in progress.

**Session number:** 11 of ~30.

**Phase A:** ✓ complete (3 batches, 20 questions, 27 ANSWERS entries, ~50 ASSUMPTIONS).

**Phase B:** ✓ complete (8 artifacts).

**Phase C status:**
- ✓ Session 1 — Project skeleton, configs, Boot Steps 1-2, tracking files, canonical schema sql.
- ✓ Session 2 — Boot Steps 3 + 4 (Drizzle clients, middleware, rate-limit). Project moved out of Claude Desktop sandbox to `~/Documents/VibeCoderHub` after the session. First commit on `main` (`df7289a`).
- ✓ Session 3 — `db/relations.ts` populated (51 blocks), Boot Step 6 (auth — 6 files + middleware modification), Boot Step 7 (root providers + cookie banner + root layout). Boot Step 5 (Sentry+Pino) skipped — needs DSN. Boot Step 8 deferred to Session 4.
  - Auth files: `lib/auth/{server,client,middleware,is-admin,return-to}.ts`, `app/auth/callback/route.ts`, middleware.ts modified.
  - Providers: `components/{theme/ThemeProvider,theme/ReducedMotionProvider,stack-context/StackProvider,analytics/PostHogProvider,layout/cookie-banner/CookieBanner}.tsx`, `app/providers.tsx`, `app/layout.tsx`.
- ✓ Session 4 — Boot Steps 8 + 9 + 10 + 11 (UI primitives, icons, layout chrome, root wiring + placeholder home).
  - Primitives (`components/ui/`): button, input, label, badge (+ TypeBadge), card, skeleton, empty-state, tooltip, dropdown-menu, dialog, drawer, toast (Sonner), tabs (hash-driven), icon-button.
  - Icons: `components/icons/Icon.tsx` — 40 Lucide-style SVGs ported verbatim from Promptkit, 1.6px stroke.
  - Chrome: `components/layout/{header/Header,header/MegaMenu,footer/Footer,mobile-nav/MobileNav,stack-banner/StackBanner,skip-link/SkipLink}.tsx`.
  - Supporting: `lib/shadcn/cn.ts`, `lib/resource-types.ts` (24-type registry referencing `colors` from tokens), globals.css helpers (`.mono-caps` / `.tnum` / `.hairline-*` / `.skeleton` shimmer / `hide-{mobile,desktop}`), `eslint.config.mjs` adds `docs/**` to ignores.
  - Root wiring: `app/layout.tsx` mounts SkipLink + StackBanner + Header + main + Footer + MobileNav. `app/page.tsx` placeholder home so chrome renders in `pnpm dev`.
  - Step 5 (Sentry) still deferred — no DSN. Avatar / Popover / dedicated Pill primitives deferred to Session 5 (build when needed).
- ✓ Session 5 — Boot Step 12 (real landing page) + Slice S01 (full /models index + /models/[slug] detail).
  - `app/page.tsx` — real anonymous landing: hero + stats strip + 3-pillar tile cards + 4-column category browse + top-4-models teaser + Pro upgrade closer.
  - `lib/seed/models.ts` — 8 seed model records matching the `resources ⋈ models` join shape. `listModels` / `getModelBySlug` / `sortModels` / `filterModels`. Drop-in for the eventual DB query.
  - `app/models/page.tsx` — Server Component hero + count + delegation to `ModelsList`.
  - `app/models/_components/{ModelsList,ModelCard}.tsx` — Client list with search + 5 sorts + open-weights filter + Load-more pagination + skeleton + empty state + in-memory bookmarks.
  - `app/models/loading.tsx` — route-segment loading boundary (idiomatic for the eventual async query).
  - `app/models/[slug]/page.tsx` — Server Component detail. `generateStaticParams` prerenders all 8 slugs. Hero + 4-up stats strip + tabs + right rail (Try-it / Alternatives / Source).
  - `app/models/[slug]/_components/ModelDetailTabs.tsx` — Client wrapper over hash-driven Tabs. 4 panels: Overview / Pricing / Performance / Capabilities. Hash sync verified end-to-end via preview eval.
  - Build emits 14 routes (8 are SSG model details). Index 6 kB / 122 kB first-load. Detail 2.1 kB / 118 kB. Middleware 80.5 kB.
- ✓ Session 7 — Foundation slice F overlays + Slice S02 `/mcps`.
  - `components/overlays/{OverlaysProvider,CmdK,AuthModal,StackPicker}.tsx` + `lib/stack/presets.ts`. Single provider mounts all three modals + registers the global ⌘K keybinding. Cmd-K built on `cmdk` (groups: Recent / Models / Actions; `>` flips to command mode); AuthModal wraps Supabase GitHub OAuth + magic link; StackPicker has 6 preset cards above the fold + 8 AI clients + 27 tech-stack tags, persists to `vch_stack` cookie via the existing StackProvider.
  - `Header.tsx` wired: search button → openCmdK, sign-in / get-started → openAuth, new "Set your stack" pill chip → openStackPicker.
  - `lib/seed/mcps.ts` — 8 seed MCP records (resources ⋈ mcps shape) with typed tools / resources / prompts.
  - `app/mcps/page.tsx`, `app/mcps/_components/{McpsList,McpCard}.tsx`, `app/mcps/loading.tsx`, `app/mcps/[slug]/page.tsx`, `app/mcps/[slug]/_components/McpDetailTabs.tsx`. Index has client + sort filters; detail has 5 tabs including a read-only MCP Tool Inspector that accordion-expands each tool to show its JSON Schema input.
  - `generateStaticParams` prerenders all 8 MCP detail pages.
  - Editor's-pick accent: /models uses mint at 0 + UV at 4; /mcps uses UV at 0 + mint at 4 (D37) for visual distinction.
- ✓ Session 8 — SEO infra + shared chassis + 6-type batch (S03-S08).
  - SEO: `app/sitemap.ts` (dynamic; pulls from seed data), `app/robots.ts` (allow `/`, disallow authed paths + /api), `app/opengraph-image.tsx` (default 1200×630), `app/models/[slug]/opengraph-image.tsx` + `app/mcps/[slug]/opengraph-image.tsx` (per-resource OG via generateImageMetadata), `app/api/health/route.ts` (Edge liveness probe returning `{status, timestamp, uptimeSeconds, version, env}`).
  - Shared chassis: `lib/seed/generic.ts` (shape + sort + filter), `components/resources/{GenericResourceIndex,GenericResourceCard,DetailChassis,DetailTabs,ResourceIndexPage,CodeSnippetPreview}.tsx`. Detail chassis takes an optional `previewBlock` for Zone 5.
  - Batch S03-S08: /components (Snippet tab), /skills (Overview + Compatibility), /rules (Rule text tab), /subagents (Overview + Compatibility), /plugins (Overview + Compatibility), /prompts (Template tab). Each per-type page is ~10 lines index + ~30 lines detail; 4 seed entries per type. `lib/seed/_configs.ts` bundles configs.
  - Build emits 46 routes total. 24 new SSG detail pages added (4 per type × 6 types). Middleware 80.8 kB.
- ✓ Session 9 — Slices S09 + S10 + S11 + 16-type closeout batch.
  - `/deals` — 10 seed deals across 3 tiers (public / member / pro) × 4 categories. Server hero + Client `DealsList` with category + tier pill rows + sort `<select>`. `DealCard` paints Pro deals under a `backdrop-blur-md` overlay with `UpgradeModal` trigger; member deals get a sign-up CTA; public deals are claimable inline.
  - `components/overlays/UpgradeModal.tsx` — Pro paywall modal with payback math + UV CTA. `OverlaysProvider` now exposes `openUpgrade(context)`.
  - `/news` + `/news/[slug]` + `/news/feed.rss` + `/news/feed/[kind].rss` — 8 seed news items, 5 kind filters (Client state), focused-read article at `max-w-prose`. RSS 2.0 feeds with shared XML renderer; per-kind feeds prerendered via `generateStaticParams`.
  - `/guides` + `/guides/[slug]` — tinted grid index, sticky-aside stepper detail. Step completion persists to `vch_guide_completed:<slug>` in localStorage.
  - 16-type batch closeout — every remaining `resource_type` enum (tools, hooks, commands, starters, workflows, evals, showcase, sandboxes, observability, backends, assets, docs-for-llms, specs, stacks, scripts, marketplaces) now has a working index + detail. 3 seed entries each. Page wrappers stamped via `/tmp/stamp_pages.sh`.
  - `app/sitemap.ts` walks every bundle reflectively + lists deals/news/guides. New types pick up SEO for free.
  - Build emits 141 routes total. Middleware unchanged at 80.8 kB.
- ✓ Session 10 — Cmd-K expansion + /dashboard + /submit + /settings (parallel subagents).
  - `components/overlays/CmdK.tsx` rewritten to search across every seed bundle in `_configs` + models + MCPs + deals + news + guides (~70 entries). New `buildIndex()` returns `SearchEntry[]` grouped by type via stable `GROUP_ORDER`. Each row renders a TypeBadge-style chip on the left so users can distinguish types at a glance. Recents persist full entry so cross-type history works.
  - `/dashboard` (protected) — Server `auth()` gate → redirect to `/?signin=1` if anon. Kicker + brutalist "Welcome back." + 3-column grid (Your stack mint-border + openStackPicker, Recent bookmarks EmptyState stub, What's changed 3-row stub) + 4-button Quick Actions row + Saved-stacks placeholder.
  - `/submit` (protected) — 4-step wizard (Type → Details → Compatibility → Review). Mint step dots, Zod schema (`_schema.ts`), per-field inline errors, 600 ms fake submit → success state. TODO Slice S24 for real POST. 19 kB client bundle (Zod).
  - `/settings` (protected) — Tabs-driven (Profile / Stack / Subscription / Danger). Profile form fakes 400 ms save → toast. Subscription "Upgrade to Pro" → openUpgrade. Danger zone opens DeleteAccountModal — Radix Dialog with email-match gate before the danger button enables.
  - Process: Cmd-K landed on the main thread (touches shared overlay code), then 3 subagents built dashboard / submit / settings in parallel (~14 min wall-clock vs ~45-60 min sequential). Subagents adapted to the real `auth()` export rather than the prompt's mistaken `getServerUser` reference.
  - Build emits 145 routes total. New routes: `/dashboard` 1.77 kB, `/settings` 3 kB, `/submit` 19 kB. Middleware unchanged at 80.8 kB. Protected routes verified to 307 → `/?signin=1` when anon.
- ✓ Session 11 — Bookmarks persistence + /compare + /best-for + /pricing (3 parallel subagents after main-thread bookmarks).
  - `components/bookmarks/BookmarksProvider.tsx` — React context + `vch_bookmarks` cookie (1-year SameSite=Lax). Entry shape `{id, type, name, href, addedAt}`. Anon cap = 5 per Q1.5. `useBookmarks()` API: `{items, count, limit, atCap, has, toggle, remove, clear}`. Wired into `app/providers.tsx`.
  - 3 lists swapped local `useState<Set<string>>` for the hook: ModelsList, McpsList, GenericResourceIndex. At-cap → `toast.error` with upgrade hint.
  - `BookmarkChip` in Header between Stack chip and auth buttons — mint pill with count when ≥1, links to /dashboard/bookmarks.
  - `/dashboard/bookmarks` (protected) — sort row (Recent / By type / A→Z), Trash per-row, Clear all with confirm. `DashboardClient` now renders top-5 bookmarks in the "Recent bookmarks" card (replaces the EmptyState stub when count > 0).
  - `/compare` — `?ids=type:slug,…` URL state, shareable links. `_lib/resolve.ts` walks models/MCPs/all `_configs` bundles. CompareGrid renders 11 conditional rows (rating / installs / license / input / output / blended-mint / intelligence / context / speed / tools / compatible-clients). EmptyState when no ids.
  - `/best-for` — 12 use cases × 3 editorial picks each. Index = tinted tile grid; per-use-case page has top-3 ranked picks (60px Bebas mint numbers) + 7 stub slots + JSON-LD `ItemList` schema.
  - `/pricing` — Free/Member/Pro three-card grid (Member is the highlighted recommended one; Pro UV-accent). 14-row × 3-col feature table. Money-back callout + 5-question FAQ accordion. CTAs fire openAuth('signup') / openUpgrade.
  - Build emits 159 routes total. Middleware unchanged at 80.8 kB.
- ✓ Session 6 — Design polish. Root cause: Tailwind v4 wasn't reading `tailwind.config.ts` (v4 needs `@theme` in CSS), and our reset rules sat in unlayered CSS which beat the utility layer in the cascade. Two CSS edits unblocked the entire palette: added `@theme { --color-* / --font-* / --radius-* / --height-* / --container-* / … }` block + wrapped reset/base in `@layer base { … }`. Net effect: every page that already had correct structure suddenly rendered with the full Promptkit palette (mint kicker, mint hero highlight, mint stats in 38px Bebas Neue, mint/uv/yellow pillar tiles, mint button pills, mint nav-active underline, 1280px containers instead of 320px).
  - Also: `ModelCard` gained `tone={'dark' | 'mint' | 'uv'}` + `ribbon` props. `ModelsList` paints position 0 as the mint "★ EDITOR'S PICK" card, position 4 as ultraviolet; rest stay dark. Matches Promptkit's accent-rhythm pattern.
  - Verified at 1440×900 and 375×812 — both render Promptkit-faithful.

**Project location:** `~/Documents/VibeCoderHub/vibecoderhub-web` (moved out of Claude Desktop sandbox Session 2 → 3 handoff). Planning docs at `~/Documents/VibeCoderHub/`.

**Last commit:** `1ccd8e6` (`feat(bookmarks,pricing): cookie-backed bookmarks + /pricing page`) on branch `feat/bookmarks-pricing`. Session 11A pricing-polish follow-up (mint-on-Pro per spec revision, "Browse free →" → /models) committed on the same branch.

**Earlier checkpoint commits on `main`:** `50a1d7d` (`fix(app): add error / global-error / not-found route boundaries`), `e1e9926` (`fix(theme): tailwind v4 @theme + @layer base — unblocks entire palette`), `52e51ae` (Session 5 models), `40a64fd` (Session 4 chrome), `6aa2511` (planning docs in repo), `9202881` (Session 3 auth + providers), `df7289a` (Sessions 1-2 skeleton).

**4 quality gates at end of Session 11:** typecheck ✓, lint ✓, build ✓ — **159 routes total** (up from 145). New routes: `/compare` 2.29 kB · `/best-for` index + 12 SSG details · `/dashboard/bookmarks` 5.46 kB · `/pricing` 1.9 kB. Middleware unchanged at 80.8 kB. Verified: `/`, `/pricing`, `/best-for`, `/best-for/saas-weekend`, `/compare?ids=…` all 200; `/dashboard/bookmarks` 307 → `/?signin=1` when anon; JSON-LD `ItemList` present on use-case pages; `/compare?ids=model:gpt-5,model:claude-opus-4-7,mcp:github-mcp` resolves all 3 mixed-type items.

**Next planned:** Session 12 — Wire real Supabase project if creds land (bookmarks DB swap + real auth round-trip), Sentry + Pino if DSN arrives, Cmd-K type-prefix filters (`>models foo`), and editorial seed bundle pickup if delivered.

---

## Pre-flight for Session 4 (read in this order, do these things)

### 1. Read these files (in this order)

```
/outputs/SESSION_HANDOFF.md         ← THIS FILE — tells you where we are
/outputs/ANSWERS.md                 ← every Q&A from Phase A (the decisions index)
/outputs/ASSUMPTIONS.md             ← every default we proceeded with
/outputs/vibecoderhub-web/BUILD_LOG.md  ← Session 1 decisions + deferrals
/outputs/vibecoderhub-web/KNOWN_ISSUES.md
/outputs/TOKEN_RECONCILIATION.md    ← when touching styles
/outputs/ARCHITECTURE.md            ← when touching architecture
/outputs/DIRECTORY_TREE.md          ← when creating files
/outputs/MIGRATION_ORDER.md         ← when changing setup order
/outputs/DEFINITION_OF_DONE.md      ← when completing a slice
```

If any locked decision seems wrong, surface via the `🛑 STOPPING` format. Never silently deviate.

### 2. Verify Ben's local validation status

Check the validation table below in §Validation status. If status is ✗ or ⚠️ on any of `pnpm install` / `typecheck` / `lint` / `build`, fix Session 1 issues BEFORE writing any new code. Do not stack Session 2 code on a broken Session 1 foundation.

### 3. Open the canonical files for Session 4

Boot Step 5 (Sentry + Pino) — **needs Sentry DSN before starting**. If still not provided, skip and continue:
```
sentry.client.config.ts                ← will create
sentry.server.config.ts                ← will create
sentry.edge.config.ts                  ← will create
instrumentation.ts                     ← will create (next.js instrumentation hook)
lib/logger.ts                          ← will create (Pino with redact + transports)
```

Boot Step 8 (UI primitives) — no external creds needed. ~17 components, all token-aware per TOKEN_RECONCILIATION:
```
components/ui/button.tsx               ← 5 sizes × 5 variants
components/ui/input.tsx                ← 3 sizes
components/ui/label.tsx
components/ui/badge.tsx
components/ui/pill.tsx
components/ui/card.tsx
components/ui/skeleton.tsx
components/ui/dialog.tsx               ← Radix wrapper
components/ui/drawer.tsx               ← Vaul
components/ui/tooltip.tsx              ← Radix
components/ui/popover.tsx              ← Radix
components/ui/dropdown.tsx             ← Radix
components/ui/tabs.tsx                 ← URL-hash-driven (Phase B B2)
components/ui/toast.tsx                ← Sonner-based
components/ui/toaster.tsx              ← (already partially wired in app/providers.tsx)
components/ui/icon-button.tsx
components/ui/avatar.tsx               ← Radix
```

Boot Step 9 (icons) — no external creds:
```
components/icons/Icon.tsx              ← Lucide wrapper, 1.5px stroke
components/icons/ProviderLogos/*
components/icons/ClientLogos/*
```

Boot Step 10 (layout chrome) — stretch:
```
components/layout/header/* (all 7 files)
components/layout/footer/*
components/layout/mobile-nav/*
components/layout/stack-banner/*
components/layout/skip-link/*
components/layout/breadcrumb/*
```

### 4. Run this command first

```bash
cd vibecoderhub-web
pnpm install                # if not already run by Ben between sessions
pnpm typecheck && pnpm lint && pnpm build  # confirm green baseline before adding
```

If green, begin Session 2 work. If red, fix existing Session 1 issues first.

### 5. Begin with Boot Step 3 — Drizzle DB schema mirror

Per MIGRATION_ORDER §4 Step 3, the order within Step 3 is:
1. `db/enums.ts` (Postgres enums as Drizzle `pgEnum` declarations)
2. `db/schema.ts` (every table from canonical SQL, hand-mirrored — ~800 lines, the big one)
3. `db/relations.ts` (Drizzle relations for `db.query.X.findFirst({ with: ... })`)
4. `db/operational/rate_limit_buckets.ts` (operational table, separate file per DIRECTORY_TREE §5)
5. `lib/server/db.ts` (pooled Drizzle client via `postgres-js`)
6. `lib/server/db-direct.ts` (direct connection, migrations-only)
7. `lib/server/db-service.ts` (service-role client)
8. `db/migrations/0002_rate_limit_buckets.sql` (operational migration sql)

Then Boot Step 4 (rate-limit + middleware), then Boot Step 5 (Sentry + Pino). Land each as a separate commit.

---

## Validation status — end of Session 3 (Claude ran these)

```
$ pnpm typecheck               ✓ green (silent)
$ pnpm lint                    ✓ green after D14 fix (core `no-unused-vars` off)
$ pnpm build                   ✓ green
                                 - middleware 80.7 kB (was 30.5 kB; @supabase/ssr)
                                 - /auth/callback (dynamic) registered
                                 - /404 unchanged
```

Session 3 fixes that landed:
- **D14** disabled core `no-unused-vars` (TS variant handles signature params correctly).
- **D15** patched `.env.local` — R2_*, RESEND_WEBHOOK_SECRET, and DATABASE_URL_* needed real-looking dummy values once `app/auth/callback/route.ts` imported the auth chain and pulled `lib/env.ts` into build-time evaluation.
- **D16** middleware `refreshSession()` short-circuits on placeholder URLs / dummy keys so local dev doesn't DNS-fail every request.

Engine constraint: Node 18 host vs `.nvmrc` says 22 — pnpm warns, build proceeds. Supabase JS now warns at build time too ("Node.js 18 deprecated"). Bumping to Node 22 locally is overdue.

---

## Open questions for Ben (resolve before Session 2 if possible)

### Q1.7 — Editorial seed in version control? [LOW priority — defaultable]
`.gitignore` currently has `editorial-seed/` exclusion COMMENTED OUT — by default we DO commit Ben's editorial bundle so it's reviewable in PRs and seedable reproducibly. Confirm or override.

**Default:** commit. (Reasoning: PR review of new editorial content is valuable; reproducible seed across envs.)

### Q1.8 — Email domain DNS access timing [BLOCKER for newsletter slice 24]
Resend domain verification + SPF/DKIM/DMARC setup needs DNS access. Phase 1 launch needs `news@vibecoderhub.com` working. Confirm Ben has DNS access NOW (Cloudflare per ASSUMPTIONS) and can configure when needed. **No action this session** — flagged so it's not a surprise at slice 24.

### Q1.9 — `.gitignore` for `.env*` patterns
Currently excludes `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`. Includes `.env.example`. Standard. Confirm no other env file patterns to exclude (e.g., `.env.*.local` glob if you use multiple local envs).

**Default:** as-is (covers standard Next.js conventions).

### Q1.10 — GitHub repo URL [needed for Session 2's Sentry release tagging]
Once Ben creates the repo + pushes Session 1, capture the URL into `SESSION_HANDOFF.md` so Session 2 can wire Sentry source-map upload + GitHub Action workflows correctly. **Not blocking Session 2 start; needed mid-Session-2 for Sentry config.**

---

## Files in `/outputs/`

| File / folder | Status | Purpose |
|---|---|---|
| `PROMPTKIT_RECON.md` | ✓ done | Pre-Phase-A reconnaissance |
| `ANSWERS.md` | ✓ Phase A locked | All Q&A capture |
| `ASSUMPTIONS.md` | ✓ Phase A locked | All defaults captured |
| `TOKEN_RECONCILIATION.md` | ✓ Phase B locked | Visual system canonical |
| `ARCHITECTURE.md` | ✓ Phase B locked | Technical decisions canonical |
| `DIRECTORY_TREE.md` | ✓ Phase B locked | File layout canonical |
| `MIGRATION_ORDER.md` | ✓ Phase B locked | Build sequence |
| `DEPENDENCY_GRAPH.md` | ✓ Phase B locked | Slice ordering |
| `PHASE_0_1_CHECKLIST.md` | ✓ Phase B locked | Master-plan → file-paths mapping |
| `DEFINITION_OF_DONE.md` | ✓ Phase B locked | Per-feature acceptance criteria |
| `RISK_REGISTER.md` | ✓ Phase B locked | 20 risks + mitigations + triggers |
| `SESSION_HANDOFF.md` | ▸ live | This file |
| `specs/` | reference | The 6 canonical spec files (extracted from `promptkitdesign.zip`) |
| `promptkit-recon/` | reference | Extracted Promptkit prototype (visual reference) |
| `vibecoderhub-web/` | ▸ active build | The actual project (Session 1 output) |

### Inside `vibecoderhub-web/` after Session 1

| File / folder | Status |
|---|---|
| `package.json` | ✓ Session 1 |
| `tsconfig.json` | ✓ Session 1 |
| `eslint.config.mjs` | ✓ Session 1 |
| `.prettierrc.mjs` | ✓ Session 1 |
| `.gitignore` | ✓ Session 1 |
| `.nvmrc` | ✓ Session 1 |
| `.env.example` | ✓ Session 1 |
| `next.config.ts` | ✓ Session 1 |
| `postcss.config.mjs` | ✓ Session 1 |
| `tailwind.config.ts` | ✓ Session 1 |
| `BUILD_LOG.md` | ✓ Session 1 entry |
| `KNOWN_ISSUES.md` | ✓ Session 1 |
| `IDEAS_DURING_BUILD.md` | ✓ Session 1 (empty, ready) |
| `MAKE_SURE_VERIFICATION.md` | ✓ Session 1 |
| `lib/env.ts` | ✓ Session 1 (Boot Step 1) |
| `lib/tokens.ts` | ✓ Session 1 (Boot Step 2) |
| `app/globals.css` | ✓ Session 1 (Boot Step 2) |
| `db/migrations/0001_initial.sql` | ✓ Session 1 (canonical schema copied) |
| `db/enums.ts` | ✓ Session 2 (Boot Step 3a) |
| `db/schema.ts` | ✓ Session 2 (Boot Step 3b — 61 tables, 1502 lines) |
| `db/relations.ts` | ⚠️ Session 2 STUB — populate first thing in Session 3 |
| `db/migrations/0002_rate_limit_buckets.sql` | ✓ Session 2 (Boot Step 3d) |
| `db/migrations/0003_ingestion_runs.sql` | ✓ Session 2 (Boot Step 3d) |
| `db/operational/rate_limit_buckets.ts` | ✓ Session 2 |
| `db/operational/ingestion_runs.ts` | ✓ Session 2 |
| `lib/server/db.ts` | ✓ Session 2 (pooled) |
| `lib/server/db-direct.ts` | ✓ Session 2 (direct, migrations only) |
| `lib/server/db-service.ts` | ✓ Session 2 (Supabase service-role client) |
| `lib/server/ratelimit.ts` | ✓ Session 2 (sliding-window CTE) |
| `lib/http/ip.ts` | ✓ Session 2 |
| `lib/http/request-id.ts` | ✓ Session 2 (AsyncLocalStorage) |
| `middleware.ts` | ✓ Session 2 + 3 (now async; `refreshSession` wired) |
| `db/relations.ts` | ✓ Session 3 — 51 blocks, 520 lines |
| `lib/auth/server.ts` | ✓ Session 3 (Boot Step 6) |
| `lib/auth/client.ts` | ✓ Session 3 |
| `lib/auth/middleware.ts` | ✓ Session 3 (Edge — Supabase cookie refresh, dummy-key skip) |
| `lib/auth/is-admin.ts` | ✓ Session 3 |
| `lib/auth/return-to.ts` | ✓ Session 3 |
| `app/auth/callback/route.ts` | ✓ Session 3 (OAuth code exchange) |
| `components/theme/ThemeProvider.tsx` | ✓ Session 3 |
| `components/theme/ReducedMotionProvider.tsx` | ✓ Session 3 |
| `components/stack-context/StackProvider.tsx` | ✓ Session 3 |
| `components/analytics/PostHogProvider.tsx` | ✓ Session 3 |
| `components/layout/cookie-banner/CookieBanner.tsx` | ✓ Session 3 |
| `app/providers.tsx` | ✓ Session 3 |
| `app/layout.tsx` | ✓ Session 3 (Next/font wiring + cookie reads) |
| `.env.local` | ⚠️ Modified Session 3 — R2/RESEND/DATABASE_URL dummies filled in. Real values land per slice. |
| `eslint.config.mjs` | ⚠️ Modified Session 2 + 3 (D7-D9, D14) |
| All other dirs | ▸ empty placeholders, populated as slices land |

---

## Session-by-session projection (revised after Session 1)

| Session | Scope | Status |
|---|---|---|
| **1** | Project skeleton + Boot Steps 1-2 + Phase-C tracking files | ✓ done |
| **2** | Boot Steps 3-4 (Drizzle clients + middleware/rate-limit). Sentry deferred (no DSN). Relations.ts deferred to Session 3 (subagent timed out). | ✓ done |
| **3** | relations.ts populated, Boot Steps 6-7 (auth + root providers). Step 5 (Sentry) deferred — no DSN. Step 8 deferred to next. | ✓ done |
| **4** | Boot Step 5 (Sentry+Pino — needs DSN), Boot Steps 8-9 (UI primitives + icons), stretch Step 10 (layout chrome) | ▸ next |
| **5** | Boot Steps 11-12 + Foundation slice F (landing + home + AuthModal + Stack Picker + Cmd-K skeleton + /api/health + sitemap + robots + OG) |  |
| **6** | Slice 1: /models index + /models/[slug] detail (proves the full stack with first real type) |  |
| **7-9** | Slices 2-4: /mcps + /components + Cmd-K full |  |
| **10-12** | Slices 5-7: bookmarks + /skills detail + extension types batch |  |
| **13-16** | Slices 8-12: /tools + infra types + /news + /deals + /guides + /showcase |  |
| **17-19** | Slices 13-16: /search + /compare + /best-for SEO + /alternatives |  |
| **20-22** | Slices 17-20: Adopt-stack + Pro upgrade + admin + /firehose |  |
| **23-26** | Slices 21-25: Ingestion (13 sources interleaved) + newsletter + pricing + settings + submit |  |
| **27-30** | Slices 26-30: 404/500/maintenance + SEO infra + legal pages + Phase D Pass 1 |  |
| **31-34** | Phase D Passes 2-5 + Outside-Eye + delivery package |  |

Realistic horizon: **30-34 sessions** to public-launchable state. Critical-path (8 slices) reachable in ~10-12 sessions if everything goes smoothly.

---

## Decisions locked (cross-reference index)

For full reasoning see `ANSWERS.md`. Quick lookup:

| Decision | Source |
|---|---|
| Promptkit visual + build-prompt structural tokens | Pre-A R1 → TOKEN_RECONCILIATION.md |
| 24 resource types + 3 content surfaces = 27 destinations | Pre-A R2 |
| Light mode deferred to Phase 2 | Pre-A R3 |
| 3 fonts: Bebas Neue + DM Sans + Space Mono | Pre-A R4 |
| Visual conflicts → Promptkit; structural → design-prompt | Pre-A R5 |
| Tweaks-panel excluded | Pre-A R6 |
| Multi-session framing; Phase D defers to end | Pre-A R7 |
| Schema canonical + scope-down policy | Q1.1 |
| MCP Tool Inspector read-only Phase 1 | Q1.1 |
| GHA + pg_cron + Edge Functions only | Q1.2 |
| OpenAI text-embedding-3-small for embeddings ($50/mo cap) | Q1.3 |
| OpenRouter primary; AA Phase 2 | Q1.4 |
| $99/yr Pro + 14-day trial card-required + Customer Portal | Q1.5 |
| Single repo at root; trunk-on-main; Conventional Commits | Q1.6 |
| 13 ingestion sources Phase 0+1 + priority enum | Q2.1 |
| News auto-drafts go to admin queue, not auto-publish | Q2.2 |
| Stack: hardware-capture-now-use-later; cookie `vch_stack`; adopt = bookmark+fork | Q2.3 |
| `/api/firehose` SSE + 5 RSS feeds Phase 1 | Q2.4 |
| Cmd-K: tsvector + embedding parallel; `>type query` filter | Q2.5 |
| Admin via `ADMIN_GITHUB_USER_IDS` numeric env var | Q2.6 |
| PostHog for analytics + session replay | Q2.7 |
| Image moderation: showcase pre-publish, avatars immediate + NSFW pre-screen | Q2.8 |
| Soft-30-then-hard delete; PII scrub; retained attribution | Q3.1 |
| OG images: dynamic via `opengraph-image.tsx`, edge-cached | Q3.2 |
| Perf: <200KB default; <300KB model-page exception | Q3.3 |
| 12 use-case `/best-for` pages verbatim from schema seed | Q3.4 |
| 30 Stack Picker presets, top-6 above fold | Q3.5 |
| Pro launches with 3 live features + transparent "coming soon" copy | Q3.6 |
| Operational-table carve-out: rate_limit_buckets, ingestion_runs OK | Phase B Flag 1 |
| One-folder-per-resource-type (no mega-route) | Phase B Flag 2 |
| Hash-based tabs Phase 1 (convertible to nested routes post-launch) | Phase B B2 |
| `--space-9-exception` only as CSS variable, not Tailwind utility | Session 1 D2 |
| Dummy-key local-dev mode in `lib/env.ts` + `.env.example` | Session 1 D1 |
| `editorial-seed/` committed to repo by default | Session 1 D6 (pending Q1.7 confirm) |

---

## Editorial seed bundle (Ben provides outside Cowork)

Status: **not yet delivered.** Build infrastructure that consumes will land in slices 12 (news), 14 (guides), 17 (best-for), 24 (newsletter). Bundle can land any time before those slices.

Required:
- 4 AGENT.md personality files at `editorial-seed/agents/{workflow-author,news-editor,guide-writer,reviewer-qa}.md`
- 10 evergreen guides at `editorial-seed/guides/*.md`
- 30 stack presets at `editorial-seed/presets/*.json` (matching `user_stacks` shape)
- First newsletter at `editorial-seed/newsletter/issue-001-launch.tsx` (React Email)
- 50 RSS feeds at `editorial-seed/rss-sources.json`
- 36 best_for rows at `editorial-seed/best-for/*.md` (one per use case, with top-3 picks + rationale)
- Top-12 model benchmark snapshot at `editorial-seed/benchmarks/top-12-models-snapshot.json`

`db/seed/seed.ts` (Session 5 work) will read from this folder.

---

## Credentials package (Ben provides via secure channel before Session 6)

Status: **awaiting.** Phase B can scaffold `.env.example` placeholders (✓ done); real credentials slot in before any slice that needs them. Session 2-5 work all uses dummy keys per the local-dev mode.

First slice that requires REAL keys: **Slice 1 (Models index, Session 6)** — needs real Supabase project + populated DB to render real model data.

Required (in priority order):
1. **Supabase prod project** — `vibecoderhub-prod`, Pro tier; URL + service-role key + anon key + pooled connection string + direct connection string. Needed by Session 6.
2. **GitHub repo URL** — for Sentry release tagging. Needed mid-Session 2.
3. **Ben's GitHub user ID** — for `ADMIN_GITHUB_USER_IDS`. Needed by Session 5 (Foundation slice — admin route group middleware).
4. **OpenAI API key** — for embedding generation. Needed by Session 6 (ingestion produces resources, embedding pipeline runs).
5. **Sentry DSN + auth token** — for source-map upload. Needed by Session 2.
6. **PostHog API key** — for client-side analytics. Needed by Session 3 (root providers).
7. **Resend API key + DNS-verified domain** — needed by slice 24 (newsletter). Lots of slack.
8. **Stripe test keys** — needed by slice 20 (Pro upgrade). Plenty of slack.
9. **Replicate API token** — needed by slice 11+ (avatar uploads). Plenty of slack.
10. **R2 keys** — needed by ingestion slice (~slice 23 onward). Plenty of slack.
11. **Slack ops webhook** — needed by ingestion slice. Plenty of slack.

---

## How to resume in a fresh session (paste this as the first message)

```
Resuming Vibe Coder Hub build. Read these files in order before doing anything else:

1. /outputs/SESSION_HANDOFF.md       ← THIS FIRST. Tells you everything below in summary.
2. /outputs/ANSWERS.md               ← every Q&A from Phase A. The decisions index.
3. /outputs/ASSUMPTIONS.md           ← every default Claude proceeded with.
4. /outputs/vibecoderhub-web/BUILD_LOG.md  ← prior sessions' decisions.
5. /outputs/vibecoderhub-web/KNOWN_ISSUES.md
6. The Phase B reference docs as relevant to the current slice:
   /outputs/TOKEN_RECONCILIATION.md  (when touching styles)
   /outputs/ARCHITECTURE.md          (when touching architecture)
   /outputs/DIRECTORY_TREE.md        (when creating files)
   /outputs/MIGRATION_ORDER.md       (when changing setup order)
   /outputs/DEFINITION_OF_DONE.md    (when completing a slice)
   /outputs/PHASE_0_1_CHECKLIST.md   (when starting a master-plan checkbox)
7. /outputs/specs/vibe-coder-hub-*.{md,sql}  (the six canonical specs)

Then resume from the "Next planned" section in SESSION_HANDOFF.md. Verify Ben's
local validation status from the previous session before stacking new code.

Do not re-litigate any locked decision (see SESSION_HANDOFF.md "Decisions locked"
table). If a locked decision seems wrong, surface via the 🛑 STOPPING format
from the build prompt — never silently deviate.

Build prompt is the canonical process spec. The per-slice ritual (build →
typecheck → lint → build → tests → Make Sure walk → 375px test → both themes
[Phase 1 = dark only] → both auth states → BUILD_LOG append → commit →
checkpoint) gates every slice.

Confirm you've read all the above and surface any conflicts before continuing.
```

---

## Open commitments (things Ben is doing in parallel)

- **Local validation** of Session 1 output (`pnpm install` → `typecheck` → `lint` → `build`); update §Validation status above with results.
- **Editorial seed bundle** drafting (AGENT.md personalities, guides, presets, newsletter, best_for, benchmarks).
- **External account setup** (Supabase prod, Stripe, Resend + DNS, PostHog, Sentry, OpenAI, Vercel).
- **GitHub repo creation** + initial commit + push (gives us the URL for Session 2's Sentry config).
