// Supabase service-role client. RLS-bypassing — for admin / system operations
// only (rate-limit writes, ingestion writes, hard-delete, storage admin).
// Never invoke from a code path that runs on behalf of a user; the service-role
// key sees every row regardless of policy.
//
// Note: this is the supabase-js client, NOT a Drizzle client. Use it for:
//   - Auth admin (lib/auth/server.ts)
//   - Storage admin (uploads, signed URLs)
//   - RLS bypass for system jobs
// For typed table queries, prefer `db` from ./db.ts.

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';

let cached: SupabaseClient | undefined;

export function getServiceClient(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  return cached;
}
