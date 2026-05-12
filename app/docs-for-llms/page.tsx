import type { ReactElement } from 'react';

import { DOCS_FOR_LLMS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Docs · Vibe Coder Hub',
  description: 'LLM-optimized reference docs — minimal, dedupe, context-window-safe.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(DOCS_FOR_LLMS.config.typeId);
  return <ResourceIndexPage items={items} config={DOCS_FOR_LLMS.config} />;
}
