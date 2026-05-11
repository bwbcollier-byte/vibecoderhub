import type { ReactElement } from 'react';

import { COMMANDS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Commands · Vibe Coder Hub',
  description: 'Slash commands that drive your agent.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={COMMANDS.items} config={COMMANDS.config} />;
}
