import type { ReactElement } from 'react';

import { WORKFLOWS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Workflows · Vibe Coder Hub',
  description: 'Multi-step recipes — SaaS launch, PR triage, doc generation.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(WORKFLOWS.config.typeId),
    getResourceCount(WORKFLOWS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={WORKFLOWS.config} totalCount={totalCount} />;
}
