# ASSUMPTIONS.md
*Defaults Claude is proceeding with that Ben implicitly agreed to (or that haven't been asked yet but follow naturally from the specs).*

## Foundation

- **Repo layout:** Single repo at root (not `apps/web`). No monorepo tool. `pnpm` workspaces unused. ✓ CONFIRMED Q1.6.
- **Branch strategy:** Trunk-based on `main`. Feature branches for vertical slices, squash merge. No required reviewers. CI: typecheck + lint + build + test on every push; Vercel preview on PR; production deploy on `main`. ✓ CONFIRMED Q1.6.
- **Commit format:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, with optional scope `feat(models): ...`). Enables auto-changelog. ✓ ADDED Q1.6.
- **Node:** v22 LTS. pnpm v9. Next.js 15 strict TS.
- **i18n:** English-only launch, architecture-ready (no hardcoded strings, all dates via `Intl`, all currency via `Intl.NumberFormat`).
- **Browser support:** Chrome / Safari / Firefox / Edge latest two versions; iOS Safari 16+; Android Chrome latest. Will confirm.
- **Responsive breakpoints:** 375 / 414 / 768 / 1024 / 1440 / 1920 — all launch-day per design-prompt §26.
- **Performance budgets:** LCP <2.5s, CLS <0.1, TBT <200ms, route bundle <200KB gzipped, Lighthouse perf ≥90 on key routes, a11y ≥95.
- **WCAG AA** floor; AAA on body copy (per design-prompt §2 accessibility).

## Stack (from build-prompt, locked unless contradicted)

- **Workers/jobs:** GitHub Actions cron (5-min minimum granularity) + Supabase pg_cron + Supabase Edge Functions only. No Trigger.dev / Inngest / Upstash Redis. ✓ CONFIRMED Q1.2. 30-min RSS cadence degrades to 60-min on GHA → KNOWN_ISSUES.
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 dim, matches schema). Edge Function generates on resource insert/update. $50/mo cap. ✓ CONFIRMED Q1.3. Cmd-K + `/search` ship tsvector-first with embedding-augmented overlay; can fall back to tsvector-only if quality is bad.
- **Vector index:** ivfflat with lists=100 (as defined in schema.sql). Build-prompt's HNSW guidance loses to "do not modify schema" rule.
- **Auth:** Supabase Auth, GitHub OAuth primary, Google OAuth secondary (per design-prompt §20).
- **Payments:** Stripe Checkout + Stripe Customer Portal (hosted billing UI, no custom). Test mode for local + preview, live for production only. ✓ CONFIRMED Q1.5.
  - $99/yr only at launch. No monthly tier.
  - **14-day free trial**, card-required upfront. Stripe-native.
  - 7-day failed-renewal grace, then downgrade to Free.
  - Bookmarks + stacks retained after downgrade. Pro features lock; Free-tier access continues.
- **Email:** Resend with two sender identities — `notify@vibecoderhub.com` (transactional) + `news@vibecoderhub.com` (marketing). React Email templates server-rendered. Plain-text fallback. One-click unsubscribe in marketing. Bounce/complaint via Resend webhooks. Will need DNS access — surface in Batch 6.
- **Observability:** Sentry (build-prompt). Free tier. Source maps uploaded. Release tagging tied to deploys.
- **Analytics:** **PostHog** (free tier, 1M events/mo). ✓ CONFIRMED Q2.7. Cookie consent banner required (GDPR). Page views auto-tracked. Custom events: signup, signin, bookmark, install-clicked, pro-upgrade, comparison-opened, stack-adopted, deal-claimed, guide-completed. Session replay enabled for first 90 days post-launch (then evaluate). Feature flags available for A/B testing. PostHog detail page on the directory shows our actual dashboard screenshot (eat-own-dog-food).
- **Storage:** Supabase Storage (buckets per schema.sql §19) + Cloudflare R2 for raw ingestion dumps + image originals. Avatars resized to 256/512/1024 server-side via Sharp on upload.
- **Image moderation (split policy ✓ CONFIRMED Q2.8):**
  - **Showcase screenshots** — pre-publish moderation. Upload → private `submissions-temp/` bucket → row in `submissions` with `type_slug='showcase'` → admin reviews at `/admin/moderation` → on approval, image moved to public `showcase-screenshots/` and resource `status='published'`.
  - **Avatars** — published immediately + reactive flagging. Upload Edge Function calls Replicate NSFW classifier first (~$0.001/img); on pass, resize via Sharp to 256/512/1024, store in public `avatars/` bucket. "Report" button on every avatar surface for users to flag → flagged avatars surface in admin queue. Helper: `lib/moderation/nsfw-check.ts`.
- **Logging:** Pino. Three transports: pretty console (dev), Vercel logs (prod), Sentry (errors). PII scrubbing — never log raw email/tokens/Stripe IDs. Request-ID UUID propagation.
- **Rate limiting:** Sliding-window-in-Postgres helper (no Upstash). Per-IP on auth/submit/public-API; per-user on review/comment/bookmark (lenient).
- **Validation:** Zod for every input. next-safe-action for typed Server Actions.

## Design tokens (Promptkit visual + build-prompt structural — to be reconciled in Phase B)

- **Colors:** Canvas Black `#131313` page bg, Surface Slate `#2d2d2d` cards-2, Mint `#3cffd0` primary accent, Ultraviolet `#5200ff` secondary, Yellow `#f5e642` / Pink `#ff3cac` / Orange `#ff6b35` / Blue `#1e6efa` tile accents.
- **Fonts:** Bebas Neue (display), DM Sans (UI/body), Space Mono (mono/caps/labels). Three only. Loaded via `next/font` with `display: swap`.
- **Spacing:** 4px base — 0/1/2/3/4/5/6/8/10/12/16/20/24 scale. Promptkit's off-grid values (5, 9, 14, 15, 25) absorbed into nearest grid value or documented.
- **Button heights:** 5 locked — xs 24 / sm 32 / md 40 (default) / lg 48 / xl 56.
- **Input heights:** 3 locked — sm 32 / md 40 (default) / lg 48 — must align with adjacent button heights.
- **Radii:** 5 slots — none 0 / sm 4 / md 8 / lg 12 / xl 16 / full 9999 — but Promptkit's vocabulary differs (input 2, image 4, tile 20, feature 24, promo 30, pill 40). Reconciliation in Phase B.
- **Z-index:** 8-tier scale 0/10/20/30/40/50/60/70.
- **Animation:** durations 100/150/300ms. Easings: out (enter), in (exit), in-out (transition). Respect `prefers-reduced-motion`.
- **Page padding:** 16/24/32px responsive.
- **Vertical rhythm:** 48px between major sections, 24px subsections, 16px between cards.

## Tier model & paywalls (locked from design-prompt §24 + schema.sql `subscription_tier` enum)

- **Free** — browse, Cmd-K, 5 bookmarks, 1 collection, 1 stack, public deals, news, basic guides, 10 playground calls/day per IP, weekly digest signup.
- **Member** (free + signup) — unlimited bookmarks/collections, 5 stacks, member deals, submit, reviews/comments, 10 alerts, BYO key for unlimited playground, save searches, fork.
- **Pro** ($99/year) — all Pro deals ($4M+), unlimited alerts, gateway access (Phase 2+), secrets vault (Phase 2+), author tools, 6-resource compare, read-only API.
- **Pricing:** $99/year only at launch. Stripe Checkout creates the subscription. 14-day money-back guarantee per design-prompt §24.
- **Paywall pattern:** Pro features show 🔒 badge + value-led upgrade modal (computes ROI). Locked deals use blur with 1-2px of underlying content visible — "window not wall" per design-prompt §16.

## Schema — canonical, unmodified

- **`vibe-coder-hub-schema.sql` runs as-is.** No modifications without explicit approval per build-prompt.
- Drizzle schema generated to mirror the SQL exactly; Supabase connection pooler used for app queries; direct connection only for migrations.
- Storage buckets created via Supabase dashboard per schema §19 comment.
- Spec-vs-schema gaps (tables in final.md not in schema.sql — `playgrounds`, `model_tips`, `mcp_tools_introspected`, `alternatives`, `model_quantizations`, etc.) get **resolved by either deferring the dependent feature or asking for explicit schema approval**. No silent table creation. Will surface in Q1.1.

## Master plan — Phase 0 + Phase 1 scope

- **Phase 0:** infra (Supabase Pro, GitHub repo, Vercel, R2, Resend, Sentry, analytics) + auth + minimum data model + brand/design system + 7 ingestion sources + GHA workflows + editorial seed (4 AGENT.md personalities + 10 guides + first newsletter).
- **Phase 1 Week 1:** /resources, /models, /mcps indexes; generic detail rendering for components/MCPs/models; OpenRouter+LMArena Elo; tsvector search; 2 more ingestion sources.
- **Phase 1 Week 2:** /skills /subagents /rules /plugins /commands /hooks indexes; detail pages for top 6 types; Stack Picker modal; user_stack mgmt; 2 more sources.
- **Phase 1 Week 3:** /news /deals /guides /showcase indexes; bookmarks/collections; 2 more sources.
- **Phase 1 Week 4:** /best-for SEO pages (top 12 use-cases); /compare drawer; "Adopt this stack" mechanic; Stripe Pro upgrade; settings/dashboard; /firehose endpoint stub; auto-Pulse newsletter; public roadmap.

## Editorial seed — Ben's responsibility (CONFIRMED in pre-empt)

Ben produces these **outside Cowork**, attaches as a single editorial-seed bundle when ready:
- 4 AGENT.md personality files (Workflow Author, News Editor, Guide Writer, Reviewer/QA).
- 10 evergreen guides.
- First newsletter issue (sets the voice).
- 30 curated stack presets under `@vch-curated` account.
- 50 RSS feed URLs for news ingestion (Ben provides list).

My responsibility: build the **infrastructure that consumes** the bundle —
- `seed.json` schema for stacks + `pnpm seed` script that ingests it.
- Guide markdown ingestion pipeline (markdown frontmatter → `guides` + `guide_steps` rows).
- AGENT.md → news-editor wiring (which agent personality assigns to which auto-draft kind).
- Newsletter React Email template + Resend send + `newsletter_issues` log.
- RSS-feed-list config file + ingestion script reading it.

## Schema-modifications policy (CONFIRMED Q1.1)

For any spec-vs-schema gap encountered during build:
1. First try: scope-down to what schema supports (e.g., use jsonb columns creatively, repurpose existing tables like `prompting_tips` for non-prompt resources).
2. If not feasible: defer the dependent feature to Phase 2, log to `KNOWN_ISSUES.md`.
3. Never silently create new tables.
4. Schema modifications require explicit Ben approval; surface with `🛑 STOPPING` format.

**Already deferred to Phase 2:**
- Live Sandpack playgrounds (Sandpack iframe + security).
- MCP live tool invocation (WebSocket proxy + sandboxing).
- Open-weights hardware sizing block.
- Gateway tables exist but feature lives in Phase 2+.

**Already scoped-down for Phase 1:**
- MCP Tool Inspector is **read-only** — parses tools/resources/prompts from `mcps.tools` jsonb, no execution.
- Alternatives use existing `resource_alternatives` table (not the final.md `alternatives` table).
- Model tips use existing `prompting_tips` table (not the final.md `model_tips` table).

## Ingestion specifics

- Each script in `/scripts/ingest/{source}.ts` with shared helpers in `/scripts/ingest/_shared/`.
- Idempotent — upsert on `source_url` natural key.
- Logs to `ingestion_runs` table (assumed to exist in seed data — confirm in batch).
- Exponential backoff on upstream errors. Rate-limit-aware.
- `workflow_dispatch` manual trigger + cron schedule per source.
- `pnpm seed` populates 200-resource baseline from checked-in `seed.json` for local dev (no waiting for ingestion).
- `pnpm reset` drops + re-runs migration + re-seeds.

## Test scope (from build-prompt)

- Vitest unit for `lib/` utilities, Drizzle queries, Zod schemas, business logic.
- Vitest integration for Server Actions, API routes.
- Playwright E2E for the 5 critical flows: signup, sign-in, bookmark, build-stack, Pro checkout (test mode).
- Coverage target: ~60–70% in `lib/`, 100% of the 5 Playwright flows.

## Legal pages

- Privacy + ToS templated v1 (Termly export or Vercel template). Logged in `KNOWN_ISSUES.md` as "lawyer-review-required-before-public-launch".

## Account lifecycle (CONFIRMED Q3.1)

- Soft-delete pattern with PII scrub on user-initiated delete. 30-day reversal window. Nightly pg_cron hard-deletes after 30 days via `auth.admin.deleteUser()`.
- Submitted resources retained public with `author_id = NULL`; `author_handle` denormalised attribution preserved.
- Reviews + comments retained, author shows "[deleted user]".
- Stripe subscription auto-cancelled on delete (refund pro-rated remaining trial / period via Stripe dashboard if requested).
- GDPR data export: Phase 1 ships request endpoint + confirmation email; actual export job is Phase 1 stretch — fall back to manual fulfillment within 30 days, logged in KNOWN_ISSUES.

## OG image strategy (CONFIRMED Q3.2)

- Dynamic generation via Next.js `opengraph-image.tsx` per route group.
- 1200×630 standard, Promptkit tokens (Canvas Black bg, mint accent, Bebas Neue title, DM Sans subtitle, Space Mono labels).
- Edge-cached after first hit.
- Per-type variants: model, mcp, component, generic-resource, news, deals, guides, showcase.

## Performance budgets (CONFIRMED Q3.3)

- Default routes: LCP <2.5s on simulated 4G, CLS <0.1, TBT <200ms, route bundle <200KB gzipped, Lighthouse perf ≥90, a11y ≥95.
- Model detail page exception: <300KB gzipped allowed; above-the-fold under 200KB; below-the-fold blocks (Developer Reference, Timeline, Sources & Methodology) lazy-loaded via `dynamic(() => …, { ssr: false })`.
- Cmd-K perceived open <100ms (skeleton immediate).
- All images use `next/image` with explicit dimensions + `priority` flag on above-the-fold; OG images excluded.
- Lighthouse audit gates Phase D Pass 4 on: `/`, `/models`, `/models/[slug]`, `/mcps`, `/components`. Other routes audited but not gate-blocking.

## /best-for SEO surface (CONFIRMED Q3.4)

- Ship 12 use-case pages from schema seed verbatim.
- Page structure: hero (name + description) → top-10 ranked resources via `best_for` join → "Why this is best for X" rationale per pick → "Try this prompt" inline playground for top picks.
- Schema-org `Product` + `ItemList` JSON-LD per page.
- Editorial seed bundle (Ben) populates `best_for` rows for top-3 picks per use case (36 rows minimum).
- After-launch: community submissions via `/submit` with `best-for` flag.

## Stack Picker presets (CONFIRMED Q3.5)

- 30 total presets under `@vch-curated`.
- Top-6 above the fold in 2×3 grid, sorted by `adoption_count`. "Browse all 30 →" expands within picker modal (not full-page route).
- Each card: name, 3 client logos, 3 stack-tag chips, adoption count.
- One-click "Use this" fills picker fields; user saves or further edits.
- Editorial seed `seed.json` includes `presets[]` array shape matching `user_stacks`.

## Pro feature scope at Phase 1 launch (CONFIRMED Q3.6)

**Live at launch (3 features):**
- All Pro deals unlocked
- Unlimited price alerts
- 6-way compare (app-layer enforces vs schema's 2-6 constraint)

**Coming-soon copy on upgrade modal + `/pricing` page (5 features):**
- Hosted gateway (Phase 2)
- Hosted secrets vault (Phase 2)
- Author tools dashboard (Phase 2)
- Advanced analytics on submitted resources (Phase 2)
- Public read-only JSON API (Phase 2; RSS launches Phase 1)

`/pricing` page surfaces explicit "Live" / "Coming Q3 2026" badges per feature. 14-day free trial (card-required) + 14-day money-back guarantee on pricing page.
