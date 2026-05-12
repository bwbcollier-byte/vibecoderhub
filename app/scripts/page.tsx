import type { ReactElement } from 'react';

import { SCRIPTS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Scripts · Vibe Coder Hub',
  description: 'Repo-level scripts — bumpver, envsync, release-notes.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(SCRIPTS.config.typeId),
    getResourceCount(SCRIPTS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={SCRIPTS.config} totalCount={totalCount} />;
}
