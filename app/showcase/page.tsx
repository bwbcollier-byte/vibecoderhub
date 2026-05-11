import type { ReactElement } from 'react';

import { SHOWCASE } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Showcases · Vibe Coder Hub',
  description: 'Real apps shipped by vibe coders — patterns, stacks, lessons.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={SHOWCASE.items} config={SHOWCASE.config} />;
}
