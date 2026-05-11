# ANSWERS.md
*Phase A Q&A capture. Every question batch and Ben's answers, in order.*

## Pre-Phase-A rulings (from prior turns)

**R1 — Token reconciliation.** Promptkit's *visual* tokens win (colors, fonts, type scale, accent rhythm). Build-prompt's *structural* tokens win (5 fixed button heights, 3 fixed input heights, 5-slot radii scale, 4px-base spacing scale, 8-tier z-index, locked focus ring). Promptkit's actual values get slotted into the structural buckets. Produce `TOKEN_RECONCILIATION.md` in Phase B documenting every Promptkit value → structural slot mapping.

**R2 — Resource type taxonomy.** 24 resource types + 3 content surfaces (Guides, Deals, News) = 27 total content destinations. The schema's `resource_type` enum has all 27 values; only 24 share the `resources` spine. The "27" in mission statement and master plan was loose phrasing; design-prompt §1 explicitly says "24 resource types" — that's the structural truth. No Phase-A question needed on this.

**R3 — Light mode deferred to Phase 2.** Architecture must be light-mode-ready (CSS variables, no hardcoded colours, theme provider in place); no light-mode CSS written this build; no light-mode testing required for Make-Sure checklist this session. Add to `KNOWN_ISSUES.md`: "Light mode deferred to Phase 2."

**R4 — Drop Newsreader.** Three fonts only: Bebas Neue (display), DM Sans (body/UI), Space Mono (mono/caps/labels). Pull-quotes use DM Sans italic at larger size.

**R5 — Promptkit-vs-design-prompt tiebreaker.** Visual conflicts → Promptkit wins. Structural conflicts (states, layout pattern, interaction behaviour) → design prompt wins. Surface ambiguities.

**R6 — Tweaks-panel excluded.** `src/tweaks-panel.jsx` and the duplicate at root are confirmed dev tooling, not ported.

**R7 — Multi-session framing.** This session: Phase A complete + Phase B complete + Phase C foundation slice complete + ideally 1-2 additional vertical slices. Hand-off discipline via `SESSION_HANDOFF.md`. Phase D (Five-Pass Review) only at end of full Phase C, not per session.

---

## Phase A — Q&A capture

*(Each batch below gets filled as Ben answers.)*

### Batch 1 — The Big Rocks (BLOCKER tier)

**Q1.1 — Schema-vs-spec drift policy.** ACCEPTED with refinement.
- Default rule: use what schema supports; defer features needing new tables to Phase 2; no schema modifications this session.
- **MCP Tool Inspector for Phase 1 is READ-ONLY.** Shows tools/resources/prompts the MCP exposes (parsed from `mcps.tools` jsonb), does NOT invoke them. Live invocation needs WebSocket proxy + sandboxing — Phase 2. Read-only is the more useful flagship anyway (most users want "what does this MCP do" before installing, not "execute from browser").
- Live Sandpack playgrounds: deferred to Phase 2. → KNOWN_ISSUES.
- Alternatives engine: use existing `resource_alternatives` table.
- Open-weights hardware sizing: Phase 2 as planned.
- Model tips: use existing `prompting_tips` table (works for any resource type, not just models).
- For every other schema-vs-spec gap encountered during build: scope-down to schema, defer rest, log to KNOWN_ISSUES.

**Q1.2 — Background-jobs stack.** ACCEPTED in full.
- GitHub Actions + pg_cron + Edge Functions only. No Trigger.dev, no Inngest, no Upstash.
- 30-min RSS cadence degrades to 60-min on GHA (saved $2K+/mo earlier session decision). Note in KNOWN_ISSUES.
- "Stale > 24h" UI from data-sourcing §25 covers user-facing impact.
- Heavy parsing: Edge Function invoked from GHA worker.

**Q1.3 — Embeddings provider.** Option (A) with "stretch" framing.
- Add `openai` SDK as approved dependency. `text-embedding-3-small` for embeddings.
- Build full ingestion pipeline (Edge Function generates embedding on resource insert/update, writes to `resources.embedding` column).
- Cmd-K and `/search` ship tsvector-first; embedding-augmented results layered on top when confidence is high.
- If embedding queries aren't producing high-quality results in first 2 weeks post-launch, fall back to tsvector-only with no UX disruption.
- Cost budget: $50/mo cap for embeddings in Phase 1. Alert if approaching.

**Q1.4 — Primary model-pricing source.** ACCEPTED in full.
- OpenRouter `/api/v1/models` is primary.
- LMArena Elo for ranking, replacing AA Intelligence Index in Phase 1.
- Manual editorial seed for benchmarks on top 12 models (SWE-Bench, GPQA, HumanEval, MMLU) — one-time scrape from public AA pages, stored with `source_url` + `as_of`, attribution surfaced as "Source: Artificial Analysis (as of [date])".
- Real-world performance block: empty-state with explanatory text until gateway exists (Phase 2+).
- Intelligence Index column hidden in Phase 1, replaced by Arena Elo column.

**Q1.5 — Pricing & Stripe.** ACCEPTED with trial addition.
- $99/yr only at launch. No monthly tier.
- Stripe-hosted Customer Portal. No custom billing UI.
- 7-day failed-renewal grace, then downgrade to Free.
- Bookmarks + stacks retained after downgrade. Pro features locked, Free-tier access continues.
- **Addition:** 14-day free trial for new Pro subscribers, card-required upfront. Stripe-native.

**Q1.6 — Repo + branch strategy.** ACCEPTED with one addition.
- Single repo at root (no `apps/web/`).
- Trunk-based on `main`. Feature branches for vertical slices, squash merge. No required reviewers.
- CI on every push: typecheck + lint + build + test. Vercel preview on every PR. Production deploy on `main` push.
- **Addition:** Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, with optional scope `feat(models): …`). Enables auto-changelog.

---

## Pre-empted answers (Ben volunteered, not asked)

**Editorial seed scope.** Ben produces the 4 AGENT.md personality files (Workflow Author, News Editor, Guide Writer, Reviewer/QA), 10 evergreen guides, first newsletter issue, and 30 curated stack presets in parallel **outside Cowork**. I build the **infrastructure that consumes them** — `seed.json` schema for stacks, guide markdown ingestion, AGENT.md → news-editor wiring, newsletter React Email template, RSS-feed-list config. Editorial seed bundle attached when ready.

**Existing accounts.** Ben to provide in Batch 2 reply: Supabase project ID, Stripe test keys, Resend API key + DNS access, Vercel team ID + project, Sentry DSN, OpenAI API key, Cloudflare R2 credentials, GitHub repo URL. **Domain:** `vibecoderhub.com`, registered. **Logo:** placeholder for Phase 1 — surface cleanly, real logo lands Phase 2.

---

### Batch 2 — Data, Ingestion & Cross-Product Wiring

**Q2.1 — 13-source ingestion plan.** ACCEPTED in full + priority addition.
- Build all 13 sources as proposed; Phase 0's 7 ship with foundation slice; Phase 1's 6 layer in across weeks.
- Shared helpers in `/scripts/ingest/_shared/` (rate-limiter, R2 raw-dump uploader, `ingestion_runs` writer, dedup-on-source_url, retry+backoff).
- All idempotent, `workflow_dispatch`-able, locally runnable (`pnpm ingest:openrouter`).
- GitHub Code Search authenticated (~30 req/min comfortable budget).
- **Addition:** each ingestion script declares a `priority` enum (`critical` / `high` / `normal`) stored in `ingestion_runs`. OpenRouter + MCP Official Registry = `critical`; HN-Algolia + Product Hunt RSS = `normal`. Admin dashboard surfaces failures by priority.

**Q2.2 — News engine.** ACCEPTED 1-3, AMENDED 4 (significant).
1. ✓ Trusted-source list lives at `lib/news/trusted-sources.ts` — code-reviewed PR flow.
2. ✓ Trusted-source binary gate; no auto-content-quality detection.
3. ✓ 48h auto-flag with red badge in admin queue; no auto-publish or auto-reject after timeout.
4. **AMEND:** `fn_after_change_event` writes news rows with `status = 'draft'`, NOT `status = 'published'`. All trigger-generated news goes to admin draft queue with one-click publish. Reasons: (a) noise risk — provider pricing-page parsing bugs would auto-publish wild swings, (b) editorial voice risk — 5 templated auto-articles a week makes /news feel robotic. Cost: ~5 min/day reviewing drafts. Phase 2 may introduce `confidence_score` on `change_events` and whitelist auto-publish for high-confidence sources (direct provider API confirms). For Phase 1: drafts only.

**Q2.3 — Stack mechanics.** ACCEPTED all three.
1. Hardware section in Phase 1 picker = capture-now-use-later; data writes to `user_stacks.hardware_profile`; UI is 3-dropdown stub; empty-state copy "We'll use this when local-model recommendations land."
2. Anonymous stack cookie: `vch_stack`, 1-year expiry, JSON-encoded `{clients, tags, hardware_profile}`, `SameSite=Lax`, `Secure` in production, **`HttpOnly=false`** (client-side read needed for picker display). On signup, cookie contents seed user's first `user_stacks` row with `is_default=true`.
3. "Adopt this stack" does both — bookmark each resource into adopter's bookmarks AND fork the stack into adopter's `user_stacks` with `forked_from_id` pointer. Increments `adoption_count` + `fork_count` on original.

**Q2.4 — `/firehose` + RSS.** ACCEPTED with cache + headers note.
- `/api/firehose` SSE stream of `change_events` (line-delimited `data: {...}`); last 100 events on connect, then live tail; per-IP 1-connection limit.
- Polling fallback: `/api/firehose?since={iso8601}` returns JSON array.
- 5 RSS feeds at launch: `/news/feed.rss`, `/news/feed/[kind].rss`, `/[type]/feed.rss`, `/models/[slug]/feed.rss`, plus per-resource feeds where applicable.
- 5-minute revalidation cache on RSS responses.
- JSON public API defers to Phase 2; surface as "coming soon" in `/dashboard/api-keys`.
- **Addition:** all RSS feeds include `<atom:link rel="self">`, `<lastBuildDate>`, proper `Content-Type: application/rss+xml; charset=utf-8` headers. Validate each feed against W3C RSS validator before declaring slice done.

**Q2.5 — Cmd-K palette.** ACCEPTED 1, 3, 4, 5; AMENDED 2 + addition on 5.
1. ✓ Recent items: `localStorage` for logged-out (10 cap), `user_activity` query for logged-in.
2. **AMEND:** Type filter via fuzzy-match inside the query, NOT `>` autocomplete dropdown. Examples:
   - `>models gpt` → models matching "gpt"
   - `>mcps github` → MCPs matching "github"
   - `>m` → inline disambiguator: "models? mcps? marketplaces?"
   Closer to Linear's Cmd-K pattern; no 2-step interaction.
3. ✓ Empty-query state: Recent + Trending now (from `v_trending_per_type`) + ⌨ Tips.
4. ✓ Action commands: "Update my stack", "Submit a resource", "Sign out", "Open dashboard". (Theme switch removed since light mode deferred to Phase 2.)
5. ✓ Semantic search wiring: tsvector + embedding parallel queries, 300ms timeout per keystroke, embedding similarity threshold >0.78. **Addition:** on first Cmd-K open per session, prefetch user's top 50 recent resources' embeddings into a small client-side index for instant local filtering on their own corpus. Native-fast feel.

**Q2.6 — Admin identification.** ACCEPTED (C) with refinement.
- Env var allow-list for Phase 1.
- **Refinement:** check GitHub `provider_id` (numeric user ID from Supabase Auth `user_metadata` or `app_metadata`), NOT `user_name` (handle, user-editable). Tamper-proof.
- Env var: `ADMIN_GITHUB_USER_IDS=<comma-separated-ids>` (e.g. `12345678`).
- Ben to provide his GitHub user ID via `api.github.com/users/<his-handle>` lookup before Phase C.

**Q2.7 — Telemetry.** OVERRIDDEN to PostHog.
- Reasons: (a) eat-own-dog-food — VCH lists PostHog as a tracked tool; PostHog detail page can show our own dashboard screenshot. Marketing gold. (b) Session replay invaluable in months 1-3 post-launch — single highest-leverage telemetry feature for a new product. Plausible has none. (c) Free tier (1M events/mo) covers comfortable launch scale. (d) Feature flags as free A/B infra. (e) Cookie-banner concern is minor — Stripe + auth cookies likely need consent under strict GDPR anyway; bake banner pattern from day 1.
- Cost: ~30 min extra setup. Worth it.
- **PostHog confirmed** for Phase 1.

**Q2.8 — Image moderation.** ACCEPTED split + automated NSFW pre-screen.
- Showcase screenshots: pre-publish via `submissions` queue, admin approves at `/admin/moderation`.
- Avatars: published-immediately + reactive flagging.
- **Addition:** avatar uploads run through automated NSFW classifier in the upload Edge Function before becoming visible (Replicate or similar, ~$0.001/image). Catches obvious abuse without admin time. Helper at `lib/moderation/nsfw-check.ts`. Manual flagging still surfaces edge cases.
- One extra dependency (Replicate API), but solves "genuinely terrible upload" cheaply.

---

## Credentials / IDs (placeholders for Phase A; real values via secure channel before Phase C)

- **Supabase:** project name `vibecoderhub-prod`, region us-east-1 (or matching latency preference), Pro plan ($25/mo). Provides project URL + service-role key + anon key + pooled DB connection string + direct DB connection string (for migrations).
- **Stripe:** test secret + test publishable + webhook signing secret for build. Live keys held back until post-launch verification.
- **Resend:** API key + verified sending domain `vibecoderhub.com`. `notify@` (transactional) + `news@` (marketing) sub-addresses. SPF/DKIM/DMARC pre-configured.
- **Vercel:** team ID + project name. Auto-deploy from `main`.
- **Sentry:** DSN for client + server (single project). Source-map upload token.
- **OpenAI:** API key with $100/mo budget cap (covers embeddings).
- **Replicate:** API key with low budget cap (covers NSFW pre-screen for avatars).
- **Cloudflare R2:** bucket `vch-raw-dumps`, R/W access keys.
- **GitHub:** repo URL `github.com/<org>/vibecoderhub-web`, PAT with `repo`, `read:org`, `read:user` scopes (for ingestion scripts).
- **GitHub user ID** for `ADMIN_GITHUB_USER_IDS` env var.
- **Domain:** `vibecoderhub.com`, registered, DNS via Cloudflare. Apex + www both pointed at Vercel.
- **Logo:** placeholder (Promptkit's mint "V" mark) for Phase 1; real logo lands Phase 2.

Phase B can scaffold the architecture with placeholders in `.env.example`; real credentials slot in before Phase C.

---

### Batch 3 — Closer (IMPORTANT tier)

**Q3.1 — Account deletion cascade.** ACCEPTED in full.
- User-initiated delete (from `/settings/account`): soft-delete `profiles.deleted_at = now()`; immediately scrub PII (email zeroed in `auth.users` via service role; `display_name`/`bio`/`avatar_url`/`github_handle`/`twitter_handle`/`website_url`/`location` set NULL on profile; `username` retained but suffixed `[deleted-{8-char-uuid}]` for FK integrity).
- Stripe subscription auto-cancelled.
- Bookmarks/collections/alerts deleted.
- Submitted resources kept public with `author_id = NULL` (cascade `set null`); `author_handle` retained as denormalised attribution.
- Reviews + comments retained but author shows "[deleted user]".
- 30-day reversal window — sign-in via same GitHub OAuth restores. After 30 days, nightly pg_cron job hard-deletes via `auth.admin.deleteUser()`.
- **GDPR data export:** Phase 1 ships `/settings/privacy` "Request my data" button + "we've received your request" confirmation email. Actual export job is Phase 1 stretch — if time permits build it; if not, log to KNOWN_ISSUES with note "manual fulfillment within 30 days until automated job ships." Endpoint and UX exist either way.

**Q3.2 — OG images.** ACCEPTED option (A) dynamic-only.
- `opengraph-image.tsx` per route group, exactly as proposed (model / mcp / component / generic / news / deals / guides / showcase variants).
- All 1200×630, Promptkit's tokens (Canvas Black bg, mint accent, Bebas Neue title, DM Sans subtitle, Space Mono labels).
- Edge-cached after first hit.
- Promote to pre-rendered + R2 only if cold-load latency becomes a measured problem post-launch.

**Q3.3 — Performance budgets.** ACCEPTED with model-page exception.
- **Default routes:** LCP <2.5s simulated 4G, CLS <0.1, TBT <200ms, route bundle <200KB gzipped, Lighthouse perf ≥90, a11y ≥95.
- **Model detail page:** route bundle <300KB gzipped allowed. Above-the-fold blocks <200KB; below-the-fold (Developer Reference, Timeline, Sources) lazy-loaded via `dynamic(() => …, { ssr: false })`. LCP target <2.5s applies to above-the-fold only (hero + stats strip + Try It Now + Pricing).
- **Cmd-K:** must open in <100ms perceived (skeleton immediate, results stream in).
- **Image budget:** all images use `next/image` with explicit dimensions + `priority` on above-the-fold; OG images excluded.
- **Lighthouse audit targets** (Phase D Pass 4): `/`, `/models`, `/models/[slug]` (Claude Opus or top model), `/mcps`, `/components`. Other routes audited but not gate-blocking.

**Q3.4 — `/best-for` use-case slug list.** ACCEPTED verbatim.
- Ship 12 use-case pages from schema seed unchanged: `saas-mvp`, `landing-page`, `chatbot`, `rag-pipeline`, `agent-system`, `browser-automation`, `web-scraping`, `e2e-testing`, `content-generation`, `code-review`, `data-analysis`, `design-to-code`.
- Page structure per use case: hero (name + description from `use_cases` row) → top 10 ranked resources via `best_for` join → "Why this is best for X" rationale per pick → "Try this prompt" inline playground for top picks where applicable.
- `/best-for` index lists all 12 with thumbnail descriptions.
- `best_for` rows populated from Ben's editorial seed bundle (top-3 picks per use case = 36 rows minimum).
- Schema-org `Product` + `ItemList` JSON-LD per page.
- After launch: community submission via `/submit` with `best-for` flag.

**Q3.5 — Stack Picker presets.** ACCEPTED with seed-bundle dependency note.
- 30 total presets under `@vch-curated` account.
- Top-6 above the fold in 2×3 grid, sorted by `adoption_count` (hand-picked at launch).
- "Browse all 30 →" expands within the picker modal (NOT a full-page route — keep picker flow contained).
- Each card: name, 3 most-prominent client logos, 3 stack-tag chips, adoption count.
- "Use this" one-click fills picker fields with preset values; user clicks Save or further edits.
- **Note:** preset stacks are part of Ben's editorial seed bundle. Build infrastructure that consumes them (`seed.json` schema includes a `presets[]` array with shape matching `user_stacks`). Ben provides data before Phase C.

**Q3.6 — Pro feature scope at launch.** ACCEPTED launch-with-3-live + transparency.
- **Live at Phase 1:** Pro deals unlocked (all $4M+), unlimited price alerts (uses existing `alerts` table), 6-way compare (app-layer enforces vs schema's 2-6 constraint).
- **"Plus, launching within 90 days:"** Hosted gateway, secrets vault, author tools, advanced analytics, public read-only API. Shown on upgrade modal as value-led copy.
- `/pricing` page lists all features with explicit "Live" / "Coming Q3 2026" badges. No bait-and-switch.
- 14-day free trial (card-required, per Q1.5) absorbs "is this worth $99?" hesitation.
- 14-day money-back guarantee copy on pricing page.
- **Do NOT defer Pro to Phase 2.** Payment infrastructure needs real-world validation; even 10 conversions in month 1 proves the model.

---

## Phase A close

All BLOCKER and IMPORTANT items resolved across 3 batches (20 questions). Spec contradictions between data-sourcing.md (pre-pivot) and build prompt (post-pivot) reconciled — build prompt wins on workers/jobs/pricing-source; data-sourcing wins on ingestion roster + source-specific details. Ready for Phase B.
