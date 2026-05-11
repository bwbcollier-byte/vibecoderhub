import type { ReactElement } from 'react';

import { HOOKS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Hooks · Vibe Coder Hub',
  description: 'Pre-commit, pre-push, and post-merge hooks for AI coders.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={HOOKS.items} config={HOOKS.config} />;
}
