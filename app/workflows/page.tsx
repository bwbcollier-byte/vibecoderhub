import type { ReactElement } from 'react';

import { WORKFLOWS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Workflows · Vibe Coder Hub',
  description: 'Multi-step recipes — SaaS launch, PR triage, doc generation.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(WORKFLOWS.config.typeId);
  return <ResourceIndexPage items={items} config={WORKFLOWS.config} />;
}
