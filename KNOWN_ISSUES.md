# KNOWN_ISSUES.md

*Items deferred during Phase C, with reasoning + when they'll land. Reviewed at session-end and pre-launch.*

---

## Active deferrals (Phase 2+)

### From Phase A rulings

- **Light mode** — deferred to Phase 2 per ruling R3. Architecture is light-ready (CSS variables, no hardcoded colours, theme provider planned for Boot Step 7); no light-mode CSS tokens defined; no light-mode testing required Phase 1.
- **Live Sandpack component playgrounds** — deferred per Q1.1 ruling. Sandpack iframe needs ~1 week of integration + security review. Phase 1 component detail pages omit the playground block; Promptkit's screenshot serves as visual reference.
- **Live MCP tool invocation** — deferred per Q1.1. WebSocket proxy + sandboxing required. Phase 1 ships the **read-only** MCP Tool Inspector — parses tools/resources/prompts from `mcps.tools` jsonb, displays input schema as a structured form, but no execution.
- **Open-weights hardware sizing block** — deferred per Q1.1. Phase 1 captures `user_stacks.hardware_profile` jsonb via the Stack Picker (data captured) but no recommendations engine consumes it yet. `/models/by-hardware` exists as a placeholder.
- **Hosted gateway runtime** — Phase 2+. Schema's `gateway_*` tables exist but unused; `/dashboard/gateway` is a "coming soon" placeholder for Pro users.
- **Public read-only JSON API** — deferred per Q3.6. RSS feeds ship Phase 1; JSON API is Phase 2 ("coming soon" in `/dashboard/api-keys`).
- **30-min RSS poll cadence degraded to 60-min on GHA** — per Q1.2. GHA cron has 5-min minimum reliability floor. Per data-sourcing §25, "Source: stale" badge surfaces when critical sources >24h.
- **GDPR data export job** — Phase 1 stretch per Q3.1. Phase 1 ships request endpoint + "we received your request" confirmation email. Manual fulfillment within 30 days until automated job ships.
- **JSON public API behind Pro tier** — Phase 2. RSS feeds ship Phase 1.

### From Phase A ASSUMPTIONS

- **Legal pages templated** — Termly v1 export or Vercel template for `/terms` + `/privacy`. Lawyer review required before public launch. Documented assumption: legally sound enough for closed beta; lawyer pass before public launch.

### From Phase C Session 1

- **Boot Steps 3-12** (db client, middleware, observability, auth, root providers, UI primitives, icons, layout chrome, route groups, action client, queries, format, i18n, sanitize) — pending; will land Session 2+.
- **Foundation slice F** (landing, home, AuthModal, Stack Picker, Cmd-K, /api/health, sitemap, robots, OG, e2e tests) — pending; will land Session 3+.
- **`supabase/` folder for Edge Functions** — exists in skeleton; no functions written yet. Session 4+.
- **`.github/workflows/ci.yml`** — pending. Should land before first commit so CI gates the rest. Session 2.
- **husky + commitlint hooks** — pending. Session 2.
- **`scripts/dev/migrate.ts`** (referenced in package.json `db:migrate`) — pending. Session 2.

### Schema-vs-spec deferrals (per Q1.1 default rule)

- **`playgrounds` table** — not in canonical schema; live Sandpack feature deferred Phase 2.
- **`mcp_tools_introspected`** — not in schema; using `mcps.tools jsonb` for read-only inspector instead.
- **`mcp_tool_invocations`** — not in schema; not needed for read-only inspector.
- **`alternatives` table** (final.md shape) — not used; existing `resource_alternatives` table covers the use case with slightly different shape.
- **`model_quantizations`, `runtimes`, `model_runtime_support`** — not in schema; open-weights hardware sizing deferred Phase 2.
- **`model_tips`** — not used; existing `prompting_tips` table works for any resource type.
- **`install_targets`** — not in schema; `mcps.install_configs jsonb` covers per-client install paths.
- **`cost_workloads`, `ai_curated_stacks`, `resource_health`, `model_context_quality`, `model_rate_limits`, `model_compliance`** — not in schema; respective features either deferred (compliance, gateway-derived health, AI-curated stacks) or scoped down (model rate limits as static text on detail page; cost workloads stored client-side via permalink Phase 1).

### Operational tables added under carve-out (per Q1.1 + Flag 1)

- **`rate_limit_buckets`** — added in `db/migrations/0002_rate_limit_buckets.sql` (operational; no resource-model touch). Carve-out approved.
- **`ingestion_runs`** — added in `db/migrations/0003_ingestion_runs.sql` if not in canonical schema (verify before running). Carve-out approved.

---

### From Phase C Session 2

- **`db/relations.ts` populated** — currently a stub. Subagent timed out mid-generation; standard query API (`db.select().from(...)`) works without it. Needs full population (~50 relations blocks; one() + many() for every FK in schema.ts) before any slice consumes `db.query.X.findFirst({ with: ... })`. Land first action of Session 3.
- **Next.js ESLint plugin not detected** — `eslint-config-next` v15.0.3 ships `@rushstack/eslint-patch` which breaks ESLint 9 flat config. Removed the unused import in Session 2; build emits a one-line warning ("The Next.js plugin was not detected"). Re-add via `@eslint/eslintrc` `FlatCompat` in a later session if Next-specific lint rules are wanted.
- **Local Node 18 vs `.nvmrc` says 22** — pnpm proceeds with engine warning. Project works on Node 18, but the engine constraint will bite eventually (Vercel runs Node 22, GHA can be pinned to 22 — local is the gap).
- **`middleware.ts` does not touch the DB** — the Session 2 prompt's "middleware does rate-limit + auth refresh" was incompatible with Next 15.0.3 Edge constraints (no postgres-js on Edge, `runtime = 'nodejs'` still experimental). Middleware now flags + forwards headers only; rate-limit check happens in action-middleware (Boot Step 12) and route handlers per-slice; auth session refresh happens in Boot Step 6 via Supabase SSR (Edge-safe).
- **Schema mirror — generated `tsvector` columns** — `resources.search_vector` and any other `generated always as ... stored` columns are declared as plain `tsvector('search_vector')` in Drizzle. The generation expression lives DB-side only. Drizzle reads/writes will SEE the value correctly because Postgres computes it; we just can't `.insert(...)` into the column from app code, and `drizzle-kit generate` would lose the generation clause if it ever rebuilds from schema.ts. Always treat `0001_initial.sql` as authoritative; never `db:generate` a fresh migration from schema.ts without verifying.
- **Project working dir is a Claude Desktop sandbox** — `~/Library/Application Support/Claude/local-agent-mode-sessions/<uuid>/.../outputs/vibecoderhub-web`. Fragile; Claude Desktop may clean these directories on its own schedule. Move to a normal project location before serious work (e.g. `~/Documents/Scripts & Tasks/VibeCoderHub`).

### From Phase C Session 3

- **Boot Step 5 (Sentry + Pino)** — pending Sentry DSN. Land first thing Session 4 when DSN provided. Until then the app has no client-side error reporting beyond the browser console.
- **Boot Step 8-10 (UI primitives, icons, layout chrome)** — deferred to Session 4. Three Boot Steps that interact closely; better to land as one cohesive batch than to thin-slice across sessions.
- **No `app/page.tsx` yet** — root layout renders, but there's no landing page. `pnpm dev` would 404 on `/`. That's fine for Phase C foundation; the page lands in Foundation slice F (Session 5).
- **`refreshSession` defensive skip is config-coupled** — middleware short-circuits when the Supabase URL contains `your-project-ref` or the anon key looks like a placeholder (`eyJ...` / `*dummy`). If Ben sets a real URL but leaves the anon key as `eyJ...`, the skip will still fire even though the URL is real. Won't matter in practice because anon key changes too — but worth knowing.
- **Auth callback OAuth flow is wired but untested end-to-end** — no Supabase project exists yet to authenticate against. End-to-end test (real GitHub OAuth round-trip) happens Session 5 / 6 when Supabase is provisioned.
- **`vch_consent` cookie controls PostHog init** — opt-in, not opt-out. Local dev never initialises PostHog (key is dummy). No analytics until both: real `phc_*` key AND user consent.

### From Phase C Session 12

- **Privacy + Terms generated from standard SaaS template** — `app/privacy/page.tsx` + `app/terms/page.tsx` are template-driven (data collection, third-parties enumerated, Pro subscription terms, DMCA, Delaware governing-law boilerplate). Requires lawyer review before public launch (already flagged in ASSUMPTIONS / Phase A).
- **Email infrastructure stubbed** — `lib/resend/client.ts` returns `null` on dummy key. Templates (`welcome`, `pro-upgrade`, `newsletter`, `submission-status`) compile + are render-ready but no email is actually sent until `RESEND_API_KEY` is real. `/api/webhooks/resend` verifies sigs and logs but does not yet persist to `newsletter_subscribers` (TODO slice S24). Newsletter signup POST `/api/newsletter/subscribe` is cookie-stubbed (`vch_newsletter=1`) until Supabase wired.
- **Unsubscribe is cookie-stub** — `/unsubscribe/[token]` validates token format and shows the success state but does not yet flip `newsletter_subscribers.unsubscribed_at`. Wires up when Supabase lands.
- **`/api/firehose` uses seed data** — 30-event in-memory seed array, no DB. Per-IP single-connection limit via in-process `Map` (won't survive multiple Node processes / serverless cold starts). Polling fallback at `?since={iso8601}` works. Swap to real `change_events` query when ingestion is producing rows.
- **Track 4 (visual polish pass) — landed Session 13.** Header overflow at 1440px fixed (wordmark wrapping + Get-started button clipping). Tightened header: `gap-3`, `md:px-6`, wordmark `text-[20px]` + `whitespace-nowrap`, nav `gap-0.5` + `px-2.5`, search `min-w-[160px]`, stack chip `max-w-[120px]`, all elements `shrink-0`. `BookmarkChip` now hidden below `2xl` (1536px) — still accessible via `/dashboard/bookmarks`. Mobile pass clean across home/models/pricing/deals/compare/privacy.

### From Phase C Session 13 — Phase 2 carry-over (definitive deferred list)

These are intentional Phase 2+ deferrals — do NOT pick them up before public launch unless a real customer-blocking issue surfaces:

- Light mode (Phase A R3)
- Live Sandpack playgrounds (Q1.1)
- Live MCP tool invocation (Q1.1) — read-only inspector ships Phase 1
- Open-weights hardware sizing engine (Q1.1) — data captured, no recommendations
- Hosted gateway runtime (Q1.5) — schema present, `/dashboard/gateway` is "coming soon"
- Public read-only JSON API (Q3.6) — RSS feeds ship Phase 1
- GDPR data export automation (Q3.1) — manual within 30 days for now
- Cmd-K type-prefix filter `>type query` (Q2.5) — basic search works; prefix filter Phase 2
- Editorial seed bundle pickup — pending Ben's delivery; consumed in slices 12/14/17/24 when delivered
- Real credentials provisioning — Supabase prod, Stripe live, Resend domain, Sentry DSN, PostHog key, OpenAI key, R2, Slack ops webhook (see SESSION_HANDOFF §Credentials package)
- Boot Step 5 (Sentry + Pino) — pending Sentry DSN
- Node 22 local pin — Vercel + GHA pinned; local is the gap

## (Append new deferrals as they happen)
