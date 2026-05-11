// Script-local Drizzle client. Uses DATABASE_URL_DIRECT (single connection,
// migration-safe). Separate from lib/server/db-direct.ts which is gated by
// `server-only` and the strict env validator.

import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as tables from '@/db/schema';
import * as tableRelations from '@/db/relations';
import { rateLimitBuckets } from '@/db/operational/rate_limit_buckets';
import { ingestionRuns } from '@/db/operational/ingestion_runs';

import { getEnv } from './env';

const schema = {
  ...tables,
  ...tableRelations,
  rateLimitBuckets,
  ingestionRuns,
} as const;

export type IngestDb = PostgresJsDatabase<typeof schema>;

let cached: { db: IngestDb; client: ReturnType<typeof postgres> } | null = null;

export function getDb(): IngestDb {
  if (cached) return cached.db;
  const url = getEnv('DATABASE_URL_DIRECT') ?? getEnv('DATABASE_URL_POOLED');
  if (!url) throw new Error('DATABASE_URL_DIRECT (or _POOLED) required');
  const client = postgres(url, { max: 1, prepare: true, idle_timeout: 0 });
  const db = drizzle(client, { schema });
  cached = { db, client };
  return db;
}

export async function closeDb() {
  if (cached) {
    await cached.client.end({ timeout: 5 });
    cached = null;
  }
}
