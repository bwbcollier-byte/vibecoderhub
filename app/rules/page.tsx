import type { ReactElement } from 'react';

import { RULES } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Rules · Vibe Coder Hub',
  description: 'Coding conventions enforced by the agent at completion time.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(RULES.config.typeId),
    getResourceCount(RULES.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={RULES.config} totalCount={totalCount} />;
}
