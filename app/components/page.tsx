import type { ReactElement } from 'react';

import { COMPONENTS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Components · Vibe Coder Hub',
  description:
    'Drop-in UI components built for AI coders. Pricing cards, command palettes, data tables, motion primitives.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(COMPONENTS.config.typeId),
    getResourceCount(COMPONENTS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={COMPONENTS.config} totalCount={totalCount} />;
}
