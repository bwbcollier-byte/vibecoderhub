# RISK_REGISTER.md

*Phase B artifact 8 (build-prompt B8). Risks ranked by likelihood × impact. Each carries a documented mitigation and a trigger that activates the mitigation.*

> **Format per risk:**
> - **Likelihood** L / M / H
> - **Impact** L / M / H
> - **Score** L×I (used for ranking; L=1, M=2, H=3)
> - **Mitigation** what we do upfront
> - **Trigger** when we actively respond
> - **Owner** who handles it

> **Sort order:** descending by score; ties broken by impact descending.

---

## §1 Risk catalogue

### R1 — Phase C timeline overrun (30 slices vs 4-week master plan)
- **Likelihood:** H
- **Impact:** H
- **Score:** 9
- **Description:** `PHASE_0_1_CHECKLIST.md` §4 estimates ~6-8 weeks at solo pace; master plan targets 4 weeks for Phase 1. Critical path is ~5 weeks. Solo dev + 30 slices + multi-session reality means real risk of slipping launch.
- **Mitigation:**
  - Critical-path discipline: 8 critical-path slices identified in `DEPENDENCY_GRAPH.md` §7; everything else is buffer.
  - Vertical-slice protocol: each slice ships a working user feature, so partial completion still yields a launchable product.
  - Per-slice quality gates prevent rework; debt doesn't accumulate.
  - Multi-session checkpoint discipline via `SESSION_HANDOFF.md` — sessions end clean, restart fast.
- **Trigger:** Any slice exceeds 3× its estimate (build-prompt's stop condition); pause + replan.
- **Owner:** Ben + Claude (this session's framing).

### R2 — Schema-vs-spec drift causing scope creep
- **Likelihood:** M
- **Impact:** H
- **Score:** 6
- **Description:** Final.md and detail-pages.md describe ~15 tables that don't exist in canonical `schema.sql`. Phase C will encounter these gaps mid-slice; the temptation is to "just add a small table" — which violates Q1.1's lock and starts compounding scope.
- **Mitigation:**
  - Q1.1 default rule locked: scope-down or defer; no schema mods without `🛑 STOPPING`.
  - Operational carve-out (Q1.1 + Flag 1 ruling) cleanly separated from resource-model mods — `rate_limit_buckets`, `ingestion_runs` already approved.
  - DoD §15 requires `BUILD_LOG.md` documentation for every Phase 2 deferral.
  - `KNOWN_ISSUES.md` is the catalog; reviewed at each session-end.
- **Trigger:** Phase C slice encounters a feature that doesn't fit the schema; surface via `🛑 STOPPING`.
- **Owner:** Claude (raises); Ben (rules).

### R3 — Ingestion source breakage cascading to data quality
- **Likelihood:** H
- **Impact:** M
- **Score:** 6
- **Description:** APIs change, sites add rate limits, scrapers fail. Per master plan §risk register: high likelihood. With 13 sources in Phase 0+1, expected breakage rate is ~1 source per month.
- **Mitigation:**
  - Per-source `priority` enum (Q2.1) — `critical` sources monitored most aggressively.
  - GHA Slack alerts on `status='failed'`.
  - "Source: stale" badge on resource detail pages when `priority='critical'` source goes >24h without success (data-sourcing §19).
  - Each source has fallback path (e.g., MCP Registry can degrade to Smithery + Glama; OpenRouter can degrade to per-provider polls).
  - Dedup logic preserves data integrity even if sources double-publish.
  - R2 raw-dump archive enables re-processing of historical data if a parser breaks.
- **Trigger:** Slack alert fires OR `ingestion_runs` shows 3 consecutive failures from same source.
- **Owner:** Ben (admin) — ~1 hr/week budgeted for ingestion maintenance.

### R4 — OpenAI cost overrun (embeddings)
- **Likelihood:** L
- **Impact:** M
- **Score:** 2 (low likelihood)
- **Description:** Embeddings cost ~$0.02/1M tokens; 60K resources × ~500 tokens each = 30M tokens = $0.60 one-time. Re-embedding on update could 2-3x. Q1.3 budget cap: $50/mo. Risk: ingestion bug re-embeds everything daily.
- **Mitigation:**
  - $50/mo budget cap as alert threshold (Q1.3).
  - Edge Function only generates embedding when `embedding IS NULL OR updated_at > embedding_generated_at`.
  - Idempotency check: if `name + tagline + description` hash hasn't changed, skip re-embedding.
  - Daily cost dashboard in PostHog (custom event `openai_cost_logged`).
- **Trigger:** OpenAI usage dashboard shows $30+ in any month → audit ingestion logs for re-embedding loops.
- **Owner:** Ben (cost monitoring).

### R5 — Stripe webhook failure handling gap
- **Likelihood:** M
- **Impact:** H
- **Score:** 6
- **Description:** Webhook delivery is best-effort; if our endpoint is down or returns 5xx, Stripe retries with exponential backoff but eventually gives up. Missing a `customer.subscription.deleted` event = Pro user keeps Pro access forever.
- **Mitigation:**
  - Stripe webhook handler idempotent (uses Stripe event ID for dedup) — replays don't break.
  - On every Pro-feature access, server-side double-check `subscription_expires_at` from DB; if past, treat as Free regardless of `subscription_tier` value.
  - Sentry captures all webhook handler errors.
  - Pg_cron job (daily) reconciles: queries Stripe API for all active subscriptions, compares to `profiles.subscription_tier='pro'`, fixes drift.
  - Stripe dashboard's "Failed webhooks" panel monitored weekly.
- **Trigger:** Any webhook returns 5xx → immediate Sentry alert; reconciliation job catches drift within 24h.
- **Owner:** Ben (Stripe dashboard); Claude (handler implementation).

### R6 — Performance budget violations on model detail page
- **Likelihood:** M
- **Impact:** M
- **Score:** 4
- **Description:** Model detail page is 22 blocks; Recharts + Shiki + multiple data fetches push toward bundle bloat. Q3.3 grants 300KB exception (vs 200KB default), but easy to exceed.
- **Mitigation:**
  - Below-the-fold blocks lazy-loaded via `dynamic({ ssr: false })` — Developer Reference, Timeline, Sources & Methodology.
  - Recharts loaded via dynamic import only when chart-containing block is visible (IntersectionObserver).
  - Shiki uses lightweight bundle (only the languages we actually highlight: ts, tsx, js, jsx, py, go, rust, bash, json, yaml).
  - Bundle audit script (`pnpm audit:bundle`) runs in CI; build fails if any route exceeds budget.
  - Lighthouse perf audit nightly via `.github/workflows/lighthouse.yml` on the audit list.
- **Trigger:** Bundle size CI check fails OR Lighthouse perf <85 on `/models/[slug]`.
- **Owner:** Claude (during Phase C build); Ben (post-launch monitoring).

### R7 — Editorial seed bundle delivery delay
- **Likelihood:** M
- **Impact:** M
- **Score:** 4
- **Description:** Ben writes 4 AGENT.md + 10 guides + 30 stack presets + first newsletter + 50 RSS sources + 36 best_for rows + benchmark snapshot outside Cowork. Delay means sparse launch content.
- **Mitigation:**
  - Build infrastructure that consumes the bundle FIRST (Phase 1 work). Empty consumer is fine; populated consumer ships when bundle lands.
  - Each consumer has a documented seed.json schema (in `editorial-seed/README.md`) so Ben knows the exact shape.
  - Phase 1 launch can technically ship with placeholder content (3-6 stack presets, 3-5 guides, default Pulse-only news, no `best_for` rows) and backfill within 30 days. Not ideal but launchable.
- **Trigger:** Bundle not delivered by end of slice 19 (Adopt-this-stack) → re-plan with placeholder content.
- **Owner:** Ben.

### R8 — Single-developer continuity / burnout
- **Likelihood:** H
- **Impact:** H
- **Score:** 9
- **Description:** Master plan §risk register flags this as high. Phase 1 is 4-8 weeks of focused work; solo dev is high-burn. Sessions span weeks; loss of context risks rework.
- **Mitigation:**
  - `SESSION_HANDOFF.md` discipline — every session ends with clean baton; resumption in <5 min.
  - `BUILD_LOG.md` continuity — every decision logged.
  - `ASSUMPTIONS.md` traceability — every default re-checkable.
  - Quarterly weeks off built into master plan §hiring milestones.
  - Hiring milestone: month 3 part-time editorial reviewer ($1-2K/mo) reduces editorial burden.
- **Trigger:** Two consecutive sessions miss their slice estimates by >2× → flag in `BUILD_LOG.md` + reduce next session scope.
- **Owner:** Ben.

### R9 — Slow Pro conversion (revenue model unproven)
- **Likelihood:** M
- **Impact:** H
- **Score:** 6
- **Description:** Per master plan: medium likelihood. Phase 1 success criterion is "first 10 Pro subscribers" — modest, but conversion from visitor → Pro is unknown.
- **Mitigation:**
  - 14-day free trial (Q1.5) absorbs hesitation.
  - Multi-stream revenue (sponsors, affiliate, Member-tier deals) reduces reliance on Pro alone.
  - Pricing test in month 3 (per master plan).
  - PostHog funnel tracking from /pricing visit → /signup → trial-start → trial-end → conversion.
  - "Plus, coming soon:" framing on /pricing keeps trial-quality high (don't oversell what's coming).
- **Trigger:** <5 Pro conversions by end of month 1 → analyze funnel + iterate value prop.
- **Owner:** Ben.

### R10 — Competitor moves (Cursor.directory, Smithery expand into our space)
- **Likelihood:** H
- **Impact:** H
- **Score:** 9
- **Description:** Per master plan §risk register: high likelihood. Cursor.directory or Smithery could add cross-type indexing, real telemetry, or deals — eroding our differentiation.
- **Mitigation:**
  - Move faster (Phase C cadence prioritised).
  - Build moats: gateway (Phase 2), original research (Phase 3), CLI (Phase 3), standards (Phase 4-5).
  - Cross-product graph as defensible architecture (24 types under one roof; competitors can't quickly catch up on breadth).
  - Acquisition optionality (per master plan).
- **Trigger:** Competitor announces a feature overlap → assess + accelerate roadmap or pivot differentiator.
- **Owner:** Ben.

### R11 — Browser support gaps (especially Safari iOS for SSE)
- **Likelihood:** L
- **Impact:** M
- **Score:** 2 (low likelihood)
- **Description:** SSE works in Safari iOS but with quirks (timeouts more aggressive). `/api/firehose` may need polling fallback for these clients.
- **Mitigation:**
  - Polling fallback at `/api/firehose?since=` ships Phase 1 (per Q2.4) — Safari iOS clients can use this.
  - Auto-detect via User-Agent and prefer polling on Safari iOS.
  - Browser support matrix tested in Phase D Pass 5 (user journey).
- **Trigger:** Phase D Pass 5 finds /firehose broken on Safari iOS → enable polling auto-detect.
- **Owner:** Claude (Phase C).

### R12 — RLS policy gap (per-user data leakage)
- **Likelihood:** L
- **Impact:** H
- **Score:** 3
- **Description:** Schema's RLS policies are comprehensive but a missed policy on a new operational table (e.g., `rate_limit_buckets`) could leak data. Every operational addition under the carve-out needs RLS too.
- **Mitigation:**
  - `rate_limit_buckets` and `ingestion_runs` already have RLS (deny-by-default; service-role bypasses).
  - Phase D Pass 5 includes RLS-bypass test: log in as User A, attempt to query User B's data via every Server Action.
  - ESLint rule: `lib/server/db-service.ts` (service-role client) imported only inside files with `'admin-only'` directive comment.
- **Trigger:** Any RLS-bypass found in Phase D → block merge until policy added.
- **Owner:** Claude (during Phase C); Phase D pass.

### R13 — PostHog session replay storage cost
- **Likelihood:** L
- **Impact:** M
- **Score:** 2
- **Description:** Q2.7 enables session replay for first 90 days. Free tier covers 5K replays/mo. Spike in traffic could exceed free tier (~$0.005/replay above).
- **Mitigation:**
  - Sample replay at 10% of sessions (PostHog setting).
  - Mask all inputs (`maskAllInputs: true`) — reduces stored bytes.
  - Disable replay after 90 days unless we explicitly extend.
  - Monitor PostHog usage dashboard weekly.
- **Trigger:** PostHog billing alert threshold ($30/mo) → reduce replay sample rate.
- **Owner:** Ben (PostHog dashboard).

### R14 — Image moderation false positives (NSFW classifier blocks legit avatars)
- **Likelihood:** M
- **Impact:** L
- **Score:** 2
- **Description:** Replicate's NSFW model (~95% accuracy) could block ~5% of legitimate avatars (e.g., gym selfies, art photography). User experience suffers.
- **Mitigation:**
  - Failure UX is graceful: "We couldn't verify this image — try another, or contact support" + ticket queue for manual review.
  - Confidence threshold tunable (start at 0.85; lower if too many false positives).
  - Manual review backlog in admin queue.
- **Trigger:** >10 manual review tickets in any week → tune threshold or swap classifier.
- **Owner:** Ben (admin queue).

### R15 — Domain DNS misconfiguration breaks email deliverability
- **Likelihood:** L
- **Impact:** H
- **Score:** 3
- **Description:** SPF/DKIM/DMARC misconfigured → emails go to spam → trial-conversion + alerts + welcome flows broken.
- **Mitigation:**
  - DNS verification step in MIGRATION_ORDER §8.
  - Resend dashboard health check before sending first newsletter.
  - mail-tester.com check on every transactional template.
  - DMARC report monitoring (`rua=mailto:dmarc@vibecoderhub.com`).
- **Trigger:** First batch send shows >10% to-spam rate → audit DNS + Resend domain status.
- **Owner:** Ben (DNS + Resend setup).

### R16 — Stale data badges undermining credibility
- **Likelihood:** M
- **Impact:** M
- **Score:** 4
- **Description:** Data-sourcing §25: "Never ship a data source without an `updated_at` and a publicly-visible 'as of' timestamp on the front-end." If ingestion lags, every model/MCP/component card shows "stale" — users lose trust.
- **Mitigation:**
  - "Source: stale" badge only fires when `priority='critical'` source >24h stale.
  - Most ingestion runs daily — staleness is rare unless multiple sources break simultaneously.
  - Slack alert on first failure means we know within minutes, not days.
  - Editorial fallback: manual data entry for top 12 models is comparatively quick (1-hour task).
- **Trigger:** ≥3 critical sources stale simultaneously → emergency manual update.
- **Owner:** Ben.

### R17 — Tabs as URL hashes hurt SEO for long-tail queries
- **Likelihood:** L
- **Impact:** M
- **Score:** 2
- **Description:** "claude opus install" might rank better as `/models/claude-opus-4-7/install` (its own URL) than `/models/claude-opus-4-7#install`. Phase 1 ships hashes; if SEO data argues for nested routes post-launch, conversion is required.
- **Mitigation:**
  - Conversion is non-breaking (per Ben's note + my response): old `#install` continues to anchor; new `/install` becomes canonical via 301.
  - Single `setActiveTab(tab)` function abstracts the hash mechanic — refactor is one function, not per-page.
  - Phase D Pass 4 includes SEO check: tabs-as-hash JSON-LD + canonical URL inspection.
- **Trigger:** 3+ months post-launch, Search Console shows long-tail "claude opus install"-style queries underperforming → A/B test nested-route version.
- **Owner:** Ben (SEO monitoring) + Claude (refactor if triggered).

### R18 — Free-tier cap (5 bookmarks) frustrates users into churn
- **Likelihood:** M
- **Impact:** L
- **Score:** 2
- **Description:** Free tier caps bookmarks at 5; users hitting it might bounce rather than upgrade to Member (which is also free, but requires signup).
- **Mitigation:**
  - "Upgrade to Member (free with signup) for unlimited bookmarks" toast is the prompt — clear that signup is free.
  - Cap is intentional — converts anonymous → Member, which is the funnel.
  - Member-tier features (collections, alerts, deal access) reinforce the value of signing up.
- **Trigger:** PostHog funnel shows >50% drop-off at 5-bookmark cap → reconsider cap or improve upgrade copy.
- **Owner:** Ben.

### R19 — Vendor dependence (Anthropic, Cursor, etc. push back on coverage)
- **Likelihood:** L
- **Impact:** L
- **Score:** 1
- **Description:** Per master plan §risk: low likelihood. Major vendors usually engage positively with independent directories.
- **Mitigation:**
  - Editorial independence — never accept vendor pay-for-placement.
  - Attribution + fact-checking — every claim sourced.
  - Build relationships before they're needed (master plan Phase 2-3 partner outreach).
- **Trigger:** Vendor sends formal complaint → engage diplomatically + correct any factual errors.
- **Owner:** Ben.

### R20 — Conference fails / loses money year 1
- **Likelihood:** M
- **Impact:** M
- **Score:** 4 (but Phase 5+ — out of Phase 0+1 scope)
- **Description:** Per master plan §risk. Out of Phase 1 scope; flagged for tracking.
- **Mitigation:** Virtual format Year 1 per master plan; "first annual" framing.
- **Trigger:** Phase 5 — assess closer to event date.
- **Owner:** Ben.

---

## §2 Risk dashboard summary

| ID | Risk | Likelihood | Impact | Score | Phase relevance |
|---|---|---|---|---|---|
| R1 | Phase C timeline overrun | H | H | 9 | Phase C (active) |
| R8 | Single-dev burnout | H | H | 9 | Phase C onward |
| R10 | Competitor moves | H | H | 9 | Always |
| R2 | Schema-vs-spec drift scope creep | M | H | 6 | Phase C |
| R3 | Ingestion source breakage | H | M | 6 | Phase 0 onward |
| R5 | Stripe webhook failure | M | H | 6 | Phase 1 launch |
| R9 | Slow Pro conversion | M | H | 6 | Phase 1 launch onward |
| R6 | Performance budget violations | M | M | 4 | Phase C |
| R7 | Editorial seed delivery delay | M | M | 4 | Phase 1 launch |
| R16 | Stale data undermines credibility | M | M | 4 | Phase 1 onward |
| R20 | Conference fails | M | M | 4 | Phase 5 (out of scope) |
| R12 | RLS policy gap | L | H | 3 | Phase D |
| R15 | DNS misconfig breaks email | L | H | 3 | Phase 1 launch |
| R4 | OpenAI cost overrun | L | M | 2 | Phase 0 onward |
| R11 | Safari iOS SSE quirks | L | M | 2 | Phase D |
| R13 | PostHog replay cost | L | M | 2 | Phase 1 onward |
| R14 | NSFW false positives | M | L | 2 | Phase 1 onward |
| R17 | Hash-tabs SEO underperformance | L | M | 2 | Post-launch |
| R18 | Free-tier cap churn | M | L | 2 | Phase 1 onward |
| R19 | Vendor pushback | L | L | 1 | Always |

**Top 3 active risks for this build phase:** R1 (timeline), R8 (continuity), R10 (competitors). All three are mitigated via the build process itself (slice discipline, handoff continuity, faster execution).

---

## §3 Pre-mortem — what would make this build fail?

A pre-mortem visualises failure to prevent it. If, 6 months from now, this build is judged a failure, the most likely causes:

1. **Slice 20 (Pro upgrade) ships broken.** Stripe webhooks misfire, conversion tracking lies, refunds dispute → revenue model breaks. Mitigation: R5 covers; e2e Playwright test for full Stripe flow is non-negotiable.
2. **Ingestion never reaches 10K resources.** Sources break + editorial backlog grows → site looks empty. Mitigation: R3 + R7 cover; daily ingestion-runs check is in admin dashboard.
3. **Cmd-K is slow.** Embedding queries hang, results lag, users abandon search. Mitigation: 300ms timeout + tsvector-first hybrid + prefetch (Q2.5 amendment + Q1.3 fallback).
4. **Token system drifts in Phase C.** Despite TOKEN_RECONCILIATION.md, components creep in with magic numbers. Mitigation: ESLint rule (`no-restricted-syntax` regex) + `pnpm audit:tokens` script + Phase D Pass 1 grep audit.
5. **Phase D never happens.** Multi-session reality means sessions accumulate but the 5-pass review keeps sliding. Mitigation: SESSION_HANDOFF.md tracks pending Phase D as an explicit blocker; Phase C completion is gated on Phase D readiness.
6. **Privacy / PII leak.** Logs contain emails, Sentry breadcrumbs leak Stripe IDs, RLS policy missed on a new table. Mitigation: R12 + Pino redact config + Sentry beforeSend + manual privacy audit before launch.
7. **Schema modification drift.** Q1.1 carve-out gets stretched ("this is just a small operational thing too"). Mitigation: clear definition of "operational" in BUILD_LOG; only `rate_limit_buckets` + `ingestion_runs` qualify; anything else triggers `🛑 STOPPING`.

---

## §4 What this document gates

- Every Phase C slice surfaces relevant risks in `BUILD_LOG.md` as encountered.
- Phase D Pass 5 (user journey) explicitly walks the high-score risks (R1, R5, R8, R10, R12) for verification.
- Pre-launch readiness review checks that all H × H risks have active mitigations.
- Post-launch: this document is reviewed at end of Phase 1 (week 4) and updated with actual-vs-predicted outcomes.
