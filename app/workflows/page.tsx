import type { ReactElement } from 'react';

import { WORKFLOWS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Workflows · Vibe Coder Hub',
  description: 'Multi-step recipes — SaaS launch, PR triage, doc generation.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={WORKFLOWS.items} config={WORKFLOWS.config} />;
}
