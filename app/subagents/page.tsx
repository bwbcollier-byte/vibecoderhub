import type { ReactElement } from 'react';

import { SUBAGENTS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Subagents · Vibe Coder Hub',
  description:
    'Specialized Claude Code subagents — test writers, PR reviewers, migration planners, security auditors.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(SUBAGENTS.config.typeId),
    getResourceCount(SUBAGENTS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={SUBAGENTS.config} totalCount={totalCount} />;
}
