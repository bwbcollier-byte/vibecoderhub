import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { getGuideBySlug, listGuideSlugs } from '@/lib/db/queries/guides';
import { GUIDE_KIND_LABELS, DIFFICULTY_LABELS } from '@/lib/seed/guides';

import { GuideStepper } from './_components/GuideStepper';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuideBySlug(slug);
  if (!g) return { title: 'Guide not found' };
  return { title: `${g.title} — Vibe Coder Hub`, description: g.description };
}

export default async function GuidePage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <Link href="/guides">
        <Button variant="ghost" size="sm" className="mb-6">
          <Icon.ArrowRight size={14} className="rotate-180 mr-1" />
          All guides
        </Button>
      </Link>

      <header className="mb-10">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          {GUIDE_KIND_LABELS[guide.kind]} · {DIFFICULTY_LABELS[guide.difficulty]} · {guide.duration}
          {guide.os.length > 0 && ` · ${guide.os.join(' / ')}`}
        </p>
        <h1 className="font-display uppercase leading-[0.95] text-[clamp(40px,7vw,84px)] mb-4">
          {guide.title}
        </h1>
        <p className="text-text-body text-[18px] leading-[1.5] max-w-prose">
          {guide.description}
        </p>
      </header>

      <GuideStepper steps={guide.steps} slug={guide.slug} />
    </div>
  );
}
