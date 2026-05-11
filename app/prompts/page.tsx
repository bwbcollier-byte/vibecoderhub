import type { ReactElement } from 'react';

import { PROMPTS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Prompts · Vibe Coder Hub',
  description:
    'Reusable instruction packs — PR summaries, commit messages, release notes, ticket extractors.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={PROMPTS.items} config={PROMPTS.config} />;
}
