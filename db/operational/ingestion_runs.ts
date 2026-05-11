// Operational table — ingestion script run log.
// Carve-out approved (Q1.1 + Phase B Flag 1). NOT part of resources spine.
// Source of truth: db/migrations/0003_ingestion_runs.sql.

import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';

export const ingestionRuns = pgTable(
  'ingestion_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sourceSlug: text('source_slug').notNull(),
    priority: text('priority').default('normal').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    status: text('status').default('running').notNull(),
    recordsInserted: integer('records_inserted').default(0).notNull(),
    recordsUpdated: integer('records_updated').default(0).notNull(),
    recordsFailed: integer('records_failed').default(0).notNull(),
    errorMessage: text('error_message'),
    rawDumpR2Key: text('raw_dump_r2_key'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
  },
  (table) => ({
    sourceIdx: index('ingestion_runs_source_idx').on(
      table.sourceSlug,
      table.startedAt.desc(),
    ),
    priorityIdx: index('ingestion_runs_priority_idx').on(
      table.priority,
      table.status,
      table.startedAt.desc(),
    ),
    recentIdx: index('ingestion_runs_recent_idx').on(table.startedAt.desc()),
  }),
);
