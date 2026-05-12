// OAuth code-exchange endpoint.
//
// Supabase Auth sends the user here after they approve OAuth at the provider
// (GitHub). We swap the code for a session, then redirect to the return-to
// path (validated against same-origin paths only — see lib/auth/return-to).

import { NextResponse, type NextRequest } from 'next/server';

import { getSupabaseServerClient } from '@/lib/auth/server';
import { sanitiseReturnTo } from '@/lib/auth/return-to';
import { ensureProfile } from '@/lib/db/queries/profiles';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = sanitiseReturnTo(url.searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(new URL('/?auth_error=missing_code', url.origin));
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const failUrl = new URL('/?auth_error=exchange_failed', url.origin);
    return NextResponse.redirect(failUrl);
  }

  const user = data.session?.user;
  let firstSignIn = false;
  if (user) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const result = await ensureProfile({
      id: user.id,
      githubHandle: typeof meta.user_name === 'string' ? meta.user_name : null,
      email: user.email ?? null,
      displayName: typeof meta.full_name === 'string' ? meta.full_name : null,
      avatarUrl: typeof meta.avatar_url === 'string' ? meta.avatar_url : null,
    });
    firstSignIn = result.created;
  }

  // First sign-in for a brand-new account → onboard via Profile tab with a
  // welcome banner. Returning users go to wherever they were heading.
  const target = firstSignIn ? '/settings?tab=profile&welcome=true' : next;
  return NextResponse.redirect(new URL(target, url.origin));
}
