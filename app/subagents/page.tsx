import type { ReactElement } from 'react';

import { SUBAGENTS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Subagents · Vibe Coder Hub',
  description:
    'Specialized Claude Code subagents — test writers, PR reviewers, migration planners, security auditors.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(SUBAGENTS.config.typeId);
  return <ResourceIndexPage items={items} config={SUBAGENTS.config} />;
}
