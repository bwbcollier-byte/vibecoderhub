'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * Toast — Sonner-backed. 4 kinds (info/success/error/warning), pill shape,
 * Promptkit-style colors. Use `toast.info(...)` / `toast.success(...)` / etc.
 *
 * Mount <Toaster /> once at the root (already wired in app/providers.tsx).
 */

export function Toaster(): React.ReactElement {
  return (
    <SonnerToaster
      position="bottom-right"
      offset={24}
      gap={8}
      visibleToasts={5}
      toastOptions={{
        unstyled: true,
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
