// Direct (non-pooled) Drizzle client. Use ONLY for migrations and long-running
// scripts that need a real Postgres connection (prepared statements, advisory
// locks, transactions across many statements). Never import this from request
// path code — it bypasses the connection pool and will exhaust Supabase's
// direct-connection limit fast.
//
// Used by scripts/dev/migrate.ts and any one-off maintenance scripts.

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

export type DbDirect = PostgresJsDatabase<typeof schema>;

// Single connection — never pool. Migration scripts run in a single
// long-lived process; pooling here is wasteful and breaks advisory locks.
const client = postgres(env.DATABASE_URL_DIRECT, {
  max: 1,
  prepare: true,
  idle_timeout: 0,
});

export const dbDirect: DbDirect = drizzle(client, { schema });
export const rawDirectClient = client;
