// Safe return-to URL handling.
//
// The "return to where I was" UX flow stashes an intended path in a query
// param during OAuth, then redirects there after sign-in. Naive
// implementations are an open-redirect surface: if we forward to whatever
// `?next=` says, an attacker can phish via `vibecoderhub.com/auth?next=https://evil.com`.
//
// Rule: only same-origin, absolute paths. Reject anything with a scheme,
// double slashes, or backslashes (some browsers normalise `\/` to `//`).
// Fallback: `/`.

const FALLBACK = '/';

export function sanitiseReturnTo(raw: string | null | undefined): string {
  if (!raw) return FALLBACK;
  // Strip whitespace + control chars first
  const trimmed = raw.trim();
  if (trimmed.length === 0) return FALLBACK;

  // Must start with a single slash
  if (!trimmed.startsWith('/')) return FALLBACK;

  // Reject protocol-relative ("//host") and backslash variants
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.includes('\\')) {
    return FALLBACK;
  }

  // Reject any scheme-looking content (defence in depth)
  if (/^[a-z]+:/i.test(trimmed.slice(1))) return FALLBACK;

  // Cap length so a giant path can't cause downstream issues
  if (trimmed.length > 2048) return FALLBACK;

  return trimmed;
}

/**
 * Build a sign-in URL that remembers where the user was. Use on the
 * client side of "you must sign in" guards.
 */
export function signInUrl(currentPath: string): string {
  const safe = sanitiseReturnTo(currentPath);
  const qs = new URLSearchParams({ next: safe });
  return `/?${qs.toString()}#auth`;
}
