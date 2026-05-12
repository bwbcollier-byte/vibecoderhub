import type { ReactElement } from 'react';

import { COMMANDS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Commands · Vibe Coder Hub',
  description: 'Slash commands that drive your agent.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(COMMANDS.config.typeId);
  return <ResourceIndexPage items={items} config={COMMANDS.config} />;
}
