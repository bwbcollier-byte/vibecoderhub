// /settings — user settings.
//
// Server Component: gates on auth() and renders the client form.
// Profile / Stack / Subscription / Danger zone sections.

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/server';

import { SettingsClient } from './_components/SettingsClient';

export const metadata = {
  title: 'Settings · Vibe Coder Hub',
};

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await auth();
  // TODO Slice 5: replace with return-to query via lib/auth/return-to.ts
  if (!session) redirect('/?signin=1');

  const { user } = session;
  const email = user.email ?? '';
  const displayName =
    (user.user_metadata?.['full_name'] as string | undefined) ??
    (user.user_metadata?.['name'] as string | undefined) ??
    email.split('@')[0] ??
    '';

  return <SettingsClient email={email} initialDisplayName={displayName} />;
}
