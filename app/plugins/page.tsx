import type { ReactElement } from 'react';

import { PLUGINS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Plugins · Vibe Coder Hub',
  description:
    'Claude Code plugin bundles — shadcn/ui, Drizzle helpers, Next App Router pack, Stripe billing kit.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(PLUGINS.config.typeId);
  return <ResourceIndexPage items={items} config={PLUGINS.config} />;
}
