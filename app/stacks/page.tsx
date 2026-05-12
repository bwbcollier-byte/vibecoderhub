import type { ReactElement } from 'react';

import { STACKS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Stacks · Vibe Coder Hub',
  description: 'Opinionated full-stack combinations — T3, Astro Content, Convex.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(STACKS.config.typeId),
    getResourceCount(STACKS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={STACKS.config} totalCount={totalCount} />;
}
