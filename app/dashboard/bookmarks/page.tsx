// /dashboard/bookmarks — all saved bookmarks for the current user.
//
// Anonymous users see their cookie-backed list (cap 5 per Q1.5). Member /
// Pro tiers see DB-backed unlimited bookmarks once Slice 5 lands; the page
// shape stays identical because `useBookmarks()` is the only data source.
//
// Phase 1 stub: same protected-route pattern as the rest of /dashboard —
// auth() gate → redirect /?signin=1 when anon. Once cookie bookmarks are
// the only data source we may relax the gate so anonymous users can still
// inspect their own list; revisit when DB-backed entries land.

import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

import { auth } from '@/lib/auth/server';

import { BookmarksClient } from './_components/BookmarksClient';

export const metadata = {
  title: 'Bookmarks · Vibe Coder Hub',
};

export default async function BookmarksPage(): Promise<ReactElement> {
  const session = await auth();
  if (!session) redirect('/?signin=1');
  // TODO Slice 5: pass session.user.id; client hook will read DB-backed
  // bookmarks rather than the cookie.
  return <BookmarksClient />;
}
