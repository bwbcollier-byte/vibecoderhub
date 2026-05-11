// Client-side provider tree. Composed by app/layout.tsx (a Server Component)
// with hydrated initial state read from cookies.

'use client';

import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ReducedMotionProvider } from '@/components/theme/ReducedMotionProvider';
import { StackProvider, type ActiveStack } from '@/components/stack-context/StackProvider';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { CookieBanner } from '@/components/layout/cookie-banner/CookieBanner';

interface ProvidersProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark' | 'system';
  initialStack?: ActiveStack | null;
}

export function Providers({
  children,
  initialTheme = 'dark',
  initialStack = null,
}: ProvidersProps): ReactNode {
  return (
    <ReducedMotionProvider>
      <ThemeProvider initialTheme={initialTheme}>
        <StackProvider initialStack={initialStack}>
          <PostHogProvider>
            {children}
            <Toaster
              theme="dark"
              richColors
              closeButton
              position="bottom-right"
            />
            <CookieBanner />
          </PostHogProvider>
        </StackProvider>
      </ThemeProvider>
    </ReducedMotionProvider>
  );
}
