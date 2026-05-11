'use client';

// Route-level error boundary. Catches uncaught errors in the route segment
// tree (Server Components, Client Components, async data fetches) and
// renders a recovery UI. The `reset` callback re-renders the segment.

import { useEffect } from 'react';
import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps): ReactElement {
  useEffect(() => {
    // Sentry lands Boot Step 5; until then log to console.
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="max-w-prose mx-auto px-4 md:px-8 py-20 flex flex-col gap-6">
      <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-error-red">
        ERROR · {error.digest ?? 'CLIENT'}
      </p>
      <h1 className="font-display uppercase leading-[0.95] text-[clamp(48px,7vw,88px)]">
        Something broke.
      </h1>
      <p className="text-text-secondary text-[16px] leading-[1.5]">
        {error.message || 'An unexpected error occurred while rendering this page.'}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="ghost" onClick={() => (window.location.href = '/')}>
          Go home
        </Button>
      </div>
    </div>
  );
}
