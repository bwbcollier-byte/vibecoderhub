import type { ReactElement } from 'react';

import { STACKS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Stacks · Vibe Coder Hub',
  description: 'Opinionated full-stack combinations — T3, Astro Content, Convex.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={STACKS.items} config={STACKS.config} />;
}
