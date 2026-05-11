# DEFINITION_OF_DONE.md

*Phase B artifact 7 (build-prompt B7). Per-feature acceptance criteria. Specific. Testable. A slice is "done" only when every applicable criterion below is verifiable.*

> **Format per feature:**
> - **Visual** — what it looks like (concrete: dimensions, breakpoints, themes)
> - **Functional** — flows that work (concrete: input → output, side effects)
> - **States covered** — idle / loading / empty / success / error / unauthorised
> - **Performance** — measurable budget
> - **Accessibility** — WCAG AA + keyboard nav
> - **Tests** — Vitest / Playwright coverage
> - **Edge cases** — adversarial scenarios handled
>
> **The bar (Ben's example):** "Auth works" = bad. "GitHub OAuth signup creates a `profiles` row with `subscription_tier='free'`, sets a session cookie, redirects to return-to URL or `/dashboard`, persists across page reloads" = good. Every DoD below meets the latter bar.

---

## §1 Foundation slice (Slice F)

### Visual
- `/` renders Promptkit's landing hero (Bebas Neue display title, mint accent, live stats bar showing `resources` count + `ides` count + `models` count + `dealsValue`) at all 5 breakpoints (375 / 414 / 768 / 1024 / 1440 / 1920) without horizontal scroll.
- Hero animation respects `prefers-reduced-motion: reduce` (no Cmd-K demo loop when set).
- `/home` (logged-in) renders the personalised feed: hero strip with "Welcome back, @username", "X new resources match your stack since [day]" if applicable, "For your stack" horizontal scroll of 8 ResourceCards, two-column Trending + Today.
- Header renders at 60px tall, 32px horizontal padding desktop / 16px mobile, sticky with `--bg-canvas` + 1px `--color-surface` bottom border.
- Stack chip in header always shows current stack ("Cursor · Next.js · Supabase ▾"); empty for new users with placeholder "Set your stack ▾".
- Cmd-K opens within 100ms of ⌘K keypress (skeleton immediate; results stream).
- Footer renders 5 columns (Browse / Discover / Money / Account / Company) at desktop, single accordion column at mobile.

### Functional
- Anonymous visitor lands on `/`, sees hero + live stats + 30-resource masonry. Clicks "Get started" → `AuthModal` opens with GitHub + Google OAuth buttons.
- "Sign up with GitHub" → redirects to `github.com/login/oauth/authorize?...&state=<csrf>` → user authorizes → returns to `/auth/callback?code=...` → `lib/auth/server.ts` exchanges code for session → creates `profiles` row with `subscription_tier='free'`, `username` derived from GitHub handle (uniqueness-checked, suffixed `-2`, `-3` if collision) → session cookie set (HTTP-only, signed, 1-week expiry) → redirects to `/home` (or to `?return=` URL if present and same-origin).
- Logged-in user opens Cmd-K (⌘K) → palette opens 100ms → empty-query state shows: "Recent" (top 10 from `user_activity`), "Trending now" (top 5 from `v_trending_per_type`), "⌨ Tips" (3 keyboard hint lines).
- User types `mod` → palette filters to results matching "mod" via tsvector + embedding parallel queries (300ms timeout per keystroke); arrow keys navigate; Enter opens; Cmd+Enter installs (if installable).
- User types `>models gpt` → type filter triggers; results filtered to `type_slug='model'` matching "gpt"; up/down navigates; Enter opens model detail.
- User opens Stack Picker via header chip → modal opens → can select clients (multi-select pills with brand logos), tech stack tags, hardware (3 dropdowns: platform / chip / RAM); "Save my stack" → calls `lib/actions/stacks/save.ts` → upserts `user_stacks` row with `is_default=true` → modal closes → `/home` re-renders with personalised content (revalidatePath fires).
- "Skip for now" in Stack Picker → no save, modal closes, no error.
- User signs out via avatar dropdown → `lib/actions/auth/signOut.ts` → Supabase Auth sign-out → cookie cleared → redirects to `/`.
- `/api/health` GET returns `{status:"ok", db:"ok", sha:"<commit-sha>", uptime:"<seconds>"}` with 200 status, `Cache-Control: no-store`. If DB connection fails, returns 503 with `{status:"degraded", db:"error", sha:"..."}`.

### States covered
- **Idle:** all components render in initial state.
- **Loading:** Cmd-K shows skeleton results (matching real shape) while embedding query in flight.
- **Empty:** new user (no stack, no bookmarks) sees `/home` empty state with "Set your stack to personalise" CTA.
- **Success:** Stack-saved toast appears (5s auto-dismiss); /home reshapes immediately.
- **Error:** OAuth failure (user denies, network error, etc.) → AuthModal shows inline error "Couldn't sign you in. Try again." with retry button; Sentry captures the underlying error.
- **Unauthenticated:** Stack chip click → opens AuthModal (logged-out users save to `vch_stack` cookie instead, but Phase 1 ships logged-in-only stack picker per scope).

### Performance
- LCP `/` < 2.5s on simulated 4G (Lighthouse).
- LCP `/home` < 2.5s on simulated 4G.
- CLS < 0.1 on both.
- TBT < 200ms on both.
- Route bundle gzipped: `/` < 200KB, `/home` < 200KB.
- Cmd-K perceived open < 100ms.

### Accessibility
- All interactive elements keyboard-navigable.
- Focus rings visible (cyan, 2px, 2px offset per TOKEN_RECONCILIATION §11).
- Header nav uses `<nav>` landmark; main content uses `<main>` with skip-to-content link as first focusable element.
- Cmd-K has `role="dialog"` + `aria-modal="true"`; focus trapped while open; Escape closes; focus returns to trigger.
- Mega-menu uses `aria-expanded` on trigger; items in `<ul>`/`<li>`; arrow keys navigate within.
- Lighthouse a11y score ≥95 on `/` and `/home`.
- axe DevTools: 0 violations on both routes.

### Tests
- `tests/e2e/01-signup.spec.ts` — full GitHub OAuth signup → /home (mocked OAuth provider).
- `tests/e2e/02-signin.spec.ts` — sign-in flow.
- `tests/e2e/04-build-stack.spec.ts` — Stack Picker save → DB row exists.
- `tests/integration/api/health.test.ts` — health endpoint behaviour.
- `tests/unit/lib/auth/return-to.test.ts` — return-to URL whitelist.
- `tests/unit/lib/format/relative-time.test.ts` — relative-time hydration safety.

### Edge cases
- User signs up with same GitHub → idempotent (no duplicate `profiles` row); existing session reused.
- Concurrent stack-save from two tabs → last-write-wins on `user_stacks.updated_at`; both tabs see the merged result on next refresh.
- Session expires mid-Cmd-K-search → next Server Action call returns `serverError: 'session_expired'` → toast appears, user redirected to `/signin?return=/home`.
- Cmd-K opened with no internet → empty-query shows Recent (from localStorage); query input shows "Couldn't reach search" toast inline.
- Hash fragment (`#try-it`) preserved across redirect from `/auth/callback`.

---

## §2 `/models` index + `/models/[slug]` detail

### Visual
- `/models` renders FilterRail on left desktop / bottom-sheet mobile, ResourceCard grid (3 columns desktop / 2 tablet / 1 mobile), 24px gap, ModelCard variant (cost-first leading).
- ResourceCard hover: 1px y-translate, accent border brighten, 150ms ease-out.
- `/models/[slug]` renders the 22-block detail page per detail-pages.md §3 + ARCHITECTURE.md §3 caching (ISR 60s).
- Hero shows provider logo (40px square via `ProviderMark`) + name (Bebas Neue display3 60px) + tagline (DM Sans body 16px) + status pills cluster + 4 primary CTAs (Try / Compare / Set alert / Add to stack).
- Stats strip is 8 cells, sticky-on-scroll under hero, monospace numbers with delta arrows.
- Tabs (Overview, Try It, Guides, Install, Source, Compatibility, Reviews, Versions, Forks, Analytics) use URL hash — clicking scrolls to anchor, updates `location.hash`.
- Right rail (desktop) sticky from after hero through end of page; mobile bottom-bar (Try / Compare / Save / Share) sticks at bottom.

### Functional
- `/models?clients=cursor,claude-code&sort=trending&page=2` → `lib/queries/resources/listByType.ts` returns paginated, filtered, sorted resources; URL fully encodes state; refresh restores exact view.
- Filter changes update URL (`router.replace` to avoid history pollution) and trigger re-fetch.
- ResourceCard click navigates to detail; cmd-click opens new tab (proper `<Link>`).
- Bookmark icon click → `lib/actions/bookmarks/toggle.ts` (optimistic UI: icon fills immediately; on serverError: rolls back + toast).
- Compare checkbox click → adds to `CompareDrawer` (right-side slide-in); drawer count badge in nav updates.
- Detail page hero "Install for Cursor" click → copies install command to clipboard + records `install_events` row + 5s "Copied" feedback on button.
- Detail page Try It Now block → embedded chat playground; free-trial mode allows 10 messages/day per IP (rate-limit enforced via `lib/server/ratelimit.ts`); BYOK + saved-on-account modes available.
- Cost calculator block: sliders update results in real time (no debounce > 100ms); save workload (logged-in) → `cost_workloads` row; permalink format `/models/[slug]?in=X&out=Y&calls=Z&cache=W`.
- Provider availability table sortable; cheapest highlighted.
- "Compare with" → opens `CompareDrawer` pre-populated with vs-previous / vs-cheaper / vs-smarter alternatives.
- "Set price alert" → opens modal; on save, creates `alerts` row with `kind='price_drop'`, `threshold_field='price_input_per_mtok'`, `threshold_value` per user input.
- News & releases block → `lib/queries/news/listForResource.ts` returns last 10 news items mentioning this model (joined via `news.related_resource_ids`).
- Active deals block → `lib/queries/deals/listForResource.ts`; locked Pro deals show blur paywall with upgrade CTA.

### States covered
- **Idle:** filters all unchecked, sort=trending, page=1.
- **Loading:** skeleton ResourceCards (matching real card dimensions: 320px tall, 320-400px wide); skeleton hero + stats strip + tabs on detail.
- **Empty (no data):** "No models match your filters. Clear filters?" with clear button.
- **Empty (new database):** "We're indexing models — check back in an hour. Browse other types: [MCPs] [Components]."
- **Success:** filter applied → results count updates ("47 models"); active filter chips appear above grid with X buttons.
- **Error:** detail page DB query fails → `error.tsx` renders friendly state with retry; Sentry captures.
- **Not found:** `/models/[invalid-slug]` → `not-found.tsx` shows "We couldn't find that model" + "Browse all models" CTA.
- **Unauthorised:** "Set price alert" / "Add to stack" / "Bookmark" by anonymous user → AuthModal opens with `?return=` URL; on signup, action retried automatically.

### Performance
- `/models` LCP < 2.5s; route bundle < 200KB gzip.
- `/models/[slug]` LCP < 2.5s on above-the-fold blocks; route bundle < 300KB gzip (per ARCHITECTURE §3 model-page exception); below-the-fold blocks lazy-loaded via `dynamic()` with `ssr: false` for Developer Reference, Timeline, Sources & Methodology.
- ISR 5 min on `/models`; ISR 60s on `/models/[slug]`.

### Accessibility
- ResourceCard is a single keyboard-focusable element (focus on the card; nested actions reachable via Tab into the card); enter activates the link.
- Bookmark button has `aria-pressed` toggling `true`/`false`.
- Compare checkbox has `aria-label="Add to compare"`.
- Tabs use `role="tablist"` + `role="tab"` + `aria-selected`; arrow keys navigate.
- Stats strip cells have `<dl>`/`<dt>`/`<dd>` semantic structure for label/value pairs.
- Sparkline charts have `<title>` SVG element + `<desc>` describing trend ("price decreased 30% over 90 days").
- Lighthouse a11y ≥95 on both routes.

### Tests
- `tests/integration/actions/bookmarks.test.ts` — toggle action covering: anonymous (returns 'session_expired'), authenticated add, authenticated remove, rate-limit triggered.
- `tests/integration/api/firehose.test.ts` — SSE stream behaviour validates change_event flow.
- Manual test: 10 model detail pages tested across 3 themes (dark only Phase 1; theme stub for light tested for no crashes).

### Edge cases
- Model with no `models.intelligence_index` value → "—" shown, not `null` or "0".
- Model with `is_open_weights=true` → renders open-weights variant blocks (5b/5c/5d/5e); Phase 1 shows "Hardware sizing — coming Phase 2" placeholder for 5b.
- Deleted model (`deleted_at != null`) → 404, not stale render.
- Filter combination returning zero results → empty state with "Clear filters" affordance.
- 1000+ models in filter result → pagination engages (page size 24); cursor-based pagination URL safe (`?cursor=`).
- Rapid sequential bookmark toggles (10 in 5 sec) → optimistic UI debounces; only final state persists; no duplicate rows.

---

## §3 `/mcps` index + `/mcps/[slug]` detail

### Visual
- Same chassis as `/models`; ResourceCard renders MCP-specific stat overrides (tool count, transport badge `stdio`/`SSE`/`HTTP`, auth badge `OAuth`/`API key`/`No auth`).
- Detail page Tool Inspector full-width block (the "heart of the page"), per detail-pages.md §4.
- Tool Inspector left rail lists tools with destructive-tool ⚠️ badges; right pane shows selected tool's input schema as form, description, output schema (Phase 1 read-only — no execution per Q1.1).

### Functional
- Tool Inspector: selecting a tool from the left rail updates right pane to show the tool's `input_schema` rendered as a structured form (read-only inputs, just for inspection); the Run button shows "Phase 2: live execution coming soon" with no action.
- Configuration card: tabs for Cursor / Claude Desktop / Windsurf / Claude Code; each shows the per-client install JSON snippet from `mcps.install_configs` jsonb; Copy button copies snippet + 5s "Copied" feedback.
- "Open my config file" button shows path with copy (e.g., `~/Library/Application Support/Claude/claude_desktop_config.json`); does NOT auto-open (no OS interaction from web).
- Per-client deeplink for Cursor (`cursor://anysphere.cursor-deeplink/mcp/install?...`) ships as a clickable link if `install_configs.cursor_deeplink` is populated.

### States covered
- All states from §2 (`/models`) apply.
- **Tool Inspector empty:** MCP with no tools introspected → "Tools not yet introspected for this MCP — coming soon."
- **Authentication walkthrough:** if MCP `auth_kind='oauth'`, dedicated section explains scope + permissions before install.

### Performance
- Same as §2; tool inspector adds ~30KB to bundle (form-renderer for JSON schema).

### Tests
- Manual test: 5 MCP detail pages with varying tool counts (1, 5, 12, 24); verify install JSON renders correctly per client.

### Edge cases
- MCP with stdio-only transport → no "Try it without installing" promise; inspector still shows tools but with banner "Local MCP — install to use."
- MCP with `tools` jsonb empty → empty-state + admin-flag for re-introspection.

---

## §4 Stack Picker

### Visual
- 640px wide modal centred (full-screen on mobile per design-prompt §6); 3 sections (clients / stack tags / hardware); save/skip buttons in footer.
- Multi-select pills with brand logos (24×24); selected pills have mint border + subtle bg.
- "+ Add" reveals the long tail of less-popular options.
- Saving preview: page behind modal previews the change (chips light up; home feed silently re-orders).

### Functional
- Open via header chip click OR welcome onboarding step OR a behaviour-signal prompt (after 5+ resource views in a session).
- Cancel / Skip → modal closes, no save.
- Save → `lib/actions/stacks/save.ts` upserts the user's default `user_stacks` row with new `ai_clients`, `tech_stack`, `hardware_profile`; revalidates `/home`, `/dashboard`, `/dashboard/stacks`; closes modal; toast "Stack saved" appears.
- Anonymous user save (logged-out) → cookie `vch_stack` set (1y, JSON-encoded, SameSite=Lax, Secure in prod, HttpOnly=false). On signup, cookie contents seed first `user_stacks` row with `is_default=true`.
- Hardware section dropdowns: platform (Apple Silicon / NVIDIA GPU / AMD GPU / CPU only), chip (M2/M3/M4/Ultra/RTX 30xx/40xx/etc.), RAM (8/16/24/32/64/128 GB+). Captured to `user_stacks.hardware_profile` jsonb; UI is stub Phase 1 per Q2.3.
- Quickstart presets: top-6 above the fold in 2×3 grid sorted by `adoption_count`; "Browse all 30 →" expands within modal; "Use this" fills picker fields.

### States covered
- **Idle:** picker opens with current stack pre-filled (or empty for new users).
- **Loading:** save action shows spinner inside Save button.
- **Empty:** new user — picker shows "What's your setup? We'll tailor everything to it." copy.
- **Success:** toast + page reshape.
- **Error:** save fails → inline error in picker + retry button.
- **Unauthenticated:** logged-out save → cookie set + AuthModal prompt "Save permanently? Sign in." (non-blocking — picker closes either way).

### Tests
- `tests/e2e/04-build-stack.spec.ts` — full Stack Picker → save → /home reshape.
- `tests/integration/actions/stacks.test.ts` — save action validation + persistence.

### Edge cases
- 50+ tech stack tags selected → save still works (no client cap); UI handles overflow gracefully (chip wrapping).
- User selects no clients but saves → allowed (just an empty stack); no error.
- Adopt-this-stack from another user's public stack → calls `lib/actions/stacks/adopt.ts` which forks + bookmarks; original `adoption_count` increments.

---

## §5 Bookmarks + Collections

### Visual
- `/dashboard/bookmarks` renders ResourceCard grid sorted by `bookmarks.created_at desc`; FilterSidebar with type chips on left.
- Bookmark icon (top-right of every ResourceCard): outline when unsaved, filled mint when saved.
- `/dashboard/collections` renders list of user's collections; clicking opens `/dashboard/collections/[id]` showing the collection's resources.
- Empty state for new user: illustration + "Save things you'll want later. Click the bookmark icon on any resource."

### Functional
- BookmarkButton click on ResourceCard (logged-in) → `lib/actions/bookmarks/toggle.ts` → optimistic icon fill → server confirms → toast "Bookmark saved" / "Bookmark removed".
- BookmarkButton click (logged-out) → opens AuthModal with `return=`.
- Move to collection: long-press / right-click bookmark icon → opens dropdown of user's collections + "+ Create new"; selecting → `lib/actions/bookmarks/moveToCollection.ts`.
- Collection CRUD: Create / Rename / Delete via `lib/actions/collections/*`; deleting a collection moves its bookmarks to "Uncategorised" (not deleted).
- Public collection: toggle `is_public=true` + slug → `/u/[username]/[collection-slug]` becomes accessible.

### States covered
- **Idle:** bookmarks rendered.
- **Loading:** skeleton bookmarks while fetching.
- **Empty (no bookmarks):** illustration + CTA.
- **Empty (filter returns zero):** "No bookmarks match these filters."
- **Success:** toast.
- **Error:** rollback + toast with retry.
- **Tier check:** Free users hit 5-bookmark cap → toast "Upgrade to Member (free!) for unlimited bookmarks" + AuthModal/upgrade modal.

### Performance
- `/dashboard/bookmarks` renders first 24 cards within 1s of navigation; pagination cursor-based.

### Tests
- `tests/integration/actions/bookmarks.test.ts` — covered above.
- `tests/e2e/03-bookmark.spec.ts` — full bookmark + verify in dashboard.

### Edge cases
- Free user adds 6th bookmark → action returns `serverError: 'free_tier_limit_exceeded'` with `upgrade=member`; UI shows "Upgrade to Member (free with signup) for unlimited bookmarks."
- 500+ bookmarks → pagination engages; page loads <2s.
- Bookmarked resource gets soft-deleted by author → bookmark stays in user's list with "Removed" badge; clicking shows 410 Gone page.

---

## §6 Cmd-K palette (full)

### Visual
- 640px wide, max 60vh tall, centred; backdrop with `--color-overlay`.
- Search input at top; type-filter inline disambiguator under input when ambiguous prefix typed.
- Results grouped by type with type badges; "Recent" / "Trending now" / "Actions" sections.
- Footer with keyboard hints: ↑↓ navigate · ↵ open · ⌘↵ install · esc close.

### Functional (per Q2.5 amended)
- Opens via ⌘K / Ctrl+K from anywhere → 100ms perceived open.
- Empty query: shows Recent (from `user_activity` for logged-in, localStorage for logged-out, capped at 10) + Trending now (top 5 from `v_trending_per_type`) + Actions (Update stack / Submit / Sign out / Open dashboard) + ⌨ Tips.
- Type filter: `>models gpt` → filters to `type_slug='model'` matching "gpt"; `>m` → inline disambiguator "models? mcps? marketplaces?" with click-to-pick.
- Semantic search: tsvector + embedding parallel queries on every keystroke (debounced 300ms); embedding query timeout 300ms (drops if exceeds, tsvector still returns).
- Prefetch: on first Cmd-K open per session, prefetch user's top 50 recent resources' embeddings client-side; local cosine-similarity for instant filtering on user's corpus.
- Up/down navigates highlighted result; Enter opens; Cmd+Enter installs (if installable — opens install dropdown for non-deeplink clients).
- Click outside closes; Escape closes; focus returns to trigger.

### States covered
- **Idle:** palette opens with empty-query state.
- **Loading:** skeleton results while query in flight; embedding query loading indicator separate from tsvector.
- **Empty (zero results):** "Nothing matches '[query]'. Try a broader term, or [submit it →]."
- **Success:** results populate; first highlighted by default.
- **Error:** query fails (rate-limited / DB down) → "Search unavailable. Try again." + retry button.
- **Network failure:** detected via fetch wrapper → inline retry; recent items still show from localStorage.

### Performance
- 100ms perceived open (skeleton immediate, real results stream).
- Keystroke → result update <200ms p50, <400ms p95 (excluding embedding when timed out).
- Bundle impact: cmdk + result components <30KB gzip.

### Accessibility
- Focus trap inside palette; Escape closes.
- `role="combobox"` + `aria-controls` on input; `role="listbox"` on results; `role="option"` on each.
- `aria-live="polite"` announcement of result count when query changes.
- `aria-selected="true"` on highlighted result.

### Tests
- `tests/integration/api/firehose.test.ts` — covered (different feature, related concerns).
- Manual test: open Cmd-K from 5 different routes, verify navigation works.

### Edge cases
- User opens Cmd-K, navigates, opens a resource, presses Cmd-K again on detail page → palette opens with same recent list updated to include just-viewed.
- Prefetch fails (offline) → semantic search degrades to tsvector-only; "Local results only — connect for more" indicator.
- Type filter typed but query is empty → shows Trending in that type.

---

## §7 `/deals` + `/deals/[slug]` (with paywall)

### Visual
- Deals index with hero strip ("$4.2M+ in credits"), filters (tier / value / provider / category), sort (most-valuable / most-claimed / newest / expiring-soon), DealCard grid.
- DealCard has provider logo (40px) + value (large display number, mint colour) + summary + tier badge.
- Locked Pro DealCard shows blur paywall over the value/details with "🔒 Pro deal" header + "Upgrade to Pro — $99/yr" CTA + "This deal alone is 100x the cost." copy. Blur reveals 1-2px of underlying content per design-prompt §16.
- `/deals/[slug]` shows full eligibility checklist + step-by-step redemption guide + reviews + "what you get" breakdown.

### Functional
- Filter / sort change → URL-encoded → list refetches.
- Eligibility checklist: client-side, unenforced (informational); checking all → "Apply now" CTA enabled.
- "Apply now" button → opens partner's URL in new tab (`target=_blank rel="noopener noreferrer"`) AND inserts `deal_claims` row with `status='started'`.
- Locked Pro deal click → opens `UpgradeModal` showing the specific deal value + "Plus, Pro members get…" coming-soon list.
- Self-reported claim status update: user can mark `approved` / `rejected` / `redeemed` from `/dashboard/deals` → updates `deal_claims.status`.
- Pro user accessing Pro deal: sees full apply URL + redemption steps; non-Pro sees blur overlay.

### States covered
- All standard states.
- **Tier-gated:** non-Pro on Pro deal → blur paywall.
- **Expired:** `deals.expires_at < now()` → "This deal expired on [date]" + suggest similar active deals.
- **Claim already started:** "You started claiming this deal on [date]. Status: [...]." with link to dashboard.

### Performance
- `/deals` ISR 5min; LCP <2.5s; bundle <200KB.
- `/deals/[slug]` ISR 60s.

### Tests
- `tests/integration/actions/dealClaim.test.ts` — claim flow including duplicate-claim handling.
- Manual test: paywall blur visually correct in dark theme.

### Edge cases
- Free user clicks "Sign in to claim" on Member deal → AuthModal → on signup, automatically claims (return-to flow preserves the click intent).
- Pro user cancels subscription → `subscription_tier` flips to 'free' after grace period; previously-claimed Pro deals stay accessible in `/dashboard/deals` (claim record persists) but new Pro deal access locked.

---

## §8 `/news` + `/news/[slug]`

### Visual
- News index two-column desktop (left rail filters: kind / topics; right column feed); hero with "🔥 BREAKING" pinned item if any.
- NewsCard variants: dark (default), mint (release), uv (ecosystem), yellow (tutorial), pink (op-ed), with auto-generated 🤖 badge if applicable.
- Article view: max 720px reading width; markdown body; "Resources mentioned" sidebar (right rail) with mini ResourceCards.

### Functional
- Auto-drafted news (from `fn_after_change_event`) lands in `/admin/news-queue` with `status='draft'`; admin one-click publish per Q2.2 amendment.
- Editorial news: `/news/[slug]` body rendered from `news.body` markdown; sanitized via `lib/safe/sanitize.ts`.
- Resources-mentioned sidebar: joined via `news.related_resource_ids`; each clickable.
- Inline newsletter promo mid-article → opens newsletter signup modal.
- Comments (threaded) — depends on `comments` table; reply, upvote, downvote actions.
- RSS feed at `/news/feed.rss` — last 50 published items; includes `<atom:link rel="self">`, `<lastBuildDate>`, `Content-Type: application/rss+xml; charset=utf-8` per Q2.4 amendment.

### States covered
- All standard.
- **No news yet:** "Stay in the loop — subscribe to the digest" CTA + browsable trending across types.
- **Article 404:** not-found state with "Browse trending" CTA.

### Tests
- `tests/integration/api/firehose.test.ts` — change_event → news draft chain.
- W3C RSS validator on `/news/feed.rss` (audit script `pnpm audit:rss`).

### Edge cases
- News article body exceeds 5,000 words → reading view still renders (no length cap); "Reading time: X min" computed and shown.
- News article references a resource that's been soft-deleted → resource sidebar shows "Removed" badge (link still routes to 410 Gone).
- 100+ news items per day → RSS feed limits to last 50; full archive paginated at `/news?page=N`.

---

## §9 `/guides` + `/[resource-slug]/guides/[guide-slug]`

### Visual
- Guides index with FilterSidebar (kind / difficulty / OS / client / runtime / duration); GuideCard grid.
- Reader view: focused-reading mode — site header DIMS (lower opacity, smaller height); two-column (sticky 280px progress sidebar + 720px reading column).
- Each step is a card with copy button + "Mark step complete" + "Step didn't work?" buttons.

### Functional
- Sticky progress sidebar tracks `guide_completions.completed_steps[]` for logged-in users; localStorage for logged-out.
- "Mark complete" → `lib/actions/guides/markStepComplete.ts` updates row.
- "Step didn't work?" → opens drawer with troubleshoot hints from `guide_steps.troubleshoot_hints` jsonb + crowdsourced fixes.
- Verifier ("Run check"): if user has gateway connected (Phase 2+), runs probe; Phase 1 just shows expected output + asks user to paste their result.
- Last-verified-by-us badge: `guide.last_verified_at`; if >90d ago, shows yellow "Needs verification" badge.
- "Help improve this guide" → opens editorial submission form.

### States covered
- All standard.
- **Guide stale:** "needs verification" badge appears when `last_verified_at > 90d ago`.
- **Step verifier failure:** drawer opens with "Common fixes" mined from `guide_completions.failure_reason`.

### Tests
- Manual: walk one guide end-to-end, verify step markers persist.

### Edge cases
- User abandons guide at step 3 → `guide_completions.abandoned_at_step=3`, `failure_reason` captured if user provides one.
- Guide updated mid-session → user's in-progress state preserved; banner notifies "This guide was updated. [Reload]."

---

## §10 `/showcase`

### Visual
- Index: masonry grid (4 cols desktop / 2 cols tablet / 1 mobile); large screenshots with overlay showing "Built with [chip][chip][chip]" on hover.
- Detail: hero is the screenshot or video (16:9 or square); built-with stack chips below; builder's notes section; "Replicate this stack" button.

### Functional
- "Replicate this stack" → calls `lib/actions/stacks/adopt.ts` with the showcase's `built_with_resource_ids[]` → bookmarks all + creates user's stack with these resources pinned + opens picker for further customisation.
- Submission flow (logged-in only) → `/submit` with `type=showcase` → upload screenshots (Sharp + NSFW pre-screen for the screenshot) → live URL verification (HEAD request, must return 200, HTTPS, <3s) → submit for moderation per Q2.8.
- Live URL chip: opens in new tab with `rel="noopener noreferrer"`.

### States covered
- All standard.
- **Stats opt-in:** showcase items with `stats_shared=true` show MAU / revenue / traffic (only if user opted in); never required.
- **Live URL down:** if periodic check fails, surfaces "Site temporarily unreachable" badge; doesn't auto-delete.

### Tests
- Manual: 3 showcase submissions through the full flow.

### Edge cases
- Showcase URL goes 404 → flagged in admin; original screenshot retained for archival; "Site no longer available" badge.
- User submits showcase claiming "built with Cursor" but reviewer can't verify → submission rejected with "Please provide a Cursor screenshot or build log evidence."

---

## §11 Profile (public + edit)

### Visual
- Public profile `/u/[username]` shows avatar (96px), username, bio, joined date, total resources published, total stacks shared, links (GitHub/Twitter/website).
- Tabs: Submissions / Stacks / Collections.
- Edit at `/settings/profile` — same fields, with avatar upload.

### Functional
- Profile fetched via `lib/queries/profiles/getByUsername.ts`; ISR 5min.
- Avatar upload → signed URL → direct upload to Supabase Storage → Edge Function processes (NSFW + Sharp resize per Q2.8) → `profiles.avatar_url` updated.
- Username change: subject to 30-day cooldown (prevents handle squatting); validates format (`[a-z0-9_-]{2,32}`).
- Public-private toggle on collections / stacks / submissions controls visibility on public profile.

### Tests
- `tests/integration/actions/updateProfile.test.ts` — covers username uniqueness, format validation, cooldown.

### Edge cases
- Username taken → action returns `validationErrors: { username: ['Already taken'] }`.
- Avatar upload fails NSFW check → toast "Couldn't process this image. Try a different one." + Sentry log.

---

## §12 Pro upgrade flow

### Visual
- `/pricing` page with 3-column comparison (Free / Member / Pro $99/yr); "Live" / "Coming Q3 2026" badges per feature per Q3.6.
- UpgradeModal: value-led — shows the specific deal/feature being unlocked + ROI calculation ("This deal alone is 1500x the cost of Pro") + 14-day free trial CTA + 14-day money-back guarantee badge.
- Pro Badge (🔒 + "PRO") on locked features site-wide.

### Functional
- "Start 14-day Pro trial" → redirects to Stripe Checkout (test/live mode based on env) with the configured `STRIPE_PRICE_ID_PRO_YEARLY` price + 14-day trial period + card-required.
- On successful checkout → Stripe webhook `checkout.session.completed` fires → `lib/actions/stripe/handleWebhook.ts` updates `profiles.subscription_tier='pro'` + `subscription_expires_at` + `pro_started_at`; redirects user to `/settings/billing?welcome=true`.
- WelcomeEmail sent via Resend on subscription activation.
- Cancellation: user clicks "Manage subscription" in `/settings/billing` → opens Stripe Customer Portal session URL → user cancels in Stripe-hosted UI → webhook `customer.subscription.deleted` (or scheduled cancel via `customer.subscription.updated`) updates `subscription_expires_at` to period end; tier remains 'pro' until period end then flips to 'free'.
- Failed renewal: `invoice.payment_failed` webhook → email sent + 7-day grace period (per Q1.5) → after grace: tier flips to 'free', Pro-locked content re-locks.
- Account deletion mid-subscription: subscription auto-cancelled (refund prorated remaining trial / period via Stripe dashboard if requested).

### States covered
- **Pre-upgrade:** Free user on Pro feature → ProBadge + click → UpgradeModal.
- **Trial active:** "X days left in trial" indicator in /settings/billing.
- **Trial converting:** auto-converts at end of trial (card already on file); email sent 3 days before.
- **Trial cancelled:** user cancels during trial → no charge; tier stays 'free'; "We'd love your feedback" email sent.
- **Active sub:** "Pro member since [date]" in /settings/billing.
- **Cancelled (in grace):** "Subscription ends [date]" + "Reactivate" CTA.
- **Failed renewal:** "Card declined — update payment method [link]" + 7-day countdown.

### Performance
- /pricing static; LCP <2s.
- Checkout redirect <1s.

### Tests
- `tests/e2e/05-pro-checkout.spec.ts` — full Stripe test-mode checkout including webhook handling.
- `tests/integration/api/webhooks-stripe.test.ts` — signature verification + each event type.

### Edge cases
- User attempts to start a 2nd trial → Stripe reuses the customer; trial only granted once per customer (Stripe-enforced).
- Webhook arrives before checkout-success page render → idempotency: webhook handler is idempotent (uses Stripe event ID for dedup).
- User on trial accesses Pro feature, trial expires mid-action → action returns `serverError: 'trial_expired_upgrade_required'`; UI shows in-context modal "Your trial just ended. Continue with Pro?"

---

## §13 `/api/firehose`

### Visual
- N/A (API endpoint).

### Functional
- GET `/api/firehose` opens SSE stream (`Content-Type: text/event-stream`).
- On connect: server sends last 100 `change_events` rows in chronological order as `data: {kind, resource_id, payload, occurred_at}\n\n` lines.
- Then subscribes to Supabase Realtime channel for new INSERTs on `change_events`; forwards each new row.
- Heartbeat (`: ping\n\n`) every 30s to keep proxies alive.
- On client disconnect (`req.signal.abort`): unsubscribes channel + closes stream.
- Polling fallback: GET `/api/firehose?since=<iso8601>` returns JSON array of events since that timestamp, max 100.
- Per-IP limit: 1 concurrent SSE connection (separate concurrency check; not rate-limit). Polling subject to `firehose:ip:<ip>` 60/min rate-limit.

### States covered
- **Connected:** live tail.
- **Disconnected:** server cleans up channel.
- **Rate-limited (polling):** returns 429 with `Retry-After` header.
- **Concurrency-limited (SSE):** returns 429 with "Already streaming from this IP" message + closes new connection.

### Performance
- TTFT (first event delivered) <200ms after connect.
- Memory per connection <1MB.

### Tests
- `tests/integration/api/firehose.test.ts` — connect, receive history, receive live event, disconnect cleanup.

### Edge cases
- Vercel Edge function 30s timeout → SSE auto-reconnects from client side (browsers handle this); state preserved via `?since=` last-event-ID.
- Supabase Realtime channel disconnects mid-stream → server attempts re-subscribe once; on second failure, closes stream gracefully.

---

## §14 Ingestion jobs (per source — applies to all 13)

### Visual
- N/A (background scripts).
- Admin dashboard `/admin/ingestion-runs` shows last 50 runs by source + priority + status + records counts; failed runs surface in red.

### Functional
- Each script in `/scripts/ingest/[source].ts` is callable via `pnpm ingest:[source]` locally OR triggered by GHA workflow on cron + `workflow_dispatch`.
- Wrapper (`lib/ingestion/_shared/runner.ts`) creates `ingestion_runs` row at start (`status='running'`, `priority` from script metadata), writes raw response to R2 (`raw_dump_r2_key`), runs the parser, upserts via `upsertResource.ts` (idempotent on `source_url`), updates row at end (`status='success'`/`'failed'`/`'partial'`, `records_inserted/updated/failed` counts).
- On failure: Slack notification to `#vch-ops` via `slack-notify.ts`; failed records logged but other records in the batch still processed.
- Concurrency: `concurrency: { group: 'ingest-${source}', cancel-in-progress: false }` in GHA — no two runs of the same source overlap.

### States covered
- **Success:** `ingestion_runs.status='success'` with `records_inserted+updated > 0`, `records_failed = 0`.
- **Partial:** records_failed > 0 but records_inserted+updated > 0; surface in admin with yellow badge.
- **Failed:** records_inserted+updated = 0 OR upstream API returned 5xx after backoff exhausted; status='failed' + Slack alert.
- **Stale:** if `priority='critical'` source hasn't had a successful run in 24h, surface "Source: stale" badge on affected resource detail pages per data-sourcing §19.

### Performance
- OpenRouter run completes <5min for ~400 models.
- MCP Registry run completes <10min for ~500 servers.
- Smithery run completes <15min for ~7,300 servers.
- GitHub code search runs use the `pushed:>YYYY-MM-DD` incremental — daily run completes <30min.

### Tests
- Each ingestion script has a smoke test in `tests/integration/ingestion/[source].test.ts` — uses recorded fixture (HTTP-mocked) to verify parsing.

### Edge cases
- Upstream API returns malformed JSON → parser logs + skips that record; counter incremented; other records still processed.
- Upstream API rate-limits us → exponential backoff (1m, 5m, 15m); if all 3 fail, run marked failed.
- Same MCP appears in Official Registry + Smithery + Glama → dedup on `source_url` (canonical = GitHub repo URL); merged record stores per-registry install configs in `mcps.install_configs` jsonb per data-sourcing §3.
- New record from source has missing required field (e.g. no `name`) → record skipped + counter incremented; other records still processed.

---

## §15 The cross-cutting "every slice" gates

Every slice, in addition to its feature-specific DoD, must pass these gates before being declared complete:

- ✓ `pnpm typecheck` zero errors
- ✓ `pnpm lint` zero warnings
- ✓ `pnpm build` zero warnings
- ✓ Applicable Vitest tests pass (unit + integration as relevant)
- ✓ Applicable Playwright tests pass (if any of the 5 critical flows touched)
- ✓ Slice's "Make Sure" checklist items walked + verified (per build-prompt §C ritual)
- ✓ Tested at 375px viewport (actually narrowed, not just devtools)
- ✓ Tested in dark theme (light theme deferred Phase 2)
- ✓ Tested signed-out and signed-in (for any auth-aware feature)
- ✓ `BUILD_LOG.md` updated with what was built, decisions made, anything deferred to KNOWN_ISSUES
- ✓ Conventional Commits commit message + push
- ✓ Brief checkpoint surfaced to Ben

If any gate fails, the slice is NOT complete; fix before moving on. No accumulating debt.

---

## §16 What this document gates

- Every Phase C slice references this document for its target acceptance criteria
- Phase D Pass 2 (functional sweep) walks the DoD per feature and verifies each criterion
- A slice declared complete in `BUILD_LOG.md` is gateable against this document — if a reviewer can find a DoD criterion not met, the slice goes back open
