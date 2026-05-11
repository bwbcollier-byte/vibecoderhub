// Next.js middleware (Edge runtime).
//
// Runs before every matched request. Kept lean because Edge can't talk to
// postgres-js and can't open arbitrary Node modules. Heavier work (rate-limit
// DB writes, full auth lookups, admin allowlist checks) lives in:
//   - lib/server/ratelimit.ts   — called from route handlers + action middleware
//   - lib/auth/middleware.ts    — wired in Boot Step 6 (next session)
//   - lib/auth/is-admin.ts      — Boot Step 6
//
// What we DO here:
//   1. Generate a per-request ID and forward it on `x-request-id` so logs,
//      Sentry, and the client can correlate. The Node-side runtime reads it
//      via next/headers and re-enters AsyncLocalStorage (lib/http/request-id.ts).
//   2. Capture the client IP into a header that Node-side code can trust
//      (the raw x-forwarded-for is a potential spoof on non-Vercel hosts).
//   3. Stamp matched admin paths with a header so the route group layout knows
//      to enforce the admin allowlist (the actual check lives in Boot Step 6).
//
// We do NOT touch the DB, postgres, or Supabase here. Step 6 will add Supabase
// SSR cookie refresh via @supabase/ssr (Edge-safe).

import { NextResponse, type NextRequest } from 'next/server';
import { REQUEST_ID_HEADER } from '@/lib/http/request-id';
import { getClientIp } from '@/lib/http/ip';

const ADMIN_PATH_PREFIX = '/admin';
const ADMIN_PATH_FLAG = 'x-vch-admin-path';
const CLIENT_IP_HEADER = 'x-vch-client-ip';

export function middleware(req: NextRequest): NextResponse {
  const requestId = crypto.randomUUID();
  const clientIp = getClientIp(req.headers);

  // Forward request headers so Server Components / route handlers see them.
  const forwardHeaders = new Headers(req.headers);
  forwardHeaders.set(REQUEST_ID_HEADER, requestId);
  forwardHeaders.set(CLIENT_IP_HEADER, clientIp);

  if (req.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX)) {
    forwardHeaders.set(ADMIN_PATH_FLAG, '1');
  }

  const res = NextResponse.next({
    request: { headers: forwardHeaders },
  });
  // Echo on the response so the browser can show / report it.
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
