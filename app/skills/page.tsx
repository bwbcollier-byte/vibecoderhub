import type { ReactElement } from 'react';

import { SKILLS } from '@/lib/seed/_configs';
import { listResources } from '@/lib/db/queries/resources';
import { ResourceIndexPage } from '@/components/resources/ResourceIndexPage';

export const metadata = {
  title: 'Skills · Vibe Coder Hub',
  description: 'Capabilities packaged for the agent — PDFs, spreadsheets, design tokens, docx.',
};

export default async function Page(): Promise<ReactElement> {
  const items = await listResources(SKILLS.config.typeId);
  return <ResourceIndexPage items={items} config={SKILLS.config} />;
}
