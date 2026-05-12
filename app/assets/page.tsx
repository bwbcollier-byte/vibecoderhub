import type { ReactElement } from 'react';

import { ASSETS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Assets · Vibe Coder Hub',
  description: 'Icons, illustrations, 3D scenes, brand kits.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(ASSETS.config.typeId);
  return <ResourceIndexPage items={items} config={ASSETS.config} />;
}
