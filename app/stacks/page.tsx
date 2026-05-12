import type { ReactElement } from 'react';

import { STACKS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Stacks · Vibe Coder Hub',
  description: 'Opinionated full-stack combinations — T3, Astro Content, Convex.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(STACKS.config.typeId);
  return <ResourceIndexPage items={items} config={STACKS.config} />;
}
