-- 0003_ingestion_runs.sql
-- Operational table for data-sourcing §19 (ingestion script logging).
-- Approved under operational carve-out (Q1.1 + Phase B Flag 1).
-- Verified absent from canonical schema before adding (MIGRATION_ORDER §3.3).

create table ingestion_runs (
  id              uuid primary key default gen_random_uuid(),
  source_slug     text not null,                       -- 'openrouter', 'shadcn', etc.
  priority        text not null default 'normal',      -- 'critical' | 'high' | 'normal' (Q2.1)
  started_at      timestamptz default now() not null,
  completed_at    timestamptz,
  status          text not null default 'running',     -- 'running' | 'success' | 'failed' | 'partial'
  records_inserted int default 0 not null,
  records_updated  int default 0 not null,
  records_failed   int default 0 not null,
  error_message    text,
  raw_dump_r2_key  text,                                -- pointer to the R2 raw dump
  metadata         jsonb default '{}'::jsonb
);
create index ingestion_runs_source_idx on ingestion_runs (source_slug, started_at desc);
create index ingestion_runs_priority_idx on ingestion_runs (priority, status, started_at desc);
create index ingestion_runs_recent_idx on ingestion_runs (started_at desc);

alter table ingestion_runs enable row level security;
-- Admin read only (via app-layer is_admin check in queries; service-role inserts).
