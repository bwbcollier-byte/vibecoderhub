import type { ReactElement } from 'react';

import { SKILLS } from '@/lib/seed/_configs';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Skills · Vibe Coder Hub',
  description: 'Capabilities packaged for the agent — PDFs, spreadsheets, design tokens, docx.',
};

export default function Page(): ReactElement {
  return <ResourceIndexPage items={SKILLS.items} config={SKILLS.config} />;
}
