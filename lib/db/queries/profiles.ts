// Profile upsert on first sign-in. Idempotent: re-running for an existing
// user is a no-op (onConflictDoNothing). DB unreachable → logged + ignored.

import 'server-only';
import { sql } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { profiles } from '@/db/schema';

import { safeQuery } from './_safe';

export interface UpsertProfileInput {
  id: string;
  githubHandle?: string | null;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

function deriveUsername(input: UpsertProfileInput): string {
  const base =
    input.githubHandle ||
    (input.email ? input.email.split('@')[0]! : '') ||
    `user_${input.id.slice(0, 8)}`;
  const normalised = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
  return normalised.length >= 2 ? normalised : `user_${input.id.slice(0, 8)}`;
}

export async function ensureProfile(input: UpsertProfileInput): Promise<void> {
  await safeQuery(async () => {
    const username = deriveUsername(input);
    await db
      .insert(profiles)
      .values({
        id: input.id,
        username,
        displayName: input.displayName ?? null,
        avatarUrl: input.avatarUrl ?? null,
        githubHandle: input.githubHandle ?? null,
      })
      .onConflictDoNothing({ target: profiles.id });
    return null;
  }, null);
}

export async function getProfileById(id: string) {
  return safeQuery(async () => {
    const rows = await db
      .select()
      .from(profiles)
      .where(sql`${profiles.id} = ${id} and ${profiles.deletedAt} is null`)
      .limit(1);
    return rows[0];
  }, undefined);
}
