import type { ReactElement } from 'react';

import { PLUGINS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Plugins · Vibe Coder Hub',
  description:
    'Claude Code plugin bundles — shadcn/ui, Drizzle helpers, Next App Router pack, Stripe billing kit.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={PLUGINS.items} config={PLUGINS.config} />;
}
