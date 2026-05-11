import type { ReactElement } from 'react';

import { BACKENDS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Backends · Vibe Coder Hub',
  description: 'Auth, data, and storage backends optimized for AI apps.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={BACKENDS.items} config={BACKENDS.config} />;
}
