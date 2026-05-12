// Wrap a Drizzle query so a connection failure (placeholder password,
// network blip, RLS denial during dev) returns the empty fallback rather
// than crashing the page. Errors are logged once at warn level.

import 'server-only';

let warned = false;

export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (!warned) {
      warned = true;
      console.warn('[db] query failed; returning fallback. Subsequent failures suppressed.', err);
    }
    return fallback;
  }
}

/** Format a count for hero stats: 1234 → "1,234"; 12500 → "12.5K". */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return n.toLocaleString();
  return `${(n / 1000).toFixed(n < 100_000 ? 1 : 0).replace(/\.0$/, '')}K`;
}
