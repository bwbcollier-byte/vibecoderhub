import type { ReactElement } from 'react';

import { SANDBOXES } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Sandboxs · Vibe Coder Hub',
  description: 'Cloud sandboxes for agent-executed code.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={SANDBOXES.items} config={SANDBOXES.config} />;
}
