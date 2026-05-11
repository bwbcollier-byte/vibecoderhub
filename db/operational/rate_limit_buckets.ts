// Operational table — sliding-window rate-limit bucket.
// Carve-out approved (Q1.1 + Phase B Flag 1). NOT part of resources spine.
// Source of truth: db/migrations/0002_rate_limit_buckets.sql.

import { pgTable, primaryKey, text, timestamp, integer, index } from 'drizzle-orm/pg-core';

export const rateLimitBuckets = pgTable(
  'rate_limit_buckets',
  {
    bucketKey: text('bucket_key').notNull(),
    bucketAt: timestamp('bucket_at', { withTimezone: true }).notNull(),
    count: integer('count').default(0).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bucketKey, table.bucketAt] }),
    recentIdx: index('rate_limit_buckets_recent_idx').on(table.bucketAt),
  }),
);
