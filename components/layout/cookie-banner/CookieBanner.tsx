// Cookie consent banner.
//
// Renders bottom-left until the user accepts or rejects. Choice persists in
// the `vch_consent` cookie (`true` | `false`). PostHogProvider checks the
// cookie before initialising; rejecting prevents any analytics load.
//
// Phase 1 styling is intentionally plain — proper layout chrome (Header,
// Footer, MobileNav) lands in Boot Step 10. Replace with a styled component
// when the design system catches up.

'use client';

import { useEffect, useState, type ReactNode } from 'react';

const COOKIE_NAME = 'vch_consent';
const COOKIE_MAX_AGE_SEC = 365 * 24 * 60 * 60;

function readConsent(): 'true' | 'false' | null {
  if (typeof document === 'undefined') return null;
  for (const part of document.cookie.split(';')) {
    const [name, value] = part.trim().split('=');
    if (name === COOKIE_NAME) {
      if (value === 'true') return 'true';
      if (value === 'false') return 'false';
    }
  }
  return null;
}

function writeConsent(value: 'true' | 'false'): void {
  document.cookie =
    `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
}

export function CookieBanner(): ReactNode {
  const [decided, setDecided] = useState<boolean>(true);

  useEffect(() => {
    setDecided(readConsent() !== null);
  }, []);

  if (decided) return null;

  function accept(): void {
    writeConsent('true');
    // Hard reload so PostHogProvider re-runs its effect and initialises.
    window.location.reload();
  }

  function reject(): void {
    writeConsent('false');
    setDecided(true);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-md rounded border border-border bg-surface p-4 text-sm shadow-md sm:right-auto"
    >
      <p className="mb-3">
        We use cookies for analytics (PostHog) to learn how the site is used. No ads,
        no tracking outside the site.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded bg-fg px-3 py-1.5 text-bg hover:opacity-90"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={reject}
          className="rounded border border-border px-3 py-1.5 hover:bg-muted"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
