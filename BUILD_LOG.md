# BUILD_LOG.md

*Continuous decisions log. Appended at every commit. The "what / why / what surprised me / what's deferred" record.*

---

## Session 1 — Phase C kickoff (Boot Steps 1-2 + project skeleton)

### Built

- Project skeleton: directory structure per `DIRECTORY_TREE.md` (all top-level + nested folders empty-but-present).
- Repo config: `package.json` (every script from DIRECTORY_TREE.md §12, every dep from ARCHITECTURE.md), `tsconfig.json` (strict + `noUncheckedIndexedAccess` + path aliases), `eslint.config.mjs` (flat config; rules: no `any`, server-only enforcement, no `"use client"` in route files, no hex literals), `.prettierrc.mjs` (with prettier-plugin-tailwindcss), `.gitignore`, `.nvmrc` (node 22), `next.config.ts` (security headers + remotePatterns + Server Actions bodySizeLimit), `postcss.config.mjs` (Tailwind v4).
- `.env.example`: complete canonical env list per DIRECTORY_TREE.md §11 with the local-dev "no external services" mode documented at the bottom (`sk_test_dummy` / `whsec_dummy` / etc. placeholder convention).
- **Boot Step 1** — `lib/env.ts`: Zod-validated env vars. App fails to boot on missing/invalid. `apiKey()` helper accepts dummy placeholders for local-dev mode. `isDummyKey()` exported for `lib/server/*` clients to mock external service calls. `isDev` / `isProd` / `isTest` / `isLocalDev` derived helpers.
- **Boot Step 2** — `lib/tokens.ts`: complete TS source-of-truth for design tokens, derived from `TOKEN_RECONCILIATION.md`. Includes colours (verbatim Promptkit), semantic role aliases, fonts (3 — Newsreader dropped), full type scale (21 entries), 4px-base spacing with `9_exception` for TypeBadge, 11-slot radii system, 5 button-height slots with derived padding tokens, 3 input-height slots, icon button sizes, 8-tier z-index, motion tokens, focus ring spec, shadow + elevation, container widths, breakpoints, page padding, section + form rhythm. Type exports for ColorToken / RadiusToken / SpaceToken / ButtonSize / etc.
- **Boot Step 2 cont.** — `app/globals.css`: CSS variables mirroring `lib/tokens.ts`. `:root` with `color-scheme: dark`. Reset + base typography. Custom scrollbar. Selection styling. Focus-visible rings (visible, never suppressed). `prefers-reduced-motion` global respect. `.skip-link` a11y helper.
- **Boot Step 2 cont.** — `tailwind.config.ts`: Tailwind v4 theme extension derived from `lib/tokens.ts`. Colours + role aliases + spacing + radii + heights (btn-md, input-md, icon-md, etc.) + container widths + z-index + motion + shadows. `9_exception` deliberately NOT exposed via Tailwind utility — TypeBadge uses CSS variable directly.
- Canonical `vibe-coder-hub-schema.sql` copied to `db/migrations/0001_initial.sql`.

### Decisions made

- **D1.** Used `apiKey()` validator helper that accepts `<prefix>dummy` suffix for local-dev mode. Keeps env validation strict in production while letting the app boot without external accounts wired up. Surfaced in .env.example bottom comment.
- **D2.** Did NOT expose `--space-9-exception` via Tailwind utility. Force component code to use `style={{padding: '3px var(--space-9-exception)'}}` inline for the TypeBadge component only — explicit "this is the documented exception" rather than tempting accidental use. Per TOKEN_RECONCILIATION §4.
- **D3.** `noUncheckedIndexedAccess: true` in tsconfig. More verbose code (need to handle `arr[0]` as `T | undefined`) but catches a class of bugs where we assume array indexing returns a valid item. Worth it for production-quality.
- **D4.** ESLint flat config restricts `"use client"` in `app/**/page.tsx` and `app/**/layout.tsx` files (per ARCHITECTURE §2 composition rule). Forces interactive bits into separate CC files imported into the page. Reviewers can grep for `"use client"` in route files = instant rejection.
- **D5.** ESLint flat config bans hex colour literals via `no-restricted-syntax` regex `^#[0-9a-fA-F]{3,8}$`. Backstop for TOKEN_RECONCILIATION enforcement.
- **D6.** `.gitignore` excludes `editorial-seed/` is COMMENTED OUT — by default we DO want Ben's editorial content in version control (so it's reviewable in PRs and seeded reproducibly). Ben can uncomment if he prefers it kept out.

### What surprised me

- Nothing significant on Boot Steps 1-2. Tokens derivation from TOKEN_RECONCILIATION.md was clean — the reconciliation doc made this near-mechanical translation.
- Tailwind v4 uses `@import 'tailwindcss'` (not `@tailwind` directives like v3). Configured cleanly via `@tailwindcss/postcss`.

### Deferred to KNOWN_ISSUES.md

- Boot Steps 3-12 (db client, middleware, observability, auth, root providers, UI primitives, layout chrome, route groups, error boundaries, action client, queries, format, i18n, sanitize) — all pending; will land in Session 2+.
- Foundation slice F (landing page, home page, AuthModal, Stack Picker, Cmd-K, /api/health, sitemap, robots, OG image, e2e tests) — pending; will land in Session 3-4.
- `supabase/` folder for Edge Functions exists in skeleton but no functions written yet (Session 4+).
- `.github/workflows/ci.yml` not yet written (Session 2 — should land before first commit so CI gates work).
- `husky` + `commitlint` setup deferred to Session 2.
- `db:migrate` script (`scripts/dev/migrate.ts`) not yet written; package.json references it.

### Next session

Resume with **Boot Step 3** — `db/schema.ts` (Drizzle schema mirror of canonical SQL) + `db/relations.ts` + `db/enums.ts` + `lib/server/db.ts` (pooled client) + `lib/server/db-direct.ts` (migrations only) + `lib/server/db-service.ts` (service-role).

Per the per-slice ritual, before the next session:
1. Boot Steps 1-2 quality gates have NOT been validated (no `pnpm install` run yet — would require Cowork sandbox to install ~80 deps, slow + may hit network limits).
2. Recommend Ben runs `pnpm install && pnpm typecheck && pnpm build` locally to verify before Session 2 lands new code on top.

---

## Session 2 — Boot Steps 3-4 (Drizzle clients + middleware/rate-limit)

### Validated Session 1 (first action this session)

- `pnpm install` → green (1m07s; warnings: React 19 vs Next 15.0.3 peer range — non-blocking; `engines.node` wanted 22, host is Node 18 — pnpm proceeded).
- `pnpm typecheck` → green.
- `pnpm lint` → **red on first run**. Fixed in this session (see decisions D7-D9 below).
- `pnpm build` → green after lint fix.

### Built

- **Boot Step 3a** — `db/enums.ts`: all 19 pgEnums from canonical schema §2 (resource_type, publish_status, license_kind, compat_status, subscription_tier, deal_tier, deal_status, claim_status, news_kind, news_source_kind, guide_kind, difficulty, alert_kind, alert_status, install_method, ai_client, alternative_kind, review_outcome, notification_channel). Order of values preserved.
- **Boot Step 3b** — `db/schema.ts`: hand-mirrored 61 tables from `db/migrations/0001_initial.sql` (1502 lines TS for 1831 lines SQL). Custom Postgres types declared once (`citext`, `tsvector`, `vector(1536)`). Generated columns (`search_vector tsvector generated always as ... stored`) declared as plain columns with the generation expression living DB-side only — documented inline. Self-references (`userStacks.forkedFromId`, `resources.forkedFromId`, `comments.parentCommentId`) and forward refs use `(): AnyPgColumn =>` lazy callbacks.
- **Boot Step 3c** — `db/relations.ts`: **STUB / DEFERRED to Session 3**. Subagent attempt timed out mid-run (stream idle 6+ min, 0 lines written). Stub exports `{}` and the file carries a full implementation brief for the next session. None of Session 3-4's planned work (auth, root providers, UI primitives) consumes `db.query.X.findFirst({ with: ... })`, so no slice is blocked.
- **Boot Step 3d** — Operational tables (carve-out per Q1.1 + Phase B Flag 1, verified ABSENT from canonical schema §3.3 grep):
  - `db/migrations/0002_rate_limit_buckets.sql` — composite PK on `(bucket_key, bucket_at)`, recent index, RLS enabled with no policies (service-role only).
  - `db/migrations/0003_ingestion_runs.sql` — uuid PK, source/priority/recent indexes, RLS enabled.
  - `db/operational/rate_limit_buckets.ts` + `db/operational/ingestion_runs.ts` — Drizzle mirrors.
- **Boot Step 3e** — Database clients (all `server-only`):
  - `lib/server/db.ts` — pooled `postgres-js` client (max 10, `prepare: false` for Supabase pgbouncer transaction mode), HMR singleton via `globalThis.__vch_postgres__`, Drizzle wrap with combined schema (`tables + relations + operational`).
  - `lib/server/db-direct.ts` — single-connection (max 1) direct client for migrations / advisory locks.
  - `lib/server/db-service.ts` — Supabase JS service-role client (cached singleton, `autoRefreshToken: false`, `persistSession: false`) for RLS-bypassing admin / storage / system jobs.
- **Boot Step 4** — Middleware + rate-limit + helpers:
  - `lib/http/ip.ts` — safe IP extraction (x-forwarded-for first, then x-real-ip, cf-connecting-ip; loopback filter; never throws).
  - `lib/http/request-id.ts` — `AsyncLocalStorage`-based request-ID propagation. `REQUEST_ID_HEADER` constant, `generateRequestId()`, `withRequestId()`, `getRequestId()`.
  - `lib/server/ratelimit.ts` — sliding-window limiter against `rate_limit_buckets`. Single round-trip per check (CTE upsert + window SUM). Throws on invalid options; otherwise returns `{ allowed, used, remaining, resetAtSec }`. Documented as Node-only (NOT for middleware.ts).
  - `middleware.ts` (root) — Edge-runtime: generates request ID, captures client IP into `x-vch-client-ip` header, flags admin paths with `x-vch-admin-path`, forwards headers to downstream Server Components. Matcher excludes `_next/static`, `_next/image`, favicons, OG image route, robots/sitemap, `/api/health`. **NO DB calls from middleware** — the auth-session-refresh + rate-limit-DB-check originally specified in the Session 2 prompt are deferred to Boot Step 6 (auth) and to action-middleware respectively, because postgres-js is Node-only and Next 15.0.3's `runtime = 'nodejs'` middleware is still experimental.

### Decisions made

- **D7.** Removed unused `import nextPlugin from 'eslint-config-next'` from `eslint.config.mjs`. Its `@rushstack/eslint-patch` side-effect breaks on ESLint 9 flat config ("Failed to patch ESLint because the calling module was not recognized"). The import wasn't actually used in the config array — only its side-effect was firing. Trade-off: lose Next's recommended rules. Build now emits a one-line warning ("The Next.js plugin was not detected in your ESLint configuration"). Re-add via `@eslint/eslintrc` `FlatCompat` in a later session if Next-specific rules are wanted.
- **D8.** Added `globals` dev dep and wired `languageOptions.globals = { ...browser, ...node, ...es2022, React, JSX }` so `process` / `console` / etc. are recognised. Without this, every Node-side file errored on `'process' is not defined`.
- **D9.** Exempted `lib/tokens.ts` and `tailwind.config.ts` from the `no-restricted-syntax` hex-literal rule. Those files ARE the source of truth for hex values per `TOKEN_RECONCILIATION.md`; the rule applies to consumers, not definers.
- **D10.** Skipped relations.ts via stub when the subagent timed out. The schema mirror is the load-bearing artifact; relations are an ergonomic layer on top. Better to land Step 3 cleanly and defer than to half-write a 600-line relations file in the dying minutes of a session.
- **D11.** Middleware is Edge-only and does NOT touch the DB. Rate-limit check happens in action-middleware (Boot Step 12) and in route handlers (per-slice). Auth session refresh happens in Boot Step 6 (Supabase SSR is Edge-safe, postgres-js is not). The Session 2 prompt's "middleware does rate-limit + auth refresh" framing was at odds with Next 15.0.3 Edge constraints — refactored to "middleware flags + headers; Node-side enforces."
- **D12.** Included `ingestion_runs` operational table now (not just `rate_limit_buckets`). MIGRATION_ORDER §3.3 says verify-then-add for both. Verified absent from canonical schema, added under same carve-out. Drizzle mirror lives in `db/operational/ingestion_runs.ts` next to its sibling.

### What surprised me

- ESLint flat config + `eslint-config-next` v15.0.3 incompatibility was nastier than the Session 1 handoff anticipated — wasn't just a "tweak the syntax" fix; the legacy patch import had to come out entirely.
- The subagent crash on relations.ts at 6+ minutes with 0 lines written. Streaming output to a tool subagent is fragile for very large outputs. For future schema-scale work, splitting into smaller per-batch subagent calls would be safer than one big one.
- Project lives in `~/Library/Application Support/Claude/local-agent-mode-sessions/<uuid>/.../outputs/vibecoderhub-web` (a Claude Desktop agent-mode sandbox). Working dir has spaces and is buried 9 levels deep; needs heavy quoting. Worth Ben moving to a normal project location (e.g. `~/Documents/Scripts & Tasks/VibeCoderHub`) before Session 3.

### Deferred to KNOWN_ISSUES.md

- `db/relations.ts` — full implementation. Subagent crashed; stub written with implementation brief.
- Next ESLint plugin re-add via FlatCompat — non-blocking warning today.
- Local Node version mismatch — running on 18.20.0; `.nvmrc` says 22. Project works on 18 but won't long-term.
- Boot Step 5 (Sentry + Pino) — needs Sentry DSN. Will land Session 3.

### Next session

Resume with:
1. Re-attempt Boot Step 3c (`db/relations.ts`) — write directly (not via subagent), in batches if needed.
2. Boot Step 5 (Sentry + Pino) — needs Sentry DSN.
3. Boot Step 6 (auth) — needs Supabase project URL + keys (Ben to provide).
4. Boot Step 7 (root providers) — needs PostHog key.

The 4 quality gates are green at end-of-Session-2. Local repo is clean and ready for Session 3.

---

## Session 3 — relations.ts + Boot Steps 6-7 (auth + root providers)

### Baseline check

Project lives at `~/Documents/VibeCoderHub/vibecoderhub-web` now (moved out of the Claude Desktop sandbox per Session 2 flag). First commit on `main` (`df7289a`). All four gates were green at start of Session 3 per Ben's report — re-running them was skipped to save time; Session 2's BUILD_LOG entry covers them.

### Built

- **`db/relations.ts`** — populated in full (~520 lines, 51 `relations(...)` blocks). Every FK from `db/schema.ts` mirrored into a matching `one()/many()` pair. Disambiguation via `relationName`:
  - `resourceAuthor` / `resourceReviewer` (resources → profiles, two FKs)
  - `guideVerifier` / `guideAuthor` (guides → profiles)
  - `submissionAuthor` / `submissionReviewer` (submissions → profiles)
  - `depParent` / `depChild` (resourceDependencies)
  - `altBase` / `altAlt` (resourceAlternatives)
  - `pluginsMarketplace`, `commandSubagent`, `startersRules`, `backendKitsRules` (resources self-or-cross refs)
  - Self-refs: `userStackFork`, `resourceFork`, `commentThread`
  - 23 type-extension tables (components, mcps, models, …) each get a `resource: one(resources, ...)` plus matching `resources.{type}: one({type})` on the parent.
- **Boot Step 6 — Auth (Supabase SSR):**
  - `lib/auth/server.ts` — `getSupabaseServerClient()` per-request (reads `cookies()` from `next/headers`), `auth()` returns `{user} | null`, `requireUser()` throws on signed-out.
  - `lib/auth/client.ts` — singleton browser client, `useSession()` hook subscribes to auth state changes, `signOut(redirectTo)` helper.
  - `lib/auth/middleware.ts` — `refreshSession(req, res)` rotates Supabase cookies on Edge. Skips network round-trip when env points at `your-project-ref` placeholder or anon key ends with `dummy` / equals `eyJ...` (local-dev no-services mode).
  - `lib/auth/is-admin.ts` — checks `user.user_metadata.provider_id` against `env.ADMIN_GITHUB_USER_IDS`.
  - `lib/auth/return-to.ts` — `sanitiseReturnTo()` only accepts same-origin absolute paths; rejects protocol-relative, backslash variants, schemes, and >2048 chars. `signInUrl(currentPath)` builds the OAuth-with-return-to URL.
  - `app/auth/callback/route.ts` — OAuth code exchange, sanitises `next` param, redirects with explicit error flags on failure.
  - **Modified `middleware.ts`** — now async; calls `refreshSession()` before the response is returned so the Supabase cookies ride along with the Set-Cookie header.
- **Boot Step 7 — Root providers + cookie banner + root layout:**
  - `components/theme/ThemeProvider.tsx` — cookie-backed (`vch_theme`). Phase 1 dark-only; API supports `light | dark | system` so architecture is light-ready.
  - `components/theme/ReducedMotionProvider.tsx` — reads `prefers-reduced-motion` MQ; complements the global CSS suppression in globals.css for JS-driven motion.
  - `components/stack-context/StackProvider.tsx` — cookie-backed (`vch_stack`); `setStack` JSON-encodes into the cookie; `clearStack` resets. Per Q2.3.
  - `components/analytics/PostHogProvider.tsx` — opt-in via `vch_consent === 'true'` cookie. Refuses to init on dummy / placeholder keys. `history_change` capture so App Router navs auto-track.
  - `components/layout/cookie-banner/CookieBanner.tsx` — accept / reject; writes `vch_consent`; accept does a hard reload so PostHogProvider's effect re-runs.
  - `app/providers.tsx` — client-side composition: `ReducedMotion > Theme > Stack > PostHog > {children + Toaster + CookieBanner}`.
  - `app/layout.tsx` — Server Component. Reads `vch_theme` + `vch_stack` cookies and threads initial state into Providers. Wires three Next/font Google fonts (Bebas Neue → `--font-display`, DM Sans → `--font-sans`, Space Mono → `--font-mono`) which globals.css consumes. Sets `<html class="... dark">` so SSR + first paint are dark; `suppressHydrationWarning` for the cookie-driven className flicker.

### Decisions made

- **D13.** Removed unused `eslint-config-next` import side-effect path is now well-tested — added it to the locked decisions table. (No new fix; this is a recap from D7 since the pattern carried forward to Session 3 without issue.)
- **D14.** Disabled core ESLint `no-unused-vars` (rule "off") and rely solely on `@typescript-eslint/no-unused-vars`. The core rule fires on interface method-signature parameter names (`setX: (next: T) => void`), which are documentation, not bindings. TS variant handles these correctly.
- **D15.** Filled in `.env.local` dummies for the four empty required values (`R2_ACCOUNT_ID/ACCESS_KEY_ID/SECRET_ACCESS_KEY`, `RESEND_WEBHOOK_SECRET`) and replaced the `<ref>` / `<pwd>` placeholder `DATABASE_URL_*` strings with `postgresql://postgres:postgres@localhost:54322/postgres` so Zod url() parsing passes. Session 1 had left these empty / placeholder-but-not-URL; the build only surfaced the issue once `app/auth/callback/route.ts` imported the auth chain (which transitively imports `lib/env.ts`). Lib/env evaluation at build time is now a known constraint.
- **D16.** Middleware `refreshSession()` short-circuits if the Supabase URL contains the documented placeholder (`your-project-ref`) or the anon key looks like a placeholder (`eyJ...` / `*dummy`). Without this, dev runtime would attempt a network call to a non-existent host on every request. Real keys land later, this defensive branch becomes dead code at that point — no removal needed.
- **D17.** `app/providers.tsx` is a Client Component wrapping all four providers + `Toaster` + `CookieBanner`. `app/layout.tsx` (Server Component) reads cookies and hands `initialTheme` / `initialStack` down. Pattern: server reads request-scoped state, client owns reactivity. Keeps the layout from needing `'use client'`.
- **D18.** Stopped at Step 7 instead of starting Step 8. UI primitives are 17 components and need design-system context (sizing/variant tokens) that's not yet anchored to a real consumer. Session 4 should do Steps 8-10 fresh — primitives + icons + layout chrome (Header/Footer/MobileNav) — because they all interact and reviewing the whole batch at once catches inconsistencies earlier.

### What surprised me

- Auth chain build-time evaluation: as soon as `app/auth/callback/route.ts` imported `lib/auth/server.ts → lib/env.ts`, Next executed lib/env's Zod parse during `next build`'s "Collecting page data" step. Empty / placeholder env values that "worked" in Session 2 (no app/* file imported env) became hard build failures. Lesson: any file that imports `@/lib/env` widens the build-time validation requirement to every dev with an .env.local. Worth documenting in the env.example dummy-mode comment.
- Middleware bundle grew from 30.5 kB → 80.7 kB after adding `@supabase/ssr`. Edge bundle is now non-trivial but still under the 1 MB Edge limit. Worth watching as Sentry (Step 5) lands.
- The `relations.ts` write was clean and direct (no subagent) — Session 2's retry instinct ("use a subagent for big files") was wrong for this kind of work. Mechanical FK mirroring is fine to write inline as long as the file is structured into sections.

### Deferred to KNOWN_ISSUES.md

- Boot Step 5 (Sentry + Pino) — still needs Sentry DSN. Will land Session 4 once DSN provided.
- Boot Step 8 (UI primitives) — deferred to Session 4. Need 17 components, all token-aware.
- Boot Step 9 (icons) — Session 4 alongside primitives.
- Boot Step 10 (layout chrome) — Session 4 stretch.
- `husky` `.git can't be found` warning at install (pre Session 3 commit) — went away after `git init` per user.

### Next session

Resume with:
1. Boot Step 5 (Sentry + Pino) — `lib/logger.ts`, `sentry.{client,server,edge}.config.ts`, `instrumentation.ts`. Needs Sentry DSN.
2. Boot Step 8 (UI primitives) — button, input, label, badge, pill, card, skeleton, dialog, drawer, tooltip, popover, dropdown, tabs (hash-based per Phase B B2), toast (already partly via Sonner Toaster), icon-button, avatar.
3. Boot Step 9 (icons) — Lucide wrapper + provider/client logos.
4. If context permits: Boot Step 10 (header / footer / mobile-nav / stack-banner / skip-link / breadcrumb).

Gates green at end of Session 3. No mid-step deferrals.

---

## (Future sessions append below)

---

## Session 6 — Design polish (Tailwind v4 @theme + accent palette + tinted cards)

**Date:** 2026-05-11. **Branch:** `main`. **Commit:** _pending at session end._

### The root-cause find

Session 5 shipped a page that was structurally correct but visually monochrome — no mint, no ultraviolet, no tile accents. Looked nothing like Promptkit despite the tokens being declared in `lib/tokens.ts` and `tailwind.config.ts`. **The cause was two unrelated CSS cascade bugs that compounded:**

1. **Tailwind v4 doesn't auto-read `tailwind.config.ts`.** v4 expects tokens declared inline in CSS via a `@theme` block, or an explicit `@config` directive. The JS config file we shipped in Session 1 was silently inert — Tailwind generated only its default palette, so `bg-mint`/`text-mint`/`max-w-xl` all collapsed to either the closest default (`max-w-xl` rendered as 320px, not 1280px) or were never generated at all (`.bg-mint` was missing from the stylesheet entirely for resource-type-tinted utilities).
2. **Unlayered base CSS beat layered utilities.** Even after `@theme` was added and `.bg-mint` started being emitted into `@layer utilities`, our `button { background: transparent }` reset rule (declared at the top level, outside any layer) still won. v4 utilities sit inside `@layer utilities` which is **weaker than unlayered CSS** in the cascade order. Result: utilities applied to every element EXCEPT the ones a base rule had touched first.

The fix is two CSS edits, ~120 lines combined:

- Added a Tailwind v4 `@theme { ... }` block in `globals.css` declaring `--color-*`, `--font-*`, `--radius-*`, `--height-*`, `--width-*`, `--container-*`, `--z-*`, `--transition-*`, `--shadow-*`. v4 generates `bg-mint`/`text-mint`/`rounded-tile`/`h-btn-md`/`max-w-xl`/etc. directly from these names. Values match `lib/tokens.ts` / `TOKEN_RECONCILIATION.md` verbatim.
- Wrapped the reset + base rules (`*`, `html, body`, `button`, `input`, `a`) inside `@layer base { … }`. Now utilities (in `@layer utilities`) win the cascade.

**Net effect:** every page that already had the right structure suddenly rendered with the full Promptkit palette. The hero kicker became mint. The "a vibe coder needs." span became mint. The 5 stats turned into 38px Bebas Neue mint figures. The 3-pillar cards filled with their mint/ultraviolet/yellow tile colors. The Pro CTA picked up its ultraviolet border. The header nav's active-state mint underline came back. Buttons rendered as mint pills with black text. Containers stretched to 1280px instead of 320px so the pillar grid no longer overlapped.

The user's 8-point critique list reduces almost entirely to those two CSS edits. Problems 1 / 4 / 5 / 6 / 7 were all symptoms of the same root cause; problems 2 / 3 disappeared once `max-w-xl` and `grid-cols-3` started rendering at the right width.

### Additional polish that landed

- **`/models` editor's pick variant.** `ModelCard` now accepts `tone` (`'dark' | 'mint' | 'uv'`) + `ribbon` (e.g. `★ EDITOR'S PICK`). Tone drives a tokenized treatment of bg / kicker / headline hover / divider / stat / price color / drop chevron / tag-badge tone. `ModelsList` passes `tone="mint"` + the ribbon to position 0, `tone="uv"` to position 4, dark to the rest — matches Promptkit's prototype pattern of "one accent card per index, second accent at a rhythmic offset."
- **Container widths registered in `@theme`.** `--container-sm/md/lg/xl/xxl/prose` so `max-w-xl` = 1280px (page default), `max-w-prose` = 720px (article column), `max-w-xxl` = 1440px (landing hero + detail page chassis).
- **Heights for `h-btn-*` / `h-input-*` / `h-icon-*` registered.** Button/input/icon-button primitives were referencing these utility classes but Tailwind hadn't generated them. Now they render at the locked heights per TOKEN_RECONCILIATION §6/7/8.

### Per-slice ritual

- typecheck: green
- lint: green
- build: green — 14 routes, `/models` 6.38 kB (was 6 kB; +0.38 kB for tone variant logic), `/models/[slug]` 2.1 kB unchanged, middleware unchanged at 80.5 kB.
- preview verification — desktop (1440×900): hero / stats / pillars / categories / frontier-models / Pro CTA / footer all render Promptkit-faithful. /models grid renders mint editor's pick card position 0, UV card position 4, dark elsewhere. /models/[slug] renders mint tab underline + mint blended-cost stat + mint price headline.
- preview verification — mobile (375×812): home hero scales correctly, brutalist headline wraps cleanly, mint kicker + highlight intact, sign-up button is a clear mint pill. /models grid stacks to single column with full-width tinted cards.

### Decisions made this session

- **D29 — Tailwind v4 single source of truth is `@theme` in `globals.css`, not `tailwind.config.ts`.** The JS config file is retained for documentation but only `@theme` actually configures the runtime. To add a new token, update `lib/tokens.ts` *and* mirror into the `@theme` block. (Eventually we should generate the `@theme` block from `lib/tokens.ts` at build time. For now the duplication is small enough that hand-mirroring is fine.)
- **D30 — Base styles must live inside `@layer base`.** Codified as a rule. Future CSS edits that touch reset / base / element-level styles must be wrapped in `@layer base { ... }` or they'll silently win against the utility layer.
- **D31 — Tinted card variants on `/models` use accent rhythm, not random.** Position 0 = mint (editor's pick), position 4 = UV. Pattern is stable across pages of results. When pagination loads more, positions 6 / 10 / etc. would get accents too — but only after a UX decision: the user's eye should be drawn forward, not pulled back. Leaving `tone='dark'` for positions > 5 until we have a heuristic (price drop > 25%? new release? unsupported open weights with high install velocity?) to pick the second mint card meaningfully.
- **D32 — Mobile preview gates count as visual verification.** Both 1440 and 375 viewports verified per page before commit. Going forward, treat 375 as a first-class checkpoint, not an afterthought.

### Deferred to Session 7

- Boot Step 5 (Sentry + Pino) — still no DSN.
- Foundation slice F finishing touches (AuthModal + Stack Picker + Cmd-K + /api/health + sitemap + robots + OG).
- Tag-badge tones on tinted cards still render with low contrast in some cases — e.g. on the mint editor's pick card the "REASONING" / "TOOLS" / "VISION" / "CACHING" badges are outlined in white-on-mint which is legible but cramped. Visual review may want a dedicated "on-tile" badge tone with stronger contrast.
- Auto-generate the `@theme` block from `lib/tokens.ts` at build time so the duplication is mechanically eliminated.

### Next session

1. Sentry / Pino if DSN arrives.
2. Foundation slice F finishing touches.
3. Slice S02 — `/mcps` index + detail. Will exercise the new `tone` prop pattern on a second resource type.

Gates green at end of Session 6. No mid-step deferrals.

---

## Session 5 — Boot Step 12 + Slice S01 (Home page + /models index + /models/[slug] detail)

**Date:** 2026-05-11. **Branch:** `main`. **Commit:** _pending at session end._

### What landed

**Boot Step 12 — Landing page** (`app/page.tsx`):
- Replaced Session 4's placeholder with the real anonymous landing page. Hero (kicker + clamp(56,11vw,152) display headline, "Every primitive a vibe coder needs.", value sub + 2 CTAs), stats strip (5 figures), 3-pillar (Find / Try / Ship — mint / uv / yellow tile cards), category browse (4 columns × resource-type registry), top-4-models teaser linking to `/models`, and a Pro upgrade closer in the ultraviolet tile.
- Pure Server Component. All sizes / radii / colors flow through tokens — no hex / px literals.
- Logged-in dashboard shell deferred (no real Supabase user available yet); anonymous landing serves everyone Phase 1.

**Slice S01 — `/models` index + `/models/[slug]` detail:**

`lib/seed/models.ts` — 8 seed model records (Promptkit's MODELS array, shape mapped to the `resources ⋈ models` join). Exports `listModels()`, `getModelBySlug(slug)`, plus `sortModels` (5 sorts: intelligence / cost-low / speed / context / newest) and `filterModels` (search + open-weights toggle). Hex tints reference `colors` from `lib/tokens.ts` — no raw hex. When Supabase is wired, only the import in `app/models/page.tsx` flips; UI is unchanged.

`app/models/page.tsx` — Server Component. Hero kicker + count + `MODELS.` brutalist headline + handoff to the client list.

`app/models/_components/ModelsList.tsx` — Client Component owning search / sort / filter / pagination / bookmark state. Search is debounceless (seed is 8 rows; will move server-side once row count goes up). Sort = 5 segmented pills, Open-weights = sr-only checkbox styled as a pill. Pagination: `Load more` button, 6 per page. Bookmarks: in-memory `Set<slug>` (will persist to DB in Slice 5: bookmarks). Empty state via `EmptyState` primitive. Hydrating skeleton flag flips off after 250ms — proves the `SkeletonCard` grid renders; will become a real loading state once the DB query goes async.

`app/models/_components/ModelCard.tsx` — Client Component (needs bookmark click). Provider mark (initials in tint square), provider eyebrow, name (link), price headline + price-drop chevron, stat strip (intelligence / context / speed), tag badges, bookmark icon-button top-right (`aria-pressed`, fill flips on state).

`app/models/loading.tsx` — Route-segment loading boundary mirroring the index layout with `SkeletonCard`s. Unused with seed data but ships idiomatically for the eventual async query.

`app/models/[slug]/page.tsx` — Server Component. `generateStaticParams()` prerenders all 8 model slugs at build time. Metadata derived from the model. Layout:
- Zone 1: hero (provider mark, kicker, brutalist name display, description, tag row)
- Zone 2: stats strip (intelligence / blended cost / throughput / context — 4-up grid above the tabs)
- Zones 3-5: hash-driven Tabs (Overview / Pricing / Performance / Capabilities)
- Right rail: Try-it stack (3 buttons), Alternatives list (top-4 other models), Source provenance card.

`app/models/[slug]/_components/ModelDetailTabs.tsx` — Client Component wrapping the hash-driven Tabs primitive from Session 4. Four panels: Overview (description + arch + params + dates), Pricing (input/output/blended table + price-delta line), Performance (speed/ttft/context/intelligence dl), Capabilities (6-pill checklist with strike-through for unsupported).

### Per-slice ritual

- typecheck: green
- lint: green
- build: green — 14 routes (`/`, `/_not-found`, `/auth/callback`, `/models`, plus 8 `/models/[slug]` prerendered via SSG, plus loading boundaries). Index page 6 kB / 122 kB first-load. Detail page 2.1 kB / 118 kB. Middleware 80.5 kB.
- preview verification: `pnpm dev` on :3005. `/` landing rendered hero + stats + pillars + categories + top-4 models + Pro closer. `/models` rendered 3-col grid, sort + filter row, "Load more (2 remaining)". Verified search filter narrows to 1 article when typing "gemini". `/models/claude-opus-4-7` rendered hero + stats + 4 tabs + right rail; verified hash tab switching (`location.hash = 'pricing'` → tab `aria-selected="true"` on Pricing).
- Make-Sure walk (index): search ✓, filter (open-weights toggle) ✓, sort (5 options) ✓, pagination (Load more reveals last 2 of 8) ✓, empty state path (set search to "zzz" returns empty grid + EmptyState — verified via filter logic) ✓, loading skeleton path (hydrating flag) ✓, bookmark inline (in-memory Set, no persistence yet) ✓, keyboard reachability (all sort/filter as `<button>` + `<input type=checkbox>`) ✓.

### Decisions made this session

- **D23 — Seed module exports the same shape the DB query will.** `ModelListItem` (list-row shape) and `ModelDetail` (detail shape) both live in `lib/seed/models.ts`. When Supabase comes online, a parallel `lib/queries/models.ts` will export `listModels()` / `getModelBySlug()` with the same return types. The pages won't change. This is the explicit "swap the import" path — keep the contract sharp now to avoid a rewrite later.
- **D24 — Bookmarks are in-memory until Slice 5.** A `useState<Set<slug>>` in `ModelsList.tsx` gives the UI affordance + visual feedback today; the persistence layer (auth-gated POST to `/api/bookmarks`) lands in the dedicated Slice 5. Until then, refresh wipes them — acceptable; the alternative (localStorage) would create a sync-with-DB migration headache when auth lands.
- **D25 — `priceDeltaPct` is on the seed `ModelListItem` shape directly, not derived.** Per TOKEN_RECONCILIATION spec + the visual reference, the card needs to show "▼ 30%" on the price headline. Computing that requires a price history table (`model_price_history` exists in schema but is empty). Seeding the value as a precomputed field lets the UI render correctly; the real query will compute this with a window function over price history. Comment in seed flags the substitution.
- **D26 — Sort uses pills, not a `<select>`.** Promptkit's prototype uses pill toggles; matches the brutalist register. A native select would be more keyboard-friendly but visually generic. The pill row carries `role="radiogroup"` + `aria-checked` so screen readers get the same semantics.
- **D27 — Hash-driven tabs work end-to-end.** Confirmed via `preview_eval`: `location.hash = 'pricing'` flips `aria-selected="true"` on the Pricing tab and re-renders the panel. The render-prop API (Session 4 D17) reads cleanly in `ModelDetailTabs.tsx`. Bookmarkability + back-button intact.
- **D28 — Static prerender all 8 model detail pages.** `generateStaticParams()` returns every seed slug. Build emits 8 prerendered HTML files. Once the model count goes up + the data is dynamic, switch to ISR (`revalidate = 3600`) — same `generateStaticParams` shape, the cost stays minimal.

### Cosmetic follow-ups

- Mobile nav overlaps the cookie banner. Acceptable until cookie banner is dismissed.
- Top-models teaser cards on `/` use the same shape as `/models` `ModelCard` but without bookmark / tag rows. Could extract to a shared `ModelCardCompact` once a second consumer appears (don't generalise on first sight).
- The cookie banner is positioned above the mobile nav on mobile, which makes the bottom 5-tab strip partly obscured. Fix when persistent banner shows up.

### Deferred to Session 6

- Boot Step 5 (Sentry + Pino) — still no DSN.
- Bookmarks persistence (`/api/bookmarks`, server actions, DB writes). Lands as its own slice.
- Server-side search + filters via Drizzle once Supabase connects.
- Cmd-K command palette stub (Foundation slice F still has Cmd-K + AuthModal + StackPicker + landing's animated demo strip + sitemap + robots + OG — three of those were the intended Session 5 stretch; landed only home + S01 here).

### Next session

1. Boot Step 5 (Sentry + Pino) **only if Ben has provided a DSN.**
2. Foundation slice F finishing touches — AuthModal, Stack Picker, Cmd-K, `/api/health`, sitemap, robots, OG image.
3. Slice S02 — `/mcps` index + `/mcps/[slug]` detail. Pattern-mirror of S01 with the MCP type, exercising the registry + the same primitives.

Gates green at end of Session 5. No mid-step deferrals.

---

## Session 4 — Boot Steps 8 / 9 / 10 / 11 (UI primitives, icons, layout chrome, root wiring)

**Date:** 2026-05-11. **Branch:** `main`. **Commit:** _pending at session end._

### What landed

**Boot Step 8 — UI primitives** (`components/ui/`):
- `button.tsx` — 5 sizes × 5 variants (primary/secondary/ghost/uv/danger), `loading` prop with inline spinner, token-driven heights (`h-btn-{xs..xl}`), Promptkit mono-caps label treatment. Small sizes (xs/sm) get pill radius; md/lg/xl get feature radius per TOKEN_RECONCILIATION §6.
- `input.tsx` — 3 sizes (sm/md/lg), 2px input radius (typewriter feel), mint border on focus, `error` prop wires `aria-invalid` + red border.
- `label.tsx` — Radix Label, mono-caps text-meta styling.
- `badge.tsx` — Badge (neutral/mint/uv/white/danger) + TypeBadge (uses documented `--space-9-exception` for padding-x; tint passed in as prop so the component knows nothing about the resource-type registry).
- `card.tsx` — Card + CardHeader + CardTitle + CardMeta + CardFooter. 8 tones (dark/surface + 6 tile-accent variants for ResourceCard / NewsCard / DealCard reuse). `interactive` variant adds hover-mint border.
- `skeleton.tsx` — Skeleton + SkeletonCard. New `.skeleton` keyframe in globals.css (linear shimmer matching Promptkit's `.skeleton`).
- `empty-state.tsx` — large display glyph + title + body + action.
- `tooltip.tsx` — Radix Tooltip primitive wrappers.
- `dropdown-menu.tsx` — Radix DropdownMenu wrappers (Trigger / Content / Item / Label / Separator / Group).
- `dialog.tsx` — Radix Dialog wrappers (Overlay + Content + Header/Body/Footer + Title + Description). Tile radius, scrim @ z-overlay, content @ z-modal.
- `drawer.tsx` — Vaul wrappers — bottom-anchored mobile drawer with grab handle.
- `toast.tsx` — Sonner Toaster + re-export. 4 kinds (info/success/error/warning) mapped to Promptkit tint colors with pill shape + mono-caps text.
- `tabs.tsx` — purpose-built hash-driven Tabs (per ANSWERS B2). `window.location.hash` is the source of truth; `hashchange` listener syncs state; convertible to nested routes post-launch without API change at the component level.
- `icon-button.tsx` — 3 sizes (32/40/48 square), 3 variants (ghost/solid/primary), `aria-label` enforced as a required prop.

**Boot Step 9 — Icon system** (`components/icons/Icon.tsx`):
- 40 Lucide-style SVGs ported verbatim from Promptkit's `Icon` object (search/close/chev/arrow/bookmark/star/share/check/copy/plus/minus/filter/bell/user/home/menu/external/download/play/command/zap/brain/eye/wrench/package/lock/alert/flame/sliders/rss/github/rocket/history/link/trending/coins/layers/compare/trash/edit/refresh).
- Stroke width locked to 1.6 (Promptkit default). Size prop controls 24-viewbox SVG dimension. Each icon is a typed React component (`Icon.Search`, `Icon.Bookmark`, …). `aria-hidden` defaulted to `true` unless `aria-label` is supplied (a11y safety).

**Boot Step 10 — Layout chrome** (`components/layout/`):
- `header/Header.tsx` — sticky 60px-tall, max-xxl container, dark canvas bg. Top nav (Components/Models/MCPs/Tools/Deals/News/Guides) with active-state mint underline. Search-launcher button (⌘K keycap). Sign-in + Get-started buttons. Mobile: hamburger expands a vertical link drawer.
- `header/MegaMenu.tsx` — "All 24 types ▾" trigger; hover-opens a 4-column grid (EXTENSIONS / PROMPTS / INFRA / CONTENT) sourced from `lib/resource-types.ts`. Z-dropdown layer.
- `footer/Footer.tsx` — 5-column link grid (Browse / Discover / Money / Account / Company) + wordmark + tagline + social icons + © line. Bg `#0a0a0a` per Promptkit.
- `mobile-nav/MobileNav.tsx` — fixed bottom 5-tab bar (Home / Search / Saved / News / Account); `usePathname()` for active state.
- `stack-banner/StackBanner.tsx` — mobile-only sticky strip reading `useStack()` context; "EDIT" + dismiss buttons. Returns `null` when no stack.
- `skip-link/SkipLink.tsx` — a11y skip-to-content link, styled via the existing `.skip-link` CSS.

**Boot Step 11 — Root wiring + placeholder page:**
- `app/layout.tsx` — wires SkipLink + StackBanner + Header + `<main id="main">` + Footer + MobileNav inside Providers.
- `app/page.tsx` — minimal placeholder home so `pnpm dev` renders chrome (real Foundation slice lands Session 5).

**Supporting changes:**
- `lib/shadcn/cn.ts` — `clsx` + `tailwind-merge` helper.
- `lib/resource-types.ts` — registry for the 24 resource types + 4-column mega-menu groups. References `colors` from `lib/tokens.ts` for tints; no raw hex (passes lint).
- `app/globals.css` — appended `.mono-caps`, `.tnum`, `.hairline-{t,b}` helpers; `.skeleton` shimmer keyframe; modal/drawer/toast animation keyframes; `hide-mobile` / `hide-desktop` responsive helpers.
- `eslint.config.mjs` — added `docs/**` to global ignores (planning docs + promptkit-recon prototype reference shouldn't lint; was 10 `no-undef` errors from `window` usage in the JSX prototype).
- `.claude/launch.json` (user-level) — added `vch-dev` config so the preview tooling can drive `next dev --port 3005`.

### Per-slice ritual

- typecheck: green
- lint: green (after the `docs/**` ignore)
- build: green — `/` registers (138 B), `/auth/callback` unchanged, middleware unchanged at 80.7 kB
- preview verification: `pnpm dev` on :3005 rendered the placeholder home with header + nav + cookie banner; mobile preset (375×812) showed hamburger + bottom 5-tab nav. No console errors.

### Decisions made this session

- **D17 — Hash-based Tabs API shape.** `<Tabs items={…}>{(active) => …}</Tabs>` render-prop, not a Radix-style compound. Why: hash-driven semantics differ enough from Radix `Tabs.Root`/`Tabs.Content` (URL is source of truth, not internal state) that mimicking the shadcn surface would be misleading. Render-prop reads cleanly and converts to nested-route layouts without component-shape change. Reference for slice authors: `components/ui/tabs.tsx`.
- **D18 — TypeBadge owns `--space-9-exception`.** Padding applied via `style={{ padding: '3px var(--space-9-exception)' }}`. Single documented consumer, matches the carve-out in TOKEN_RECONCILIATION §4 verbatim. No Tailwind utility exposed (intentional — keeps the exception narrow).
- **D19 — Resource-type tint colors live in a registry that imports from `lib/tokens.ts`.** Rather than scatter `tileMint`/`tileBlue`/etc. constants in JSX or add `lib/resource-types.ts` to the lint-exempt list, the registry imports `colors` from tokens and references `colors.tileMint` etc. Single source of truth survives; no hex literals outside tokens.ts/tailwind.config.ts.
- **D20 — Mega-menu group memberships.** Per Promptkit's `chrome.jsx` (Extensions = skill/subagent/plugin/hook/command/marketplace; Prompts = prompt/spec/rule/workflow; Infra = sandbox/observability/backend/docs-llm/eval; Content = component/asset/starter/showcase/stack/script). `tool`/`model`/`mcp` keep their dedicated top-level nav slots and are excluded from the mega-menu grid (else they'd appear twice). Total in mega-menu = 21; remaining 3 reachable via top nav. Documented in `lib/resource-types.ts`.
- **D21 — Cards default to `tone="dark"` not `tone="surface"`.** Cards stack on a canvas-bg page; Promptkit's prototype uses `#131313` (canvas) for card bg with a `#2d2d2d` border, not the `#2d2d2d` surface fill. Surface tone reserved for nested or floating cards inside an already-canvas card.
- **D22 — Button "small" maps to Promptkit's existing ~33px `.btn`, NOT to a 40px `md`.** TOKEN_RECONCILIATION §6 already settled this. Re-confirmed during chrome work: header sign-in/get-started render at `sm` (32px), matching Promptkit verbatim. `md` is reserved for the landing hero CTA + detail-page primary actions (Session 5).

### Deferred to Session 5

- Boot Step 5 (Sentry + Pino) — still no DSN. Carry-over.
- Avatar primitive — Radix Avatar wrapper not built yet (lands alongside Foundation slice when auth UI needs a user-photo dropdown).
- Popover primitive — Radix Popover wrappers, separate from Tooltip + DropdownMenu. Will land when the install-button options popover needs it (slice 1, model detail).
- Pill primitive — Promptkit's `.pill` chip pattern. The look is reachable today via `Badge`/`Button` compositions; a dedicated `Pill` is only needed once Foundation hits stack-picker / filter UI.

### Cosmetic follow-ups before Session 5

Chrome rendered correctly but a Session-5-eye pass should:
1. Nav links currently sit on letter-spacing alone; visual rhythm may improve with `gap-2` instead of `gap-1`.
2. Mega-menu opens on hover only — should also open on focus + click for keyboard / touch parity.
3. `Header` wordmark is hidden on mobile (matches Promptkit). If Ben wants a small "VCH" mark at the top, swap the `hide-mobile` to render a 24px mark always.
4. `MobileNav` overlaps the cookie banner when both visible. Acceptable for a one-off banner; revisit if persistent.

### Next session

1. Boot Step 5 (Sentry + Pino) **only if Ben has provided a DSN** — otherwise skip again.
2. Foundation slice: landing page, real home (with For-Your-Stack rail), AuthModal, Stack Picker overlay, Cmd-K skeleton, `/api/health`, sitemap, robots, OG. Exercises most of the primitives built this session.

Gates green at end of Session 4. No mid-step deferrals.
