import type { ReactElement } from 'react';

import { SHOWCASE } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Showcases · Vibe Coder Hub',
  description: 'Real apps shipped by vibe coders — patterns, stacks, lessons.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(SHOWCASE.config.typeId);
  return <ResourceIndexPage items={items} config={SHOWCASE.config} />;
}
