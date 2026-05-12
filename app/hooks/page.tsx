import type { ReactElement } from 'react';

import { HOOKS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Hooks · Vibe Coder Hub',
  description: 'Pre-commit, pre-push, and post-merge hooks for AI coders.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(HOOKS.config.typeId);
  return <ResourceIndexPage items={items} config={HOOKS.config} />;
}
