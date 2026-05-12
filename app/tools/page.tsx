import type { ReactElement } from 'react';

import { TOOLS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Tools · Vibe Coder Hub',
  description: 'AI-first IDEs and agent runtimes — Cursor, Claude Code, Windsurf.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(TOOLS.config.typeId),
    getResourceCount(TOOLS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={TOOLS.config} totalCount={totalCount} />;
}
