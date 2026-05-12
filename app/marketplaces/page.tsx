import type { ReactElement } from 'react';

import { MARKETPLACES } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Marketplaces · Vibe Coder Hub',
  description: 'Curated registries — Cursor Directory, Smithery, shadcn Registry.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(MARKETPLACES.config.typeId),
    getResourceCount(MARKETPLACES.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={MARKETPLACES.config} totalCount={totalCount} />;
}
