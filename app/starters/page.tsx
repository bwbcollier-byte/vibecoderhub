import type { ReactElement } from 'react';

import { STARTERS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Starters · Vibe Coder Hub',
  description: 'Production-ready full-stack starters.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(STARTERS.config.typeId),
    getResourceCount(STARTERS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={STARTERS.config} totalCount={totalCount} />;
}
