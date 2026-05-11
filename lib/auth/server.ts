// Server-side auth helpers. Use from Server Components, Server Actions, and
// route handlers — NEVER from Client Components (cookies() is server-only and
// the cookie writes from createServerClient need access to a writable jar).
//
// The Supabase SSR client is cheap to construct (just bag-of-fetches with a
// cookies adapter), so we re-create per call. Do NOT cache across requests —
// each request has its own cookies() instance.

import 'server-only';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { env } from '@/lib/env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Per-request Supabase server client wired to the current cookie store.
 * Reads + writes auth cookies — call inside RSCs / route handlers / SAs.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `cookies().set()` throws when called from a Server Component
          // (no response to attach Set-Cookie to). That's fine — middleware
          // refreshes the session cookies on the response, this branch
          // happens only on RSC reads.
        }
      },
    },
  });
}

/**
 * Current authenticated user, or null if signed out.
 *
 * Returns the user object from the Supabase session — DOES NOT fetch the
 * profiles row. Pages that need the profile should follow up with a typed
 * Drizzle query keyed on `user.id`.
 */
export async function auth(): Promise<{ user: User } | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { user: data.user };
}

/**
 * Same as auth() but throws when signed out. Use inside protected route
 * handlers where the caller has already gated access; saves a null check.
 */
export async function requireUser(): Promise<User> {
  const session = await auth();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session.user;
}
