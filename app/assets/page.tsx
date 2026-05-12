import type { ReactElement } from 'react';

import { ASSETS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Assets · Vibe Coder Hub',
  description: 'Icons, illustrations, 3D scenes, brand kits.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(ASSETS.config.typeId),
    getResourceCount(ASSETS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={ASSETS.config} totalCount={totalCount} />;
}
