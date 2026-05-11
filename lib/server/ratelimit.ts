// Sliding-window rate limiter, backed by the rate_limit_buckets operational
// table (ARCHITECTURE.md §10). Each bucket holds one minute of activity for
// a given key; the limiter sums the trailing N minutes.
//
// Postgres-only: keeps the dependency surface small and we already have a
// service-role connection. Bucket rows are purged nightly by pg_cron job
// 005-purge-rate-limits (see MIGRATION_ORDER §3.6).
//
// Cost model: one INSERT…ON CONFLICT and one SUM per checked request. For
// hot paths, callers should pre-check via a cheap auth/admin allowlist
// before invoking; treat this as the last-line gate, not the first filter.
//
// NEVER call this from middleware.ts (Edge runtime — no postgres-js). Call
// it from route handlers, Server Actions, and action-client middleware
// (all Node runtime).

import 'server-only';
import { sql } from 'drizzle-orm';

import { db } from './db';
import { rateLimitBuckets } from '@/db/operational/rate_limit_buckets';

export interface RateLimitOptions {
  /** Stable bucket identity — typically `${scope}:${ip|userId}`. */
  key: string;
  /** Max requests allowed inside the window. */
  limit: number;
  /** Window length in minutes. Bucket granularity is 1 minute. */
  windowMinutes: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Requests counted in the trailing window (after this one is recorded). */
  used: number;
  /** Requests still permitted in the trailing window. Floors at 0. */
  remaining: number;
  /** UTC seconds at which the oldest bucket exits the window. */
  resetAtSec: number;
}

/**
 * Increment the current minute's bucket and check the trailing window total.
 *
 * Behaviour: the increment always lands (so we have an audit trail of the
 * attempt). `allowed = false` is the caller's signal to return 429 / surface
 * a UI error — the row is still written.
 */
export async function checkRateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const { key, limit, windowMinutes } = opts;

  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error('rate-limit: `limit` must be a positive number');
  }
  if (!Number.isFinite(windowMinutes) || windowMinutes <= 0) {
    throw new Error('rate-limit: `windowMinutes` must be a positive number');
  }

  // Single round-trip: upsert the current bucket and return the window sum.
  // date_trunc to minute gives a stable bucket key for the in-flight minute.
  const rows = await db.execute<{ total: number; reset_at_sec: number }>(sql`
    with upsert as (
      insert into ${rateLimitBuckets} (bucket_key, bucket_at, count)
      values (${key}, date_trunc('minute', now()), 1)
      on conflict (bucket_key, bucket_at)
      do update set count = ${rateLimitBuckets.count} + 1
      returning bucket_at
    )
    select
      coalesce(sum(count), 0)::int as total,
      extract(epoch from (
        coalesce(min(bucket_at), now()) + (${windowMinutes}::int * interval '1 minute')
      ))::int as reset_at_sec
    from ${rateLimitBuckets}
    where bucket_key = ${key}
      and bucket_at >= now() - (${windowMinutes}::int * interval '1 minute')
  `);

  const row = rows[0] ?? { total: 1, reset_at_sec: Math.floor(Date.now() / 1000) + windowMinutes * 60 };
  const used = row.total;
  const allowed = used <= limit;
  const remaining = Math.max(0, limit - used);

  return { allowed, used, remaining, resetAtSec: row.reset_at_sec };
}
