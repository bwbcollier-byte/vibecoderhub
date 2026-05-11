import type { ReactElement } from 'react';

import { MARKETPLACES } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Marketplaces · Vibe Coder Hub',
  description: 'Curated registries — Cursor Directory, Smithery, shadcn Registry.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={MARKETPLACES.items} config={MARKETPLACES.config} />;
}
