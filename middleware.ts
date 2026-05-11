// Next.js middleware (Edge runtime).
//
// Runs before every matched request. Kept lean because Edge can't talk to
// postgres-js and can't open arbitrary Node modules. Heavier work (rate-limit
// DB writes, full admin enforcement, profile loads) lives in:
//   - lib/server/ratelimit.ts   — called from route handlers + action middleware
//   - lib/auth/server.ts        — RSC/Action `auth()` helper
//   - lib/auth/is-admin.ts      — checked inside `/admin` route group layout
//
// What we DO here:
//   1. Refresh the Supabase auth session (rotates the access token cookie
//      via @supabase/ssr — Edge-safe).
//   2. Generate a per-request ID and forward it on `x-request-id` so logs,
//      Sentry, and the client can correlate. The Node-side runtime reads it
//      via next/headers and re-enters AsyncLocalStorage (lib/http/request-id.ts).
//   3. Capture the client IP into a header that Node-side code can trust
//      (the raw x-forwarded-for is a potential spoof on non-Vercel hosts).
//   4. Stamp matched admin paths with a header so the admin route group can
//      gate at the layout level (the actual allowlist check uses is-admin.ts).
//
// We do NOT touch the DB or postgres here.

import { NextResponse, type NextRequest } from 'next/server';
import { REQUEST_ID_HEADER } from '@/lib/http/request-id';
import { getClientIp } from '@/lib/http/ip';
import { refreshSession } from '@/lib/auth/middleware';

const ADMIN_PATH_PREFIX = '/admin';
const ADMIN_PATH_FLAG = 'x-vch-admin-path';
const CLIENT_IP_HEADER = 'x-vch-client-ip';

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const clientIp = getClientIp(req.headers);

  // Forward request headers so Server Components / route handlers see them.
  const forwardHeaders = new Headers(req.headers);
  forwardHeaders.set(REQUEST_ID_HEADER, requestId);
  forwardHeaders.set(CLIENT_IP_HEADER, clientIp);

  if (req.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX)) {
    forwardHeaders.set(ADMIN_PATH_FLAG, '1');
  }

  let res = NextResponse.next({
    request: { headers: forwardHeaders },
  });

  // Rotate the Supabase auth cookies if the access token is near expiry.
  // This must happen on the same response we return so Set-Cookie reaches
  // the browser.
  res = await refreshSession(req, res);

  // Echo the request id on the response so the browser / clients can correlate.
  res.headers.set(REQUEST_ID_HEADER, requestId);
  return res;
}

// Skip Next internals and static assets. Match everything else.
export const config = {
  matcher: [
    // Run on every path except: _next assets, the static dir, favicons,
    // sitemap/robots, and the API health check (which has its own lightweight
    // path for uptime probes).
    '/((?!_next/static|_next/image|favicon|apple-icon|icon|opengraph-image|robots\\.txt|sitemap\\.xml|api/health).*)',
  ],
};
