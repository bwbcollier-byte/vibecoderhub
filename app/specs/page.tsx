import type { ReactElement } from 'react';

import { SPECS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Specs · Vibe Coder Hub',
  description: 'Reusable design specs for common SaaS flows.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={SPECS.items} config={SPECS.config} />;
}
