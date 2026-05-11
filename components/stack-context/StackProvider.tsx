// User-stack context.
//
// Per Q2.3: the user's "stack" (AI clients + tech stack + hardware) is
// captured by the Stack Picker. For logged-out users it persists in the
// `vch_stack` cookie. For logged-in users it lives in the user_stacks DB
// table and the active id is also stashed in the cookie for fast SSR.
//
// This provider exposes the active stack to consumers (header chip, "for
// your stack" feeds, Cmd-K filters). It does NOT load anything from the DB —
// that's a Server Component query the layout passes down as `initialStack`.

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export interface ActiveStack {
  /** Stack id from user_stacks. Null when logged-out + hasn't picked yet. */
  id: string | null;
  /** Display label — e.g. "Cursor + Next.js + Tailwind". */
  label: string | null;
  aiClients: string[];
  techStack: string[];
}

interface StackContextValue {
  stack: ActiveStack | null;
  setStack: (next: ActiveStack | null) => void;
  clearStack: () => void;
}

const StackContext = createContext<StackContextValue | null>(null);

const COOKIE_NAME = 'vch_stack';
const COOKIE_MAX_AGE_DAYS = 180;

export function StackProvider({
  children,
  initialStack = null,
}: {
  children: ReactNode;
  initialStack?: ActiveStack | null;
}): ReactNode {
  const [stack, setStackState] = useState<ActiveStack | null>(initialStack);

  const setStack = useCallback((next: ActiveStack | null): void => {
    setStackState(next);
    if (next === null) {
      document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
      return;
    }
    const payload = encodeURIComponent(JSON.stringify(next));
    document.cookie =
      `${COOKIE_NAME}=${payload}; Path=/; Max-Age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
  }, []);

  const clearStack = useCallback(() => setStack(null), [setStack]);

  return (
    <StackContext.Provider value={{ stack, setStack, clearStack }}>
      {children}
    </StackContext.Provider>
  );
}

export function useStack(): StackContextValue {
  const ctx = useContext(StackContext);
  if (!ctx) throw new Error('useStack must be used inside <StackProvider>');
  return ctx;
}
