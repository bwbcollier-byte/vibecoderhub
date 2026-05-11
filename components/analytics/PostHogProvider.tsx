// PostHog provider — opt-in via cookie consent (per Q2.7 + GDPR).
//
// PostHog is initialised ONLY when:
//   1. NEXT_PUBLIC_POSTHOG_KEY is set to a real key (not the `phc_dummy`
//      local-dev placeholder).
//   2. The user has actively consented (`vch_consent` cookie === 'true').
//
// CookieBanner is responsible for setting/clearing `vch_consent`. After
// consent flips to true, this provider initialises PostHog on next mount —
// the simplest behaviour is to hard-reload after accepting, which the
// banner does.
//
// Pageview capture: PostHog's `capture_pageview: 'history_change'` config
// hooks into pushState/replaceState so Next App Router navs are tracked
// without us threading a router.

'use client';

import { useEffect, type ReactNode } from 'react';
import posthog from 'posthog-js';

function hasConsent(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith('vch_consent=true'));
}

function isUsableKey(key: string | undefined): key is string {
  if (!key) return false;
  if (key.endsWith('dummy')) return false;
  if (key === 'phc_...' || key === '') return false;
  return key.startsWith('phc_');
}

export function PostHogProvider({ children }: { children: ReactNode }): ReactNode {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!isUsableKey(key)) return;
    if (!hasConsent()) return;

    posthog.init(key, {
      api_host: 'https://app.posthog.com',
      capture_pageview: 'history_change',
      capture_pageleave: true,
      disable_session_recording: false,
      autocapture: false, // turn on per-event tracking explicitly
      persistence: 'localStorage+cookie',
    });
  }, []);

  return <>{children}</>;
}
