// Wraps an ingestion run with start/finish rows in operational ingestion_runs.
// Per Q1.1 + Phase B Flag 1 (operational-table carve-out).

import { ingestionRuns } from '@/db/operational/ingestion_runs';
import { eq } from 'drizzle-orm';

import { createLogger, type Logger } from './logger';
import { closeDb, getDb } from './db';
import { buildR2Key, uploadRawDump } from './r2';
import { getEnv } from './env';

export type Priority = 'critical' | 'high' | 'normal' | 'low';

export interface RunContext {
  runId: string;
  sourceSlug: string;
  logger: Logger;
  counters: { inserted: number; updated: number; failed: number };
  /** Upload a raw-dump payload to R2 for audit trail. Returns the R2 key (or null if unconfigured). */
  dump: (payload: unknown, ext?: string) => Promise<string | null>;
  metadata: Record<string, unknown>;
}

export interface RunOptions {
  sourceSlug: string;
  priority?: Priority;
  /** Skip the entire run (and exit 0) when these env vars are missing/dummy. */
  requiredEnv?: string[];
}

export async function withIngestionRun(
  opts: RunOptions,
  fn: (ctx: RunContext) => Promise<void>,
): Promise<void> {
  const logger = createLogger(opts.sourceSlug);

  if (opts.requiredEnv?.length) {
    const missing = opts.requiredEnv.filter((k) => !getEnv(k));
    if (missing.length) {
      logger.warn('skip: required env missing', { missing });
      return;
    }
  }

  // If DB is not configured locally, log + skip rather than crash.
  if (!getEnv('DATABASE_URL_DIRECT') && !getEnv('DATABASE_URL_POOLED')) {
    logger.warn('skip: no DATABASE_URL configured');
    return;
  }

  const db = getDb();
  const priority = opts.priority ?? 'normal';

  const rows = await db
    .insert(ingestionRuns)
    .values({ sourceSlug: opts.sourceSlug, priority, status: 'running' })
    .returning({ id: ingestionRuns.id });
  const runId = rows[0]!.id;

  logger.info('run started', { runId, priority });

  const counters = { inserted: 0, updated: 0, failed: 0 };
  let r2Key: string | null = null;
  const metadata: Record<string, unknown> = {};

  const ctx: RunContext = {
    runId,
    sourceSlug: opts.sourceSlug,
    logger,
    counters,
    metadata,
    async dump(payload, ext = 'json') {
      const key = buildR2Key(opts.sourceSlug, runId, ext);
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const uploaded = await uploadRawDump(key, body).catch((err) => {
        logger.warn('r2 upload failed', { err: String(err) });
        return null;
      });
      if (uploaded) r2Key = uploaded;
      return uploaded;
    },
  };

  try {
    await fn(ctx);
    await db
      .update(ingestionRuns)
      .set({
        status: 'success',
        completedAt: new Date(),
        recordsInserted: counters.inserted,
        recordsUpdated: counters.updated,
        recordsFailed: counters.failed,
        rawDumpR2Key: r2Key,
        metadata,
      })
      .where(eq(ingestionRuns.id, runId));
    logger.info('run completed', { runId, ...counters, r2Key });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db
      .update(ingestionRuns)
      .set({
        status: 'failed',
        completedAt: new Date(),
        recordsInserted: counters.inserted,
        recordsUpdated: counters.updated,
        recordsFailed: counters.failed,
        errorMessage: message.slice(0, 2000),
        rawDumpR2Key: r2Key,
        metadata,
      })
      .where(eq(ingestionRuns.id, runId));
    logger.error('run failed', { runId, err: message });
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}
