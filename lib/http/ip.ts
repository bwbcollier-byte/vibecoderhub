// Safe IP extraction for rate-limit keying and audit logging.
//
// On Vercel/Cloudflare, the client IP arrives via x-forwarded-for (first
// entry is the original client; subsequent entries are intermediate proxies).
// Reverse-proxy callers can spoof this header, so we ONLY trust it when the
// request reaches us from a known edge — on Vercel that's always the case.
//
// Fallbacks (in order): x-real-ip, cf-connecting-ip, then 'unknown'. We never
// throw; rate-limit logic prefers a stable string over a thrown exception.

const LOOPBACK = new Set(['127.0.0.1', '::1', '0.0.0.0']);

export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first && !LOOPBACK.has(first)) return first;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp && !LOOPBACK.has(realIp)) return realIp;
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp && !LOOPBACK.has(cfIp)) return cfIp;
  return 'unknown';
}
