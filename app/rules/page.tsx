import type { ReactElement } from 'react';

import { RULES } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Rules · Vibe Coder Hub',
  description: 'Coding conventions enforced by the agent at completion time.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={RULES.items} config={RULES.config} />;
}
