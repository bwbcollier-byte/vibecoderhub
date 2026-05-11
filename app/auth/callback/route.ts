// OAuth code-exchange endpoint.
//
// Supabase Auth sends the user here after they approve OAuth at the provider
// (GitHub). We swap the code for a session, then redirect to the return-to
// path (validated against same-origin paths only — see lib/auth/return-to).

import { NextResponse, type NextRequest } from 'next/server';

import { getSupabaseServerClient } from '@/lib/auth/server';
import { sanitiseReturnTo } from '@/lib/auth/return-to';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = sanitiseReturnTo(url.searchParams.get('next'));

  if (!code) {
    // No code → bounce back to landing with an error flag the modal can read.
    return NextResponse.redirect(new URL('/?auth_error=missing_code', url.origin));
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const failUrl = new URL('/?auth_error=exchange_failed', url.origin);
    return NextResponse.redirect(failUrl);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
