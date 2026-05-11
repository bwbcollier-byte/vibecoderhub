// Pooled Drizzle client. Use this for runtime queries from Server Components,
// Server Actions, route handlers, and middleware. Goes through the Supabase
// transaction-mode pooler (pgbouncer), so prepared statements are disabled.
// For migrations and long-running scripts, use db-direct.ts instead.

import 'server-only';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/lib/env';
import * as tables from '@/db/schema';
import * as tableRelations from '@/db/relations';
import { rateLimitBuckets } from '@/db/operational/rate_limit_buckets';
import { ingestionRuns } from '@/db/operational/ingestion_runs';

const schema = {
  ...tables,
  ...tableRelations,
  rateLimitBuckets,
  ingestionRuns,
} as const;

export type DbSchema = typeof schema;
export type Db = PostgresJsDatabase<DbSchema>;

// HMR-safe singleton (Next.js dev re-evaluates modules; we'd otherwise leak
// connections each save). In prod, module evaluation happens once per cold
// start so this is identical to a top-level const.
declare global {
  var __vch_postgres__: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__vch_postgres__ ??
  postgres(env.DATABASE_URL_POOLED, {
    // Supabase pgbouncer in transaction mode does not support prepared statements.
    prepare: false,
    // Connection pool sizing — Vercel functions are short-lived; keep tiny.
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (env.NODE_ENV !== 'production') {
  globalThis.__vch_postgres__ = client;
}

export const db: Db = drizzle(client, { schema, logger: env.LOG_LEVEL === 'debug' });
