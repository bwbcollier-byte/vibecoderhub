import type { ReactElement } from 'react';

import { PROMPTS } from '@/lib/seed/_configs';
import { listResources, getResourceCount } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Prompts · Vibe Coder Hub',
  description:
    'Reusable instruction packs — PR summaries, commit messages, release notes, ticket extractors.',
};

export default async function Page(): Promise<ReactElement> {
  const [items, totalCount] = await Promise.all([
    listResources(PROMPTS.config.typeId),
    getResourceCount(PROMPTS.config.typeId),
  ]);
  return <ResourceIndexPage items={items} config={PROMPTS.config} totalCount={totalCount} />;
}
