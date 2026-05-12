import type { ReactElement } from 'react';

import { SANDBOXES } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Sandboxs · Vibe Coder Hub',
  description: 'Cloud sandboxes for agent-executed code.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(SANDBOXES.config.typeId);
  return <ResourceIndexPage items={items} config={SANDBOXES.config} />;
}
