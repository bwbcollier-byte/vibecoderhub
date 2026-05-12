'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * Toast — Sonner-backed. 4 kinds (info/success/error/warning), pill shape,
 * Promptkit-style colors. Use `toast.info(...)` / `toast.success(...)` / etc.
 *
 * Mount <Toaster /> once at the root (already wired in app/providers.tsx).
 *
 * Position: bottom-right on desktop, bottom-center on mobile (≤768px).
 * Duration: 5s default, 8s for errors (pass `{ duration: 8000 }` per call).
 */

export function Toaster(): React.ReactElement {
  // Start with desktop position SSR-side to avoid hydration mismatch, then
  // flip to bottom-center on the client if the viewport is mobile.
  const [position, setPosition] = React.useState<'bottom-right' | 'bottom-center'>(
    'bottom-right',
  );

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const apply = (): void => {
      setPosition(mql.matches ? 'bottom-center' : 'bottom-right');
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  return (
    <SonnerToaster
      position={position}
      offset={24}
      gap={8}
      visibleToasts={5}
      toastOptions={{
        unstyled: true,
        duration: 5000,
        classNames: {
          toast: [
            'flex items-center gap-2 px-4 py-3 rounded-pill shadow-lg',
            'font-mono font-bold uppercase tracking-[1.2px] text-[12px]',
          ].join(' '),
          info:    'bg-ultraviolet text-white',
          success: 'bg-mint text-black',
          error:   'bg-tile-pink text-white',
          warning: 'bg-tile-yellow text-black',
        },
      }}
    />
  );
}

export const toast = sonnerToast;
