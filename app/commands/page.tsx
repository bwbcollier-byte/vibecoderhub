import type { ReactElement } from 'react';

import { COMMANDS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Commands · Vibe Coder Hub',
  description: 'Slash commands that drive your agent.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(COMMANDS.config.typeId),
    getResourceCount(COMMANDS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={COMMANDS.config} totalCount={totalCount} />;
}
