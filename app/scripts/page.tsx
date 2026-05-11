import type { ReactElement } from 'react';

import { SCRIPTS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Scripts · Vibe Coder Hub',
  description: 'Repo-level scripts — bumpver, envsync, release-notes.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={SCRIPTS.items} config={SCRIPTS.config} />;
}
