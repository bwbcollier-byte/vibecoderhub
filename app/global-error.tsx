'use client';

// Global error boundary — catches errors that escape app/layout.tsx itself
// (so this file must render its own <html> + <body>). Used as a last-resort
// fallback; the regular `error.tsx` handles segment-level errors.

import { useEffect } from 'react';
import type { ReactElement } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): ReactElement {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#131313',
          color: '#ffffff',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 640, textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#ff6b6b',
              marginBottom: 16,
            }}
          >
            FATAL · {error.digest ?? 'ROOT'}
          </p>
          <h1
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(48px, 7vw, 88px)',
              lineHeight: 0.95,
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            Application crashed.
          </h1>
          <p style={{ color: '#949494', fontSize: 16, marginBottom: 24 }}>
            {error.message || 'A fatal error escaped the root layout.'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: '#3cffd0',
              color: '#000',
              border: 'none',
              borderRadius: 24,
              padding: '14px 24px',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
