import type { ReactElement } from 'react';

import { EVALS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Evals · Vibe Coder Hub',
  description: 'Benchmarks and grading suites for AI coding agents.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(EVALS.config.typeId);
  return <ResourceIndexPage items={items} config={EVALS.config} />;
}
