import type { ReactElement } from 'react';

import { TOOLS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Tools · Vibe Coder Hub',
  description: 'AI-first IDEs and agent runtimes — Cursor, Claude Code, Windsurf.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={TOOLS.items} config={TOOLS.config} />;
}
