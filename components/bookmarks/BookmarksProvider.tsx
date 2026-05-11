'use client';

// Bookmarks store. Anonymous users get cookie persistence (vch_bookmarks,
// 1-year SameSite=Lax). Logged-in users will swap to DB-backed storage in
// Slice 5 — but the hook API stays identical so consumers don't change.
//
// Free tier cap: 5 bookmarks (per ANSWERS Q1.5). Member + Pro: unlimited.
// Phase 1: auth flag is hardcoded false; once useSession lands the cap
// flips automatically.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface BookmarkEntry {
  /** Stable identifier for de-dupe. Pattern: `{resourceType}:{slug}`. */
  id: string;
  /** Resource-type slug used for grouping + nav (e.g. 'model', 'mcp', 'component'). */
  type: string;
  /** Display name for the bookmarks list. */
  name: string;
  /** Path the bookmark links to. */
  href: string;
  /** When the bookmark was added — ISO string. Used for "Recent" sorting. */
  addedAt: string;
}

interface BookmarksContextValue {
  items: BookmarkEntry[];
  count: number;
  /** Cap for the current user tier; null = unlimited. */
  limit: number | null;
  has: (id: string) => boolean;
  toggle: (entry: Omit<BookmarkEntry, 'addedAt'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** True when the cap has been hit. */
  atCap: boolean;
}

const COOKIE_NAME = 'vch_bookmarks';
const COOKIE_MAX_AGE_DAYS = 365;
const ANON_LIMIT = 5;

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]!) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Path=/; ` +
    `Max-Age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
}

function clearCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function parseStored(raw: string | null): BookmarkEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as BookmarkEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is BookmarkEntry =>
        typeof b?.id === 'string' &&
        typeof b?.type === 'string' &&
        typeof b?.name === 'string' &&
        typeof b?.href === 'string' &&
        typeof b?.addedAt === 'string',
    );
  } catch {
    return [];
  }
}

export function BookmarksProvider({ children }: { children: ReactNode }): ReactNode {
  const [items, setItems] = useState<BookmarkEntry[]>([]);

  // Hydrate from cookie after mount — SSR returns an empty list, the client
  // fills in. Per-card bookmark icons flip from "off" to "on" on hydration if
  // the user already had the entry saved. Acceptable Phase 1; the small
  // visual flash is preferable to making every list a Server Component
  // dependency.
  useEffect(() => {
    setItems(parseStored(readCookie(COOKIE_NAME)));
  }, []);

  const persist = useCallback((next: BookmarkEntry[]): void => {
    if (next.length === 0) clearCookie(COOKIE_NAME);
    else writeCookie(COOKIE_NAME, JSON.stringify(next));
  }, []);

  const isAuthed = false; // TODO Slice 5: useSession().user != null
  const limit: number | null = isAuthed ? null : ANON_LIMIT;

  const has = useCallback((id: string): boolean => items.some((b) => b.id === id), [items]);

  const toggle = useCallback(
    (entry: Omit<BookmarkEntry, 'addedAt'>): void => {
      setItems((prev) => {
        const exists = prev.some((b) => b.id === entry.id);
        let next: BookmarkEntry[];
        if (exists) {
          next = prev.filter((b) => b.id !== entry.id);
        } else {
          if (limit != null && prev.length >= limit) {
            // Silent no-op; UI surfaces a toast / paywall hint at the call
            // site (per-card or per-list). Returning prev unchanged keeps
            // the cookie clean.
            return prev;
          }
          next = [{ ...entry, addedAt: new Date().toISOString() }, ...prev];
        }
        persist(next);
        return next;
      });
    },
    [limit, persist],
  );

  const remove = useCallback(
    (id: string): void => {
      setItems((prev) => {
        const next = prev.filter((b) => b.id !== id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clear = useCallback((): void => {
    setItems([]);
    persist([]);
  }, [persist]);

  const value = useMemo<BookmarksContextValue>(
    () => ({
      items,
      count: items.length,
      limit,
      has,
      toggle,
      remove,
      clear,
      atCap: limit != null && items.length >= limit,
    }),
    [items, limit, has, toggle, remove, clear],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be used inside <BookmarksProvider>');
  return ctx;
}
