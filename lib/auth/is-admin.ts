// Admin allowlist check.
//
// Per Q2.6: admins are identified by their GitHub *numeric* user ID (not
// handle — handles can be renamed; ids are immutable). The allowlist lives in
// env.ADMIN_GITHUB_USER_IDS as a comma-separated list of numbers.
//
// The numeric id arrives in `user.user_metadata.provider_id` after GitHub
// OAuth. Supabase preserves it verbatim.

import type { User } from '@supabase/supabase-js';

import { env } from '@/lib/env';

export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  if (env.ADMIN_GITHUB_USER_IDS.length === 0) return false;

  const providerId = user.user_metadata?.provider_id;
  if (typeof providerId !== 'string' && typeof providerId !== 'number') {
    return false;
  }

  const n = typeof providerId === 'number' ? providerId : parseInt(providerId, 10);
  if (!Number.isFinite(n) || n <= 0) return false;

  return env.ADMIN_GITHUB_USER_IDS.includes(n);
}
