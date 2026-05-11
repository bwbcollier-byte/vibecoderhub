import type { ReactElement } from 'react';

import { EVALS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Evals · Vibe Coder Hub',
  description: 'Benchmarks and grading suites for AI coding agents.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={EVALS.items} config={EVALS.config} />;
}
