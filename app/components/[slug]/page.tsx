import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { COMPONENTS } from '@/lib/seed/_configs';
import { DetailChassis } from '@/components/resources/DetailChassis';
import { CodeSnippetPreview } from '@/components/resources/CodeSnippetPreview';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return COMPONENTS.items.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = COMPONENTS.items.find((x) => x.slug === slug);
  if (!m) return { title: 'Component not found' };
  return { title: `${m.name} — ${m.author}`, description: m.tagline };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const resource = COMPONENTS.items.find((m) => m.slug === slug);
  if (!resource) notFound();

  const alternatives = COMPONENTS.items.filter((m) => m.slug !== resource.slug).slice(0, 4);

  return (
    <DetailChassis
      resource={resource}
      config={COMPONENTS.config}
      alternatives={alternatives}
      previewTabLabel="Snippet"
      previewBlock={
        resource.codeSnippet ? (
          <CodeSnippetPreview code={resource.codeSnippet} language={resource.codeLanguage} />
        ) : null
      }
    />
  );
}
