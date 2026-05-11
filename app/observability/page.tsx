import type { ReactElement } from 'react';

import { OBSERVABILITY } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Observabilitys · Vibe Coder Hub',
  description: 'LLM tracing, eval, and cost-attribution tools.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={OBSERVABILITY.items} config={OBSERVABILITY.config} />;
}
