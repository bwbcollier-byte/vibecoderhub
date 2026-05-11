// Supabase session refresh — called from middleware.ts.
//
// Edge-runtime safe (no postgres-js, no node:async_hooks). Reads the current
// session cookies, refreshes the access token if it's near expiry, and writes
// the rotated cookies back onto the response.
//
// Returns the NextResponse so the caller can chain further header writes.

import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { type NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function refreshSession(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Defensive: middleware runs before lib/env Zod validation. If env is
  // misconfigured, fail open (skip refresh) rather than 500 every request.
  if (!supabaseUrl || !supabaseAnonKey) return response;

  // Local-dev "no external services" mode (lib/env.ts `apiKey()` helper +
  // .env.example placeholders). Skip the network round-trip — there's no
  // real Supabase instance to refresh against.
  if (
    supabaseUrl.includes('your-project-ref') ||
    supabaseAnonKey.endsWith('dummy') ||
    supabaseAnonKey === 'eyJ...'
  ) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() triggers token refresh if the access token is expired and the
  // refresh token is still valid. The side-effect is the auth cookies being
  // rotated via the setAll() callback above.
  await supabase.auth.getUser();

  return response;
}
