// Wrap a Drizzle query so a connection failure (placeholder password,
// network blip, RLS denial during dev) returns the empty fallback rather
// than crashing the page. Errors are logged once at warn level.

import 'server-only';

export async function safeQuery<T>(fn: () => Promise<T>, fallback: T, label?: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    // Log every failure (not just the first). Previous behaviour suppressed
    // subsequent errors via a module-level singleton, which made debugging
    // home-page emptiness impossible — one early build-time failure poisoned
    // every later request.
    const tag = label ? `[db:${label}]` : '[db]';
    const msg = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string })?.code;
    console.warn(`${tag} query failed → fallback. ${code ? `[${code}] ` : ''}${msg}`);
    return fallback;
  }
}

/** Format a count for hero stats: 1234 → "1,234"; 12500 → "12.5K". */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return n.toLocaleString();
  return `${(n / 1000).toFixed(n < 100_000 ? 1 : 0).replace(/\.0$/, '')}K`;
}
