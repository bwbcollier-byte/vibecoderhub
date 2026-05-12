import type { ReactElement } from 'react';

import { OBSERVABILITY } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Observabilitys · Vibe Coder Hub',
  description: 'LLM tracing, eval, and cost-attribution tools.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(OBSERVABILITY.config.typeId),
    getResourceCount(OBSERVABILITY.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={OBSERVABILITY.config} totalCount={totalCount} />;
}
