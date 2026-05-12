# SESSION_HANDOFF.md

*Live document. Last thing produced before any session ends. First thing the next session reads.*

> **Pacing target.** End each session with ~20% context to spare. Better to ship a clean baton than to crash mid-slice with nothing usable.

---

## Current state — end of Session 19 — **TOKEN SWEEP COMPLETE · VISUAL BASELINE AUDITED CLEAN**

**Session phase:** Design-polish session. Two parallel passes:

1. **Token sweep (subagent A)** — replaced inline hex utility classes with the Session-18 named tokens across 27 files / ~37 occurrences. Pure mechanical, visually inert (colours resolve identically):
   - `text-[#cfcfcf]` → `text-text-body` (16×)
   - `bg-[#0a0a0a]` → `bg-canvas-deep` (7×)
   - `text-[#b69dff]` → `text-uv-label` (14×)
   - `grep` for any of the three patterns under `components/` and `app/` now returns zero hits.
   - Inline `style={{ ... }}` cases left alone (those need a separate pass — they're dynamic colour bindings, not static class swaps).
   - OG/icon/email-template carve-outs preserved (Edge `ImageResponse` runtime can't see Tailwind).

2. **Visual audit (subagent B)** — scanned `/`, `/models`, `/mcps`, `/pricing` against `docs/planning/promptkit-recon/src/app.css` and `docs/planning/TOKEN_RECONCILIATION.md`. **Zero deviations found.** Hero kickers, sort/filter pills, stat strips, card kickers, badges, stat labels, plan kickers, comparison-table headers — all already mono-caps. Section h2s correctly use either `font-display` (Bebas) or `font-sans font-bold text-[34px]` (the `headingXl` DM Sans token per TOKEN_RECONCILIATION §3). Cards already use `rounded-tile p-5 hover:border-mint`. Buttons already use `h-btn-*` tokens with mono-caps labels. Audit was honest — no padding the report with invented findings.

**Confirms what Session 14's six-pass review found (0 P0/P1 visual deviations) is still true with real data on every page** — sessions 15-18 didn't introduce any visual regressions, and the token additions in Session 18 codified the last few inline literals as named utilities. The Promptkit baseline is intact.

### Quality gates

`pnpm typecheck` ✓ · `pnpm lint` ✓ · `pnpm build` ✓.

### Outstanding follow-ups

- **Inline `style={{ background/color: '#…' }}` sweep.** A handful of dynamic-binding sites still pass raw hexes via `style={...}` — most are intentionally driven by per-row `tint`/`providerColor` values, but a few static cases could move to utility classes. Low priority.
- **Detail pages + `/news` + `/dashboard` + `/compare` + `/best-for` + `/guides`** weren't in the four-page audit scope. Same patterns; no reason to expect deviations, but worth a follow-up scan if time permits.
- **OAuth dashboard setup** still blocked on user (per `docs/setup/OAUTH_PROVIDERS.md`).
- **Magic-link production** still needs a verified Resend domain.
- **Screenshots** — preview tool's headless Chromium kept timing out on first compile (recurring issue from Session 18). Session 17 screenshots remain the visual reference; the token sweep was visually inert.

---

## Current state — end of Session 18 — **GOOGLE OAUTH UI + 3 LOAD-BEARING TOKENS PROMOTED**

**Session phase:** Auth-UI build-out + a token-system extension that codifies three colours that were already widely used in inline literals across the codebase. Design polish was scoped down (see "Deferred" below).

**Live inventory unchanged from Session 17:** 2,604 published resources, 168 news rows.

**Session 18 summary**

### Task 1 — design polish (partial)

The original brief was a full Promptkit pixel-by-pixel walk across every page. The spawned design-polish subagent ran into a corrupted `.next` turbopack cache, couldn't complete a live audit, and (correctly) declined to do speculative rewrites. Its static-analysis pass surfaced **three load-bearing colours used in inline literals across ~38 sites** that should have been tokens:

- `#cfcfcf` — body text on the dark canvas (sat between `text-secondary #949494` and `text-muted #e9e9e9`). 22+ sites: home, deals, models/[slug], mcps/[slug], guides, news, footer, header, MegaMenu, UpgradeModal, DetailChassis, DetailTabs, GenericResourceCard.
- `#b69dff` — Ultraviolet-tinted label (Pro chips, promo kicker). 10+ sites: DealCard, McpCard, StackPicker, UpgradeModal, CmdK, GenericResourceCard, GenericResourceIndex, McpsList, DealsList, GuideStepper.
- `#0a0a0a` — banded section bg (deeper than `canvas #131313`). 6 sites: footer, code-snippet bg, header dropdown, kbd chips.

Promoted all three to first-class tokens to close the loop:

- `lib/tokens.ts` — added `canvasDeep`, `textBody`, `uvLabel` with comments tracing the rationale.
- `tailwind.config.ts` — exposed as `bg-canvas-deep`, `text-body`, `text-uv-label`.
- `app/globals.css` — added the matching `--color-*` variables inside `@theme` so Tailwind v4 generates the utilities.

These additions are **visually inert** — every existing site that uses the literal hex still renders identically. The tokens are now available so future card/section work can reach for them by name. Refactoring the existing inline literals to the new utilities is a follow-up sweep (a `replace_all` on each hex with the matching utility is mechanical).

### Task 2 — Google OAuth alongside GitHub

- **`components/icons/Icon.tsx`** — new `Icon.Google` entry. Uses the existing `make()` helper with a single-path stylised mono "G" (circular arc opening on the right + the signature horizontal bar). The official 4-colour brand mark wasn't viable for the single-path `currentColor` pattern; mono G reads as Google at button size and stays consistent with the rest of the icon set.
- **`components/overlays/AuthModal.tsx`** —
  - Extended the `submitting` union to `null | 'google' | 'github' | 'magic'`. Both OAuth buttons + the magic form disable while any flow is in flight.
  - New `signInGoogle()` mirrors `signInGithub()` exactly — `provider: 'google'`, same `redirectTo: ${origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}` so return-to works for both.
  - Google button rendered above GitHub (more common consumer choice); both use `<Button variant="secondary" block />` with the matching brand icon at `size={14}`.
  - Subtle mono-caps "or" divider between the two OAuth buttons; the existing "OR WITH EMAIL" separator below stays unchanged.
- **`app/auth/callback/route.ts`** — already calls `ensureProfile()` after successful code exchange (Session 15). Provider-agnostic: works for both GitHub and Google. No edit needed.

### External OAuth setup (must be done in dashboards, not from code)

Wrote `docs/setup/OAUTH_PROVIDERS.md` with step-by-step instructions for both providers:

1. github.com → Settings → Developer settings → OAuth Apps → New OAuth App. Callback URL: `https://oerfmtjpwrefxuitsphl.supabase.co/auth/v1/callback`. Then Supabase Studio → Authentication → Providers → GitHub → paste Client ID/Secret.
2. console.cloud.google.com → APIs & Services → Credentials → Create OAuth Client ID (Web). Same callback URL. Then Supabase Studio → Authentication → Providers → Google → paste credentials.

End-to-end auth testing requires those dashboard steps to land first; can't be done from code alone.

### Quality gates

`pnpm typecheck` ✓ · `pnpm lint` ✓ · `pnpm build` ✓.

### Deferred

- **Pixel-by-pixel Promptkit polish across all pages.** The 6-pass review in Session 14 already verified 0 P0/P1 visual deviations on the seed-data baseline; Session 16 cleaned up real-data empty states; Session 17 added logos + icons + favicon. The remaining Promptkit-vs-current deltas (if any) need a fresh live audit on a clean dev cache. Schedule this for a focused Session 19.
- **Inline-hex → token refactor.** With `canvasDeep`/`textBody`/`uvLabel` now declared, the ~38 sites using those literals should be swept to the new utilities. Mechanical replace-all per hex.
- **End-to-end OAuth verification.** Blocked on the user completing the GitHub + Google dashboard setup per `docs/setup/OAUTH_PROVIDERS.md`.
- **OAuth UX polish.** Loading state currently disables the button via the `loading={...}` Button prop. A dedicated full-screen "Redirecting to Google…" overlay during the round-trip would feel nicer.
- **Magic link production-ready.** The `signInWithOtp` button currently calls successfully but no email sends until Resend is domain-verified + `RESEND_API_KEY` is set.

---

## Current state — end of Session 17 — **VISUAL ENRICHMENT + 8 MORE INGESTION SOURCES LIVE**

**Session phase:** Multi-step session. Started by repairing 7 broken ingestion scripts (across two follow-up rounds in Session 16's timeframe), then a full visual-enrichment pass on the rendered cards.

**Live inventory at session end** (deployed Supabase):
- pk_resources (published): **2,604 total** — mcp 1,029, model 365, component 247, rule 207, subagent 207, tool 165, plugin 146, command 110, skill 78, hook 50
- pk_news: **168 rows** (118 HN + 50 arXiv)

**Session 17 summary**

### Ingestion repairs (lead-in to visual session)

- ✓ **github-code-search** — `pushed:>YYYY-MM-DD` is not a valid qualifier on `/search/code` (only on `/search/repositories`); also `repository.stargazers_count` is not in code-search responses, so `if (stars < 5) continue` dropped 100% of hits. Removed the bogus filter; resolved stars via per-repo `/repos/{owner}/{repo}` lookup with a `Map` cache. Result: **538 inserted, 1 transient ECONNRESET fail**.
- ✓ **github-stargazer-velocity** — already worked: **231 inserted, 30 updated** (300 discovered, 261 above the 25-star floor).
- ✓ **cursor-directory** — cursor.directory is Vercel-bot-blocked (HTTP 429 even on `sitemap.xml`, regardless of UA). Switched data source to the open mirror at `github.com/Qwertic/cursorrules` — 101 `.cursorrules` directories with body + README. Pretty-name derivation strips the `-cursorrules-prompt-file` suffix. Result: **101 inserted**.
- ✓ **21st** — sitemap reorganised: components moved from `/r/{user}/{slug}` to `/community/components/{user}/{slug}`. The old regex matched 0 of 7,505 sitemap URLs. Updated regex; the `/r/{user}/{slug}` JSON registry endpoint still works for fetches. Filtered overview routes (popular/newest/featured/etc.) and de-duped (same component appears under multiple list pages). Result: **200 inserted** (capped per-run; 4,534 unique components discovered, 4,334 still pending — bump cap or run multiple passes).
- ✓ **smithery** — `SMITHERY_API_KEY` no longer required; `registry.smithery.ai/servers` is publicly readable. Auth honoured if set. **Public endpoint caps unauthenticated reads at 5 pages × 100 servers** (advertised `totalCount: 5,331` but `pagination.totalPages: 5`; pages 6+ return empty arrays). The 500 we fetch is the public ceiling — lifting requires the paid key. Result: **279 inserted, 221 updated** (overlap with the official MCP registry slugs).
- ✓ Promotions + backfills landed for all of the above (1,349 drafts → published; 334 new `pk_mcps` rows backfilled).

### Visual enrichment

- ✓ **Provider logos.** 15 monochrome 24×24 SVGs at `public/logos/providers/` — openai/anthropic/google/meta/mistral/cohere/deepseek/microsoft/nvidia/amazon/alibaba/xai/together/perplexity/inflection. New `<ProviderLogo>` component at `components/icons/ProviderLogos/ProviderLogo.tsx` with a defensive alias map (lowercase + strip non-alnum collapses "Open AI"/"open-ai"/"OPENAI"/"GPT"/"ChatGPT" → openai; "Claude" → anthropic; "Gemini"/"Google AI"/"DeepMind" → google; "Llama"/"Meta AI"/"Facebook" → meta; "Qwen"/"Alibaba Cloud" → alibaba; "Grok"/"X.ai" → xai; "Phi"/"MSFT" → microsoft; "Bedrock"/"AWS" → amazon; etc.). Falls back to a coloured initials tile when no slug match. Wired into `ModelCard` (replaces the inline initials box). Also into the home page's top-models teaser at `size={20}`.
- ✓ **Type icons on cards.** New `lib/resource-type-icons.ts` maps each `ResourceTypeId` to an existing `Icon.X` component (mcp→Package, model→Brain, skill→Zap, subagent→User, rule→Lock, plugin→Plus, hook→Bell, command→Command, starter→Rocket, workflow→Refresh, eval→Check, prompt/spec/docs_for_llms→Edit, marketplace→Coins, sandbox→Package, observability→Eye, backend/asset/stack/component→Layers, showcase→Star, tool→Wrench, script→Play). Wired into `GenericResourceCard` kicker (replaces the unicode `glyph` for the per-type symbol while keeping the rest of the kicker line). ModelCard / McpCard untouched — they have their own bespoke kickers.
- ✓ **OG meta-spam fix.** Both `/models/[slug]/opengraph-image.tsx` and `/mcps/[slug]/opengraph-image.tsx` exported `generateImageMetadata` returning the full slug list. With dynamic `[slug]` segments that emitted **one og:image meta tag per known slug on every page** (365 model pages × 365 OG slugs = 133K image generations + meta-tag spam in HTML). Removed the export; now exactly one og:image per page, keyed off its own params. Verified: 200 + 52 KB PNG render.
- ✓ **Favicon + apple touch.** `app/icon.tsx` (32×32) + `app/apple-icon.tsx` (180×180) — mint "V" on dark canvas via `ImageResponse` from canonical palette hexes. Added to the eslint hex-literal carve-out (same exception OG images use, since both render via Edge ImageResponse without our CSS cascade). Auto-discovered by Next 15; no `app/layout.tsx` edits needed.
- ✓ **Home page real-data finish.** New `getResourceCountsByType()` in `lib/db/queries/stats.ts` returns `{[typeId]: publishedCount}`. The category grid now renders the live count next to each type label (right-aligned, mono, muted) — visible on home: 256/247/207/146/110/78/50 etc. Top-models teaser cards adopted `<ProviderLogo>`, format `$0.00` → `Free`, hide null intelligence/speed/context cleanly via `[…].filter(Boolean).join(' · ')`, and fall back to "specs pending" when none of the spec fields are populated.

### Quality gates

`pnpm typecheck` ✓ · `pnpm lint` ✓ · `pnpm build` ✓.

### Outstanding follow-ups

- **21st pagination cap.** 4,334 unique components still unprocessed — bump `MAX` from 200 or run multiple passes.
- **Smithery 500-server ceiling.** Hard cap without a paid API key; the 4,800+ unindexed servers stay out of reach.
- **arXiv rate-limit cron.** Production scheduler must serialise high-volume sources or add jitter — parallel runs trip 429.
- **Model intelligence_index / TTFT / tokens-per-sec** still null for all OpenRouter rows. Need an Artificial Analysis (or similar) ingest before those fields become meaningful again. Polish handles the empty state ("specs pending", "speed —").
- **MCP names** like `ai.buyersense/buyersense` still ship as the canonical id format. A prettifier (capitalise after last slash, drop reverse-DNS prefixes) would help.

---

## Current state — end of Session 16 — **INGESTION REPAIRED + REAL-DATA POLISH SHIPPED**

**Session phase:** Ingestion script repair + visual polish on real-data pages. All pages now render real DB data without "0.0", "—", or hardcoded numbers.

**Live inventory at session end** (deployed Supabase):
- pk_resources (published): **1,255 total** — mcp 695, model 365, plugin 146, component 47, skill 2
- pk_news: **168 rows** — 118 from Hacker News, 50 from arXiv

**Session 16 summary**

### Task 1 — fix four broken ingestion scripts

- ✓ **arxiv-papers.ts** — was inserting `pk_resources` with `type_slug='news'`, which isn't a valid `resource_type` enum value (news has its own table). Rewired to `upsertNews()` (new helper, see below). `kind='ecosystem'`, `source_kind='rss_imported'`, `source_name='arXiv · <author>'`. Result: **50 inserted**.
- ✓ **hn-algolia.ts** — same enum bug. Rewired to `upsertNews()`. Added de-dup by `objectID` (different keyword queries return overlapping stories). Result: **118 inserted**.
- ✓ **awesome-claude-plugins.ts** — pointed at the wrong repo (`hesreallyhim/awesome-claude-code`, README in transition with no list). Switched to `quemsah/awesome-claude-plugins` and rewrote the parser: README is a Markdown table (`| # | [name](url) | description | stars | subs | plugins |`), not a bullet list. New regex matches table rows. Result: **90 inserted, 9 updated**.
- ✓ **buildwithclaude.ts** — was hitting a stale `plugins.json` URL on a fork. Switched to the canonical `davepoon/buildwithclaude` `.claude-plugin/marketplace.json`. New shape mapping: `name`, `description`, `version`, `author{name,url}`, `repository`, `keywords`. Result: **56 inserted, 1 updated**.
- ✓ **New helper `upsertNews()`** in `scripts/ingest/_shared/dedup.ts` — idempotent on `pk_news.slug`, handles publishedAt + topics + sourceKind. Sits beside `upsertResource()` so future news sources have a clean entry point.
- ✓ **Promotions** — bulk SQL: `update pk_resources set status='published', published_at=now() where status='draft'` → 146 plugin drafts promoted. (`pk_news` has no `status` column; news is published-on-insert.)
- ✓ **Backfilled empty `pk_plugins` rows** for the 146 new plugins so the inner-join in `listResources('plugin')` resolves.

### Task 2 — visual polish pass on real-data pages

- ✓ **Home `/` — live stats.** Hardcoded `STATS = [{n:'12,407', ...}, {n:'120+', ...}, {n:'$4.2M', ...}, {n:'218K', ...}]` replaced by live counts via new `getSiteStats()` query (`lib/db/queries/stats.ts`). Strip now reads: 1,255 RESOURCES INDEXED · 6 IDES & CLIENTS · 365 MODELS TRACKED · 695 MCPS INDEXED · — IN ACTIVE DEALS. Hero kicker also uses live count. New `formatCount()` helper handles 1K/100K thresholds.
- ✓ **`/models` cards (`ModelCard.tsx`)** — `$0.00 /MTOK BLENDED` for free models now renders **"Free · OPEN WEIGHTS · BYOH"**. `#0 intelligence` and `0 tok/s` (null source data) hide cleanly when value is 0; speed shows "speed —" instead of "0 tok/s".
- ✓ **`/models` sort fallback (`lib/db/queries/models.ts`)** — default `intelligence` sort cascades to `published_at desc` because OpenRouter doesn't supply intelligence_index yet. All sorts use `nulls last` so frontier paid models surface first under cost/speed/context filters too.
- ✓ **`/models/[slug]` detail** — INTELLIGENCE / THROUGHPUT / CONTEXT stat tiles show "—" with hint copy "not yet ranked" / "speed not measured" when null. BLENDED COST tile flips to "Free · open weights · BYOH". Released/cutoff line in the provider header is hidden when both empty (was rendering "RELEASED · CUTOFF" with no values). Pricing tab shows "Free" for $0 rows; performance tab uses "—" for null fields. Alternatives sidebar shows "Free" instead of "$0.00".
- ✓ **`/mcps` cards (`McpCard.tsx`)** — entire `Tools/Resources/Prompts` stat strip hidden when all zero (was rendering "0 tools · 0 resources · 0 prompts" on every card). Rating + installs only render when > 0; falls back to just `updatedLabel`.
- ✓ **`/mcps/[slug]` detail** — header kicker (`⌖ MCP · author · v… · license`) joins non-empty parts with `·` (was rendering "⌖ MCP · · V1.1.0 · UNKNOWN" with empty author). Author breadcrumb chip hidden when missing. Tagline + description deduplicated when one is a prefix of the other. Stats row shows "—" for zero usage. Alternatives sidebar hides "0 tools" trailing label.
- ✓ **Generic `/<plural>` cards (`GenericResourceCard.tsx`)** — same rating/installs tightening; covers all 24 generic resource types (plugins, components, skills, …).
- ✓ **`/compare`** — `app/compare/_lib/resolve.ts` was still walking the seed bundles, so live model/MCP/plugin IDs returned EmptyState. Rewrote to `async resolveCompareIds()` calling `getModelBySlug` / `getMcpBySlug` / `getResourceBySlug` from the live query layer. Tested with 3 real ids (2 models + 1 MCP) — all three resolve and render.
- ✓ **Mobile (375px)** sweep on `/models` and `/mcps` — no horizontal overflow, cards collapse to single column cleanly.

### Quality gates

`pnpm typecheck` ✓ · `pnpm lint` ✓ (one stale `desc` import removed mid-session) · `pnpm build` ✓.

### Outstanding issues / deferred

- **Smithery ingest** still skipped — needs `SMITHERY_API_KEY` env var.
- **Pagination** — index pages still capped at 200 (default `limit` in query layer). Need a "Load more" or `?page=` param to surface the rest of the 695 MCPs.
- **Intelligence index / throughput / TTFT** for OpenRouter models all null — these come from a future Artificial Analysis ingest. Polish handles the empty state; the data needs a separate source.
- **MCP names like `ai.buyersense/buyersense`** — registry returns canonical id format, not display title. Could add a prettifier (`capitalize-after-last-slash`) in the query layer for friendlier display.
- **arXiv rate-limit** — hit 429 when run in parallel with HN/awesome/buildwithclaude. Solo retry succeeded after ~15 min cooldown. Production cron should serialise high-volume sources or add jitter.

---

## Current state — end of Session 15 — **WIRED TO REAL SUPABASE (queries pending DB password)**

**Session phase:** Real-credential bring-up. Schema renamed, query layer built, every fetching page swapped from seed to live DB.

**Session 15 summary** — Connect Supabase + live data. One-shot session.

- ✓ **Drizzle schema rename** — every `pgTable('foo', ...)` in `db/schema.ts` is now `pgTable('pk_foo', ...)`. All 61 tables. JS export names (e.g. `profiles`, `resources`, `models`) stay the same — only the SQL table-name string changes, so `references(() => profiles.id)` callbacks and every page-side import are untouched.
- ✓ **Enums verified** — `db/enums.ts` keeps original enum names (`resource_type`, `news_kind`, etc.) per spec. No changes.
- ✓ **Relations verified** — `db/relations.ts` references the JS exports, not the SQL names; no changes needed.
- ✓ **Query layer at `lib/db/queries/`** — 9 modules, all server-only:
  - `_safe.ts` — `safeQuery(fn, fallback)` wrapper. DB unreachable / network blip / RLS denial → logged once at warn, fallback returned. Means pages never crash on a dead DB.
  - `models.ts` — `listModels({sort, openOnly, limit, offset})`, `getModelBySlug`, `getModelCount`, `listModelSlugs`. Re-exports `sortModels` / `filterModels` from seed.
  - `mcps.ts` — `listMcps({sort, limit, offset})`, `getMcpBySlug`, `listMcpSlugs`. Re-exports `sortMcps` / `filterMcps`.
  - `resources.ts` — `listResources(typeId, args)`, `getResourceBySlug`, `listResourceSlugs`. Generic; consumed by all 24 type pages via the shared `_configs` bundle.
  - `deals.ts` — `listDeals({tier, category, sort, limit})`.
  - `news.ts` — `listNews({kind, ...})`, `getNewsBySlug`, `listNewsSlugs`. Maps the seed-side kind labels (`breaking|releases|...|price`) to the DB enum (`ecosystem|release|price_change|tutorial|op_ed`); `is_breaking=true` rows project back to `breaking`.
  - `guides.ts` — `listGuides`, `getGuideBySlug` (joins steps), `listGuideSlugs`.
  - `best-for.ts` — `listUseCases`, `getBestForBySlug` (joins ranked picks via `pk_best_for`), `listUseCaseSlugs`.
  - `search.ts` — `searchResources(q, type?, limit)` using `websearch_to_tsquery` + `ts_rank` against the `search_vector` column.
  - `profiles.ts` — `ensureProfile({id, githubHandle, email, displayName, avatarUrl})`. Idempotent upsert via `onConflictDoNothing`. Username derived from githubHandle / email-local-part / `user_<id8>` fallback.
- ✓ **Pages swapped from seed → live queries** (~60 file edits, delegated to subagent):
  - `app/page.tsx` (landing teaser), `app/sitemap.ts` (now async; sources slugs from query layer for every type)
  - `app/models/page.tsx`, `[slug]/page.tsx`, `[slug]/opengraph-image.tsx`
  - `app/mcps/page.tsx`, `[slug]/page.tsx`, `[slug]/opengraph-image.tsx`
  - `app/deals/page.tsx`, `app/news/page.tsx`, `[slug]/page.tsx`, `feed.rss/route.ts`, `feed/[kind]/route.ts`
  - `app/guides/page.tsx`, `[slug]/page.tsx`, `app/best-for/page.tsx`, `[slug]/page.tsx`
  - All 24 generic resource type pages (`app/<plural>/page.tsx` + `[slug]/page.tsx`)
  - Type defs and helpers stay in `lib/seed/*` — Client Components (`_components/*`) still import types from there, so seed remains the canonical type source + a fallback library if we want to flip back.
- ✓ **Auth profile creation** — `app/auth/callback/route.ts` now calls `ensureProfile()` after successful code exchange, deriving fields from `session.user.user_metadata` (GitHub OAuth: `user_name`, `full_name`, `avatar_url`).
- ✓ **OG images moved off Edge runtime** (model + MCP). Once they import the query layer (which transitively imports `postgres`, Node-only), they can't run on Edge. They render on Node now — slower per-request, still functional. Alternative if Edge OG matters: add a slug-only edge-safe query path.
- ✓ **`.env.local` gap-fill** — added `DATABASE_URL_POOLED` (env.ts requires this name; the user's prompt used `DATABASE_URL`), plus 5 missing required keys (`NEXT_PUBLIC_SITE_URL`, `STRIPE_PRICE_ID_PRO_YEARLY`, `REPLICATE_API_TOKEN`, `GITHUB_INGESTION_TOKEN`, `POSTHOG_API_KEY`) as `_dummy` so build env validation passes. Real Supabase project URL / anon key / service-role key are populated. **DB password is still the placeholder `YOUR_DB_PASSWORD_HERE`** — every live query currently hits `safeQuery`, logs once, and returns empty.

**Quality gates at end of Session 15:** typecheck ✓, lint ✓, build ✓ (~81 routes; previously-SSG type detail pages now `ƒ Dynamic` because they await DB).

**Visible-in-browser effect right now (placeholder password):**
- Every type-page index renders the hero + its EmptyState (the page no longer crashes; the query just returned `[]`).
- `/best-for/<slug>` for the seeded use cases will show empty pick lists until the DB password lands AND `pk_best_for` rows exist.
- Auth modal still opens for GitHub OAuth, but the round-trip will fail at code-exchange against the real Supabase project until DB / RLS is reachable.

**Deferred from this session — explicit and intentional:**
- **Bookmarks DB swap.** The cookie-backed `BookmarksProvider` still owns reads + writes. Wiring to `pk_bookmarks` requires a structural shift to Server Actions + a server-fed initial state — not a one-line swap. Plan: do this once auth round-trip is verified, since DB bookmarks need a real `userId`.
- **Cmd-K live search.** Still uses `buildIndex()` over seed entries. Swap target: `searchResources()` (already built in `lib/db/queries/search.ts`). The existing client component needs a debounced fetch instead of in-memory filter — pattern change, not a one-line swap.

## Next session pickup (Session 16)

**Required from Ben before Session 16 can verify anything end-to-end:**
1. Set the real DB password in `.env.local` — replace both `YOUR_DB_PASSWORD_HERE` instances. Get from Supabase → Settings → Database → "Connection string" reveal.
2. Confirm `pk_use_cases` is the only seeded table (12 rows) so we know what "expected empty" looks like for everything else.

**Once password lands, the order of operations:**
1. `tsx -e "import('./lib/server/db').then(({db}) => import('./db/schema').then(({useCases: pk_use_cases}) => db.select().from(pk_use_cases).limit(5).then(console.log)))"` — confirm DB reachable, prints 12 use cases.
2. `pnpm ingest:openrouter` — populate `pk_resources` (type=model) + `pk_models` + `pk_model_providers` + `pk_model_price_history`. Verify in Supabase Table Editor.
3. `pnpm dev` and load `/models` — should show real OpenRouter models, no longer EmptyState.
4. Auth round-trip: sign in with GitHub → check `pk_profiles` for the new row.
5. Wire bookmarks to DB (swap `BookmarksProvider` to Server Actions + server-fed initial items; keep cookie path for anonymous users).
6. Wire Cmd-K to `searchResources()` (debounced fetch, replace `buildIndex()`).
7. Run remaining ingestion scripts as their source data is needed.

---

## Current state — end of Session 14 — **PHASE D COMPLETE · READY FOR LAUNCH REVIEW**

**Session phase:** Phase D done. The Cowork build loop ends here. Next step is real-credential provisioning + a launch checklist run, not more Phase-C feature work.

**Session 14 summary** — six-pass formal self-review.

- ✓ **Pass 1 Visual Consistency** — sampled 8+ pages at 1440. Token system holds: 3 canonical button heights (32/36/48), card padding consistent (`p-5` / `rounded-tile` on resource cards; `p-8` on pillar+pricing tiles), Bebas/DM Sans/Space Mono pairing verified via `getComputedStyle`, mint/UV accent discipline intact, single Icon set, shared Skeleton + EmptyState primitives. **0 P0, 0 P1.**
- ✓ **Pass 2 Functional Completeness** — newsletter signup (valid+invalid), firehose JSON+SSE, health endpoint, /models search (6→2 on "claude"), 4 sort buttons, bookmark toggle, Cmd-K via click AND keyboard shortcut (`window.dispatchEvent` confirmed open), Esc closes, ArrowDown navigates 40 results. Auth-gated routes redirect to `/?signin=1`. **0 P0, 0 P1.**
- ✓ **Pass 3 Edge Cases** — invalid slugs render `not-found.tsx` UI (P1 caveat: dev returns 200 not 404; verify in prod build before launch), invalid sort param falls back, /compare with no/bad ids → EmptyState, /unsubscribe/short → "Already gone", /api/firehose?since=garbage → returns full feed, newsletter invalid/empty → 400, Cmd-K no-results state, Stack-Picker Save-disabled until selection. **0 P0, 1 P1 (manual prod-build status-code verification).**
- ✓ **Pass 4 A11y + Perf** — single h1 per page, skip-link present, all form inputs labelled (explicit or implicit-wrap), focus rings visible, prefers-reduced-motion respected, body contrast ~16:1, bundles within budget (≤126 KB First-Load, well under 200 KB). **Lighthouse not run this session — owed before launch.** **0 P0, 1 P1 (Lighthouse audit).**
- ✓ **Pass 5 User Journeys** — 4 personas (anon, returning, mobile, keyboard) walked end-to-end. All journeys complete. **0 P0, 0 P1, 2 P2** (mobile compare swipe affordance; bookmark below 2xl needs toast confirmation).
- ✓ **Pass 6 Screenshot Review** — 10+ pages captured at 1440 + 375. Visual fidelity to Promptkit reference confirmed; no structural deviations (Session 6 `@theme` fix already unblocked the entire palette).
- ✓ **OUTSIDE_EYE_CRITIQUE.md** — three top-priority fixes for a senior Linear/Vercel engineer to action first: (1) wire one real Drizzle query end-to-end against a populated dev Supabase project, (2) move firehose + ratelimit off in-process Map, (3) land Sentry + Pino (needs DSN).

**Phase D findings files (`docs/phase-d/`):**
- `PASS_1_FINDINGS.md` through `PASS_6_FINDINGS.md`
- `OUTSIDE_EYE_CRITIQUE.md`

**Quality gates at end of Session 14:** typecheck ✓, lint ✓, build ✓. **170 routes total** (up from 165 — `pnpm build` line-count includes SSG path enumeration which slightly differs from app-route count).

**P0/P1 totals across all six passes:**
- P0 found: **0**
- P1 found: **2** — both are manual smoke tests owed pre-launch, not code fixes (prod-build 404 status verification, Lighthouse run).
- P2 deferred: **3** (compare mobile affordance, bookmark below 2xl chip, secondary-text contrast spot-check)
- P3 deferred: **multiple** — see KNOWN_ISSUES "Phase 2 carry-over" section.

**Next step (not a Cowork session): launch readiness checklist run by Ben.**
1. Provision real credentials (Supabase prod, Sentry DSN, PostHog, Resend domain, Stripe test).
2. Wire one real query (start with `listModels()` → Drizzle).
3. Run Lighthouse audit on `/`, `/models`, `/models/[slug]`, `/pricing` — desktop + mobile.
4. `pnpm start` (production build) — verify `/models/nonexistent-slug` returns HTTP 404.
5. Land Sentry + Pino once DSN provided.
6. Move firehose + rate-limit off in-process Map to KV or Postgres-backed.
7. Public launch.

---

## Current state — end of Session 13 — READY FOR PHASE D

**Session phase:** Phase C closeout complete. Phase D (Six-Pass Self-Review) begins Session 14.

**Session 13 summary** — Visual polish pass + pre-Phase-D readiness check. No new features.

- ✓ **20-route curl spot-check** — all returned 200 (including new Session-12 routes `/privacy`, `/terms`, `/unsubscribe/[token]`, `/api/firehose`).
- ✓ **1440px walk** — `/`, `/models`, `/models/claude-opus-4-7`, `/mcps`, `/pricing`, `/compare?ids=…`, `/deals`, `/best-for/saas-weekend`, `/privacy` visually verified. Mint pick at 0, UV pick at 4 (or vice versa per type) rhythm intact. Tabs, right-rail, filter pills, ranked numbered lists all aligned.
- ✓ **375px walk** — `/`, `/models`, `/pricing`, `/deals`, `/compare`, `/privacy` checked. No horizontal-overflow regressions. Compare table scrolls horizontally inside its container (`minWidth: 720` on the table, `overflow-x-auto` on wrapper) — working as designed.
- ✓ **Visual fix landed: header overflow at 1440px.** Before: wordmark wrapped to 99px, "Get started" clipped past viewport at right:1470. After: header content fits within 1440 (last button right:1408). Changes in `components/layout/header/Header.tsx` + `components/layout/header/BookmarkChip.tsx`:
  - Container `gap-4 px-4 md:px-8` → `gap-3 px-4 md:px-6`
  - Wordmark `text-[22px]` → `text-[20px]` + `whitespace-nowrap` + `shrink-0`
  - Nav `gap-1 ml-4 px-3` → `gap-0.5 ml-2 px-2.5` + `whitespace-nowrap`
  - Search trigger `min-w-[200px]` → `min-w-[160px]` + `shrink-0`
  - Stack chip `max-w-[160px]` → `max-w-[120px]` + `shrink-0`
  - BookmarkChip: `hide-mobile inline-flex` → `hide-mobile hidden 2xl:inline-flex shrink-0`. Below 1536px the chip is hidden — bookmarks still reachable via `/dashboard/bookmarks` directly.
- ✓ **KNOWN_ISSUES rationalised.** Closed out Track 4 (Session 12 carry-over). Added a definitive "Phase 2 carry-over" section listing every deliberate deferral — these are NOT to be touched before public launch unless customer-blocking.

**Quality gates at end of Session 13:** typecheck ✓, lint ✓, build ✓. Route count unchanged (~165). Middleware unchanged at 80.8 kB.

**Phase D readiness checklist:**
- [x] All gates green
- [x] Every spot-checked route returns 200
- [x] Visual consistency verified at 1440 + 375
- [x] No console errors during the walk
- [x] KNOWN_ISSUES is the definitive deferred list
- [x] SESSION_HANDOFF updated

**Next session (14) — Phase D Pass 1 (Six-Pass Self-Review):**
1. Pass 1 — Visual consistency sweep (re-walk every page; tabular tighten only)
2. Pass 2 — Accessibility audit (keyboard, focus, screen-reader, contrast)
3. Pass 3 — Performance + bundle audit (route sizes, ssg coverage, image weight)
4. Pass 4 — SEO + metadata pass (titles, OG, sitemap, JSON-LD)
5. Pass 5 — Error / edge-case coverage (empty states, 404/500, slow networks)
6. Pass 6 — Outside-eye / launch checklist sweep

---

## Current state — end of Session 12

**Session phase:** Phase C closeout. Phase D (Five-Pass Self-Review) can begin Session 13 after cookie-banner + visual-polish carry-over.

**Session 12 summary** — Phase 1 feature-complete on this session's tracks 1+2; tracks 3+4 partially deferred.
- ✓ **Track 1 (main thread): Email + newsletter infra.**
  - `lib/resend/client.ts` — Resend wrapper. Returns `null` on dummy key (no-op send); `sendEmail()` returns `{ok, id|reason}`.
  - `lib/resend/templates/{_shared,welcome,pro-upgrade,newsletter,submission-status}.tsx` — 4 React Email templates + shared shell. Inline hex literals are token-canonical (eslint exception added for `lib/resend/templates/**/*.tsx`, same carve-out as OG images).
  - `app/api/webhooks/resend/route.ts` — HMAC-SHA256 signature verification, handles bounce/complaint/delayed events. Persistence TODO slice S24.
  - `app/api/newsletter/subscribe/route.ts` — Zod-validated POST. Cookie-stub `vch_newsletter=1` for 1 year, SameSite=Lax. Inserts into `newsletter_subscribers` once Supabase wired.
  - `components/layout/footer/NewsletterSignup.tsx` — Client component, inline email + Subscribe button, Sonner toast on result, "✓ Subscribed" success state. Wired into Footer's brand column under a "VCH Weekly" kicker.
  - `app/unsubscribe/[token]/page.tsx` — confirmation page, validates token shape (cookie-stub until Supabase). `robots: noindex`.
- ✓ **Track 2 (subagent): Legal + error pages.**
  - `app/privacy/page.tsx` (193 lines) + `app/terms/page.tsx` (200 lines) generated from standard SaaS template. Requires lawyer review pre-public-launch (flagged in KNOWN_ISSUES).
  - `app/not-found.tsx` / `app/error.tsx` / `app/global-error.tsx` already existed from Session 11 checkpoint `50a1d7d`; subagent verified them.
- ✓ **Track 3 (main thread, after subagent quota'd): `/api/firehose` SSE.**
  - 30-event in-memory seed of mixed `change_events`. GET with `Accept: text/event-stream` → SSE stream, sends last 100 on connect, 25 s heartbeat comment. GET with `?since=<iso8601>` → JSON array polling fallback. Per-IP 1-connection limit via in-process `Map`; new connection from same IP aborts the prior. `runtime: 'nodejs'`, `dynamic: 'force-dynamic'`.
- ✓ **Track 3 (cookie banner z-index) — fixed.** Hierarchy now clean: modals (`z-[100]` overlay / `z-[110]` content) > cookie banner (`z-[80]`) > header. Touched `components/layout/cookie-banner/CookieBanner.tsx`, `components/overlays/CmdK.tsx`, `components/ui/dialog.tsx`. (Subagent landed this before exhausting quota.)
- ⚠ **Track 4 (visual polish pass) — DEFERRED.** Subagent ran out of quota before producing any output. Full 1440px/375px walk-through still owed.

**Quality gates at end of Session 12:** typecheck ✓, lint ✓, build ✓ — Route count up from 159 → ~165. New: `/privacy` · `/terms` · `/unsubscribe/[token]` · `/api/firehose` · `/api/newsletter/subscribe` · `/api/webhooks/resend`. Middleware unchanged at 80.8 kB.

**Next session (13) — pickup before Phase D Pass 1:**
1. Cookie banner z-index fix (Session 7 carry-over, re-deferred).
2. Visual polish pass — walk all key pages at 1440px + 375px, verify accent rhythm + spacing + OG image render.
3. If both clean, Session 13 ends Phase C. Session 14 begins Phase D Pass 1 (Five-Pass Self-Review).

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
