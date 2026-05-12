import type { ReactElement } from 'react';

import { COMPONENTS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Components · Vibe Coder Hub',
  description:
    'Drop-in UI components built for AI coders. Pricing cards, command palettes, data tables, motion primitives.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(COMPONENTS.config.typeId);
  return <ResourceIndexPage items={items} config={COMPONENTS.config} />;
}
