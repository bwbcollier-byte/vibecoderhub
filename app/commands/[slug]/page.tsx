import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { COMMANDS } from '@/lib/seed/_configs';
import { listResources, getResourceBySlug, listResourceSlugs } from '@/lib/db/queries/resources';
import { DetailChassis } from '@/components/resources/DetailChassis';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listResourceSlugs(COMMANDS.config.typeId);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = await getResourceBySlug(COMMANDS.config.typeId, slug);
  if (!m) return { title: 'Command not found' };
  return { title: `${m.name} — ${m.author}`, description: m.tagline };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const resource = await getResourceBySlug(COMMANDS.config.typeId, slug);
  if (!resource) notFound();
  const all = await listResources(COMMANDS.config.typeId);
  const alternatives = all.filter((m) => m.slug !== resource.slug).slice(0, 4);
  return (
    <DetailChassis resource={resource} config={COMMANDS.config} alternatives={alternatives} />
  );
}
