import type { ReactElement } from 'react';

import { COMPONENTS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Components · Vibe Coder Hub',
  description:
    'Drop-in UI components built for AI coders. Pricing cards, command palettes, data tables, motion primitives.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={COMPONENTS.items} config={COMPONENTS.config} />;
}
