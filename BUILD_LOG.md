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
