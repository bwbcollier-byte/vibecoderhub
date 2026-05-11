# DEPENDENCY_GRAPH.md

*Phase B artifact 5 (build-prompt B5). Which features block which. The build sequencing implication is captured in `PHASE_0_1_CHECKLIST.md`; this document is the cross-reference.*

---

## §1 The dependency graph (foundation-up)

```
                                  ┌──────────────────────┐
                                  │  External accounts    │ (Ben provides; per MIGRATION_ORDER §2.1)
                                  └──────────┬───────────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                  ┌───────────▼─────────┐       ┌───────────▼─────────┐
                  │  DB schema migrated  │       │  Vercel + GHA       │
                  │  + storage buckets   │       │  secrets configured │
                  │  + pg_cron jobs      │       └─────────────────────┘
                  └──────────┬───────────┘
                             │
                  ┌──────────▼───────────┐
                  │  lib/env.ts (Zod-    │
                  │  validated env)      │
                  └──────────┬───────────┘
                             │
        ┌────────────────────┼─────────────────────────┐
        │                    │                         │
┌───────▼──────────┐  ┌──────▼────────┐  ┌─────────────▼───────┐
│ Design tokens     │  │ Drizzle DB    │  │ Sentry + Pino       │
│ (TOKEN_RECON →    │  │ client +      │  │ + request-ID        │
│ lib/tokens.ts →   │  │ schema mirror │  │ middleware          │
│ tailwind config)  │  └──────┬────────┘  └─────────────────────┘
└───────┬──────────┘         │
        │                    │
        │           ┌────────▼─────────────┐
        │           │  Supabase Auth        │
        │           │  (client/server/      │
        │           │  middleware/is-admin) │
        │           └────────┬─────────────┘
        │                    │
        │           ┌────────▼─────────────┐
        │           │  Root providers       │
        │           │  (Theme + Stack +     │
        │           │  PostHog + Toaster +  │
        │           │  CookieBanner)        │
        │           └────────┬─────────────┘
        │                    │
        └─────┐    ┌─────────┘
              │    │
        ┌─────▼────▼─────────────────┐
        │  UI primitives              │  (button/input/card/dialog/drawer/
        │  (components/ui/*)          │   tabs/skeleton/toast/...)
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  Layout chrome              │  (Header/Footer/MobileNav/
        │  (components/layout/*)      │   StackBanner/Breadcrumb/SkipLink)
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  Route group layouts        │  (marketing/app/admin)
        │  + error boundaries         │  + empty states + error states
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  Action client + lib       │  (lib/actions/_client.ts; lib/queries/*;
        │  queries + format + i18n   │   lib/format/*; lib/i18n/*; lib/safe/*)
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  Foundation slice (F)       │  (/, /home, AuthModal, Stack Picker,
        │                             │   Cmd-K, /api/health, sitemap, robots, OG)
        └─────────────┬──────────────┘
                      │
                      │  At this point: full stack proven. Per-feature slices
                      │  follow per master plan; each consumes the above.
                      ▼
        ┌──────────────────────────────────────────────────────────────┐
        │  Per-feature slices (parallelisable in groups — see §5)      │
        └──────────────────────────────────────────────────────────────┘
```

---

## §2 Hard dependencies (must complete before)

A "hard dependency" means: starting the dependent slice without the prerequisite produces broken code, compile errors, or missing runtime infrastructure.

### Foundation-level hard dependencies

```
External accounts (§2.1 of MIGRATION_ORDER)
    └─ blocks → DB migration, env vars, all integrations

DB schema migrated
    └─ blocks → Drizzle client, all queries, all Server Actions
    └─ blocks → pg_cron jobs (which reference tables)
    └─ blocks → seed script

Storage buckets created
    └─ blocks → avatar upload, showcase upload, image moderation

lib/env.ts (Zod-validated)
    └─ blocks → every other module (everything imports validated env)
    └─ specifically blocks → lib/server/db, lib/server/stripe, lib/server/resend,
                             lib/server/openai, lib/server/replicate, lib/server/r2,
                             lib/auth/*, lib/logger, components/analytics/PostHogProvider

Design tokens (lib/tokens.ts + globals.css + tailwind.config.ts)
    └─ blocks → every component (UI primitives, layout, all per-page components)
    └─ blocks → all OG image generation (uses tokens for visual identity)

Drizzle client (lib/server/db.ts)
    └─ blocks → every Drizzle query
    └─ blocks → auth (looks up profiles row)
    └─ blocks → rate-limit helper (writes to rate_limit_buckets)

Supabase Auth wiring (lib/auth/*)
    └─ blocks → all Server Actions (action middleware checks auth)
    └─ blocks → middleware.ts (protected-path matcher)
    └─ blocks → all authenticated pages (dashboard, settings, submit, admin)
    └─ blocks → StackProvider (needs current user to hydrate stack)

Root providers (app/layout.tsx wiring Theme + Stack + PostHog + Toaster + CookieBanner)
    └─ blocks → every page (without root providers, components break)

UI primitives (components/ui/*)
    └─ blocks → every layout component
    └─ blocks → every per-page component

Layout chrome (Header/Footer/MobileNav)
    └─ blocks → every route group layout (which wraps pages in chrome)

Route group layouts ((marketing)/(app)/(admin))
    └─ blocks → every page within that group
    └─ blocks → error.tsx and not-found.tsx within that group

next-safe-action client (lib/actions/_client.ts)
    └─ blocks → every Server Action
    └─ blocks → every mutation form/button on the client

Foundation slice (F)
    └─ blocks → every per-feature slice (we don't start a feature slice until F is green)
```

### Feature-level hard dependencies

```
Auth working end-to-end
    └─ blocks → Bookmarks (per-user state)
    └─ blocks → Stacks (saving requires auth)
    └─ blocks → Submissions (requires author)
    └─ blocks → Reviews + Comments + Prompting Tips
    └─ blocks → Dashboard + Settings + /admin
    └─ blocks → Pro upgrade flow (Stripe customer creation)
    └─ blocks → Alerts (per-user)
    └─ blocks → Newsletter signup confirm (token tied to user)

Stack Picker
    └─ blocks → Home (logged-in version reshapes per stack)
    └─ blocks → "For your stack" feed
    └─ blocks → /alternatives/[slug] (filtered by user's stack)
    └─ blocks → /best-for/[slug] (filtered by user's stack)
    └─ blocks → Adopt-this-stack mechanic

Stripe wiring (lib/server/stripe.ts + /api/webhooks/stripe + actions/stripe/*)
    └─ blocks → Pro upgrade flow
    └─ blocks → Pro deal unlock
    └─ blocks → Settings → Billing
    └─ blocks → Customer Portal redirect

Resend wiring (lib/server/resend.ts + templates + /api/webhooks/resend)
    └─ blocks → Auth email verification
    └─ blocks → Newsletter confirm + send
    └─ blocks → Alert triggered notifications
    └─ blocks → Deal claimed confirmation
    └─ blocks → Submission approved/rejected notifications
    └─ blocks → Pro upgrade welcome + cancellation + failed-renewal

OpenAI embeddings pipeline
    └─ blocks → Semantic search in Cmd-K + /search
    └─ blocks → Real "smart" alternatives matching

PostHog analytics
    └─ blocks → Pro conversion tracking
    └─ blocks → Cohort analysis
    └─ blocks → Session replay (post-launch debugging)
    └─ blocks → Newsletter open/click tracking (via PostHog + Resend webhooks)

Ingestion pipeline (any source)
    └─ blocks → Real data on index pages (without ingestion, pages show seed data only)
    └─ blocks → Trending materialised view (which needs install_events to populate)
    └─ blocks → Cross-product graph (alternatives, works-well-with) — needs critical mass of resources

Resource detail chassis (components/resources/DetailChassis.tsx)
    └─ blocks → every type's [slug]/page.tsx (24 detail pages)

Resource card (components/resources/ResourceCard.tsx)
    └─ blocks → every index page
    └─ blocks → /search results
    └─ blocks → Cmd-K results
    └─ blocks → Compare drawer + compare full-page
```

---

## §3 Soft dependencies (better-to-do-first but not blocking)

A "soft dependency" means: the dependent slice can ship without the prerequisite, but the prerequisite makes it better (or enables an empty-state to populate with real content).

```
News auto-draft pipeline (fn_after_change_event)
    └─ improves → /news (without it, news is editorial-only and quiet)
    └─ improves → resource detail "News mentions" block

Real-world performance telemetry (gateway in Phase 2+)
    └─ improves → Model detail block 8 (currently empty-state "be the first")
    └─ improves → Tool detail real-world performance block

Editorial seed bundle (Ben's outside-Cowork work)
    └─ improves → /best-for/[slug] pages (without 36 best_for rows, pages are sparse)
    └─ improves → Stack Picker presets (without 30 presets, picker is barebones)
    └─ improves → /news (without first newsletter + voice, /news feels empty)
    └─ improves → 4 AGENT.md personalities (without them, auto-drafts have no voice)
    └─ improves → 50 RSS sources (without them, news has no inflow)
    └─ improves → 10 evergreen guides (without them, /guides is empty)
    └─ improves → top-12-models benchmark snapshot (without it, model pages show no benchmarks)

Cmd-K palette
    └─ improves → discovery from any page (without it, users navigate via menus)
    Phase 1 ships it; this is "improves" in the sense that it's an enhancement
    over the menu — but per build prompt, Cmd-K is mandatory for launch.
```

---

## §4 Cross-resource graph dependencies (the moat)

These dependencies are between resource types — building one type's detail page enables features on another type's detail page.

```
Models detail page completed
    └─ improves → MCP detail "Works with model X" badge
    └─ improves → Tool detail "Default model: X" link
    └─ improves → Starter detail "Pre-configured for model X" link
    └─ improves → /best-for/saas-mvp ranking calculations

MCPs detail page completed
    └─ improves → Model detail "Compatible MCPs" block
    └─ improves → Tool detail "MCPs that work" block
    └─ improves → Plugin detail "Bundled MCPs" list

Components detail page completed
    └─ improves → Starter detail "Uses these components" list
    └─ improves → Showcase detail "Built with these components"

Skills/Subagents/Rules/Hooks/Commands detail pages completed
    └─ improves → Plugin detail "Bundled X count" links
    └─ improves → Marketplace detail "Plugins available" grid
    └─ improves → Workflow detail "Step uses X" inline references

Workflow detail page completed
    └─ improves → Resource detail "Workflows that use this" block
    └─ improves → /best-for/[use-case] ranked workflow picks

Stacks (user-curated)
    └─ improves → Adopt-this-stack from any showcase
    └─ improves → Stack Picker presets (after launch, user-curated stacks become discoverable)
```

This is the "cross-product graph" referenced throughout the design-prompt + final.md. The order in which types ship matters: prioritise the types that enable the most cross-references first. See §6 below.

---

## §5 What can be parallelised

Once the foundation slice (F) is green, multiple slices can run in parallel without conflicting. Three parallel tracks for Phase 1:

### Track A — Core resource types (sequential within track, parallel across)

```
/models  →  /mcps  →  /components  →  /tools
```

These four are the "primary navigation" types per design-prompt §3. They should ship in order so each next one inherits the patterns the previous established. Cannot easily parallelise within this track (each uses lessons from the last).

### Track B — "Extension" type group (highly templated, can parallel-ship in batches)

```
[ /skills /rules /subagents /plugins /hooks /commands ]
```

All six use very similar detail pages (text content, fork button, install button, allowed tools, triggers). Build the **first one fully** (recommend `/skills`), extract the shared template into `components/resources/ExtensionResourceDetail.tsx`, then the other five are 1-day each.

```
[ /sandboxes /observability /backend /assets ]
```

Same pattern — these are "infra" types. Build one fully, extract template, others fast.

### Track C — Content surfaces (deals/news/guides)

```
/deals →  /news →  /guides →  /showcase
```

These are the 3 content-surfaces + showcase. Each is a standalone destination, independent of the 24 resource type detail pages — but consumes shared chrome (FilterSidebar, NewsCard, DealCard, GuideCard).

### Track D — Cross-cutting features (after at least one type's detail page is up)

```
Cmd-K palette (full, beyond foundation skeleton)
/search results page
/best-for/[slug] (12 pages)
/alternatives/[slug] (dynamic)
/compare drawer + full page
"Adopt this stack" mechanic
Bookmarks dashboard + collections
```

These layer on top of the detail pages. Can run in parallel with Track A/B once /models + /mcps + 2-3 extension types are detail-page-complete.

### Track E — Background / ingestion / ops (parallel with everything from day 1)

```
7 Phase-0 ingestion sources → 6 Phase-1 ingestion sources
GHA workflows (one per source)
pg_cron jobs (already registered in MIGRATION_ORDER §3.6)
Edge Functions (4 to deploy)
Stripe wiring + Pro upgrade
Resend wiring + email templates
PostHog event taxonomy
Newsletter weekly digest send
/admin pages
```

These don't conflict with frontend tracks. Whoever has time / context picks one. In a solo build, Ben juggles by priority.

---

## §6 Recommended slice order for Phase 1 (post-Foundation)

Synthesizing the above into a concrete sequence:

```
Slice 1:  /models index + /models/[slug] detail (Track A, primary nav)
Slice 2:  /mcps index + /mcps/[slug] detail + Tool Inspector (read-only) (Track A)
Slice 3:  /components index + /components/[slug] detail (Track A)
Slice 4:  Cmd-K palette full (Track D — depends on having 3 types with data)
Slice 5:  Bookmarks + Collections dashboard (Track D)
Slice 6:  /skills detail (Track B) + extract ExtensionResourceDetail template
Slice 7:  /rules /subagents /plugins /hooks /commands index + detail (parallel using template; Track B)
Slice 8:  /tools index + /tools/[slug] detail (Track A — last primary nav)
Slice 9:  /sandboxes /observability /backend /assets (Track B, infra types — extract InfraResourceDetail template)
Slice 10: /starters /workflows /stacks index + detail (Track B)
Slice 11: /prompts /marketplaces /docs-for-llms /specs /evals /scripts /showcase index + detail (Track B, remaining types)
Slice 12: /news index + /news/[slug] (Track C)
Slice 13: /deals index + /deals/[slug] + claim flow (Track C)
Slice 14: /guides index + /[resource-slug]/guides/[guide-slug] reader (Track C)
Slice 15: /search full results page (Track D)
Slice 16: /compare drawer + /models/compare full-page (Track D)
Slice 17: /best-for/[slug] × 12 use cases (Track D — SEO push)
Slice 18: /alternatives/[slug] dynamic (Track D — SEO push)
Slice 19: "Adopt this stack" mechanic + public stack URLs (Track D)
Slice 20: Pro upgrade flow + Stripe webhooks + Customer Portal (Track E)
Slice 21: /admin + moderation queue + news draft queue (Track E)
Slice 22: /api/firehose SSE endpoint + 5 RSS feeds (Track D)
Slice 23: All 13 ingestion scripts + GHA workflows (Track E — interleaved across earlier slices)
Slice 24: Newsletter signup + send pipeline + weekly digest (Track E)
Slice 25: /pricing + UpgradeModal + free-trial wiring (Track E)
Slice 26: Settings + profile + privacy + appearance pages (Track D/E)
Slice 27: Submit flow (3-step: URL → detect → preview & publish) (Track D)
Slice 28: 404/500/maintenance polish + cookie consent finalisation (Track E)
Slice 29: SEO infra — sitemap dynamic generation, JSON-LD per detail type, OG generation per type
Slice 30: Legal pages (terms, privacy) — Termly v1 export + lawyer-review note in KNOWN_ISSUES
```

**Total slice count: 30 vertical slices** (foundation slice F + 30 feature slices = 31 total). Each averages 1-3 days of focused work; total Phase C estimate ~6-8 weeks at solo pace (longer than master plan's 4-week Phase-1 target — flagged in RISK_REGISTER).

---

## §7 The critical path

The shortest path from "empty repo" to "publicly launchable" passes through these slices (everything else is value-add or polish):

```
Foundation slice F
    →  Slice 1 (/models)             — proves type-detail chassis works
    →  Slice 4 (Cmd-K full)          — discovery loop
    →  Slice 5 (Bookmarks)           — save mechanic
    →  Slice 20 (Pro upgrade)        — revenue
    →  Slice 23 (Ingestion scripts)  — populates real data
    →  Slice 24 (Newsletter)         — retention loop
    →  Slice 30 (Legal pages)        — pre-launch compliance
```

8 slices on the critical path. Anything else can be sequenced flexibly around them. If timeline pressure rises in Phase C, defer everything not on the critical path → KNOWN_ISSUES → "Phase 1.5".

---

## §8 What this document gates

- `PHASE_0_1_CHECKLIST.md` (B6) sequences master-plan checkboxes against §6's slice order
- `DEFINITION_OF_DONE.md` (B7) defines slice-completion criteria per feature
- `RISK_REGISTER.md` (B8) flags timeline risk (30 slices vs 4-week master-plan estimate)
- Phase C: every slice declares its hard + soft dependencies in `BUILD_LOG.md` when it starts; any unmet hard dependency is a 🛑 STOPPING condition
- Phase D Pass 2 (functional): the critical-path slices (§7) get extra scrutiny — these are the user-visible loops that must work
