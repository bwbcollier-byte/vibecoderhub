import type { ReactElement } from 'react';

import { OBSERVABILITY } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Observabilitys · Vibe Coder Hub',
  description: 'LLM tracing, eval, and cost-attribution tools.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(OBSERVABILITY.config.typeId);
  return <ResourceIndexPage items={items} config={OBSERVABILITY.config} />;
}
