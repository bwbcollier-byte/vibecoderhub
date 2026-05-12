import type { ReactElement } from 'react';

import { SCRIPTS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Scripts · Vibe Coder Hub',
  description: 'Repo-level scripts — bumpver, envsync, release-notes.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(SCRIPTS.config.typeId);
  return <ResourceIndexPage items={items} config={SCRIPTS.config} />;
}
