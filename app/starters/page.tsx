import type { ReactElement } from 'react';

import { STARTERS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Starters · Vibe Coder Hub',
  description: 'Production-ready full-stack starters.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(STARTERS.config.typeId);
  return <ResourceIndexPage items={items} config={STARTERS.config} />;
}
