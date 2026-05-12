import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { HOOKS } from '@/lib/seed/_configs';
import { listResources, getResourceBySlug, listResourceSlugs } from '@/lib/db/queries/resources';
import { DetailChassis } from '@/components/resources/DetailChassis';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listResourceSlugs(HOOKS.config.typeId);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = await getResourceBySlug(HOOKS.config.typeId, slug);
  if (!m) return { title: 'Hook not found' };
  return { title: `${m.name} — ${m.author}`, description: m.tagline };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const resource = await getResourceBySlug(HOOKS.config.typeId, slug);
  if (!resource) notFound();
  const all = await listResources(HOOKS.config.typeId);
  const alternatives = all.filter((m) => m.slug !== resource.slug).slice(0, 4);
  return (
    <DetailChassis resource={resource} config={HOOKS.config} alternatives={alternatives} />
  );
}
