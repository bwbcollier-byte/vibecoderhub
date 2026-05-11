import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { DOCS_FOR_LLMS } from '@/lib/seed/_configs';
import { DetailChassis } from '@/components/resources/DetailChassis';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return DOCS_FOR_LLMS.items.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = DOCS_FOR_LLMS.items.find((x) => x.slug === slug);
  if (!m) return { title: 'Doc not found' };
  return { title: `${m.name} — ${m.author}`, description: m.tagline };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const resource = DOCS_FOR_LLMS.items.find((m) => m.slug === slug);
  if (!resource) notFound();
  const alternatives = DOCS_FOR_LLMS.items.filter((m) => m.slug !== resource.slug).slice(0, 4);
  return (
    <DetailChassis resource={resource} config={DOCS_FOR_LLMS.config} alternatives={alternatives} />
  );
}
