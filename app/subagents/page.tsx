import type { ReactElement } from 'react';

import { SUBAGENTS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Subagents · Vibe Coder Hub',
  description:
    'Specialized Claude Code subagents — test writers, PR reviewers, migration planners, security auditors.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={SUBAGENTS.items} config={SUBAGENTS.config} />;
}
