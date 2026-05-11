import type { ReactElement } from 'react';

import { DOCS_FOR_LLMS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Docs · Vibe Coder Hub',
  description: 'LLM-optimized reference docs — minimal, dedupe, context-window-safe.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={DOCS_FOR_LLMS.items} config={DOCS_FOR_LLMS.config} />;
}
