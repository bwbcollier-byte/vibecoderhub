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

interface PageProps {
  searchParams: Promise<{ tab?: string; welcome?: string }>;
}

export default async function SettingsPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const session = await auth();
  // TODO Slice 5: replace with return-to query via lib/auth/return-to.ts
  if (!session) redirect('/?signin=1');

  const { user } = session;
  const email = user.email ?? '';
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    (typeof meta.user_name === 'string' && meta.user_name) ||
    email.split('@')[0] ||
    '';
  const avatarUrl = typeof meta.avatar_url === 'string' ? meta.avatar_url : null;

  const { tab, welcome } = await searchParams;
  const validTab =
    tab === 'profile' || tab === 'stack' || tab === 'subscription' || tab === 'danger'
      ? tab
      : undefined;

  return (
    <SettingsClient
      email={email}
      initialDisplayName={displayName}
      initialAvatarUrl={avatarUrl}
      initialTab={validTab}
      welcome={welcome === 'true'}
    />
  );
}
