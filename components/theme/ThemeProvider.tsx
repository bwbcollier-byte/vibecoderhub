// Theme provider — cookie-backed (so initial SSR has correct `class="dark"`).
//
// Phase 1 ships dark-only (R3). The provider's API supports `light | dark |
// system` so the architecture is light-ready; nothing in Phase 1 actually
// renders light. To enable light later: add light tokens to globals.css and
// flip this to default to `system`.

'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (next: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const COOKIE_NAME = 'vch_theme';
const COOKIE_MAX_AGE_DAYS = 365;

export function ThemeProvider({
  children,
  initialTheme = 'dark',
}: {
  children: ReactNode;
  initialTheme?: Theme;
}): ReactNode {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Phase 1: resolved theme is always dark (R3). Once light lands, derive
  // from system MQ or the explicit setting.
  const resolved: 'light' | 'dark' = 'dark';

  useEffect(() => {
    // Sync the `dark` class for any consumer that needs it (Tailwind dark:
    // variants, third-party widgets). globals.css already sets dark as default.
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolved]);

  function setTheme(next: Theme): void {
    setThemeState(next);
    document.cookie =
      `${COOKIE_NAME}=${next}; Path=/; Max-Age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
