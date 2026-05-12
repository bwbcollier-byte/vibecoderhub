import type { ReactElement } from 'react';

import { BACKENDS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Backends · Vibe Coder Hub',
  description: 'Auth, data, and storage backends optimized for AI apps.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(BACKENDS.config.typeId),
    getResourceCount(BACKENDS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={BACKENDS.config} totalCount={totalCount} />;
}
