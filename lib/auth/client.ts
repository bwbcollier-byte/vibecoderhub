// Browser-side auth client + `useSession()` hook.
//
// Singleton per browser tab. Re-uses one client for every Client Component
// so the auth state listener only fires once.
//
// The `useSession()` hook returns `{ user, loading }`. Components that need
// to render auth-aware UI should pull from this rather than calling
// `supabase.auth.getUser()` themselves — the hook deduplicates the network
// hit and keeps everyone in sync on auth events (SIGNED_IN, SIGNED_OUT,
// TOKEN_REFRESHED, USER_UPDATED).

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

let cachedClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  cachedClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return cachedClient;
}

export interface UseSessionResult {
  user: User | null;
  loading: boolean;
}

export function useSession(): UseSessionResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    let cancelled = false;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (cancelled) return;
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

/**
 * Sign out from the browser. Clears Supabase session, then hard-navigates so
 * Server Components re-render with the signed-out user.
 */
export async function signOut(redirectTo: string = '/'): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
  window.location.assign(redirectTo);
}
