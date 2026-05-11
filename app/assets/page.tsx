import type { ReactElement } from 'react';

import { ASSETS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Assets · Vibe Coder Hub',
  description: 'Icons, illustrations, 3D scenes, brand kits.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={ASSETS.items} config={ASSETS.config} />;
}
