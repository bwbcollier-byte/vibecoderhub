-- 0002_rate_limit_buckets.sql
-- Operational table for ARCHITECTURE.md §10 sliding-window rate limit.
-- Approved under operational carve-out (Q1.1 + Phase B Flag 1): does not touch
-- the resource model, only supports rate-limit middleware.

create table rate_limit_buckets (
  bucket_key   text not null,
  bucket_at    timestamptz not null,
  count        int default 0 not null,
  primary key (bucket_key, bucket_at)
);
create index rate_limit_buckets_recent_idx on rate_limit_buckets (bucket_at);

-- RLS: deny by default. Only the service-role client (lib/server/ratelimit.ts)
-- writes here. No SELECT/INSERT/UPDATE/DELETE policies → only service-role bypasses.
alter table rate_limit_buckets enable row level security;
