// /dashboard — logged-in user's home.
//
// Server Component: gates on auth() and hands the user down to the
// client wrapper which reads the StackProvider context for the
// "Your stack" card.

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/server';

import { DashboardClient } from './_components/DashboardClient';

export const metadata = {
  title: 'Dashboard · Vibe Coder Hub',
};

export default async function DashboardPage(): Promise<React.ReactElement> {
  const session = await auth();
  // TODO Slice 5: replace with return-to query via lib/auth/return-to.ts
  if (!session) redirect('/?signin=1');

  const { user } = session;
  const username =
    (user.user_metadata?.['username'] as string | undefined) ??
    (user.user_metadata?.['user_name'] as string | undefined) ??
    user.email?.split('@')[0] ??
    'guest';

  return <DashboardClient username={username} />;
}
