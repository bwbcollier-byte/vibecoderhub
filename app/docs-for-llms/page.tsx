import type { ReactElement } from 'react';

import { DOCS_FOR_LLMS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Docs · Vibe Coder Hub',
  description: 'LLM-optimized reference docs — minimal, dedupe, context-window-safe.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(DOCS_FOR_LLMS.config.typeId),
    getResourceCount(DOCS_FOR_LLMS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={DOCS_FOR_LLMS.config} totalCount={totalCount} />;
}
