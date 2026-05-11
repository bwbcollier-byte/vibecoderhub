# DIRECTORY_TREE.md

*Phase B artifact 3 by review priority, B2 by build-prompt order.*

> **What this is.** The full filesystem layout for the build. Every folder, every meaningful file. Phase C creates files at the paths declared here; if a file ends up somewhere else, surface via `🛑 STOPPING`.

> **Convention.** Trailing `/` denotes a folder. `[slug]` / `[type]` / `[username]` are dynamic URL segments. `(group)` parentheses mark Next.js route groups (do not appear in URL). `★` marks files that exist for every URL-accessible route (loading / error / not-found / opengraph-image — Ben's watch list).

---

## §1 Top-level layout

```
vibecoderhub-web/                         # repo root, single project (no apps/web subdir)
├── app/                                  # Next.js 15 App Router
├── components/                           # cross-page reusable components
├── lib/                                  # utilities, types, server-only modules
├── db/                                   # Drizzle schema mirror + migrations + seed
├── scripts/                              # ingestion + dev tooling
├── public/                               # static assets (favicon, robots-meta images)
├── tests/                                # Vitest unit/integration + Playwright e2e
├── editorial-seed/                       # Ben's editorial bundle drop zone
├── .github/                              # workflows + issue templates
├── .vscode/                              # workspace settings
├── docs/                                 # in-repo docs (architecture, runbooks)
├── sentry.client.config.ts               # Sentry browser SDK init
├── sentry.server.config.ts               # Sentry server SDK init
├── sentry.edge.config.ts                 # Sentry edge runtime init
├── instrumentation.ts                    # Next.js instrumentation hook (loads sentry server/edge)
├── middleware.ts                         # request-ID propagation + auth gate for protected paths
├── next.config.ts                        # Next config (remotePatterns, redirects, headers)
├── tailwind.config.ts                    # Tailwind theme extension (derived from lib/tokens.ts)
├── postcss.config.mjs                    # Tailwind v4 setup
├── drizzle.config.ts                     # Drizzle Kit config (for migrations)
├── tsconfig.json
├── eslint.config.mjs                     # ESLint flat config
├── .prettierrc.mjs
├── package.json
├── pnpm-lock.yaml
├── .env.example                          # canonical list of required env vars
├── .env.local                            # gitignored, local-only secrets
├── .gitignore
├── .nvmrc                                # node v22
├── README.md
├── CONTRIBUTING.md
├── ANSWERS.md                            # ← created in Phase A
├── ASSUMPTIONS.md                        # ← created in Phase A
├── ARCHITECTURE.md                       # ← created in Phase B (artifact 2)
├── TOKEN_RECONCILIATION.md               # ← created in Phase B (artifact 1)
├── DIRECTORY_TREE.md                     # ← this file (Phase B artifact 3)
├── MIGRATION_ORDER.md                    # ← Phase B artifact 4 (B4)
├── DEPENDENCY_GRAPH.md                   # ← Phase B artifact 5 (B5)
├── PHASE_0_1_CHECKLIST.md                # ← Phase B artifact 6 (B6)
├── DEFINITION_OF_DONE.md                 # ← Phase B artifact 7 (B7)
├── RISK_REGISTER.md                      # ← Phase B artifact 8 (B8)
├── BUILD_LOG.md                          # ← created at start of Phase C, appended every slice
├── KNOWN_ISSUES.md                       # ← created at start of Phase C
├── IDEAS_DURING_BUILD.md                 # ← created at start of Phase C
├── MAKE_SURE_VERIFICATION.md             # ← created at start of Phase C
├── SESSION_HANDOFF.md                    # ← created early Phase B, live document
└── PROMPTKIT_RECON.md                    # ← created pre-Phase A
```

---

## §2 `app/` — full route map

```
app/
├── layout.tsx                            # root layout: <html>, fonts via next/font, ThemeProvider, PostHogProvider, Toaster, CookieBanner, StackProvider
├── globals.css                           # CSS variables (from lib/tokens.ts), reset, base typography, focus rings
├── not-found.tsx                         # root 404 (rare; per-route not-found.tsx wins where present)
├── global-error.tsx                      # catastrophic boundary (no app chrome — minimal page)
├── robots.ts                             # generates /robots.txt
├── sitemap.ts                            # generates /sitemap.xml from DB
├── opengraph-image.tsx                   # default OG image (1200x630) for /, fallback for routes without their own
├── icon.tsx                              # favicon SVG generator (for /favicon.ico)
├── apple-icon.tsx                        # 180x180 apple touch icon
│
├── (marketing)/                          # ── ROUTE GROUP: unauth-friendly pages ─────────────
│   ├── layout.tsx                        # marketing chrome: full Header, Footer, no MobileNav
│   ├── error.tsx                         # ★
│   ├── page.tsx                          # / (landing for logged-out; redirects to /home for logged-in)
│   ├── loading.tsx                       # ★
│   ├── home/
│   │   ├── page.tsx                      # /home (logged-in landing)
│   │   ├── loading.tsx                   # ★
│   │   └── error.tsx                     # ★
│   ├── pricing/
│   │   ├── page.tsx                      # /pricing
│   │   ├── loading.tsx                   # ★
│   │   ├── opengraph-image.tsx           # ★ (custom OG: shows tier comparison)
│   │   └── error.tsx                     # ★
│   ├── about/
│   │   ├── page.tsx                      # /about
│   │   ├── loading.tsx                   # ★
│   │   └── error.tsx                     # ★
│   ├── manifesto/
│   │   ├── page.tsx                      # /manifesto
│   │   ├── loading.tsx                   # ★
│   │   └── error.tsx                     # ★
│   ├── contact/
│   │   ├── page.tsx                      # /contact (with form posting to a Server Action)
│   │   └── error.tsx                     # ★
│   ├── terms/
│   │   ├── page.tsx                      # /terms (Termly v1 export, lawyer-review-required note in KNOWN_ISSUES)
│   │   └── error.tsx                     # ★
│   ├── privacy/
│   │   ├── page.tsx                      # /privacy
│   │   └── error.tsx                     # ★
│   └── newsletter/
│       ├── page.tsx                      # /newsletter (public archive of weekly issues)
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       └── [issue-number]/
│           ├── page.tsx                  # /newsletter/42
│           ├── opengraph-image.tsx       # ★
│           └── error.tsx                 # ★
│
├── (app)/                                # ── ROUTE GROUP: authenticated app ──────────────────
│   ├── layout.tsx                        # app chrome: Header with stack chip, Sidebar (dashboard pages), MobileNav, Toaster
│   ├── error.tsx                         # ★
│   ├── dashboard/
│   │   ├── page.tsx                      # /dashboard (overview)
│   │   ├── loading.tsx                   # ★
│   │   ├── error.tsx                     # ★
│   │   ├── bookmarks/
│   │   │   ├── page.tsx                  # /dashboard/bookmarks
│   │   │   ├── loading.tsx               # ★
│   │   │   └── error.tsx                 # ★
│   │   ├── collections/
│   │   │   ├── page.tsx                  # /dashboard/collections (list)
│   │   │   ├── loading.tsx               # ★
│   │   │   ├── error.tsx                 # ★
│   │   │   └── [collection-id]/
│   │   │       ├── page.tsx              # /dashboard/collections/abc123
│   │   │       ├── error.tsx             # ★
│   │   │       └── not-found.tsx         # ★
│   │   ├── stacks/
│   │   │   ├── page.tsx                  # /dashboard/stacks (private + draft)
│   │   │   ├── loading.tsx               # ★
│   │   │   └── error.tsx                 # ★
│   │   ├── submissions/
│   │   │   ├── page.tsx                  # /dashboard/submissions
│   │   │   ├── loading.tsx               # ★
│   │   │   └── error.tsx                 # ★
│   │   ├── alerts/
│   │   │   ├── page.tsx                  # /dashboard/alerts
│   │   │   ├── loading.tsx               # ★
│   │   │   └── error.tsx                 # ★
│   │   ├── deals/
│   │   │   ├── page.tsx                  # /dashboard/deals (claimed deals + status)
│   │   │   ├── loading.tsx               # ★
│   │   │   └── error.tsx                 # ★
│   │   ├── gateway/
│   │   │   ├── page.tsx                  # /dashboard/gateway ("coming soon" placeholder, Pro-only)
│   │   │   └── error.tsx                 # ★
│   │   ├── api-keys/
│   │   │   ├── page.tsx                  # /dashboard/api-keys ("coming soon", Pro-only)
│   │   │   └── error.tsx                 # ★
│   │   └── author/
│   │       ├── page.tsx                  # /dashboard/author (resource authors only — Phase 2)
│   │       └── error.tsx                 # ★
│   ├── settings/
│   │   ├── page.tsx                      # /settings (overview)
│   │   ├── loading.tsx                   # ★
│   │   ├── error.tsx                     # ★
│   │   ├── account/page.tsx              # /settings/account (email, username, 2FA, delete)
│   │   ├── profile/page.tsx              # /settings/profile (display name, bio, avatar, links)
│   │   ├── stack/page.tsx                # /settings/stack (edit saved stack)
│   │   ├── notifications/page.tsx        # /settings/notifications (per-channel)
│   │   ├── billing/page.tsx              # /settings/billing (links to Stripe Customer Portal)
│   │   ├── connections/page.tsx          # /settings/connections (GitHub/Google OAuth status)
│   │   ├── privacy/page.tsx              # /settings/privacy (cookie consent, data export request)
│   │   └── appearance/page.tsx           # /settings/appearance (theme — Phase 2; reduced-motion preference now)
│   └── submit/
│       ├── page.tsx                      # /submit (step 1: URL or pick type)
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── detect/
│       │   └── page.tsx                  # /submit/detect (step 2: form prefilled)
│       └── preview/
│           └── page.tsx                  # /submit/preview (step 3: preview & publish)
│
├── (admin)/                              # ── ROUTE GROUP: admin only ─────────────────────────
│   ├── layout.tsx                        # admin chrome: minimal Header, no Sidebar, [admin] badge; (admin) layout re-checks ADMIN_GITHUB_USER_IDS env
│   ├── error.tsx                         # ★
│   └── admin/
│       ├── page.tsx                      # /admin (overview: queues + recent runs)
│       ├── loading.tsx                   # ★
│       ├── moderation/
│       │   ├── page.tsx                  # /admin/moderation (image queue, submissions queue, flagged content)
│       │   ├── loading.tsx               # ★
│       │   └── [submission-id]/
│       │       ├── page.tsx              # /admin/moderation/abc123 (review one submission)
│       │       └── error.tsx             # ★
│       ├── ingestion-runs/
│       │   ├── page.tsx                  # /admin/ingestion-runs (last 50 runs by source + priority)
│       │   ├── loading.tsx               # ★
│       │   └── [run-id]/
│       │       └── page.tsx              # /admin/ingestion-runs/abc123 (run detail, raw R2 dump link)
│       ├── news-queue/
│       │   ├── page.tsx                  # /admin/news-queue (drafts pending publish — Q2.2 amendment)
│       │   ├── loading.tsx               # ★
│       │   └── [news-id]/
│       │       └── page.tsx              # /admin/news-queue/abc123 (review one draft)
│       ├── flagged/
│       │   └── page.tsx                  # /admin/flagged (avatar reports, comment flags)
│       ├── bounces/
│       │   └── page.tsx                  # /admin/bounces (Resend bounce/complaint log)
│       └── users/
│           ├── page.tsx                  # /admin/users (search + recent signups)
│           └── [user-id]/
│               └── page.tsx              # /admin/users/abc123 (user detail, override actions)
│
├── models/                               # ── 24 RESOURCE TYPE FOLDERS at root level ──────────
│   ├── page.tsx                          # /models index (filterable, sortable, paginated)
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   ├── opengraph-image.tsx               # ★
│   ├── feed.rss/route.ts                 # /models/feed.rss (last 50 published models)
│   ├── compare/
│   │   ├── page.tsx                      # /models/compare?ids=…
│   │   └── error.tsx                     # ★
│   ├── by-hardware/
│   │   ├── page.tsx                      # /models/by-hardware (Phase 2; placeholder Phase 1)
│   │   └── error.tsx                     # ★
│   ├── pricing/
│   │   └── calculator/
│   │       └── page.tsx                  # /models/pricing/calculator (Phase 2 — embedded in detail Phase 1)
│   └── [slug]/
│       ├── page.tsx                      # /models/[slug] (the 22-block model detail page)
│       ├── loading.tsx                   # ★ (matches model-detail skeleton: hero + stats strip + tabs + 4 above-fold blocks)
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       ├── opengraph-image.tsx           # ★ (custom: provider logo + price + intelligence rank)
│       └── feed.rss/route.ts             # /models/[slug]/feed.rss (per-model events)
│
├── mcps/
│   ├── page.tsx                          # /mcps index
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   ├── opengraph-image.tsx               # ★
│   ├── feed.rss/route.ts
│   └── [slug]/
│       ├── page.tsx                      # /mcps/[slug] (with read-only Tool Inspector per Q1.1)
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       └── opengraph-image.tsx           # ★ (custom: tool count + author)
│
├── components/
│   ├── page.tsx                          # /components index
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   ├── opengraph-image.tsx               # ★
│   ├── feed.rss/route.ts
│   └── [slug]/
│       ├── page.tsx                      # /components/[slug] (Sandpack playground deferred to Phase 2 per Q1.1)
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       └── opengraph-image.tsx           # ★ (custom: framework + author)
│
├── skills/                               # SAME 6-FILE STRUCTURE as above for each of the remaining 21 types ↓
│   ├── page.tsx · loading.tsx · error.tsx · opengraph-image.tsx · feed.rss/route.ts
│   └── [slug]/{page,loading,error,not-found,opengraph-image}.tsx
│
├── subagents/{ same shape }
├── rules/{ same shape }
├── prompts/{ same shape }
├── plugins/{ same shape }
├── marketplaces/{ same shape }
├── hooks/{ same shape }
├── commands/{ same shape }
├── starters/{ same shape }
├── tools/{ same shape }
├── sandboxes/{ same shape }
├── observability/{ same shape }
├── backend/{ same shape }                 # Note: URL is /backend (not /backend-kits)
├── assets/{ same shape }
├── showcase/{ same shape }
├── docs-for-llms/{ same shape }
├── specs/{ same shape }
├── workflows/{ same shape }
├── stacks/{ same shape — but slug routes to /u/[username]/[stack-slug] redirect at /stacks/[slug] }
├── evals/{ same shape }
├── scripts/{ same shape }                 # 24th resource type (collides with /scripts dev folder — addressed below)
│
├── search/
│   ├── page.tsx                          # /search?q=…&type=…&clients=…
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   └── opengraph-image.tsx               # ★
│
├── best-for/
│   ├── page.tsx                          # /best-for index (12 use cases)
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   ├── opengraph-image.tsx               # ★
│   └── [slug]/
│       ├── page.tsx                      # /best-for/saas-mvp etc.
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       └── opengraph-image.tsx           # ★ (use-case-specific)
│
├── alternatives/
│   ├── [slug]/
│   │   ├── page.tsx                      # /alternatives/cursor etc.
│   │   ├── loading.tsx                   # ★
│   │   ├── error.tsx                     # ★
│   │   ├── not-found.tsx                 # ★
│   │   └── opengraph-image.tsx           # ★ ("Alternatives to <X>")
│
├── deals/
│   ├── page.tsx                          # /deals index
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   ├── opengraph-image.tsx               # ★
│   ├── featured/page.tsx                 # /deals/featured (curated weekly picks)
│   └── [slug]/
│       ├── page.tsx                      # /deals/[slug]
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       └── opengraph-image.tsx           # ★ (custom: value + provider + tier badge)
│
├── news/
│   ├── page.tsx                          # /news index
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   ├── opengraph-image.tsx               # ★
│   ├── feed.rss/route.ts                 # /news/feed.rss (site-wide)
│   ├── feed/
│   │   └── [kind]/route.ts               # /news/feed/releases.rss etc. (per-kind)
│   └── [slug]/
│       ├── page.tsx                      # /news/[slug]
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       └── opengraph-image.tsx           # ★ (custom: headline + source)
│
├── guides/
│   ├── page.tsx                          # /guides index (filterable by kind/difficulty/OS/client)
│   ├── loading.tsx                       # ★
│   ├── error.tsx                         # ★
│   └── opengraph-image.tsx               # ★
│
├── [resource-slug]/                      # for /<resource-slug>/guides/<guide-slug> — guides namespaced under their resource
│   └── guides/
│       └── [guide-slug]/
│           ├── page.tsx                  # /<resource-slug>/guides/<guide-slug> (focused-reading mode)
│           ├── loading.tsx               # ★
│           ├── error.tsx                 # ★
│           ├── not-found.tsx             # ★
│           └── opengraph-image.tsx       # ★ (custom: title + difficulty + duration)
│
├── u/                                    # ── USER PROFILES & STACKS ──────────────────────────
│   └── [username]/
│       ├── page.tsx                      # /u/[username] (public profile)
│       ├── loading.tsx                   # ★
│       ├── error.tsx                     # ★
│       ├── not-found.tsx                 # ★
│       ├── opengraph-image.tsx           # ★
│       ├── stacks/
│       │   ├── page.tsx                  # /u/[username]/stacks (their public stacks)
│       │   └── error.tsx                 # ★
│       └── [stack-slug]/
│           ├── page.tsx                  # /u/[username]/[stack-slug] (single public stack)
│           ├── loading.tsx               # ★
│           ├── error.tsx                 # ★
│           ├── not-found.tsx             # ★
│           └── opengraph-image.tsx       # ★ (custom: stack name + curator + 3 logos)
│
├── auth/                                 # ── AUTH CALLBACKS & UTILITY PAGES ──────────────────
│   ├── callback/
│   │   └── route.ts                      # /auth/callback (OAuth code exchange)
│   ├── verify/
│   │   └── page.tsx                      # /auth/verify (email verification landing)
│   ├── forgot/
│   │   └── page.tsx                      # /auth/forgot (forgot password — disabled in Phase 1, kept as placeholder)
│   ├── newsletter-confirm/
│   │   └── page.tsx                      # /auth/newsletter-confirm?token=… (newsletter double-opt-in)
│   └── unsubscribe/
│       └── page.tsx                      # /auth/unsubscribe?token=… (one-click unsubscribe, no auth required)
│
└── api/                                  # ── API ROUTES (Edge or Node per route) ─────────────
    ├── health/
    │   └── route.ts                      # GET /api/health (returns DB-status + version SHA)
    ├── firehose/
    │   └── route.ts                      # GET /api/firehose (SSE stream + ?since= polling fallback)  [Edge runtime]
    ├── og-revalidate/
    │   └── route.ts                      # POST /api/og-revalidate (called by ingestion to bust OG cache for a resource)
    ├── webhooks/
    │   ├── stripe/
    │   │   └── route.ts                  # POST /api/webhooks/stripe (signed)
    │   └── resend/
    │       └── route.ts                  # POST /api/webhooks/resend (bounce + complaint events)
    ├── nsfw-check/
    │   └── route.ts                      # POST /api/nsfw-check (called by avatar-upload Edge Function — internal)
    ├── upload-url/
    │   └── route.ts                      # POST /api/upload-url (returns signed Supabase Storage URL for direct browser upload)
    ├── data-export/
    │   └── route.ts                      # POST /api/data-export (GDPR — Phase 1 stretch; manual fulfillment fallback)
    └── stripe/
        └── customer-portal/
            └── route.ts                  # POST /api/stripe/customer-portal (returns a Stripe portal URL for current user)
```

### Notes on the route map

- **Resource type folders are sibling-of-everything.** No `(resource)` group. Each of the 24 type folders lives at `app/{type}/`. I considered a `(resource)` group but it would conflict with Next.js's "no two routes resolve to the same URL" rule (a `(resource)/models/page.tsx` + `models/page.tsx` collision). Ben's routing intent — clean per-type URLs, shared chassis at the *component* level — is what's implemented.
- **The shared 9-zone chassis** lives at `components/resources/DetailChassis.tsx` and is imported by every `app/{type}/[slug]/page.tsx`. Each type's page wraps the chassis with its specific Zone-5 block component. See §4.
- **Tabs are URL hashes**, not nested routes. `/models/claude-opus-4-7#try-it` scrolls to the Try It section. Per build-prompt's "Tab switching without full reload, URL hash updates." Avoids 10× nested route files per detail page.
- **Per-resource RSS feeds** (`/[type]/feed.rss` and `/models/[slug]/feed.rss`) ship Phase 1 per Q2.4. Other types' per-slug feeds added on demand.
- **The `app/scripts/` resource type** vs **the repo's `/scripts/` dev folder** — they don't collide because one is under `app/` (URL routes) and the other is at repo root (dev tooling, not exposed). No naming change needed.
- **Tab as nested route alternative.** If post-launch we find URL hashes hurt SEO (Google does index hash anchors but treats them as part of the same URL), we can convert top-level tabs to nested routes (`/models/[slug]/install` etc.) without breaking existing links — the existing single-page version stays default; the nested versions become aliases.

---

## §3 `components/` — cross-page reusable

Components used in 2+ routes live here. Page-only components colocate with the page (see §6).

```
components/
├── ui/                                   # shadcn primitives, themed per TOKEN_RECONCILIATION
│   ├── button.tsx                        # 5 sizes × 5 variants; uses --btn-py-* tokens
│   ├── input.tsx                         # 3 sizes; uses --input-py-* tokens
│   ├── textarea.tsx
│   ├── select.tsx                        # uses Radix UI primitives
│   ├── checkbox.tsx
│   ├── radio.tsx
│   ├── switch.tsx
│   ├── slider.tsx                        # 1-handle + 2-handle range variant for cost calculator
│   ├── label.tsx
│   ├── card.tsx                          # rounded-tile, border-card, hover lift
│   ├── badge.tsx                         # status pills (Available/New/Reasoning/Vision/Tools/Open weights)
│   ├── pill.tsx                          # tag chips, filter chips (rounded-pill)
│   ├── avatar.tsx                        # all 6 sizes (24/32/40/48/64/96), rounded-full
│   ├── icon-button.tsx                   # 3 sizes (32/40/48), rounded-full
│   ├── tooltip.tsx                       # Radix tooltip, hover + focus
│   ├── popover.tsx                       # Radix popover
│   ├── dropdown.tsx                      # Radix dropdown-menu
│   ├── dialog.tsx                        # Radix dialog (modal); 4 sizes (480/640/800/fullscreen)
│   ├── drawer.tsx                        # right slide-in (vaul library) or hand-rolled
│   ├── sheet.tsx                         # bottom-sheet for mobile (vaul or hand-rolled)
│   ├── tabs.tsx                          # tab triggers + panels; URL-hash-driven
│   ├── accordion.tsx                     # Radix accordion
│   ├── progress.tsx                      # linear + radial (for guide completion)
│   ├── separator.tsx                     # horizontal + vertical hairlines
│   ├── skeleton.tsx                      # animated shimmer; matches Promptkit's .skeleton class
│   ├── code-block.tsx                    # syntax-highlighted via Shiki; copy button with animated "copied" feedback
│   ├── kbd.tsx                           # keyboard key indicator (for Cmd-K hints)
│   ├── toast.tsx                         # sonner wrapper (or hand-rolled)
│   ├── toaster.tsx                       # provider for global toast queue
│   └── command.tsx                       # cmdk wrapper (Cmd-K palette primitives)
│
├── layout/                               # global chrome
│   ├── header/
│   │   ├── Header.tsx                    # the persistent top nav (server component)
│   │   ├── HeaderNav.tsx                 # the nav links (client — keyboard handling)
│   │   ├── HeaderMegaMenu.tsx            # "All 24 types ▾" dropdown (client)
│   │   ├── HeaderSearch.tsx              # ⌘K search button trigger (client)
│   │   ├── HeaderStackChip.tsx           # the user's current stack pill (client)
│   │   ├── HeaderUserMenu.tsx            # avatar dropdown (client; auth-aware)
│   │   └── HeaderAuthButtons.tsx         # Sign in / Get started for logged-out (server)
│   ├── footer/
│   │   ├── Footer.tsx                    # 5-column footer
│   │   └── FooterNewsletterCta.tsx       # inline newsletter signup form (client)
│   ├── mobile-nav/
│   │   ├── MobileNav.tsx                 # bottom-nav 5-tab (Home/Search/Bookmarks/News/Profile)
│   │   └── MobileMenu.tsx                # full-screen menu drawer (client)
│   ├── stack-banner/
│   │   └── StackBanner.tsx               # mobile-only sticky strip below header
│   ├── skip-link/
│   │   └── SkipLink.tsx                  # "Skip to content" a11y helper
│   ├── breadcrumb/
│   │   └── Breadcrumb.tsx                # contextual breadcrumb on detail pages
│   └── cookie-banner/
│       └── CookieBanner.tsx              # GDPR cookie consent (client; uses localStorage for dismissal)
│
├── resources/                            # cross-resource components (all 24 types)
│   ├── DetailChassis.tsx                 # the shared 9-zone shell from detail-pages.md §1
│   ├── DetailHero.tsx                    # Zone 1 (universal hero anatomy)
│   ├── DetailStatsStrip.tsx              # Zone 2 (8-cell stats strip; type can override 1-3 cells)
│   ├── DetailTabBar.tsx                  # Zone 3 (URL-hash tabs)
│   ├── DetailRightRail.tsx               # Zone 4 (sticky desktop rail)
│   ├── DetailMobileBottomBar.tsx         # mobile sticky bottom: Try / Compare / Save / Share
│   ├── DetailBestForAlternatives.tsx     # Zone 6
│   ├── DetailWorksWellWith.tsx           # Zone 7
│   ├── DetailSocialAndTips.tsx           # Zone 8 (reviews, prompting tips, comments)
│   ├── DetailMeta.tsx                    # Zone 9 (news mentions, deals, timeline, sources)
│   │
│   ├── ResourceCard.tsx                  # generic 7-variant card (dark/mint/uv/yellow/pink/orange/blue)
│   ├── ModelCard.tsx                     # cost-first variant
│   ├── DealCard.tsx                      # with locked Pro paywall blur state
│   ├── NewsCard.tsx                      # 5-variant
│   ├── GuideCard.tsx                     # difficulty + duration + OS badges
│   ├── StackCard.tsx                     # overlapping resource chips
│   ├── ResourceCardSkeleton.tsx
│   │
│   ├── TypeBadge.tsx                     # 24 type variants (one per resource_type)
│   ├── ClientRow.tsx                     # 22-IDE compatibility icon row, 5 visible + count
│   ├── ProviderMark.tsx                  # provider logo placeholder square
│   ├── Sparkline.tsx                     # SVG line chart (price history)
│   │
│   ├── InstallButton.tsx                 # the signature one-click + dropdown component
│   ├── InstallOptionsPopover.tsx         # the dropdown contents (per-client install paths)
│   │
│   ├── BookmarkButton.tsx                # client-side optimistic bookmark
│   ├── ShareButton.tsx                   # copy URL + toast confirmation; X/LinkedIn/etc options
│   ├── CompareCheckbox.tsx               # adds to compare drawer
│   ├── ReviewBlock.tsx                   # rating + review submit modal
│   ├── PromptingTipsList.tsx             # community-edited tips
│   ├── CompatibilityMatrix.tsx           # ✅⚠️❌❓ grid + tooltips
│   ├── VersionsList.tsx                  # reverse-chrono version history with diff
│   ├── ForkTree.tsx                      # vertical fork lineage (for forkable types)
│   └── FilterSidebar.tsx                 # left-rail filters (multi-select chips, sort, clear all)
│
├── stack-picker/
│   ├── StackPickerModal.tsx              # the big modal (client)
│   ├── StackPickerClients.tsx            # AI client multi-select (Cursor, Claude Code, etc.)
│   ├── StackPickerStack.tsx              # tech-stack tag multi-select
│   ├── StackPickerHardware.tsx           # hardware section (capture-now-use-later per Q2.3)
│   ├── StackPickerPresets.tsx            # 30 preset stacks, top-6 above fold (Q3.5)
│   └── StackPickerSavingPreview.tsx      # the "page reshapes as you save" preview
│
├── cmdk/
│   ├── CommandPalette.tsx                # the ⌘K palette (cmdk-wrapped)
│   ├── CommandResults.tsx                # grouped results renderer
│   ├── CommandRecent.tsx                 # recent items (DB or localStorage)
│   ├── CommandTrending.tsx               # trending now (from v_trending_per_type)
│   ├── CommandActions.tsx                # action commands (Update stack, Submit, etc.)
│   ├── CommandTypeFilter.tsx             # `>type query` fuzzy disambiguator (Q2.5 amendment)
│   └── CommandTipsHints.tsx              # ⌨ keyboard hint footer
│
├── compare/
│   ├── CompareDrawer.tsx                 # right-rail slide-in
│   ├── CompareTable.tsx                  # full-page side-by-side
│   └── CompareDiffCell.tsx               # winner-highlighting cell
│
├── auth/
│   ├── AuthModal.tsx                     # sign in / sign up modal
│   ├── AuthGate.tsx                      # client-side gate (for showing upgrade vs sign-in prompt)
│   └── ReturnToHandler.tsx               # captures return-to URL during auth flow
│
├── pricing/
│   ├── PricingTable.tsx                  # Free / Member / Pro 3-column
│   ├── UpgradeModal.tsx                  # value-led "this deal pays for Pro 1500x" modal
│   ├── ProBadge.tsx                      # 🔒 + tier badge for locked features
│   └── ComingSoonBadge.tsx               # "Coming Q3 2026" per Q3.6
│
├── deals/
│   ├── DealLockedOverlay.tsx             # the blur paywall ("window not wall")
│   ├── ClaimDealModal.tsx                # 3-step claim flow
│   └── EligibilityChecklist.tsx          # self-qualification UI
│
├── playground/
│   ├── ModelPlayground.tsx               # Try It Now (model detail block 3) — 3 modes (free trial / BYOK / saved)
│   ├── PromptVariableForm.tsx            # for prompt-recipe playgrounds
│   └── PlaygroundComingSoon.tsx          # Sandpack placeholder (Phase 2 deferral)
│
├── mcp/
│   ├── ToolInspector.tsx                 # the read-only MCP tool inspector (Q1.1 ruling)
│   ├── ToolInputForm.tsx                 # auto-generated form from input_schema
│   └── ToolSchemaViewer.tsx              # JSON Schema → structured form
│
├── charts/
│   ├── PriceHistoryChart.tsx             # 90-day sparkline, Recharts
│   ├── BenchmarkBarChart.tsx             # SWE-Bench scores, Recharts
│   ├── RealWorldRadar.tsx                # per-client radar chart (Phase 2 once gateway exists)
│   ├── ContextWindowQuality.tsx          # advertised vs effective bar + needle-in-haystack
│   └── ChartContainer.tsx                # responsive wrapper, theme-aware colours
│
├── forms/
│   ├── FormField.tsx                     # standard label + input + error pattern
│   ├── FormErrors.tsx                    # form-level error summary (when 3+ inline errors)
│   ├── SubmitButton.tsx                  # spinner-in-button, disabled-while-pending
│   └── FormSection.tsx                   # vertical-rhythm section wrapper
│
├── empty-states/                         # consolidated, consistent
│   ├── EmptyState.tsx                    # base (illustration slot + heading + body + action)
│   ├── EmptyBookmarks.tsx
│   ├── EmptySearch.tsx                   # query-aware
│   ├── EmptyFilters.tsx                  # "Clear filters" CTA
│   ├── EmptyAlerts.tsx
│   ├── EmptyDeals.tsx
│   ├── EmptyDashboard.tsx                # new-user onboarding nudges
│   └── EmptyComparison.tsx
│
├── error-states/
│   ├── ErrorState.tsx                    # base (used by every error.tsx)
│   ├── NotFoundState.tsx                 # used by every not-found.tsx
│   ├── RateLimitedState.tsx              # 429 handling
│   ├── NetworkErrorRetry.tsx             # inline retry pattern
│   └── MaintenanceState.tsx              # /maintenance page content
│
├── onboarding/
│   ├── WelcomeFlow.tsx                   # 3-step post-signup flow
│   ├── OnboardingStep.tsx                # single-step wrapper with skip
│   └── OnboardingProgress.tsx            # 3-dot progress
│
├── editor/
│   ├── ForkEditor.tsx                    # inline editor for forking (skill / rule / prompt / spec / agent)
│   └── MarkdownPreview.tsx               # rendered markdown with prose typography
│
├── analytics/
│   └── PostHogProvider.tsx               # client-side PostHog init + opt-in handling
│
├── theme/
│   ├── ThemeProvider.tsx                 # cookie-backed theme (dark only Phase 1)
│   └── ReducedMotionProvider.tsx         # respects prefers-reduced-motion + user setting
│
├── stack-context/
│   └── StackProvider.tsx                 # user's saved stack via React Context
│
├── icons/
│   ├── Icon.tsx                          # Lucide wrapper enforcing 1.5px stroke
│   ├── ProviderLogos/                    # SVG components for known providers (Anthropic, OpenAI, Google, etc.)
│   │   ├── AnthropicLogo.tsx
│   │   ├── OpenAILogo.tsx
│   │   ├── GoogleLogo.tsx
│   │   ├── MetaLogo.tsx
│   │   ├── MistralLogo.tsx
│   │   ├── DeepSeekLogo.tsx
│   │   ├── AlibabaLogo.tsx
│   │   ├── MoonshotLogo.tsx
│   │   ├── XaiLogo.tsx
│   │   └── index.ts                      # mapping {providerSlug: Component}
│   └── ClientLogos/                      # SVG components for known IDEs (Cursor, Claude Code, etc.)
│       ├── CursorLogo.tsx
│       ├── ClaudeCodeLogo.tsx
│       ├── WindsurfLogo.tsx
│       ├── ClineLogo.tsx
│       ├── ZedLogo.tsx
│       ├── ContinueLogo.tsx
│       ├── AiderLogo.tsx
│       ├── CopilotLogo.tsx
│       ├── ClaudeDesktopLogo.tsx
│       └── index.ts                      # mapping {clientSlug: Component}
│
├── shared/
│   ├── Wordmark.tsx                      # the "VIBE CODER HUB" lockup
│   ├── BrandMonogram.tsx                 # the 24×24 mint "V" mark
│   ├── ExternalLink.tsx                  # adds rel="noopener noreferrer" + ↗ icon
│   ├── RelativeTime.tsx                  # "3d ago" formatter, hydration-safe
│   ├── FormattedNumber.tsx               # Intl.NumberFormat wrapper
│   ├── FormattedCurrency.tsx             # Intl.NumberFormat with currency
│   ├── FormattedDate.tsx                 # Intl.DateTimeFormat wrapper
│   └── ConditionalLink.tsx               # renders <Link> or <a> per href shape (internal/external)
│
└── seo/
    ├── JsonLd.tsx                        # injects JSON-LD into <head>
    ├── ResourceJsonLd.tsx                # SoftwareApplication shape per resource
    ├── ModelJsonLd.tsx                   # Product+Offers shape for models
    ├── NewsJsonLd.tsx                    # NewsArticle shape
    ├── GuideJsonLd.tsx                   # HowTo shape
    └── ItemListJsonLd.tsx                # for /best-for and index pages
```

---

## §4 `lib/` — utilities, types, server-only

```
lib/
├── env.ts                                # Zod-validated env vars; app fails to boot on missing/invalid
├── logger.ts                             # Pino setup (see ARCHITECTURE §9)
├── tokens.ts                             # design tokens (TS constants — derived to globals.css + tailwind.config.ts)
├── cn.ts                                 # the ubiquitous `cn` helper (clsx + tailwind-merge)
│
├── server/                               # ── SERVER-ONLY (every file imports 'server-only') ──
│   ├── db.ts                             # Drizzle client instance (pooled connection)
│   ├── db-direct.ts                      # Drizzle direct connection (migrations only)
│   ├── db-service.ts                     # service-role client (bypasses RLS, admin operations only)
│   ├── ratelimit.ts                      # sliding-window rate-limit helper (Postgres-backed)
│   ├── stripe.ts                         # Stripe SDK instance
│   ├── resend.ts                         # Resend SDK instance
│   ├── openai.ts                         # OpenAI SDK instance (embeddings only)
│   ├── replicate.ts                      # Replicate SDK instance (NSFW classifier only)
│   ├── r2.ts                             # Cloudflare R2 client (raw-dump uploads)
│   ├── posthog-server.ts                 # server-side PostHog (for capturing events from Server Actions)
│   ├── sentry.ts                         # server Sentry helpers
│   └── revalidate.ts                     # convenience wrappers around revalidatePath/Tag
│
├── auth/
│   ├── server.ts                         # auth() helper for Server Components & Actions
│   ├── client.ts                         # browser client + useSession hook
│   ├── middleware.ts                     # protected-path matcher logic
│   ├── is-admin.ts                       # checks ADMIN_GITHUB_USER_IDS env
│   └── return-to.ts                      # safe return-to URL handling (whitelist same-origin)
│
├── actions/                              # ── SERVER ACTIONS (next-safe-action) ───────────────
│   ├── _client.ts                        # createSafeActionClient + auth middleware
│   ├── auth/
│   │   ├── signOut.ts
│   │   └── deleteAccount.ts
│   ├── bookmarks/
│   │   ├── toggle.ts
│   │   └── moveToCollection.ts
│   ├── collections/
│   │   ├── create.ts
│   │   ├── update.ts
│   │   └── delete.ts
│   ├── stacks/
│   │   ├── save.ts
│   │   ├── adopt.ts                      # bookmark + fork dual mechanic
│   │   ├── publish.ts
│   │   └── delete.ts
│   ├── reviews/
│   │   ├── submit.ts
│   │   ├── update.ts
│   │   ├── delete.ts
│   │   └── voteHelpful.ts
│   ├── comments/
│   │   ├── post.ts
│   │   ├── reply.ts
│   │   └── delete.ts
│   ├── compatibility/
│   │   └── report.ts
│   ├── prompting-tips/
│   │   ├── submit.ts
│   │   └── upvote.ts
│   ├── alerts/
│   │   ├── create.ts
│   │   ├── update.ts
│   │   └── delete.ts
│   ├── deals/
│   │   └── claim.ts
│   ├── newsletter/
│   │   ├── subscribe.ts
│   │   ├── confirm.ts
│   │   └── unsubscribe.ts
│   ├── submit/
│   │   ├── detect.ts                     # parses GitHub URL, returns prefilled metadata
│   │   ├── save.ts                       # saves submission (draft / submitted)
│   │   └── publish.ts                    # author-self-publish (if verified) or queue
│   ├── stripe/
│   │   ├── createCheckoutSession.ts
│   │   ├── createCustomerPortalSession.ts
│   │   └── handleWebhook.ts              # called from /api/webhooks/stripe
│   ├── settings/
│   │   ├── updateProfile.ts
│   │   ├── updateNotifications.ts
│   │   ├── updateAppearance.ts
│   │   ├── requestDataExport.ts
│   │   └── changeUsername.ts
│   ├── moderation/
│   │   ├── approveSubmission.ts
│   │   ├── rejectSubmission.ts
│   │   ├── publishNewsDraft.ts
│   │   ├── flagAvatar.ts
│   │   └── unflagAvatar.ts
│   └── search/
│       └── saveSearchAsAlert.ts
│
├── queries/                              # ── READ-ONLY DRIZZLE QUERIES (Server Components) ────
│   ├── resources/
│   │   ├── getById.ts
│   │   ├── getBySlug.ts
│   │   ├── listByType.ts                 # paginated, filtered
│   │   ├── listTrending.ts
│   │   ├── listByStack.ts                # for home feed
│   │   ├── search.ts                     # tsvector + embedding hybrid
│   │   ├── relatedResources.ts           # works-well-with via dependencies
│   │   └── alternatives.ts               # cheaper/faster/smarter
│   ├── models/
│   │   ├── getDetail.ts                  # full join: providers + benchmarks + price history
│   │   ├── listForCompare.ts
│   │   └── byHardware.ts                 # Phase 2 placeholder
│   ├── deals/
│   │   ├── listActive.ts                 # tier-aware (filters Pro for non-Pro users)
│   │   ├── getById.ts
│   │   └── listForResource.ts
│   ├── news/
│   │   ├── listFeed.ts
│   │   ├── getBySlug.ts
│   │   └── listForResource.ts
│   ├── guides/
│   │   ├── listForResource.ts
│   │   ├── getDetail.ts
│   │   └── listAllPaginated.ts
│   ├── stacks/
│   │   ├── getPublic.ts
│   │   ├── listPresets.ts                # 30 curated under @vch-curated
│   │   └── listUserStacks.ts             # current user's
│   ├── bookmarks/
│   │   └── listForUser.ts
│   ├── reviews/
│   │   └── listForResource.ts
│   ├── notifications/
│   │   └── listUnread.ts
│   ├── use-cases/
│   │   ├── listAll.ts                    # for /best-for index
│   │   └── getBySlug.ts                  # for /best-for/[slug]
│   ├── best-for/
│   │   └── listByUseCase.ts              # ranked resources
│   ├── change-events/
│   │   └── listRecent.ts                 # for /firehose initial backlog
│   └── ingestion-runs/
│       └── listByPriority.ts             # for /admin
│
├── db/                                   # (alias of db/ at repo root for ergonomics — re-exports)
│   └── (re-exports from /db/)
│
├── stripe/
│   ├── prices.ts                         # price IDs + tier mapping
│   ├── webhooks-handlers/
│   │   ├── checkoutCompleted.ts
│   │   ├── subscriptionUpdated.ts
│   │   ├── subscriptionDeleted.ts
│   │   ├── invoicePaid.ts
│   │   └── invoiceFailed.ts
│   └── tiers.ts                          # subscription_tier helper functions
│
├── resend/
│   ├── send.ts                           # generic send wrapper (with bounce handling)
│   ├── templates/                        # React Email templates (.tsx)
│   │   ├── WelcomeEmail.tsx
│   │   ├── EmailVerification.tsx
│   │   ├── NewsletterConfirm.tsx
│   │   ├── WeeklyDigest.tsx
│   │   ├── PriceAlertTriggered.tsx
│   │   ├── DealClaimedConfirmation.tsx
│   │   ├── SubmissionApproved.tsx
│   │   ├── SubmissionRejected.tsx
│   │   ├── ProUpgradeWelcome.tsx
│   │   ├── ProSubscriptionCancelled.tsx
│   │   ├── ProRenewalFailed.tsx
│   │   ├── DataExportReady.tsx
│   │   ├── AccountDeletionScheduled.tsx
│   │   └── _base/
│   │       ├── EmailLayout.tsx
│   │       ├── EmailHeader.tsx
│   │       └── EmailFooter.tsx
│   └── webhooks-handlers/
│       ├── bounce.ts
│       └── complaint.ts
│
├── ingestion/                            # shared ingestion helpers (called by /scripts/ingest/*)
│   ├── _shared/
│   │   ├── runner.ts                     # wraps a script, handles ingestion_runs row + Slack on failure
│   │   ├── upsertResource.ts             # idempotent upsert keyed on source_url
│   │   ├── deduper.ts                    # cross-source dedup logic
│   │   ├── r2-uploader.ts                # writes raw response to R2
│   │   ├── rate-limiter.ts               # respects upstream rate limits
│   │   ├── backoff.ts                    # exponential backoff helper
│   │   └── slack-notify.ts               # ops channel webhook
│   └── parsers/
│       ├── parseSkillMd.ts               # SKILL.md frontmatter + body
│       ├── parseAgentMd.ts               # agent.md
│       ├── parseCursorRules.ts
│       ├── parseClaudeMd.ts
│       ├── parseAgentsMd.ts
│       ├── parseShadcnRegistry.ts
│       ├── parseMcpManifest.ts
│       └── parseGithubReadme.ts          # safe README excerpt for resources
│
├── nsfw/
│   └── check.ts                          # Replicate NSFW classifier wrapper (lib/moderation/nsfw-check.ts per Q2.8)
│
├── og/                                   # OG image generation helpers
│   ├── _layout.tsx                       # the shared OG canvas (1200×630, Promptkit tokens)
│   ├── modelOgImage.tsx
│   ├── mcpOgImage.tsx
│   ├── componentOgImage.tsx
│   ├── genericResourceOgImage.tsx
│   ├── newsOgImage.tsx
│   ├── dealOgImage.tsx
│   ├── guideOgImage.tsx
│   ├── showcaseOgImage.tsx
│   └── pricingOgImage.tsx
│
├── search/
│   ├── tsvector.ts                       # full-text search query builder
│   ├── embedding.ts                      # cosine-similarity query
│   ├── hybrid.ts                         # tsvector + embedding merge
│   ├── ranker.ts                         # blend similarity + install velocity + verified status
│   └── prefetch.ts                       # client-side top-50 prefetch (Cmd-K)
│
├── analytics/
│   ├── events.ts                         # AnalyticsEvent type-literal union (locked event taxonomy)
│   ├── capture.ts                        # client-side wrapper (PostHog)
│   ├── captureServer.ts                  # server-side wrapper
│   ├── identify.ts                       # posthog.identify(userId)
│   └── consent.ts                        # cookie-consent gate
│
├── moderation/
│   ├── nsfwCheck.ts                      # ↪ delegates to lib/nsfw/check.ts
│   └── flagComment.ts
│
├── i18n/
│   ├── _t.ts                             # the t() helper (pass-through Phase 1)
│   ├── en.ts                             # all English strings, keyed
│   ├── intl.ts                           # Intl.NumberFormat + DateTimeFormat helpers
│   └── plural.ts                         # Intl.PluralRules helper
│
├── format/
│   ├── currency.ts                       # $X.YZ / $1.2K / $1.2M
│   ├── number.ts                         # 1,234 / 1.2K / 1.2M
│   ├── date.ts                           # absolute formatter
│   ├── relative-time.ts                  # "3d ago"
│   └── filesize.ts                       # KB / MB
│
├── http/
│   ├── ip.ts                             # parse x-forwarded-for safely
│   ├── request-id.ts                     # generate + propagate via AsyncLocalStorage
│   └── safe-fetch.ts                     # fetch wrapper with timeout + retry
│
├── safe/                                 # security helpers
│   ├── sanitize.ts                       # DOMPurify wrapper for user-submitted markdown
│   ├── markdown.ts                       # markdown → safe HTML pipeline
│   └── csp.ts                            # Content-Security-Policy header builder
│
├── stack/
│   ├── cookie.ts                         # vch_stack cookie read/write
│   ├── seedFromCookie.ts                 # on-signup: cookie → user_stacks first row
│   └── adopt.ts                          # adopt-this-stack: bookmark + fork
│
├── news/
│   ├── trusted-sources.ts                # the trusted RSS source list (Q2.2)
│   └── auto-draft.ts                     # generates draft news from change_events server-side
│
├── posthog/
│   └── eventDefinitions.ts               # PostHog event property schemas (typed)
│
├── shadcn/                               # shadcn registry helpers
│   └── installCommand.ts
│
├── pricing/
│   ├── tiers.ts                          # Free / Member / Pro feature matrix
│   ├── trialEligibility.ts               # 14-day trial guard
│   └── deferredFeatures.ts               # "Coming Q3 2026" feature list
│
├── og-revalidate/
│   └── invalidate.ts                     # invalidates per-resource OG cache key
│
├── types/                                # SHARED TYPES (work in client + server)
│   ├── resources.ts                      # ResourceCardData, ResourceDetailData, etc.
│   ├── models.ts                         # ModelMetadata, BenchmarkScore, etc.
│   ├── deals.ts                          # DealRecord, DealClaim, etc.
│   ├── news.ts
│   ├── guides.ts
│   ├── stacks.ts
│   ├── user.ts
│   ├── analytics.ts                      # ↪ alias for AnalyticsEvent from lib/analytics/events.ts
│   └── api.ts                            # API response shapes
│
└── schemas/                              # ZOD SCHEMAS (used in actions + forms + ingestion)
    ├── auth.ts
    ├── resources.ts                      # type-extension shapes
    ├── submit.ts                         # submission flow schemas
    ├── reviews.ts
    ├── comments.ts
    ├── stacks.ts
    ├── alerts.ts
    ├── settings.ts
    ├── pricing.ts                        # checkout / portal payloads
    └── moderation.ts
```

---

## §5 `db/` — Drizzle schema mirror, migrations, seed

```
db/
├── schema.ts                             # the canonical TS mirror of /specs/vibe-coder-hub-schema.sql (hand-maintained per ARCHITECTURE §5)
├── relations.ts                          # Drizzle relation definitions (for `db.query.X.findFirst({ with: ... })`)
├── enums.ts                              # all enums from schema (resource_type, ai_client, etc.)
├── operational/                          # ── operational tables under the carve-out (Q1.1 + Flag 1) ──
│   ├── rate_limit_buckets.ts
│   └── (future: any other operational tables; documented in BUILD_LOG)
├── migrations/
│   ├── 0001_initial.sql                  # symlink to /specs/vibe-coder-hub-schema.sql
│   ├── 0002_rate_limit_buckets.sql       # operational table (B4 will sequence)
│   └── (future migrations sequenced by B4)
├── seed/
│   ├── _types.ts                         # SeedJsonShape (matches editorial-seed/seed.json)
│   ├── seed.ts                           # main seed runner — reads editorial-seed/, populates DB
│   ├── reset.ts                          # drops all tables, re-runs migration, re-seeds
│   ├── use-cases.ts                      # seeds the 12 from schema verbatim
│   ├── trusted-sources.ts                # populates lib/news/trusted-sources.ts pattern (read-only)
│   └── presets.ts                        # ingests editorial-seed/presets.json into user_stacks
└── pg-cron/
    ├── README.md                         # pg_cron registration commands
    ├── 001-refresh-trending.sql
    ├── 002-decay-install-counts.sql
    ├── 003-weekly-digest.sql
    ├── 004-expire-deals.sql
    ├── 005-purge-rate-limits.sql
    ├── 006-hard-delete-accounts.sql
    └── 007-embedding-backfill.sql
```

---

## §6 `app/[type]/components/` — colocated per-page components (representative example)

Components used in only one route's page tree colocate next to the page. Convention shown for `models/` (every type gets the same pattern):

```
app/models/
├── page.tsx
├── components/                           # only used in /models/* routes
│   ├── ModelsIndexHero.tsx
│   ├── ModelsFilterRail.tsx              # model-specific filter facets (price band, capability, intelligence range)
│   ├── ModelsSortDropdown.tsx
│   ├── ModelsCardGrid.tsx                # uses ModelCard from components/resources/
│   └── ModelsEmptyState.tsx
└── [slug]/
    ├── page.tsx
    ├── components/
    │   ├── ModelHero.tsx                 # the model-specific hero (provider logo + version + status pills)
    │   ├── ModelStatsStrip.tsx           # 8-cell metric strip
    │   ├── ModelTryItNow.tsx             # the inline playground (block 3)
    │   ├── ModelPricingBlock.tsx         # current + history sparkline + cost calculator (block 4)
    │   ├── ModelCostCalculator.tsx       # the slider-driven calculator
    │   ├── ModelCapabilitiesMatrix.tsx   # block 5
    │   ├── ModelProviderTable.tsx        # block 6
    │   ├── ModelBenchmarksTable.tsx      # block 7
    │   ├── ModelRealWorldPerformance.tsx # block 8 (empty-state Phase 1 — gateway not yet)
    │   ├── ModelContextQuality.tsx       # block 9
    │   ├── ModelRateLimits.tsx           # block 10
    │   ├── ModelAbout.tsx                # block 11
    │   ├── ModelNewsList.tsx             # block 12 — uses queries/news/listForResource
    │   ├── ModelDealsList.tsx            # block 13
    │   ├── ModelWorksWellWith.tsx        # block 14
    │   ├── ModelCompareLauncher.tsx      # block 15
    │   ├── ModelAlternatives.tsx         # block 16 — uses queries/resources/alternatives
    │   ├── ModelCommunityVerdict.tsx     # block 17
    │   ├── ModelPromptingTips.tsx        # block 18
    │   ├── ModelSafetyCompliance.tsx     # block 19
    │   ├── ModelDeveloperReference.tsx   # block 20 — Shiki snippets in 6 SDKs (lazy-loaded)
    │   ├── ModelTimeline.tsx             # block 21 (lazy-loaded)
    │   ├── ModelSourcesMethodology.tsx   # block 22 (lazy-loaded accordion)
    │   └── ModelDetailLoadingSkeleton.tsx
    ├── loading.tsx                       # uses ModelDetailLoadingSkeleton
    ├── error.tsx
    ├── not-found.tsx
    └── opengraph-image.tsx
```

The same `components/` pattern repeats per type folder. Type-specific Zone-5 blocks live colocated; the cross-type chassis (`DetailHero`, `DetailStatsStrip`, `DetailTabBar`, `DetailRightRail`, `DetailMobileBottomBar`, plus zones 6/7/8/9) lives in `components/resources/`.

For 18+ resource types whose detail pages are simpler (mostly Zone 1-4, 6-9 with a single Zone-5 block), the page is ~30 lines:

```tsx
// app/skills/[slug]/page.tsx
import { DetailChassis } from '@/components/resources/DetailChassis';
import { SkillViewer } from './components/SkillViewer';
import { getResourceBySlug } from '@/lib/queries/resources/getBySlug';

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug('skill', slug);
  if (!resource) notFound();
  return (
    <DetailChassis resource={resource}>
      <SkillViewer skill={resource.skill} />  {/* the single Zone-5 block */}
    </DetailChassis>
  );
}
```

---

## §7 `scripts/` — ingestion + dev tooling

```
scripts/
├── ingest/
│   ├── _shared/                          # ↪ re-exports from lib/ingestion/_shared/ (for ergonomics)
│   ├── openrouter.ts                     # GHA: every 6h
│   ├── shadcn.ts                         # GHA: daily
│   ├── 21st.ts                           # GHA: daily incremental + weekly full
│   ├── mcp-registry.ts                   # GHA: every 6h
│   ├── smithery.ts                       # GHA: every 6h
│   ├── awesome-claude-plugins.ts         # GHA: daily
│   ├── awesome-agent-skills.ts           # GHA: daily
│   ├── github-code-search.ts             # GHA: daily incremental + weekly full
│   ├── cursor-directory.ts               # GHA: daily
│   ├── buildwithclaude.ts                # GHA: daily
│   ├── arxiv-papers.ts                   # GHA: daily
│   ├── product-hunt-rss.ts               # GHA: daily
│   ├── github-stargazer-velocity.ts      # GHA: daily (per ingest)
│   ├── hn-algolia.ts                     # GHA: daily
│   └── README.md                         # how to run locally, how to add a new source
│
├── dev/
│   ├── seed-from-bundle.ts               # reads editorial-seed/, populates DB (alias of db/seed/seed.ts)
│   ├── reset.ts                          # drop + migrate + seed
│   ├── generate-types.ts                 # generates Drizzle types diff vs canonical schema.sql
│   ├── benchmark-routes.ts               # runs Lighthouse against the audit list (ARCHITECTURE §3 perf table)
│   ├── audit-tokens.ts                   # greps codebase for hardcoded hex/px values not in tokens
│   ├── bundle-analyze.ts                 # next/bundle-analyzer wrapper
│   └── verify-rss.ts                     # runs feed.rss through W3C validator (Q2.4 amendment)
│
├── ops/
│   ├── slack-notify.ts                   # standalone Slack notifier (used by GHA failures)
│   ├── purge-soft-deletes.ts             # standalone for one-off admin runs
│   └── recompute-trending.ts             # manual trending refresh
│
└── one-offs/                             # checked-in scripts for known one-time tasks
    ├── seed-benchmark-scores.ts          # ingest top-12-models AA snapshot (Q1.4)
    ├── populate-best-for-from-bundle.ts  # parses editorial-seed/best-for/*.md → best_for rows
    └── README.md
```

---

## §8 `tests/` — Vitest + Playwright

```
tests/
├── unit/                                 # Vitest
│   ├── lib/
│   │   ├── format/
│   │   │   ├── currency.test.ts
│   │   │   ├── number.test.ts
│   │   │   ├── date.test.ts
│   │   │   └── relative-time.test.ts
│   │   ├── search/
│   │   │   ├── ranker.test.ts
│   │   │   └── hybrid.test.ts
│   │   ├── stack/
│   │   │   ├── cookie.test.ts
│   │   │   └── seedFromCookie.test.ts
│   │   ├── i18n/
│   │   │   └── plural.test.ts
│   │   ├── auth/
│   │   │   ├── return-to.test.ts         # whitelist same-origin
│   │   │   └── is-admin.test.ts
│   │   ├── http/
│   │   │   ├── ip.test.ts
│   │   │   └── safe-fetch.test.ts
│   │   ├── pricing/
│   │   │   ├── tiers.test.ts
│   │   │   └── trialEligibility.test.ts
│   │   └── safe/
│   │       └── sanitize.test.ts
│   └── schemas/
│       ├── auth.test.ts
│       ├── submit.test.ts
│       └── reviews.test.ts
│
├── integration/                          # Vitest with mocked Drizzle / Stripe / Resend
│   ├── actions/
│   │   ├── bookmarks.test.ts
│   │   ├── stacks.test.ts
│   │   ├── reviews.test.ts
│   │   ├── stripe-checkout.test.ts
│   │   └── moderation.test.ts
│   └── api/
│       ├── webhooks-stripe.test.ts       # signature verification + handler routing
│       ├── webhooks-resend.test.ts
│       ├── firehose.test.ts              # SSE stream behaviour
│       └── health.test.ts
│
├── e2e/                                  # Playwright — 5 critical flows only
│   ├── playwright.config.ts
│   ├── 01-signup.spec.ts                 # GitHub OAuth (mocked provider)
│   ├── 02-signin.spec.ts
│   ├── 03-bookmark.spec.ts               # logged-in user adds/removes bookmark, verifies dashboard
│   ├── 04-build-stack.spec.ts            # Stack Picker → save → verify in DB
│   ├── 05-pro-checkout.spec.ts           # full Stripe test-mode flow
│   ├── _fixtures/
│   │   ├── seed-test.json                # 10-resource test fixture
│   │   ├── mockOAuth.ts                  # mocked GitHub OAuth provider
│   │   └── stripe-test-card.ts
│   └── README.md
│
└── helpers/
    ├── db-test.ts                        # connects to vibecoderhub-test Supabase project
    ├── auth-test.ts                      # creates/disposes test users
    └── reset-fixtures.ts                 # drops + re-seeds before each Playwright run
```

---

## §9 `editorial-seed/` — Ben's bundle drop zone

```
editorial-seed/                           # contents arrive as Ben's editorial bundle
├── README.md                             # describes expected structure (we own this)
├── seed.json                             # all-in-one bundle alternative format
├── presets/                              # 30 curated stack presets
│   ├── 01-solo-saas.json
│   ├── 02-marketing-site.json
│   ├── 03-ai-chatbot.json
│   ├── ...
│   └── 30-data-pipeline.json
├── agents/                               # 4 AGENT.md personalities
│   ├── workflow-author.md
│   ├── news-editor.md
│   ├── guide-writer.md
│   └── reviewer-qa.md
├── guides/                               # 10 evergreen guides
│   ├── install-qwen-on-mac.md
│   ├── connect-supabase-to-cursor.md
│   ├── ...
│   └── (10 total)
├── newsletter/
│   └── issue-001-launch.tsx              # React Email template for the first issue
├── best-for/                             # 36+ best-for rows (top-3 per use case)
│   ├── saas-mvp.md                       # ranked picks + rationale
│   ├── landing-page.md
│   ├── chatbot.md
│   ├── ...                               # (12 files, one per use case)
├── benchmarks/
│   └── top-12-models-snapshot.json       # one-time AA scrape (Q1.4)
└── rss-sources.json                      # 50 RSS feed URLs for news ingestion
```

`db/seed/seed.ts` reads this folder. Phase C builds the consumer; Ben drops the contents before launch.

---

## §10 `.github/`, `.vscode/`, `docs/`, `public/`

```
.github/
├── workflows/
│   ├── ci.yml                            # typecheck + lint + build + Vitest on PR + push to main
│   ├── e2e.yml                           # Playwright on PR + push to main
│   ├── deploy-preview.yml                # Vercel preview hook (mostly auto)
│   ├── ingest-openrouter.yml             # cron + workflow_dispatch
│   ├── ingest-shadcn.yml
│   ├── ingest-21st.yml
│   ├── ingest-mcp-registry.yml
│   ├── ingest-smithery.yml
│   ├── ingest-awesome-claude-plugins.yml
│   ├── ingest-awesome-agent-skills.yml
│   ├── ingest-github-code-search.yml
│   ├── ingest-cursor-directory.yml
│   ├── ingest-buildwithclaude.yml
│   ├── ingest-arxiv-papers.yml
│   ├── ingest-product-hunt-rss.yml
│   ├── ingest-github-stargazer.yml
│   ├── ingest-hn-algolia.yml
│   └── lighthouse.yml                    # nightly perf audit on the audit list
├── ISSUE_TEMPLATE/
│   ├── bug.yml
│   ├── feature.yml
│   └── ingestion-source.yml
├── PULL_REQUEST_TEMPLATE.md
├── dependabot.yml                        # weekly minor/patch updates
└── CODEOWNERS                            # solo-dev: @benhope on everything

.vscode/
├── settings.json                         # editor.formatOnSave, ESLint, Prettier
├── extensions.json                       # recommended extensions
└── launch.json                           # Next.js debug config

docs/
├── DEPLOYMENT_RUNBOOK.md                 # ← created at end of Phase C (per build-prompt §D)
├── ADMIN_GUIDE.md                        # how Ben uses /admin
├── INGESTION_PLAYBOOK.md                 # how to add a new ingestion source
├── INCIDENT_RESPONSE.md                  # what to do when something breaks
└── adrs/                                 # architectural decision records
    ├── 0001-drizzle-over-prisma.md
    ├── 0002-next-safe-action.md
    ├── 0003-postgres-rate-limiting.md
    ├── 0004-no-component-playground-phase-1.md
    └── (future ADRs as decisions accumulate)

public/
├── favicon.ico                           # generated by app/icon.tsx for older browsers
├── apple-touch-icon.png                  # generated by app/apple-icon.tsx
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── manifest.json                         # PWA manifest (lightweight; not a full PWA Phase 1)
└── og-fallback.png                       # 1200x630 fallback if dynamic OG generation fails
```

---

## §11 `.env.example` — the canonical env list

```bash
# ── PUBLIC (ships to browser) ─────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=https://vibecoderhub.com         # for OG images, sitemaps
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# ── SUPABASE (server-only) ────────────────────────────────────────────
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL_POOLED=postgresql://...?pgbouncer=true   # port 6543, transaction-mode pooler
DATABASE_URL_DIRECT=postgresql://...                  # port 5432, migrations only

# ── AUTH (admin allow-list) ───────────────────────────────────────────
ADMIN_GITHUB_USER_IDS=12345678                        # comma-separated GitHub user IDs (Q2.6)

# ── STRIPE ────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...                  # the single $99/yr price (Q1.5)

# ── RESEND ────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...
RESEND_FROM_TRANSACTIONAL=notify@vibecoderhub.com
RESEND_FROM_NEWSLETTER=news@vibecoderhub.com
RESEND_WEBHOOK_SECRET=...

# ── OPENAI (embeddings) ───────────────────────────────────────────────
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDINGS_MONTHLY_BUDGET_USD=50               # alert threshold

# ── REPLICATE (NSFW) ──────────────────────────────────────────────────
REPLICATE_API_TOKEN=r8_...

# ── CLOUDFLARE R2 ─────────────────────────────────────────────────────
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vch-raw-dumps
R2_PUBLIC_URL=https://vch-raw-dumps.<account>.r2.cloudflarestorage.com

# ── GITHUB (ingestion) ────────────────────────────────────────────────
GITHUB_INGESTION_TOKEN=ghp_...                        # PAT with repo, read:org, read:user

# ── SENTRY (server) ───────────────────────────────────────────────────
SENTRY_AUTH_TOKEN=...                                 # source-map upload
SENTRY_ORG=vibecoderhub
SENTRY_PROJECT=vibecoderhub-web

# ── POSTHOG (server-side captures) ────────────────────────────────────
POSTHOG_API_KEY=phc_...                               # same as NEXT_PUBLIC_POSTHOG_KEY usually

# ── OPS ───────────────────────────────────────────────────────────────
SLACK_OPS_WEBHOOK_URL=https://hooks.slack.com/services/...

# ── RUNTIME ───────────────────────────────────────────────────────────
NODE_ENV=development                                  # development | production | test
LOG_LEVEL=debug                                        # debug | info | warn | error
VCH_ENV=local                                          # local | preview | production (used by db:migrate guard)
VERCEL_GIT_COMMIT_SHA=                                 # auto-populated by Vercel; used for Sentry release tagging
```

`lib/env.ts` validates each at boot via Zod. Missing required → app fails to start with a clear error message naming the var.

---

## §12 `package.json` scripts (locked)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx scripts/dev/migrate.ts",
    "db:migrate:reset": "tsx scripts/dev/reset.ts",
    "db:seed": "tsx scripts/dev/seed-from-bundle.ts",
    "db:reset": "tsx scripts/dev/reset.ts",
    "db:studio": "drizzle-kit studio",
    "ingest:all": "tsx scripts/ingest/_shared/run-all.ts",
    "ingest:openrouter": "tsx scripts/ingest/openrouter.ts",
    "ingest:shadcn": "tsx scripts/ingest/shadcn.ts",
    "ingest:21st": "tsx scripts/ingest/21st.ts",
    "ingest:mcp-registry": "tsx scripts/ingest/mcp-registry.ts",
    "ingest:smithery": "tsx scripts/ingest/smithery.ts",
    "ingest:awesome-claude-plugins": "tsx scripts/ingest/awesome-claude-plugins.ts",
    "ingest:awesome-agent-skills": "tsx scripts/ingest/awesome-agent-skills.ts",
    "ingest:github-code-search": "tsx scripts/ingest/github-code-search.ts",
    "ingest:cursor-directory": "tsx scripts/ingest/cursor-directory.ts",
    "ingest:buildwithclaude": "tsx scripts/ingest/buildwithclaude.ts",
    "ingest:arxiv": "tsx scripts/ingest/arxiv-papers.ts",
    "ingest:product-hunt": "tsx scripts/ingest/product-hunt-rss.ts",
    "ingest:github-stargazer": "tsx scripts/ingest/github-stargazer-velocity.ts",
    "ingest:hn": "tsx scripts/ingest/hn-algolia.ts",
    "audit:tokens": "tsx scripts/dev/audit-tokens.ts",
    "audit:bundle": "tsx scripts/dev/bundle-analyze.ts",
    "audit:lighthouse": "tsx scripts/dev/benchmark-routes.ts",
    "audit:rss": "tsx scripts/dev/verify-rss.ts",
    "ci": "pnpm typecheck && pnpm lint && pnpm test:run && pnpm build"
  }
}
```

---

## §13 What's NOT in this tree (deferred to Phase 2)

For clarity, things explicitly absent from Phase 0+1 build:

- **Sandpack live playgrounds** (`components/playground/Sandpack*.tsx`) — Q1.1 deferral
- **Live MCP tool invocation** (would need WebSocket proxy + sandboxing) — Q1.1 deferral; the read-only inspector exists
- **Open-weights hardware sizing block** (`components/models/HardwareSizingBlock.tsx`, `app/models/by-hardware/` is a placeholder Phase 1) — Q1.1 deferral
- **Gateway runtime** (`app/gateway/`, `lib/gateway/`, the actual proxy) — schema tables exist, the feature lives Phase 2+
- **CLI (`vchctl`)** — Phase 3 per master plan
- **Author tools dashboard analytics** (`app/(app)/dashboard/author/` is a stub) — Phase 2
- **Public read-only JSON API** (RSS feeds ship Phase 1; JSON API is Phase 2) — Q3.6
- **Light mode CSS** — Phase 2 per ruling R3 (architecture is light-ready)
- **Multi-language i18n locales** — Phase 2 (architecture is i18n-ready)
- **Conference / awards / annual report infra** — Phase 4-5
- **Enterprise white-label** — Phase 5

---

## §14 File counts summary

Approximate counts at end of Phase C (Phase 1 launch):

| Bucket | Count |
|---|---|
| Page routes (`page.tsx`) | ~115 |
| `loading.tsx` files | ~80 |
| `error.tsx` files | ~95 |
| `not-found.tsx` files | ~30 |
| `opengraph-image.tsx` files | ~35 |
| API route files (`route.ts`) | ~12 |
| Layouts (`layout.tsx`) | 5 |
| Cross-page components (`components/**`) | ~150 |
| Page-colocated components (`app/**/components/**`) | ~120 |
| `lib/` modules | ~110 |
| Drizzle schema files | ~5 |
| Server Actions | ~50 |
| Read queries | ~25 |
| Ingestion scripts | 13 + shared helpers |
| Vitest tests | ~60 |
| Playwright e2e tests | 5 + fixtures |
| GHA workflows | ~15 |
| React Email templates | 13 |
| **Total source files (rough)** | **~950** |

Bundle size impact: most of those are Server Components (zero client JS) or React Email templates (server-rendered to HTML, never shipped to client). The shippable JS for any single route stays well under 200KB gzipped per the perf budget (Q3.3), with the model detail page exception at 300KB.

---

## §15 What this document gates

- **Phase B B4 (`MIGRATION_ORDER.md`)** orders against §5 (db structure) + §10 (env vars) + §13 (deferral list).
- **Phase B B5 (`DEPENDENCY_GRAPH.md`)** maps which files block which; the route map in §2 anchors the slice ordering.
- **Phase B B6 (`PHASE_0_1_CHECKLIST.md`)** maps every master-plan checkbox to file paths from this tree.
- **Phase C every slice** creates files at the paths declared here. If a Phase C choice would create a file outside this tree, surface via `🛑 STOPPING`.
- **Phase D Pass 2 (functional sweep)** verifies the per-route files (`loading.tsx`, `error.tsx`, etc.) exist and behave as specified.
