// /news/[slug] — focused-read article. Uses `prose` container width (720px)
// per TOKEN_RECONCILIATION §13 for guides + news article body.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { getNewsBySlug, listNewsSlugs } from '@/lib/db/queries/news';
import { variantToTile, NEWS_KIND_LABELS } from '@/lib/seed/news';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNewsBySlug(slug);
  if (!n) return { title: 'News not found' };
  return { title: `${n.headline} — Vibe Coder Hub`, description: n.summary };
}

export default async function NewsArticlePage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const isBreaking = item.kind === 'breaking';

  return (
    <article className="max-w-prose mx-auto px-4 md:px-8 py-10 pb-20">
      <Link href="/news">
        <Button variant="ghost" size="sm" className="mb-6">
          <Icon.ArrowRight
            size={14}
            className="mr-1 rotate-180"
            aria-hidden
          />
          All news
        </Button>
      </Link>

      <p
        className={`font-mono uppercase tracking-[1.5px] text-[11px] font-bold mb-4 ${
          isBreaking ? 'text-tile-pink' : 'text-mint'
        }`}
      >
        {isBreaking ? '🔥 BREAKING' : NEWS_KIND_LABELS[item.kind]} · {item.source} · {item.time}
        {item.auto && ' · 🤖 AUTO'}
      </p>

      <h1 className="font-display uppercase leading-[0.95] text-[clamp(40px,7vw,84px)] mb-8">
        {item.headline}
      </h1>

      <div
        className="h-[320px] rounded-md mb-8"
        style={{ background: variantToTile(item.variant) }}
        aria-hidden
      />

      <p className="text-[22px] font-medium text-white leading-[1.4] mb-6">
        {item.summary}
      </p>

      <div className="font-sans text-[18px] leading-[1.7] text-text-body flex flex-col gap-4 whitespace-pre-wrap">
        {item.body}
      </div>

      <div className="mt-12 border border-mint-border bg-mint/5 rounded-tile p-6">
        <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-3">
          RELATED TOPICS
        </p>
        <div className="flex flex-wrap gap-2">
          {item.topics.length > 0 ? (
            item.topics.map((t) => (
              <span
                key={t}
                className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-text-body border border-surface rounded-pill px-3 py-1"
              >
                {t}
              </span>
            ))
          ) : (
            <span className="text-text-secondary text-[13px]">No tagged topics.</span>
          )}
        </div>
      </div>
    </article>
  );
}
