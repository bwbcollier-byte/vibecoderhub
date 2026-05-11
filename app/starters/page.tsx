import type { ReactElement } from 'react';

import { STARTERS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Starters · Vibe Coder Hub',
  description: 'Production-ready full-stack starters.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={STARTERS.items} config={STARTERS.config} />;
}
