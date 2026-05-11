# MIGRATION_ORDER.md

*Phase B artifact 4 (build-prompt B4). The exact sequence to bring the system from empty repo to first-slice-shippable.*

---

## §1 Sequencing principle

Two rules drive the order:

1. **Fail-early dependencies first.** If env vars are missing or the DB connection doesn't work, nothing else matters — those go first so failure surfaces at minute 5, not minute 50.
2. **No two steps require the same external service to exist simultaneously.** Each external service (Supabase project, Stripe account, Resend domain, etc.) becomes available *before* the step that needs it; we never assume "I'll set this up later."

Steps are grouped by phase. Within a phase, order is strict — do not skip ahead.

---

## §2 Pre-Phase-C bootstrap (must complete before any code in `app/`)

### 2.1 External accounts (Ben provides credentials per `ANSWERS.md` §credentials)

In order:

1. **GitHub repo created** (`github.com/<org>/vibecoderhub-web`), branch protection on `main`, PAT generated for ingestion (`repo`, `read:org`, `read:user` scopes).
2. **Supabase project provisioned** (`vibecoderhub-prod`, Pro plan $25/mo, region per Ben's latency preference). Project URL + service-role key + anon key + pooled DB connection string + direct connection string captured.
3. **Vercel project linked** to the GitHub repo. Auto-deploy from `main`. Custom domain (`vibecoderhub.com`) added (DNS via Cloudflare; apex + www both pointed at Vercel).
4. **Cloudflare R2 bucket** `vch-raw-dumps` (already provisioned per master plan); R/W keys captured.
5. **Stripe account** verified, test mode keys + webhook signing secret captured. Live keys held until post-launch.
6. **Resend account**: domain `vibecoderhub.com` verified, SPF/DKIM/DMARC configured, `notify@` and `news@` sub-addresses verified, API key captured.
7. **Sentry project** created, DSN + source-map upload token captured.
8. **PostHog project** created (free tier), API key captured.
9. **OpenAI account**: API key with $100/mo budget cap (covers embeddings + agent costs).
10. **Replicate account**: API token with low budget cap (covers NSFW pre-screen).
11. **Slack workspace** with `#vch-ops` channel + incoming webhook for ingestion failure notifications.

Failure to complete any of (1)–(11) blocks Phase C entry.

### 2.2 Repo skeleton

In order. Each step's commit message follows Conventional Commits:

```
1. git init + initial scaffold (Next.js 15 + TS + pnpm + Tailwind v4 + shadcn CLI installed)
   commit: chore: initial scaffold (Next.js 15, TS strict, Tailwind v4, shadcn)
2. .env.example + .gitignore + .nvmrc + .vscode/
   commit: chore: env scaffolding and editor config
3. Prettier + ESLint flat config + Conventional Commits hook (commitlint via husky)
   commit: chore: linting, formatting, commit hooks
4. tsconfig.json (strict mode + path aliases @/lib, @/components, @/db)
   commit: chore: typescript strict + path aliases
5. package.json scripts (per DIRECTORY_TREE.md §12)
   commit: chore: package scripts (dev/build/test/db/ingest/audit)
6. .github/workflows/ci.yml (typecheck + lint + Vitest on PR + main)
   commit: ci: typecheck/lint/test pipeline on PR
7. README.md + CONTRIBUTING.md (skeleton)
   commit: docs: readme + contributing skeleton
```

After §2.2: `pnpm dev` boots an empty Next.js app at `localhost:3000`.

---

## §3 Database migration order

**Authoritative file:** `/specs/vibe-coder-hub-schema.sql` (1,831 lines, untouchable per Q1.1).

### 3.1 Migration sequence

```
0001_initial.sql                    # symlink/copy of vibe-coder-hub-schema.sql (canonical schema)
0002_rate_limit_buckets.sql         # operational table — see §3.2 (carve-out per Q1.1 + Flag 1)
0003_ingestion_runs.sql             # operational table IF not already in canonical schema (verify in 3.3)
```

### 3.2 Operational table sql (locked content)

```sql
-- 0002_rate_limit_buckets.sql
-- Operational table for ARCHITECTURE.md §10 sliding-window rate limit.
-- Approved under operational carve-out (does not touch resource model).

create table rate_limit_buckets (
  bucket_key   text not null,
  bucket_at    timestamptz not null,
  count        int default 0 not null,
  primary key (bucket_key, bucket_at)
);
create index rate_limit_buckets_recent_idx on rate_limit_buckets (bucket_at);

-- RLS: deny by default. Only service-role writes (via lib/server/ratelimit.ts).
alter table rate_limit_buckets enable row level security;
-- No SELECT/INSERT/UPDATE/DELETE policies → only service-role bypasses.
```

```sql
-- 0003_ingestion_runs.sql (only if NOT in canonical schema — verify first)
-- Operational table for ingestion script logging (data-sourcing §19).
-- Approved under operational carve-out.

create table ingestion_runs (
  id              uuid primary key default gen_random_uuid(),
  source_slug     text not null,                       -- 'openrouter', 'shadcn', etc.
  priority        text not null default 'normal',      -- 'critical' | 'high' | 'normal' (Q2.1 addition)
  started_at      timestamptz default now() not null,
  completed_at    timestamptz,
  status          text not null default 'running',     -- 'running' | 'success' | 'failed' | 'partial'
  records_inserted int default 0 not null,
  records_updated  int default 0 not null,
  records_failed   int default 0 not null,
  error_message    text,
  raw_dump_r2_key  text,                                -- pointer to the R2 raw dump
  metadata         jsonb default '{}'::jsonb
);
create index ingestion_runs_source_idx on ingestion_runs (source_slug, started_at desc);
create index ingestion_runs_priority_idx on ingestion_runs (priority, status, started_at desc);
create index ingestion_runs_recent_idx on ingestion_runs (started_at desc);

alter table ingestion_runs enable row level security;
-- Admin read only (via app-layer is_admin check in queries; service-role inserts).
```

### 3.3 Canonical-schema verification step

Before 0002/0003 run, grep `/specs/vibe-coder-hub-schema.sql` for `ingestion_runs` and `rate_limit_buckets`. If found, drop the duplicate operational migration. Document in `BUILD_LOG.md`:

```
- ingestion_runs: NOT in canonical schema → operational migration 0003 added under carve-out
- rate_limit_buckets: NOT in canonical schema → operational migration 0002 added under carve-out
```

### 3.4 Migration commands (per environment)

```bash
# Local — against local Supabase
pnpm db:migrate                            # runs 0001, 0002, 0003 against DATABASE_URL_DIRECT (port 5432)

# Preview — against vibecoderhub-dev
VCH_ENV=preview pnpm db:migrate

# Production — against vibecoderhub-prod
VCH_ENV=production pnpm db:migrate --force # --force flag required to prevent accidental prod migration
```

The `db:migrate` script (see DIRECTORY_TREE.md §12) is `tsx scripts/dev/migrate.ts` — refuses to run against `production` without `--force`.

### 3.5 Storage buckets (created via Supabase dashboard, NOT via migration)

After §3.4 completes, create these buckets in the Supabase dashboard:

| Bucket | Public? | Notes |
|---|---|---|
| `avatars` | public | resized 256/512/1024 by Edge Function on upload |
| `resource-thumbnails` | public | admin-managed |
| `resource-screenshots` | public | admin-managed |
| `showcase-screenshots` | public | post-moderation only |
| `news-hero-images` | public | admin-managed |
| `submissions-temp` | private | pending moderation |
| `gateway-secrets` | private | service-role only (Phase 2) |

Storage RLS policies set in dashboard per the schema's §19 comment.

### 3.6 pg_cron job registration

After §3.4 completes, register pg_cron jobs from `db/pg-cron/*.sql`. Each is a single SQL command run via the Supabase SQL editor:

```sql
-- 001-refresh-trending.sql
select cron.schedule('refresh-trending', '0 3 * * *',
  $$refresh materialized view concurrently v_trending_per_type$$);

-- 002-decay-install-counts.sql
select cron.schedule('decay-install-counts', '0 * * * *',
  $$update resources set
    install_count_7d = greatest(install_count_7d - install_count_7d / 168, 0),
    install_count_30d = greatest(install_count_30d - install_count_30d / 720, 0)
  where install_count_7d > 0 or install_count_30d > 0$$);

-- 003-weekly-digest.sql (Edge Function trigger)
select cron.schedule('weekly-digest', '0 9 * * 2',
  $$select net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/send-weekly-digest',
    headers := '{"Authorization": "Bearer <service-role-key>"}'
  )$$);

-- 004-expire-deals.sql
select cron.schedule('expire-deals', '0 0 * * *',
  $$update deals set status = 'expired'
    where expires_at < now() and status = 'active'$$);

-- 005-purge-rate-limits.sql
select cron.schedule('purge-rate-limits', '0 4 * * *',
  $$delete from rate_limit_buckets
    where bucket_at < now() - interval '1 hour'$$);

-- 006-hard-delete-accounts.sql
select cron.schedule('hard-delete-accounts', '0 4 * * *',
  $$select net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/hard-delete-soft-deleted',
    headers := '{"Authorization": "Bearer <service-role-key>"}'
  )$$);

-- 007-embedding-backfill.sql
select cron.schedule('embedding-backfill', '0 3 * * *',
  $$select net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/generate-embeddings',
    headers := '{"Authorization": "Bearer <service-role-key>"}'
  )$$);
```

Edge Functions referenced above (`send-weekly-digest`, `hard-delete-soft-deleted`, `generate-embeddings`) are deployed in §6 below.

---

## §4 App boot order (within `app/`)

After §3 is green, app code lands in this strict order. Each step is a separate commit, each commit ends with `pnpm typecheck && pnpm lint && pnpm build` passing.

```
Step 1.  lib/env.ts                       # Zod-validated env vars; app fails to boot on missing
                                          # commit: feat(env): zod-validated env scaffolding

Step 2.  lib/tokens.ts                    # design tokens as TS constants (from TOKEN_RECONCILIATION.md)
         app/globals.css                  # CSS variables generated from tokens
         tailwind.config.ts               # Tailwind extension generated from tokens
         postcss.config.mjs
                                          # commit: feat(tokens): design system scaffolding

Step 3.  db/schema.ts                     # Drizzle schema mirror (hand-mirrored from canonical)
         db/relations.ts
         db/enums.ts
         lib/server/db.ts                 # pooled connection
         lib/server/db-direct.ts          # direct connection (migrations only)
         lib/server/db-service.ts         # service-role client
                                          # commit: feat(db): drizzle client + schema mirror

Step 4.  lib/server/ratelimit.ts          # sliding-window rate limit helper
         lib/http/request-id.ts           # AsyncLocalStorage UUID propagation
         lib/http/ip.ts                   # parse x-forwarded-for safely
         middleware.ts                    # request-ID + protected-path matcher
                                          # commit: feat(http): request-id + ratelimit + middleware

Step 5.  sentry.client.config.ts          # Sentry SDK init
         sentry.server.config.ts
         sentry.edge.config.ts
         instrumentation.ts
         lib/logger.ts                    # Pino with redact + transports
                                          # commit: feat(observability): sentry + pino

Step 6.  lib/auth/server.ts               # auth() helper for Server Components/Actions
         lib/auth/client.ts               # browser client + useSession hook
         lib/auth/middleware.ts           # protected-path logic (consumed by middleware.ts)
         lib/auth/is-admin.ts             # ADMIN_GITHUB_USER_IDS check
         lib/auth/return-to.ts            # safe return-to URL handling
         app/auth/callback/route.ts       # OAuth code exchange
                                          # commit: feat(auth): supabase auth + admin check

Step 7.  components/theme/ThemeProvider.tsx          # cookie-backed theme (dark only)
         components/theme/ReducedMotionProvider.tsx
         components/stack-context/StackProvider.tsx  # user stack context
         components/analytics/PostHogProvider.tsx    # opt-in PostHog init
         components/layout/cookie-banner/CookieBanner.tsx
         app/layout.tsx                              # root layout wires the above + Toaster
                                          # commit: feat(layout): root providers + cookie banner

Step 8.  components/ui/button.tsx                    # 5 sizes × 5 variants
         components/ui/input.tsx                     # 3 sizes
         components/ui/label.tsx
         components/ui/badge.tsx
         components/ui/pill.tsx
         components/ui/card.tsx
         components/ui/skeleton.tsx
         components/ui/dialog.tsx
         components/ui/drawer.tsx
         components/ui/tooltip.tsx
         components/ui/popover.tsx
         components/ui/dropdown.tsx
         components/ui/tabs.tsx                      # URL-hash-driven tab implementation
                                                     # (per Ben's note: setActiveTab() updates both URL and scroll;
                                                     # single function, future nested-route conversion is one refactor)
         components/ui/toast.tsx
         components/ui/toaster.tsx
         components/ui/icon-button.tsx
         components/ui/avatar.tsx
                                          # commit: feat(ui): primitives (button, input, card, dialog, tabs, etc.)
                                          # NOTE: shadcn primitives customised per TOKEN_RECONCILIATION;
                                          # NOT default shadcn theme.

Step 9.  components/icons/Icon.tsx                   # Lucide wrapper, 1.5px stroke
         components/icons/ProviderLogos/*
         components/icons/ClientLogos/*
                                          # commit: feat(icons): lucide wrapper + provider/client logos

Step 10. components/layout/header/* (all 7 files)
         components/layout/footer/*
         components/layout/mobile-nav/*
         components/layout/stack-banner/*
         components/layout/skip-link/*
         components/layout/breadcrumb/*
                                          # commit: feat(layout): header, footer, mobile nav, breadcrumb

Step 11. app/(marketing)/layout.tsx                  # marketing route group
         app/(app)/layout.tsx                        # app route group
         app/(admin)/layout.tsx                      # admin route group (with admin-check)
         app/error.tsx, app/global-error.tsx        # root error boundaries
         app/not-found.tsx                           # root 404
         app/(marketing)/error.tsx, loading.tsx
         app/(app)/error.tsx
         app/(admin)/error.tsx
         components/error-states/* (all)
         components/empty-states/* (all)
                                          # commit: feat(layout): route groups + error boundaries + empty states

Step 12. lib/actions/_client.ts                      # createSafeActionClient + auth middleware
         lib/queries/* (the read queries needed by foundation slice)
         lib/format/* (currency, number, date, relative-time)
         lib/i18n/_t.ts                              # the t() helper
         lib/i18n/en.ts                              # all English strings (initial set)
         lib/i18n/intl.ts                            # Intl.* helpers
         lib/safe/sanitize.ts                        # markdown sanitizer
                                          # commit: feat(lib): action client + queries + format + i18n + sanitize
```

**End of foundation phase.** App boots, navigation works, theme + auth + DB queries + rate-limiting all functional. First slice can now build (per master plan Phase 0+1 sequence — see `PHASE_0_1_CHECKLIST.md`).

---

## §5 First slice (foundation slice) build order

After §4, the foundation slice ships before any per-feature slice. It's the proof that the full stack works end-to-end.

```
Slice F: Foundation (foundation slice) — vertical slice that proves auth + DB + UI all work together.

Includes:
  - app/(marketing)/page.tsx                # / landing page (marketing-grade hero + live stats bar)
  - app/(marketing)/home/page.tsx           # /home (logged-in landing — empty for new user, prompts stack picker)
  - app/auth/callback/route.ts              # OAuth callback (lives from §4 Step 6 — verified working)
  - components/auth/AuthModal.tsx           # sign in / sign up modal
  - components/stack-picker/* (all 6 files) # the Stack Picker modal
  - lib/actions/auth/signOut.ts             # sign-out action
  - lib/actions/stacks/save.ts              # save stack action
  - lib/actions/newsletter/subscribe.ts     # newsletter signup (footer CTA)
  - lib/queries/resources/listTrending.ts   # populates the home "Trending" strip
  - lib/queries/resources/listByStack.ts    # populates "For your stack" row
  - components/cmdk/* (all 7 files)         # Cmd-K palette (skeleton; results from listTrending)
  - app/api/health/route.ts                 # health check (DB-status)
  - app/sitemap.ts                          # sitemap generator
  - app/robots.ts                           # robots.txt
  - app/icon.tsx, app/apple-icon.tsx        # favicon + apple touch icon
  - app/opengraph-image.tsx                 # default OG (1200×630)
  - tests/e2e/01-signup.spec.ts             # GitHub OAuth signup flow
  - tests/e2e/02-signin.spec.ts             # sign-in flow

Acceptance criteria (per DEFINITION_OF_DONE.md):
  - User can land on /, see hero, click Sign Up → GitHub OAuth → return to /home
  - User can open Cmd-K (⌘K), see Trending results, click → navigate
  - User can open Stack Picker from header chip, save a stack, see /home reshape
  - User can sign out
  - /api/health returns 200 with {db: 'ok', sha: '<commit-sha>'}
  - All breakpoints (375 / 768 / 1024 / 1440 / 1920) render without horizontal scroll
  - Lighthouse perf ≥90 on /
  - All Make-Sure checklist items applicable to this slice verified
```

After Slice F: per-feature slices follow the master-plan order in `PHASE_0_1_CHECKLIST.md`.

---

## §6 Edge Functions deployment order

Edge Functions deployed via `supabase functions deploy <name>`. Order:

```
1. send-weekly-digest          # called by 003-weekly-digest pg_cron job (Tuesday 9am UTC)
2. hard-delete-soft-deleted    # called by 006-hard-delete-accounts (nightly)
3. generate-embeddings         # called by 007-embedding-backfill (nightly)
4. process-image-upload        # called by Storage trigger on avatar upload (Sharp + Replicate NSFW)
5. moderate-showcase-image     # called by Storage trigger on showcase upload
```

Each Edge Function has its own folder in `supabase/functions/<name>/index.ts` (the standard Supabase layout — slightly outside the `app/` tree but inside the repo root).

```
supabase/
├── config.toml                            # Supabase CLI config
└── functions/
    ├── send-weekly-digest/
    │   ├── index.ts
    │   └── _shared/
    ├── hard-delete-soft-deleted/
    │   └── index.ts
    ├── generate-embeddings/
    │   └── index.ts
    ├── process-image-upload/
    │   └── index.ts
    └── moderate-showcase-image/
        └── index.ts
```

> **Adds to DIRECTORY_TREE.md:** the `supabase/` folder. Update `DIRECTORY_TREE.md` §1 to include this folder. (Tracked in `BUILD_LOG.md` when Phase C begins.)

---

## §7 Vercel + GitHub secrets order

After §3 + §4 + §5 complete (i.e., the app boots and the foundation slice runs locally), populate Vercel + GitHub secrets in this order:

### 7.1 Vercel project env vars

Set via Vercel dashboard or `vercel env add`:

```
NEXT_PUBLIC_SUPABASE_URL                  → all environments
NEXT_PUBLIC_SUPABASE_ANON_KEY             → all environments
NEXT_PUBLIC_POSTHOG_KEY                   → all environments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY        → preview + production (test key for preview, live key for production)
NEXT_PUBLIC_SITE_URL                      → preview = preview URL, production = vibecoderhub.com
NEXT_PUBLIC_SENTRY_DSN                    → all environments

SUPABASE_SERVICE_ROLE_KEY                 → preview + production (NEVER local)
DATABASE_URL_POOLED                       → preview + production
DATABASE_URL_DIRECT                       → not in Vercel — local + GHA only

ADMIN_GITHUB_USER_IDS                     → preview + production
STRIPE_SECRET_KEY                         → preview = test, production = live
STRIPE_WEBHOOK_SECRET                     → preview + production (separate webhooks)
STRIPE_PRICE_ID_PRO_YEARLY                → preview + production

RESEND_API_KEY                            → preview + production
RESEND_FROM_TRANSACTIONAL                 → preview + production
RESEND_FROM_NEWSLETTER                    → preview + production
RESEND_WEBHOOK_SECRET                     → preview + production

OPENAI_API_KEY                            → preview + production
OPENAI_EMBEDDINGS_MONTHLY_BUDGET_USD      → preview + production

REPLICATE_API_TOKEN                       → preview + production

R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
R2_PUBLIC_URL                             → preview + production

SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT  → all environments
POSTHOG_API_KEY                           → preview + production
SLACK_OPS_WEBHOOK_URL                     → preview + production

LOG_LEVEL=info                            → production (debug for preview)
VCH_ENV=preview                           → preview
VCH_ENV=production                        → production
```

### 7.2 GitHub Actions secrets

Set via GitHub repo → Settings → Secrets → Actions:

```
SUPABASE_SERVICE_ROLE_KEY                 → for ingestion scripts (need service-role to write to DB)
DATABASE_URL_DIRECT                       → for migrations from CI
GITHUB_INGESTION_TOKEN                    → for ingestion scripts hitting GitHub API
OPENAI_API_KEY                            → for embedding generation in ingestion
R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
R2_BUCKET_NAME, R2_ACCOUNT_ID             → for raw-dump uploads
SLACK_OPS_WEBHOOK_URL                     → for failure notifications
SENTRY_AUTH_TOKEN                         → for source-map upload from Vercel build (also needed in CI for Sentry release tagging)
```

### 7.3 Stripe webhook endpoint registration

After 7.1 sets `STRIPE_WEBHOOK_SECRET`, register the webhook in Stripe dashboard:

```
Endpoint URL:    https://vibecoderhub.com/api/webhooks/stripe   (production)
Endpoint URL:    https://<preview>.vercel.app/api/webhooks/stripe  (preview test)
Events:          checkout.session.completed, customer.subscription.updated,
                 customer.subscription.deleted, invoice.paid, invoice.payment_failed
Signing secret:  → STRIPE_WEBHOOK_SECRET env var
```

### 7.4 Resend webhook endpoint

```
Endpoint URL:    https://vibecoderhub.com/api/webhooks/resend
Events:          email.bounced, email.complained
Signing secret:  → RESEND_WEBHOOK_SECRET env var
```

---

## §8 Domain + DNS

Already done per Ben's pre-empt: `vibecoderhub.com` registered, DNS via Cloudflare, apex + www pointed at Vercel.

Phase B3 verification:

- DNS A record (apex) → Vercel
- DNS CNAME (www) → cname.vercel-dns.com
- DNS TXT for SPF (Resend)
- DNS CNAME for DKIM (Resend, both `notify._domainkey` and `news._domainkey`)
- DNS TXT for DMARC (`v=DMARC1; p=quarantine; rua=mailto:dmarc@vibecoderhub.com`)
- Cloudflare proxy: OFF for the apex/www records (Vercel handles SSL); ON if we add edge rules later
- Cloudflare R2 bucket public CNAME (optional Phase 1)

---

## §9 Rollback procedure

If a Phase C migration goes wrong:

1. **App-level rollback:** revert the Vercel deployment to the previous green build via Vercel dashboard. Takes ~30 seconds.
2. **DB-level rollback:** PER-MIGRATION DOWN scripts maintained alongside UP scripts (`db/migrations/0002_rate_limit_buckets.down.sql` etc.). Run with `pnpm db:rollback --to=0001`.
3. **Schema-level rollback:** `pg_dump` snapshot taken before each migration in production (Supabase Pro auto-backups + manual pre-migration snapshot). Restore via Supabase dashboard.
4. **Catastrophic rollback:** if the production DB is corrupted, restore from Supabase's daily PITR (Point-In-Time Recovery — Pro plan retains 7 days). RTO ~30 minutes.

Documented in detail in `docs/DEPLOYMENT_RUNBOOK.md` (Phase C end).

---

## §10 What gates what (cross-reference)

| Step | Gates |
|---|---|
| §2.1 (external accounts) | gates §3 (DB migration), §4 (app boot), §7 (env config) |
| §3 (DB migration) | gates §4 Step 3 (Drizzle client), §5 (foundation slice queries), §6 (Edge Functions) |
| §3.5 (storage buckets) | gates §6 Edge Function #4 (process-image-upload), avatar upload feature |
| §3.6 (pg_cron) | gates §6 Edge Functions #1, #2, #3, #5 (cron-triggered) |
| §4 Step 1 (`lib/env.ts`) | gates **everything** in §4 — every other step imports validated env vars |
| §4 Step 2 (tokens) | gates §4 Step 8 (UI primitives), all components |
| §4 Step 3 (db client) | gates §4 Step 6 (auth — uses db.profiles), §5 (foundation slice queries) |
| §4 Step 6 (auth) | gates §4 Step 7 (StackProvider — needs current user), §5 (foundation slice — Stack Picker requires auth) |
| §4 Step 8 (UI primitives) | gates §4 Step 10 (layout components — use primitives) |
| §4 Step 11 (route group layouts) | gates every page in Phase C |
| §5 (foundation slice) | gates every per-feature slice in Phase C |
| §6 (Edge Functions) | gates pg_cron-triggered automation; ingestion; image processing |
| §7 (Vercel/GHA secrets) | gates production deploy + ingestion scripts running |
