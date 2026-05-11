# Outside-Eye Critique

*Imagine a senior engineer at Linear or Vercel reviewed this build. What three things would they fix first?*

## 1. **Real database, not seed files.** *(Highest priority.)*

The site has 160+ routes and zero of them touch Postgres. Every list, detail, search, sort, and filter reads from `lib/seed/*.ts` — hand-rolled TS arrays of 3–10 entries per type. The schema is mirrored in Drizzle (~1500 lines), Supabase clients are wired (`db.ts`, `db-direct.ts`, `db-service.ts`), but no slice currently calls them. This is the right Phase 1 choice (no creds, no migrations to manage, build velocity high), but a Linear engineer's first reflex would be: "Wire one real query end-to-end now, before launch, to find every wrong assumption." Recommended first slice for Session 15+: swap `listModels()` to a real Drizzle query against a populated dev Supabase project. The query API will need pagination tokens (current `Load more` is in-memory), real full-text search (current `.filter(includes)` won't scale), and proper error states for network failure.

## 2. **`/api/firehose` per-IP rate limit uses a module-level `Map` — won't survive a single deploy.**

```ts
const activeConnections = new Map<string, AbortController>();
```

That Map lives in one Node process. Vercel serverless functions cold-boot into separate processes; a single IP can hold N connections by hitting N instances. The same applies to the in-process `lib/server/ratelimit.ts` sliding-window CTE — it's only "single-instance correct" if you assume one writer. For Phase 1 this is fine because the firehose has ~zero real traffic, but the comment in KNOWN_ISSUES is buried. A Vercel engineer would want this explicitly switched to either `@vercel/kv` (Upstash Redis under the hood) or back to Postgres-backed via the `rate_limit_buckets` table you already have. Estimated: 30 minutes. Fix before the first launch tweet, not after.

## 3. **No real error reporting in production.**

`sentry.client.config.ts`, `sentry.server.config.ts`, and `lib/logger.ts` are still deferred (Boot Step 5, blocked on DSN). The site will go live with `console.error` as its entire error-reporting stack. When the first production user hits a real-data edge case (a slug with a hyphen the seed didn't anticipate; a Drizzle query that returns null where the page expects an array), the team will find out via Slack DM, not via Sentry. Same priority as #1 — wire it Session 15. The `instrumentation.ts` hook, `sentry-cli` release-tagging, and the GitHub repo URL for source-map upload are all that's needed. Estimated: under an hour once the DSN lands.

---

## Honourable mentions (would-be-asked but not top-3)

- **Bundle includes a 19 KB Zod chunk on `/submit` only.** Could split further by lazy-loading the schema, but at 19 KB on a single dynamic route nobody loads before signup, it's not worth the indirection.
- **No CI in `.github/workflows/ci.yml`** — KNOWN_ISSUES from Session 1. Phase 1 stretch was to land this before first commit; never did. Now ~150 commits in, easier to set up against a real branch protection rule. 30 minutes.
- **Newsletter unsubscribe is cookie-stub.** A Linear engineer would point out that an unsubscribe link that returns "Unsubscribed" but doesn't actually unsubscribe is *a CAN-SPAM / GDPR issue*. Acceptable until Resend actually sends a real email; mandatory before any newsletter email leaves Resend's queue. (Already flagged in KNOWN_ISSUES.)
