import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { PROMPTS } from '@/lib/seed/_configs';
import { DetailChassis } from '@/components/resources/DetailChassis';
import { CodeSnippetPreview } from '@/components/resources/CodeSnippetPreview';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return PROMPTS.items.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = PROMPTS.items.find((x) => x.slug === slug);
  if (!m) return { title: 'Prompt not found' };
  return { title: `${m.name} — ${m.author}`, description: m.tagline };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const resource = PROMPTS.items.find((m) => m.slug === slug);
  if (!resource) notFound();
  const alternatives = PROMPTS.items.filter((m) => m.slug !== resource.slug).slice(0, 4);
  return (
    <DetailChassis
      resource={resource}
      config={PROMPTS.config}
      alternatives={alternatives}
      previewTabLabel="Template"
      previewBlock={
        resource.codeSnippet ? (
          <CodeSnippetPreview code={resource.codeSnippet} language={resource.codeLanguage} />
        ) : null
      }
    />
  );
}
