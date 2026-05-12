import type { ReactElement } from 'react';

import { SPECS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Specs · Vibe Coder Hub',
  description: 'Reusable design specs for common SaaS flows.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(SPECS.config.typeId);
  return <ResourceIndexPage items={items} config={SPECS.config} />;
}
