# ARCHITECTURE.md

*Top-level technical decisions for Vibe Coder Hub. Locked. Phase C builds against these.*

> **What this document is.** Every architectural decision Phase C will rely on, with reasoning. If a Phase C choice contradicts this document, this document wins; if a Phase C choice would require changing this document, surface via the `🛑 STOPPING` format and discuss before deviating.

> **What this document is not.** A primer on Next.js or Supabase. It assumes the reader knows what an App Router route group is, what RLS does, and what a Server Action is.

---

## §1 Stack — locked

Confirmed across Phase A (see `ANSWERS.md` for reasoning per item):

```
Framework      Next.js 15 App Router (Server Components by default, Server Actions for mutations)
Language       TypeScript strict, no `any` outside justified comments, no @ts-ignore
Styling        Tailwind CSS v4 + @tailwindcss/typography (only plugin)
Component lib  shadcn/ui customised per Promptkit (NOT default shadcn theme)
Database       Supabase Postgres (Pro tier, $25/mo)
ORM            Drizzle (typed against schema.sql; not generated, hand-mirrored — see §5)
Auth           Supabase Auth, GitHub OAuth primary, Google OAuth secondary
Storage        Supabase Storage (avatars, screenshots, news images) + Cloudflare R2 (raw ingestion dumps)
Embeddings     OpenAI text-embedding-3-small (1536 dim, $50/mo cap)
Image NSFW     Replicate (avatar pre-screen)
Payments       Stripe Checkout + Stripe Customer Portal (no custom billing UI)
Email          Resend (notify@ + news@ on vibecoderhub.com)
Background     GitHub Actions cron + Supabase pg_cron + Supabase Edge Functions (only)
Observability  Sentry (errors), PostHog (product analytics + session replay + flags)
Logging        Pino (structured, three transports — see §9)
Validation     Zod for every input (Server Actions, API routes, ingestion parsers)
Server actions next-safe-action (typed, Zod-integrated, action middleware) — see §6
Rate limiting  Postgres-backed sliding-window (no Upstash) — see §10
Testing        Vitest (unit + integration); Playwright (5 critical e2e flows only)
Hosting        Vercel
Repo           Single repo at root (no apps/web/ subdir), trunk-based on main
Package mgr    pnpm v9
Node           v22 LTS
```

**No additions to this stack without explicit approval** (`🛑 STOPPING` format). The friction this rule causes is the friction it's designed to cause: every dependency is operational debt.

---

## §2 Server Components vs Client Components — the rule

**Default everything to Server Components.** A file is a Client Component only if it has a documented reason from the list below. The default is enforced by the absence of `"use client"` at the top of files; reviewers grep for `"use client"` in PRs.

### When to mark `"use client"` (the only valid reasons)

1. **React state hooks** — `useState`, `useReducer`, `useRef`, `useTransition` (the optimistic flag, not the server-side hook)
2. **Effect hooks** — `useEffect`, `useLayoutEffect`, `useInsertionEffect`
3. **Context consumption** — `useContext` (the *consumption*; the Provider can stay server-rendered if its children are SCs, but most Providers also use state)
4. **Browser APIs** — `window`, `document`, `navigator`, `localStorage`, `IntersectionObserver`, `MutationObserver`, `clipboard`
5. **Event handlers attached to DOM** — `onClick`, `onChange`, `onSubmit`, `onKeyDown` (Server Components cannot ship event handlers; passing one as a prop from RSC → Client Component is fine)
6. **Third-party libraries that require the browser** — Framer Motion (animation), Recharts (charts in client mode), Sandpack (live code preview, deferred to Phase 2 anyway), `cmdk` (Cmd-K palette), `react-hot-toast` or `sonner` (toasts)
7. **Realtime subscriptions** — Supabase Realtime, SSE listeners, WebSocket clients

### Composition rule: push `"use client"` as deep as possible

The boundary should sit on the **smallest possible component** that needs interactivity. A page route is **always** a Server Component; interactive bits are Client Components imported into it.

**Wrong (the whole card becomes a CC):**

```tsx
// app/components/ResourceCard.tsx
'use client';
import { useState } from 'react';
export function ResourceCard({ resource }) {
  const [bookmarked, setBookmarked] = useState(resource.bookmarked);
  return (
    <div className="rounded-tile ...">
      <h3>{resource.name}</h3>
      <button onClick={() => setBookmarked(!bookmarked)}>...</button>
    </div>
  );
}
```

**Right (only the bookmark button is a CC):**

```tsx
// components/resources/ResourceCard.tsx — Server Component (no "use client")
import { BookmarkButton } from './BookmarkButton';
export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  return (
    <div className="rounded-tile ...">
      <h3>{resource.name}</h3>
      <p className="text-meta">{resource.tagline}</p>
      <BookmarkButton resourceId={resource.id} initiallyBookmarked={resource.bookmarked} />
    </div>
  );
}

// components/resources/BookmarkButton.tsx — Client Component
'use client';
import { useState, useTransition } from 'react';
import { toggleBookmark } from '@/lib/actions/bookmarks';
export function BookmarkButton({ resourceId, initiallyBookmarked }: Props) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        setBookmarked(b => !b); // optimistic
        startTransition(async () => {
          const result = await toggleBookmark({ resourceId });
          if (result.serverError) setBookmarked(initiallyBookmarked); // rollback
        });
      }}
      aria-pressed={bookmarked}
    >...</button>
  );
}
```

This pattern is non-negotiable. Phase D Pass 1 grep-checks for `"use client"` in the wrong files (a page route file with `"use client"` at top is an instant failure).

### Server-only utilities

Code in `lib/server/` (DB queries, Stripe SDK, Resend SDK, Drizzle client, OpenAI SDK, Replicate SDK, Sentry server SDK, Pino) **must never be imported from a Client Component**. Enforced two ways:

1. **`server-only` package** — every module in `lib/server/` imports `import 'server-only'` at the top. If a Client Component transitively imports it, the build fails with a clear error.
2. **ESLint rule** — `no-restricted-imports` disallows `lib/server/*` from any file with `"use client"`.

Shared utilities (pure, no I/O — formatters, types, Zod schemas) live at `lib/` directly and work in both server and client.

### Data flow rule

- **Reads** — Server Components fetch data directly via `db.select(...)`. No `useEffect(() => fetch(...))`. No SWR/React Query for SC-rendered data.
- **Mutations** — Server Actions invoked from Client Components via next-safe-action's `useAction` hook. Client never talks to the DB directly except via Supabase Auth.
- **Realtime** — only for `/api/firehose` (SSE) and the optional gateway-status indicator on resource detail pages (Supabase Realtime channel subscribed in a CC). Not for general data freshness; rely on `revalidatePath` after mutations + Next's built-in cache.

---

## §3 Caching strategy — per route type, explicit

Next.js 15 caches aggressively by default. The strategy below is deliberate per page-class. Each route declares its caching via `export const revalidate = N` or `export const dynamic = 'force-dynamic'` at the top of the route file.

### Cache table

| Page class | Route examples | Strategy | `revalidate` | Reason |
|---|---|---|---|---|
| **Marketing static** | `/`, `/about`, `/manifesto`, `/pricing`, `/contact` | Static (SSG) | `false` (no revalidation; rebuild on deploy only) | Pure marketing, content controlled by us, infrequent updates |
| **Resource index** | `/models`, `/mcps`, `/components`, `/skills`, …(all 24 type indexes) | ISR | `300` (5 min) | Most-trafficked. Trending updates frequently but doesn't need real-time. |
| **Resource detail** | `/models/[slug]`, `/mcps/[slug]`, `/components/[slug]`, …(all 24 type details) | ISR | `60` (1 min) | Detail pages need recent install counts, current price, but not real-time. |
| **Model detail** (special) | `/models/[slug]` | ISR | `60` (1 min) | Same as above; price-history sparkline data fetched at request time but rendered from cache. |
| **/best-for** | `/best-for`, `/best-for/[slug]` | ISR | `3600` (1 hour) | Editorial rankings, slow-moving. SEO landing pages. |
| **/alternatives** | `/alternatives/[slug]` | ISR | `3600` (1 hour) | Same. |
| **News index** | `/news`, `/news?kind=…` | ISR | `60` (1 min) | New articles arrive throughout the day. |
| **News article** | `/news/[slug]` | ISR | `300` (5 min) | Article body is stable post-publish; `view_count` denormalisation lags by 5 min, acceptable. |
| **Deals index** | `/deals`, `/deals?…` | ISR | `300` (5 min) | Deals change weekly; claim counts lag is fine. |
| **Deal detail** | `/deals/[slug]` | ISR | `60` (1 min) | Claim count is more visible here, refresh faster. |
| **Guides index** | `/guides`, `/guides?…` | ISR | `300` (5 min) | New guides land slowly. |
| **Guide reader** | `/[resource-slug]/guides/[guide-slug]` | ISR | `60` (1 min) | Step content stable; `view_count` and "verified working as of" want freshness. |
| **Showcase index** | `/showcase` | ISR | `300` (5 min) | New showcase items reviewed weekly. |
| **Showcase detail** | `/showcase/[slug]` | ISR | `300` (5 min) | Stable content. |
| **Stack detail (public)** | `/u/[username]/[stack-slug]` | ISR | `300` (5 min) | `adoption_count` lag is fine. |
| **User profile (public)** | `/u/[username]`, `/u/[username]/stacks` | ISR | `300` (5 min) | Lightly trafficked. |
| **Universal search** | `/search?q=…` | Dynamic (`force-dynamic`) | n/a | Query-dependent, must be fresh. |
| **Compare full-page** | `/models/compare?ids=…` | Dynamic (`force-dynamic`) | n/a | URL state dependent. |
| **Stack picker** (modal) | (overlay, not a route) | client-driven | n/a | |
| **Cmd-K palette** (modal) | (overlay, not a route) | client-driven, debounced 300ms | n/a | Hits an internal API route, no page cache |
| **Dashboard** | `/dashboard/*` | Dynamic, per-user | n/a | Personal data, no shared cache. `cache: 'no-store'` on all fetches. |
| **Settings** | `/settings/*` | Dynamic, per-user | n/a | Same. |
| **Submit flow** | `/submit/*` | Dynamic, per-user | n/a | Same. |
| **Admin** | `/admin/*` | Dynamic, per-user (admin only) | n/a | Same. |
| **Newsletter signup confirmation** | `/auth/newsletter-confirm` | Dynamic | n/a | Uses query token. |
| **Auth callbacks** | `/auth/callback`, `/auth/verify`, `/auth/forgot` | Dynamic | n/a | Token-based. |
| **API routes** | `/api/health`, `/api/firehose`, `/api/webhooks/stripe` | Dynamic | n/a | `cache: 'no-store'`. SSE for firehose. |
| **OG images** | `opengraph-image.tsx` per route group | Edge-cached after first hit (Next default) | n/a | Generated dynamically, cached by Vercel edge indefinitely until a deploy invalidates or the route's source data changes (we add `id` param to OG URL keyed off `updated_at`). |
| **Sitemap** | `/sitemap.xml` | ISR | `3600` (1 hour) | Updates as resources publish. |
| **RSS feeds** | `/news/feed.rss`, `/[type]/feed.rss`, etc. | ISR | `300` (5 min) | RSS readers poll on their own schedule. |
| **robots.txt** | `/robots.txt` | Static | n/a | |

### Explicit cache invalidation on mutation

Server Actions that mutate data call `revalidatePath()` and/or `revalidateTag()` to force the affected page to re-render on next request. Examples:

- `toggleBookmark(resourceId)` → `revalidateTag(\`resource:${resourceId}\`)` + `revalidatePath('/dashboard/bookmarks')`
- `submitReview({resourceId, ...})` → `revalidatePath(\`/${resourceTypeSlug}/${resourceSlug}\`)` + `revalidateTag(\`reviews:${resourceId}\`)`
- `publishResource({id})` (admin) → `revalidatePath(\`/${typeSlug}\`)` (the index) + `revalidatePath(\`/${typeSlug}/${slug}\`)` (the detail)
- `claimDeal({dealId})` → `revalidatePath(\`/deals/${dealSlug}\`)` (the claim count)

Pages reference resources via `unstable_cache` with tags so `revalidateTag` propagates. Example:

```ts
import { unstable_cache } from 'next/cache';
export const getResourceBySlug = unstable_cache(
  async (typeSlug: string, slug: string) => db.query.resources.findFirst({ where: ... }),
  ['resource-by-slug'],
  { tags: (typeSlug, slug) => [`resource:${typeSlug}:${slug}`], revalidate: 60 },
);
```

### What's **not** in the cache: per-user state

Bookmarks status, claimed-deal status, Pro/Free tier, "have I reviewed this?" — these vary per user and must NOT be baked into the ISR-cached page HTML. Pattern:

1. The cached page renders the resource shell with **placeholder slots** (e.g., a generic bookmark icon).
2. A small Client Component (e.g. `<BookmarkSlot resourceId={r.id} />`) hydrates per-user state via a Server Action call on mount, then renders the personalised state.
3. `<BookmarkSlot>` is wrapped in `<Suspense fallback={<BookmarkPlaceholder />}>` so the cached content streams immediately and the personalised slot fills in.

This keeps the public ISR cache shared across users while supporting per-user UI elements without leaking PII into the cache.

### Edge vs Node runtime

- **Edge runtime** for routes that benefit from low cold-start (`/api/firehose`, OG images, `robots.txt`, `sitemap.xml`).
- **Node runtime** for everything else (the default). Drizzle requires Node; Stripe SDK requires Node; Pino's transports require Node.

---

## §4 Error handling philosophy — three layers

### Layer 1: React error boundaries via Next.js conventions

- `app/global-error.tsx` — catastrophic root-layout failure. Single page with logo + "Something broke" + "Try again" button + Sentry-reported note. **No app chrome** (header/footer don't exist when this fires).
- `app/(marketing)/error.tsx` — marketing route group error. Full chrome, in-content message, retry button.
- `app/(app)/error.tsx` — authenticated app route group error. Full chrome, in-content message, retry button + "Get help" link.
- `app/(admin)/error.tsx` — admin route group error. Same pattern, but suppresses any user-facing error guidance (the user IS the admin).
- Per-route `error.tsx` — overrides the group-level boundary for routes with specialised recovery UX (e.g., `/models/[slug]/error.tsx` shows the model not-found state with a "Browse models" CTA).
- `app/not-found.tsx` (root) + per-route `not-found.tsx` — same pattern for 404s.

Every `error.tsx` receives `({ error, reset })` and **must** call Sentry's `captureException(error)` on mount. Pattern:

```tsx
'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { ErrorState } from '@/components/error-state';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return <ErrorState onRetry={reset} digest={error.digest} />;
}
```

`ErrorState` is a single shared component (Promptkit's `EmptyState` variant for errors) used across all `error.tsx` files for visual consistency.

### Layer 2: Server Action error returns via next-safe-action

Server Actions return discriminated unions, not throw. next-safe-action's standard shape:

```ts
type ActionResult<T> =
  | { data: T; serverError?: never; validationErrors?: never }
  | { data?: never; serverError: string; validationErrors?: never }
  | { data?: never; serverError?: never; validationErrors: Record<string, string[]> };
```

Client components handle each branch:

- `data` — success, optimistic state confirmed
- `validationErrors` — show inline below each field (Zod-keyed)
- `serverError` — show toast with retry option, optimistic state rolled back

The action middleware logs every server-error case to Pino with full context (user ID, action name, input, error stack) before returning. Sentry captures via the middleware too.

### Layer 3: Sentry catches everything else

- Server-side unhandled errors via `instrumentation.ts` Sentry init
- Client-side unhandled errors via `@sentry/nextjs` browser SDK
- Source maps uploaded on every Vercel deploy via the Sentry CLI plugin
- Release tagging tied to `VERCEL_GIT_COMMIT_SHA`
- PII scrubbing: no email addresses, no auth tokens, no Stripe customer IDs in error reports (Sentry's `beforeSend` hook scrubs known fields)

### User-facing error UX rules

- **Never show a stack trace.** Errors users see are: a friendly message, a digest code (Next's automatic error digest, useful when they email support), a retry button, and (when in `(app)` group) a "Get help" link to a contact form pre-filled with the digest.
- **Form errors:** inline below the field (red text + icon), plus a form-level summary at the top if there are 3+ errors. Validation runs on blur and on submit; server validation always re-runs and is authoritative.
- **Mutation errors:** toast notification (red tint, slightly longer dismiss timeout: 8s vs 5s for success), with a retry button on the toast itself when the action is idempotent.
- **Network failures detected client-side** (offline, fetch timeout, 5xx): the failed component shows an inline retry pattern (skeleton + "Couldn't load. Retry?" overlay), not a full-page error. Page chrome stays.
- **Optimistic updates:** always paired with rollback on error. Visible error state fires *and* the toast fires (the toast is dismissable; the inline error state persists until the user retries successfully or dismisses).
- **Idempotent retries:** Server Actions that are safe to retry (toggleBookmark, claimDeal once unclaimed, submitReview before submission accepted) carry an `idempotencyKey` (uuid generated client-side) so a retry doesn't duplicate.
- **Non-idempotent retries:** Server Actions that change state irreversibly (deleteAccount, cancelSubscription) require an explicit confirmation re-press, not a retry button.

### Logging philosophy for errors

- Pino logs every server-side error at `error` level with:
  - `requestId` (UUID generated at middleware, propagated via AsyncLocalStorage)
  - `userId` (if authenticated, hashed via SHA256+salt for log-PII-scrubbing)
  - `actionName` or `routeName`
  - `errorMessage` and `errorStack`
  - relevant input (Zod-validated, so we know it's typed; PII fields scrubbed)
- Production minimum log level is `info`. `debug` and `trace` are dev-only.
- Sentry is for unhandled / surprising errors. Pino is for everything (expected and unexpected).

### Failure-mode catalogue (the things we explicitly handle)

- **DB connection lost mid-request** — Drizzle wraps queries with a single retry on a connection error, then fails the request. Pino logs at `error`. Sentry captures.
- **Stripe webhook signature invalid** — return 400 immediately, no retry. Pino at `warn`. Sentry not captured (these are normally just probes).
- **Stripe API timeout** — Stripe SDK retries built-in (3 attempts, exponential backoff). On final failure, log to Pino + Sentry, return user-facing toast.
- **Resend send failure** — log + Sentry; queue in `email_outbox` table for retry by a pg_cron job (5-min retry window, max 5 attempts then dead-letter).
- **OpenAI embedding generation failure** — log; the `embedding` column stays NULL; the resource still publishes (search falls back to tsvector for that resource); a nightly pg_cron job re-attempts NULL embeddings.
- **Replicate NSFW classifier failure** — log + Sentry; the avatar upload is rejected with a generic "couldn't process" error, user sees a retry button. We don't ship un-classified avatars.
- **Supabase Storage upload failure** — log + Sentry; show toast with retry; user's local file selection retained until success or cancel.
- **Ingestion source returns 5xx** — exponential backoff in the ingestion script (1m, 5m, 15m, then fail the run). `ingestion_runs.status='failed'` + Slack notification to admin channel.
- **Ingestion source returns malformed data** — parse failure logged; affected records skipped (counted in `ingestion_runs.records_failed`); other records in the batch still process.

---

## §5 Why Drizzle (vs Prisma vs raw SQL)

**Decision: Drizzle.**

| | Drizzle | Prisma | Raw SQL (pg / postgres.js) |
|---|---|---|---|
| Schema source | Mirrors `schema.sql` hand-written | Generates from `schema.prisma` | n/a |
| Migrations | Generated from schema diffs OR hand-written; we use hand-written (schema.sql is canonical) | Generated; Prisma manages | Hand-written |
| Type safety | Full inferred types from schema; runtime parsed | Generated client; runtime typed | None unless wrapped |
| Bundle size | Tiny (~20KB) | Large (engine ~14MB) | Tiny |
| Query style | SQL-like builder OR raw SQL escape hatch | Domain-specific API | SQL |
| RLS-friendly | Works directly with Supabase pooler | Prisma engine sometimes conflicts with Supabase pooler | Works |
| Edge runtime | Yes (with `drizzle-orm/postgres-js`) | No (engine doesn't run on edge) | Yes |
| pgvector support | First-class via `vector` column type | Limited (manual SQL) | First-class |
| Materialised views | Direct SQL queries against them | Awkward (treats as regular models) | Direct |

**Why Drizzle wins for VCH specifically:**

1. **Schema is canonical, not generated.** `schema.sql` is the single source of truth. Prisma's "schema-first" model fights this — we'd have two schemas to keep in sync. Drizzle accepts a hand-mirrored schema in TS (`db/schema.ts`) and is happy if we never touch it via migrations because the SQL is the truth.
2. **Edge runtime** for `/api/firehose`, OG images, etc. Prisma's binary engine doesn't run on edge.
3. **pgvector first-class.** Schema uses `vector(1536)` and ivfflat index; Drizzle has a `vector` column type and operator helpers. Prisma requires raw SQL for this.
4. **Bundle size matters.** Vercel bundle limits + cold-start latency push us toward thin clients.
5. **Materialised views** (`v_trending_per_type`, future `model_adoption`) are queried as plain views; Drizzle has no opinion. Prisma awkwardly treats them as models you can't write to.

**The escape hatch.** When a query is too complex for the builder (e.g., the trending feed with type partitioning, the alternatives engine with multi-kind ranking), drop to raw SQL via `db.execute(sql\`...\`)`. The escape hatch is OK; reaching for it once a week is normal. Reaching for it every day means we picked the wrong tool.

### Connection management

- **Pooled connection** for app queries via Supabase's pgBouncer transaction-mode pooler (port 6543). Used by every Server Component, Server Action, and API route.
- **Direct connection** (port 5432) only for migrations + the seed script. Not exposed to the app runtime.
- **Service-role connection** for admin operations (image moderation publish, manual admin actions). Wrapped in a separate `createServerClient({ serviceRole: true })` factory; never imported from a Client Component (`server-only` enforced).

### Schema mirroring discipline

`db/schema.ts` is hand-mirrored from `schema.sql`. When Phase 2 introduces schema modifications:

1. SQL migration written in `db/migrations/` (timestamp-prefixed)
2. `schema.sql` updated to match new state
3. `db/schema.ts` updated by hand to mirror
4. `db/relations.ts` updated if joins changed
5. `pnpm typecheck` catches missing/extra columns at the type level

Drizzle's `pull-from-db` command exists; we don't use it (it produces messier output than hand-mirroring).

---

## §6 Why next-safe-action for Server Actions

**Decision: next-safe-action.**

The default Next.js Server Action API is untyped, has no validation, no middleware, and silently returns `void | unknown`. For a build with 50+ mutations, this is unmanageable. Three real options:

| | next-safe-action | zsa | Hand-rolled wrappers |
|---|---|---|---|
| Zod-integrated | ✓ first-class | ✓ first-class | requires writing |
| Typed return shape | ✓ discriminated union | ✓ discriminated union | requires writing |
| Middleware (auth, logging, rate-limit) | ✓ chainable | ✓ chainable | requires writing |
| Client hook (`useAction`) | ✓ included | ✓ included | n/a |
| Maintained / popular | High (de facto standard) | Growing | n/a |
| Bundle | ~5KB client | ~3KB client | 0 |

next-safe-action wins on de-facto-standard maturity and the breadth of its `useAction` hook (loading state, optimistic state, callback hooks). zsa is an acceptable alternative; the cost to switch later is low. If next-safe-action surprises us with a bug or missing feature, switching to zsa is ~1 day of work.

### Pattern for every action

```ts
// lib/actions/bookmarks.ts
import 'server-only';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/ratelimit';

const action = createSafeActionClient({
  handleServerError(e) {
    logger.error({ err: e }, 'Server action failed');
    Sentry.captureException(e);
    return 'Something went wrong. Please retry.';
  },
}).use(async ({ next }) => {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  return next({ ctx: { userId: session.user.id } });
});

export const toggleBookmark = action
  .schema(z.object({ resourceId: z.string().uuid(), idempotencyKey: z.string().uuid() }))
  .action(async ({ parsedInput: { resourceId, idempotencyKey }, ctx: { userId } }) => {
    await rateLimit({ key: \`bookmark:\${userId}\`, max: 30, window: '1 minute' });

    const existing = await db.query.bookmarks.findFirst({
      where: and(eq(bookmarks.userId, userId), eq(bookmarks.resourceId, resourceId)),
    });
    if (existing) {
      await db.delete(bookmarks).where(...);
      revalidateTag(\`resource:\${resourceId}\`);
      return { bookmarked: false };
    } else {
      await db.insert(bookmarks).values({ userId, resourceId });
      revalidateTag(\`resource:\${resourceId}\`);
      revalidatePath('/dashboard/bookmarks');
      return { bookmarked: true };
    }
  });
```

Every Server Action gets:

- **Auth check** via the chainable `.use()` middleware (the bookmarked example assumes auth required; public actions like `subscribeNewsletter` skip the auth middleware).
- **Zod-validated input** via `.schema()`.
- **Rate-limit check** inside the action body (key derived from userId or IP, see §10).
- **Sentry + Pino logging** via the `handleServerError` hook.
- **`revalidatePath` / `revalidateTag`** to invalidate dependent caches.

### Csrf protection

Next.js Server Actions include CSRF protection by default (origin checking on the encrypted action ID). No additional setup needed; verified during Phase D Pass 5 security sweep.

---

## §7 Folder structure rationale (preview — full tree in artifact 3)

The full directory tree lands as B2. Here's the rationale that drives it:

### Route groups via parentheses

```
app/
  (marketing)/    ← unauth-friendly pages: /, /about, /pricing, /manifesto, /contact
  (app)/          ← authenticated app: /dashboard, /settings, /submit
  (admin)/        ← admin-only: /admin, /admin/moderation, /admin/queue
  (resource)/     ← shared layout for all 24 resource detail pages
  api/            ← API routes
  auth/           ← auth callbacks
```

Route groups give us **separate root layouts** without affecting URL structure. The `(app)` group's layout includes the dashboard sidebar; the `(marketing)` group's layout has the marketing-only navigation; the `(admin)` group's layout has the moderation chrome. URLs are unaffected (`/dashboard` not `/(app)/dashboard`).

### Why `(resource)` is a route group, not a dynamic segment

Initially we considered `app/[type]/[slug]/page.tsx` for all 24 type-slug combinations (one route file). Rejected. Reasons:

- 24 types have different type-specific blocks; one page file with a giant `switch (type)` is unmaintainable
- Type-specific tabs (Overview, Try It, Guides, Install, Source, Compatibility, Reviews, Versions, Forks, Analytics) aren't all present for all types
- SEO routes (`/best-for/[slug]`, `/alternatives/[slug]`) coexist with type routes; URL conflicts get awkward

**Decision:** one folder per type at the URL level, sharing components.

```
app/
  (resource)/
    layout.tsx              ← shared chassis (Zone 1-4, 6-9 from detail-pages.md)
    components/
    [slug]/
      page.tsx              ← model detail
  models/
    page.tsx                ← models index
    [slug]/
      page.tsx              ← model detail (uses (resource) layout via re-export)
  mcps/
    page.tsx
    [slug]/
      page.tsx
  ...etc for all 24 types
```

Each detail page is ~30 lines (data fetch + composition of shared zone components + the Zone-5 type-specific block). Maintainable.

### Colocation rule

- **Page-specific components** live next to the page: `app/models/components/ModelStatsStrip.tsx` is only used in `app/models/`.
- **Cross-page reusable** components live at `components/`: `components/resources/ResourceCard.tsx` is used everywhere.
- **Pure utility** lives at `lib/`: `lib/format/currency.ts`, `lib/auth/server.ts`.
- **Server-only** lives at `lib/server/`: `lib/server/db.ts`, `lib/server/stripe.ts` (with `server-only` import).

The convention: if you can grep for a component name and see it's only used in one route, move it to that route's `components/` folder.

---

## §8 State management — server state + URL state + React Context (no Redux)

Three state systems, each with a clear role.

### Server state (the data)

- **Server Components** fetch directly from Drizzle. No client-side data libraries (no SWR, no React Query) for SC-rendered data.
- **Mutations** via Server Actions; invalidation via `revalidatePath` / `revalidateTag`.
- **Per-user UI state** (bookmarked? claimed?) hydrated via lightweight Server Action calls in Suspense-wrapped Client Components (see §3).

### URL state (the filter / search / pagination state)

- **Filterable views** encode all filter state in URL query params (`?type=mcp&clients=cursor,claude-code&sort=trending&page=2`).
- **Pagination** is URL-cursor-based for large lists (`?cursor=eyJpZCI6Li4ufQ==`), not OFFSET (which kills with deep pagination).
- **`useSearchParams` + `useRouter`** read/write URL state from Client Components.
- **Server Components** use the `searchParams` prop on the page function to read URL state for the initial render.
- **Sharable** — paste the URL, get the same view. Tested in Phase D Pass 5 (user journey).

### React Context (the cross-component client state)

- **Theme** — even though light mode is deferred, the theme provider exists from day 1 (cookie-backed, defaults to dark, switchable in Phase 2).
- **Stack** — the user's saved stack (clients + tags + hardware). For logged-in users, hydrated from DB on first load; for logged-out, from cookie. Provider wraps `(app)` and `(marketing)` layouts.
- **Toast** — toast notification queue (or use sonner's built-in provider — TBD in Phase B B3).
- **Cmd-K open state** — single global flag for ⌘K palette open/closed. Provider wraps all groups so any component can fire `setCmdkOpen(true)`.

### What we do NOT use Redux / MobX / Zustand for

The above three systems cover everything. There is no global mutable state outside of:

- The user's session (Supabase Auth handles via cookie)
- The user's stack (Context above)
- The Cmd-K open flag (Context above)
- Toast queue (Context or sonner)

If a future feature needs more global state, surface via `🛑 STOPPING` and re-evaluate. We will not silently introduce a state library.

---

## §9 Logging philosophy (Pino)

```ts
// lib/logger.ts
import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } }
    : undefined, // production: JSON to stdout (Vercel ingests)
  redact: {
    paths: [
      'email', '*.email',
      'password', '*.password',
      'token', '*.token',
      'apiKey', '*.apiKey',
      'stripeCustomerId', '*.stripeCustomerId',
      'authorization', 'headers.authorization',
      'cookie', 'headers.cookie',
    ],
    censor: '[REDACTED]',
  },
});
```

### Three transports

- **Dev** — `pino-pretty` to console, colorised, with `requestId` per line.
- **Prod** — JSON to stdout. Vercel automatically ingests stdout into its log store; queryable via Vercel dashboard.
- **Errors → Sentry** — error-level logs additionally sent to Sentry via a Pino hook in production.

### Structured logging discipline

- **Every log call includes context as the first arg:** `logger.info({ resourceId, userId }, 'Bookmark created')`. Never `logger.info('Bookmark created for user 123 on resource 456')` (unstructured, ungreppable).
- **Every Server Action logs at boundaries** — debug at start (with input), info at success (with result summary), error at failure (with error context). The action middleware does this generically.
- **Request-ID propagation** — every request gets a UUID via Next.js middleware, stored in AsyncLocalStorage, available to every logger call as `logger.child({ requestId })`. Same UUID flows through Server Actions, Drizzle queries (logged), and Sentry breadcrumbs.

### What we do not log

- Raw email addresses (hashed if needed)
- Auth tokens
- Stripe customer IDs (use the hashed `userId` instead)
- Request bodies of mutation Server Actions (Zod has already validated; the action's input shape is in the type, not in logs)
- Response bodies (too noisy)

---

## §10 Rate limiting (Postgres sliding-window)

Build prompt locks to "no Upstash"; we implement sliding-window rate limiting in Postgres.

```sql
create table rate_limit_buckets (
  bucket_key   text not null,                    -- e.g. 'bookmark:user:abc123' or 'auth:ip:1.2.3.4'
  bucket_at    timestamptz not null,             -- minute-aligned timestamp
  count        int default 0 not null,
  primary key (bucket_key, bucket_at)
);
create index rate_limit_buckets_recent_idx on rate_limit_buckets (bucket_at);
```

> **Schema-mod note:** This table is NOT in `vibe-coder-hub-schema.sql`. Surface as a 🛑 STOPPING when Phase B B4 (migration order) lands — Ben confirms the table addition or chooses an alternative (a Vercel KV add-on, or a per-IP edge middleware count via a smaller storage). Default is to add this single table since it's purely operational and doesn't touch the canonical resource model.

### Helper

```ts
// lib/server/ratelimit.ts
import 'server-only';
export async function rateLimit(opts: {
  key: string;
  max: number;
  window: '1 minute' | '5 minutes' | '1 hour';
}): Promise<void> {
  const windowSeconds = { '1 minute': 60, '5 minutes': 300, '1 hour': 3600 }[opts.window];
  const now = new Date();
  const since = new Date(now.getTime() - windowSeconds * 1000);

  // Insert/upsert this minute's bucket
  const minuteKey = new Date(Math.floor(now.getTime() / 60_000) * 60_000);
  await db.insert(rateLimitBuckets).values({
    bucketKey: opts.key, bucketAt: minuteKey, count: 1,
  }).onConflictDoUpdate({
    target: [rateLimitBuckets.bucketKey, rateLimitBuckets.bucketAt],
    set: { count: sql\`\${rateLimitBuckets.count} + 1\` },
  });

  // Sum recent buckets
  const result = await db.select({ total: sql<number>\`coalesce(sum(\${rateLimitBuckets.count}), 0)\` })
    .from(rateLimitBuckets)
    .where(and(eq(rateLimitBuckets.bucketKey, opts.key), gte(rateLimitBuckets.bucketAt, since)));

  if (result[0].total > opts.max) {
    throw new RateLimitError(\`Rate limit exceeded for \${opts.key}\`);
  }
}
```

A `pg_cron` job purges buckets older than 1 hour nightly to keep the table small.

### Rate-limit policy

| Surface | Key | Limit |
|---|---|---|
| `signin` / `signup` (per IP) | `auth:ip:<ip>` | 10 / 1 minute |
| `signin` / `signup` (per email) | `auth:email:<sha256(email)>` | 5 / 1 hour |
| Bookmark toggle (per user) | `bookmark:user:<id>` | 30 / 1 minute |
| Review submit (per user) | `review:user:<id>` | 5 / 1 hour |
| Comment submit (per user) | `comment:user:<id>` | 30 / 1 hour |
| Submit resource (per user) | `submit:user:<id>` | 5 / 1 hour |
| Cmd-K search query (per IP) | `search:ip:<ip>` | 60 / 1 minute |
| `/api/firehose` connection (per IP) | `firehose:ip:<ip>` | 1 connection (separate concurrency check, not rate-limit) |
| Stripe checkout creation (per user) | `checkout:user:<id>` | 5 / 1 hour |
| Newsletter signup (per IP) | `newsletter:ip:<ip>` | 5 / 1 hour |

When a rate limit is hit:
- API/Server Action returns a structured `serverError: 'rate_limited'` with a `retryAfter` seconds value
- UI shows an inline "You're going faster than we can keep up. Try again in 30 seconds." with the retry timer counting down

### IP detection

Vercel forwards client IP via `request.headers.get('x-forwarded-for')`. We parse the first hop. Rate limits are not a security boundary (they prevent abuse, not attack); we don't try to defeat IP spoofing.

---

## §11 Image handling strategy

```
User uploads image (avatar / showcase)
    ↓
Client-side validation (file type, size cap: 5MB avatar / 10MB showcase)
    ↓
Direct upload to Supabase Storage via signed URL (avoids round-trip through our server)
    ↓
Edge Function trigger: image-process
    ├── Avatars: Replicate NSFW classifier check
    │   ├── Pass: Sharp resize to 256/512/1024 → public 'avatars' bucket → update profiles.avatar_url
    │   └── Fail: delete original, return error to user, log to admin queue
    └── Showcase: Sharp resize to 1200/600 → private 'submissions-temp' bucket → row in submissions table → admin queue
```

### `next/image` everywhere

- Every image rendered via `next/image` with explicit `width` + `height` (never `fill` unless inside an aspect-ratio container with explicit dimensions).
- `priority` flag on above-the-fold hero images only.
- `remotePatterns` in `next.config.ts` whitelists Supabase Storage + Cloudflare R2 + the few external domains we proxy (provider logos hosted on their own CDNs).
- No client-side image manipulation libraries. Sharp on the Edge Function does all resizing.

### CLS prevention

Every image has explicit dimensions in HTML. The skeleton card placeholder reserves the same dimensions before the image loads. CLS budget: <0.1 per route, gate-blocking in Phase D Pass 4.

---

## §12 Background jobs split (GHA + pg_cron + Edge Functions)

| Cadence | Job | Mechanism | Why |
|---|---|---|---|
| **Every 5 min minimum** | n/a (we don't have anything this frequent) | n/a | Floor of GHA cron is 5 min |
| **Every 30 min** (originally; degraded to 60 per Q1.2) | RSS poll for news ingestion | GHA cron `*/30` (degrades to `*/60` if GHA throttles) | Lightweight, can tolerate the degradation per data-sourcing §25 |
| **Hourly** | Decay 7-day install counts | pg_cron in DB | Pure SQL update, no app code needed |
| | Refresh `v_trending_per_type` materialized view | pg_cron | Same |
| | Stripe webhook bounce-back retry | pg_cron triggers an Edge Function | Idempotent retries |
| **Every 4-6 hours** | OpenRouter, MCP Official Registry, Smithery, shadcn registry, 21st.dev | GHA cron + workflow_dispatch | Heavy parsing, remote API calls, R2 raw-dump uploads |
| **Daily 02:00 UTC** | provider model API checks | GHA cron | Low priority |
| | HuggingFace open-weights metadata refresh | GHA cron | Phase 2 (defer) |
| | cursor.directory + buildwithclaude scrape | GHA cron | |
| | GitHub code search for skills/rules/CLAUDE.md/AGENTS.md | GHA cron | Daily incremental + weekly full scan |
| **Daily 03:00 UTC** | Embedding generation for resources missing embedding | pg_cron triggers Edge Function | Edge Function calls OpenAI; logs results |
| **Daily 04:00 UTC** | Hard-delete soft-deleted accounts older than 30 days | pg_cron | Pure SQL + service-role auth admin call |
| | Expire deals where `expires_at < now()` | pg_cron | |
| | Purge `rate_limit_buckets` older than 1 hour | pg_cron | |
| **Tuesday 09:00 UTC** | Weekly newsletter digest send | pg_cron triggers Edge Function | Edge Function calls Resend bulk send + logs to `newsletter_issues` |
| **Weekly Sunday** | HF full-search for new open-weights | GHA cron | Phase 2 |
| | GitHub full re-scan for skills/rules | GHA cron | Catches what daily incrementals missed |
| **Per-event** | News auto-draft from `change_events` (price change, version release) | DB trigger (`fn_after_change_event`) | Already in schema; runs synchronously inside the change-causing transaction |
| | Bookmark count denormalisation | DB trigger (`fn_after_bookmark`) | Already in schema |
| | Review rating recomputation | DB trigger (`fn_recompute_resource_rating`) | Already in schema |
| | Install event rollup | DB trigger (`fn_after_install_event`) | Already in schema |

### Three rules

1. **GHA for I/O-heavy work.** Anything that calls a remote API, parses HTML, downloads files, or uploads to R2 runs in a GHA workflow. GHA workers have generous CPU/memory and 6-hour timeouts.
2. **pg_cron for SQL-only work.** Anything that's a UPDATE/INSERT/DELETE against our DB with no external I/O runs in pg_cron. No app code, runs inside the DB.
3. **Edge Functions for the bridge.** When pg_cron needs to call an external API (newsletter send, embedding generation, Stripe retry), pg_cron makes an HTTP call to a Supabase Edge Function via `pg_net`, and the Edge Function does the API call. Keeps app code in TypeScript.

### Concurrency

GHA workflows declare `concurrency: { group: 'ingest-${source}', cancel-in-progress: false }` so two runs of the same ingest don't collide. pg_cron jobs are inherently single-instance per cron entry. Edge Functions don't have shared mutable state, so concurrency at the function level is fine; the underlying API calls have their own rate limits we respect.

### Failure handling

Every job:

- Writes a row to `ingestion_runs` (or a similar log table for non-ingestion jobs) with `started_at`, `completed_at`, `status`, `records_inserted/updated/failed`, `error_message`
- On failure: Slack notification to `#vch-ops` channel via webhook (env var `SLACK_OPS_WEBHOOK_URL`)
- Most failures are recoverable next run (idempotent upserts); persistent failures across 7 days surface "Source: stale" badge on affected resource detail pages per data-sourcing §19

---

## §13 Authentication & authorization

### Authentication

- Supabase Auth with GitHub OAuth (primary) and Google OAuth (secondary).
- Sign-in lives at `/signin` and as a modal triggered from header.
- OAuth callback at `/auth/callback` exchanges code → session → redirects to return-to URL or dashboard.
- Sessions stored in HTTP-only cookies (Supabase default, signed by service-role secret).
- Session expiry: 1 week (Supabase default), refreshed transparently on activity.
- No password auth at launch (per design-prompt §20: "GitHub OAuth (primary, since users come from dev tools), Google OAuth (secondary). No passwords.").

### Authorization layers

1. **Middleware** (`middleware.ts`) — checks session existence on protected paths (`/dashboard/*`, `/settings/*`, `/submit/*`, `/admin/*`). Redirects to `/signin?return=<url>` if absent.
2. **Route group layouts** — `(admin)/layout.tsx` re-checks session AND admin status (`ADMIN_GITHUB_USER_IDS` env var match against `session.user.user_metadata.provider_id`). Redirects to `/dashboard` if non-admin.
3. **Server Action middleware** — `next-safe-action`'s `.use()` chain checks session on every authenticated action. Public actions (newsletter signup, anonymous bookmarks-via-cookie) opt out.
4. **RLS** — Supabase RLS policies enforce row-level access at the DB level. Even if app-layer auth is bypassed, the DB rejects unauthorized reads. Schema's RLS policies are already comprehensive (lines 1455-1694 of `schema.sql`).

### Supabase client variants

- `createBrowserClient()` — for Client Components, uses anon key, RLS enforces per-user access
- `createServerClient()` — for Server Components and Server Actions, reads session cookie
- `createServiceClient()` — admin-only operations (image moderation publish, account hard-delete), uses service-role key, BYPASSES RLS. Only callable from `lib/server/`.

### Session expiry handling

- Mid-action session expiry: Server Action returns `{ serverError: 'session_expired' }`; client redirects to `/signin?return=<current>` and shows toast "Your session expired. Please sign in again."
- Mid-page session expiry: next page navigation triggers middleware redirect.
- Concurrent sessions across tabs: each tab uses the same cookie session; refresh token rotation handled by Supabase.

---

## §14 Form validation & Server Actions

Standard pattern across every form:

1. **Zod schema** declared once, used both client and server.
2. **Client validation** on blur and on submit (using `react-hook-form` + `@hookform/resolvers/zod` OR a lightweight custom hook — TBD in Phase B B3).
3. **Server Action** re-validates with the same Zod schema (client validation is a UX improvement; server is authoritative).
4. **Inline errors** below each field (red text + icon).
5. **Form-level error summary** at top if 3+ errors.
6. **Submit button** disabled while `useAction`'s `isExecuting === true`, shows inline spinner inside the button.
7. **Success state** announces via toast + form reset (or redirect for multi-step flows).

### Library decision (TBD in Phase B B3)

Two candidates: `react-hook-form` (mature, large ecosystem, ~15KB) vs hand-rolled hook (smaller, fewer deps, more code). Default leaning: react-hook-form for the 3 large forms (submit-resource, profile-edit, settings); hand-rolled for trivial 1-field forms (newsletter signup, bookmark toggle). Final call in B3.

---

## §15 Realtime / SSE for `/api/firehose`

Single SSE endpoint streams `change_events` rows to subscribed clients.

```ts
// app/api/firehose/route.ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await rateLimit({ key: \`firehose:ip:\${ip(req)}\`, max: 1, window: '1 minute' });

  const stream = new ReadableStream({
    async start(controller) {
      // 1. Send last 100 events from history
      const history = await db.select().from(changeEvents)
        .orderBy(desc(changeEvents.createdAt)).limit(100);
      for (const ev of history.reverse()) {
        controller.enqueue(\`data: \${JSON.stringify(ev)}\\n\\n\`);
      }

      // 2. Subscribe to Supabase Realtime channel
      const supabase = createServiceClient();
      const channel = supabase.channel('change_events')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'change_events' },
          (payload) => controller.enqueue(\`data: \${JSON.stringify(payload.new)}\\n\\n\`))
        .subscribe();

      // 3. Heartbeat every 30s to keep connection alive through proxies
      const heartbeat = setInterval(() => controller.enqueue(': ping\\n\\n'), 30_000);

      // 4. Cleanup on disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        supabase.removeChannel(channel);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  });
}
```

Polling fallback at `/api/firehose?since=<iso8601>` returns JSON array.

---

## §16 PostHog wiring

```ts
// app/layout.tsx (root layout — Server Component)
import { PostHogProvider } from '@/components/posthog-provider';
import { CookieBanner } from '@/components/cookie-banner';
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <PostHogProvider>
          {children}
          <CookieBanner />
        </PostHogProvider>
      </body>
    </html>
  );
}

// components/posthog-provider.tsx — Client Component
'use client';
import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://us.posthog.com',
      capture_pageview: false, // we capture manually for SPA-style routing
      session_recording: { maskAllInputs: true, maskTextSelector: '[data-private]' },
    });
  }, []);
  return <Provider client={posthog}>{children}</Provider>;
}
```

### Event taxonomy (firms up route-by-route in Phase C)

Initial set (locked in `lib/analytics/events.ts` as TS string-literal types):

```ts
export type AnalyticsEvent =
  | 'pageview'
  | 'signup_completed'
  | 'signin_completed'
  | 'signout'
  | 'stack_picker_opened'
  | 'stack_saved'
  | 'stack_adopted'
  | 'bookmark_added'
  | 'bookmark_removed'
  | 'install_button_clicked'
  | 'cmdk_opened'
  | 'cmdk_query_searched'
  | 'cmdk_result_clicked'
  | 'comparison_opened'
  | 'comparison_added'
  | 'review_submitted'
  | 'deal_claim_started'
  | 'pro_upgrade_modal_opened'
  | 'pro_checkout_started'
  | 'pro_subscription_activated'
  | 'pro_subscription_cancelled'
  | 'newsletter_subscribed'
  | 'guide_started'
  | 'guide_step_completed'
  | 'guide_completed'
  | 'submission_started'
  | 'submission_published';
```

Every event has typed properties, validated at the analytics-helper level. No PII in event payloads; user-association via PostHog's `posthog.identify(userId)` (userId is the Supabase UUID, not PII).

### Cookie consent

PostHog initialised but `opt_out_capturing_by_default: true` if cookie consent not yet given. Cookie banner appears on first visit; user accepts → `posthog.opt_in_capturing()`. Session replay paused if user declines analytics.

---

## §17 SEO infrastructure

- **Per-page metadata** via Next.js `generateMetadata` export — every page has unique `title`, `description`, `openGraph`, `twitter`. `robots: { index: true, follow: true }` for public pages; `{ index: false }` for `(app)` and `(admin)` groups.
- **Canonical URLs** set via `metadata.alternates.canonical`. Resource detail pages with multiple type URLs (`/components/foo` and `/c/foo` if shortcut redirects exist) point all to the canonical `/components/foo`.
- **Sitemap** (`app/sitemap.ts`) — generated dynamically from DB, lists every published resource + every `/best-for` + every `/alternatives` + every guide + every news article + every showcase. Limit ~50K URLs per sitemap; if we cross that, split into a sitemap index.
- **robots.txt** (`app/robots.ts`) — allows crawl, points to sitemap, disallows `(app)`, `(admin)`, and `/auth/*`.
- **JSON-LD** structured data on detail pages:
  - Models, MCPs, Components, Skills, etc. → `SoftwareApplication`
  - Models specifically → also `Product` with `offers` for pricing tiers
  - News articles → `NewsArticle`
  - Guides → `HowTo`
  - Showcase items → `CreativeWork`
  - `/best-for` pages → `ItemList`
  - Reviews appear nested in the resource's `aggregateRating`
- **Internal links** use absolute paths (`/models/claude-opus-4-7`), never relative.

---

## §18 i18n architecture readiness

English-only at launch. Architecture supports future i18n without rewriting.

- **No hardcoded strings in component code.** Every user-facing string lives in `lib/i18n/en.ts` accessed via a `t()` helper. The helper is a pass-through for now (`t(key) => en[key] ?? key`); when Phase 2+ adds locales, the helper looks up the active locale.
- **Dates** via `Intl.DateTimeFormat` with the user's locale (defaulting to `en-US` for Phase 1, swappable later).
- **Numbers** via `Intl.NumberFormat`.
- **Currency** via `Intl.NumberFormat` with `currency` style + ISO code (`USD` default; switchable per the cost calculator's currency toggle).
- **Pluralization** via `Intl.PluralRules` where it matters ("1 review" vs "2 reviews").
- **No string concatenation** to build sentences. Always `t('key', { count: 5, name: 'foo' })` patterns.

---

## §19 Testing strategy

Per build-prompt and `ASSUMPTIONS.md`:

- **Vitest unit** — `lib/` utilities, Drizzle query helpers, Zod schemas, business logic. Target ~60-70% line coverage.
- **Vitest integration** — Server Actions (with mocked DB), API routes (with mocked DB).
- **Playwright e2e** — 5 critical flows only:
  1. Sign up via GitHub OAuth (mocked OAuth provider in test mode)
  2. Sign in via GitHub OAuth
  3. Bookmark a resource as a logged-in user
  4. Build a stack via Stack Picker
  5. Pro upgrade flow (Stripe test mode)
- **CI runs all of the above** on every push to main and every PR. Failed Vitest blocks merge; failed Playwright blocks merge.
- **No 100% coverage target.** Critical paths covered, weird edge cases tested where they bit us, the rest left to manual Phase D review.

Test fixtures: a small `seed-test.json` (10 resources, 1 user, 1 stack) is loaded at the start of every Playwright run via the test database (separate Supabase project: `vibecoderhub-test`).

---

## §20 Deployment & environments

Three environments:

| Env | Hosted at | Database | Stripe | Resend | Triggered by |
|---|---|---|---|---|---|
| **local** | `localhost:3000` | local Supabase (`supabase start`) OR remote dev project | Stripe test | Resend test (sandbox) | `pnpm dev` |
| **preview** | Vercel preview URL per PR | shared dev Supabase (`vibecoderhub-dev`) | Stripe test | Resend test | every PR |
| **production** | `vibecoderhub.com` | `vibecoderhub-prod` Supabase | Stripe live | Resend prod | merge to `main` |

- **Env vars** validated by `lib/env.ts` at boot via Zod. App fails to start if any required var is missing or invalid.
- **`.env.example`** is the canonical list with comments.
- **No secret in `NEXT_PUBLIC_*`** — anything prefixed with that ships to the browser. Only the Supabase anon key, the PostHog key, and the Stripe publishable key live there.
- **Production secrets** in Vercel project env vars + GitHub secrets (for ingestion workflows).
- **DB migrations** run via `pnpm db:migrate` against the right env. Migration command refuses to run against production unless `--force` flag passed AND `VCH_ENV=production` set.

### Deploy procedure (Phase 1 launch)

Documented in `DEPLOYMENT_RUNBOOK.md` (created at end of Phase C). Brief:

1. Schema migration on production DB (one-time)
2. Storage buckets created via Supabase dashboard
3. pg_cron schedules registered
4. GHA workflow secrets set
5. Stripe webhook endpoint registered + signing secret captured
6. Resend domain verified, DNS records confirmed
7. Sentry project created, source-map upload token configured
8. PostHog project created
9. Vercel project linked, env vars set, custom domain configured
10. First deploy via `git push origin main`
11. Smoke test: `/api/health` returns 200 with DB-status check
12. Real-user smoke: sign up via GitHub, browse a model, bookmark it
13. Announce launch

Each step has a verification check + rollback procedure in the runbook.

---

## §21 Open architectural decisions deferred to artifact 3 (B3)

These are decisions that depend on `lib/tokens.ts` being formalised and Tailwind extension being written:

- Form library: `react-hook-form` vs hand-rolled — see §14
- Toast library: `sonner` vs `react-hot-toast` vs hand-rolled — leaning sonner
- Skeleton library: hand-rolled (matches Promptkit's `.skeleton` class) — confirmed via Ben's Phase A close
- Email templates: React Email vs Mjml — confirmed React Email
- Drizzle relations vs raw joins — leaning relations for top 5 query patterns, raw SQL via `db.execute(sql\`...\`)` for complex aggregations

All defaults captured here; locked in B3 with reasoning.

---

## §22 What this document gates

- Phase B B3 (`lib/tokens.ts` + `app/globals.css` + `tailwind.config.ts`) builds against §1, §2, §10 (rate-limit table flag), §11.
- Phase B B4 (migration order) ordered against §13 (auth before pages), §10 (rate-limit table addition flag), §12 (pg_cron jobs registration).
- Phase B B5 (dependency graph) maps against §2 (composition rule), §3 (caching invalidation chains).
- Phase B B6 (Phase 0+1 checklist) maps every master-plan checkbox against the file paths these architectural choices imply.
- Phase C every slice references this document for SC/CC, caching, error-boundary placement, Server Action shape, logging, rate-limit policy.
- Phase D Pass 2 (functional sweep) verifies error-handling + cache invalidation work as specified.
- Phase D Pass 5 (user journey) verifies session expiry, network failure, optimistic rollback all work as documented.
