// GET /api/health — liveness probe.
//
// Phase 1: returns `{ status: 'ok', uptime, timestamp, version }`. When the DB
// is connected (post-Supabase), add a lightweight `SELECT 1` round-trip + a
// `db: 'ok' | 'degraded' | 'down'` field.
//
// Edge-runtime safe — no DB import, no Node-only API.

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const startedAt = Date.now();

export function GET(): Response {
  const body = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    version: process.env.NEXT_PUBLIC_GIT_SHA ?? 'dev',
    env: process.env.VERCEL_ENV ?? 'local',
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
