// Reduced-motion provider — reads `prefers-reduced-motion` once on mount and
// exposes the result via context so components can branch on it without each
// installing their own MQ listener.
//
// globals.css already disables most CSS transitions/animations globally when
// the OS setting is on (`@media (prefers-reduced-motion: reduce)`). This
// provider is for JS-driven motion (Framer, GSAP, custom intersection-based
// reveals) that the stylesheet can't reach.

'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const ReducedMotionContext = createContext<boolean>(false);

export function ReducedMotionProvider({ children }: { children: ReactNode }): ReactNode {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (ev: MediaQueryListEvent): void => setReduced(ev.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>
  );
}

export function useReducedMotion(): boolean {
  return useContext(ReducedMotionContext);
}
