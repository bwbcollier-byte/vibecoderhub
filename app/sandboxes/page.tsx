import type { ReactElement } from 'react';

import { SANDBOXES } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Sandboxs · Vibe Coder Hub',
  description: 'Cloud sandboxes for agent-executed code.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(SANDBOXES.config.typeId),
    getResourceCount(SANDBOXES.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={SANDBOXES.config} totalCount={totalCount} />;
}
