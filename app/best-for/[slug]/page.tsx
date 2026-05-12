import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { getBestForBySlug, listUseCaseSlugs } from '@/lib/db/queries/best-for';
import { bestForVariantToTile } from '@/lib/seed/best-for';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const TOTAL_SLOTS = 10;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listUseCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const uc = await getBestForBySlug(slug);
  if (!uc) return { title: 'Not found · Vibe Coder Hub' };
  return {
    title: `Best for ${uc.title} · Vibe Coder Hub`,
    description: uc.description,
  };
}

export default async function BestForPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const useCase = await getBestForBySlug(slug);
  if (!useCase) notFound();

  const tile = bestForVariantToTile(useCase.variant);
  const stubCount = Math.max(0, TOTAL_SLOTS - useCase.picks.length);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best for ${useCase.title}`,
    description: useCase.description,
    url: `${SITE_URL}/best-for/${useCase.slug}`,
    itemListElement: useCase.picks.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.resourceName,
      url: `${SITE_URL}${p.href}`,
    })),
  };

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <Link
        href="/best-for"
        className="font-mono uppercase tracking-[1.4px] text-[11px] font-bold text-mint hover:opacity-80"
      >
        ← All use cases
      </Link>

      <header className="mt-6 mb-10">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          BEST FOR · {useCase.title}
        </p>
        <h1
          className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,10vw,128px)]"
          style={{ color: tile }}
        >
          {useCase.title}
        </h1>
        <p className="text-text-body text-[18px] leading-[1.5] max-w-prose mt-4">
          {useCase.description}
        </p>
      </header>

      <section>
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-6">
          Top 10
        </p>

        <ol className="flex flex-col gap-4">
          {useCase.picks.map((pick, idx) => (
            <li
              key={pick.resourceId}
              className="rounded-tile border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row md:items-start gap-4"
            >
              <span className="font-display text-mint text-[60px] leading-[0.9] min-w-[60px]">
                #{idx + 1}
              </span>
              <div className="flex-1">
                <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-[#9a9a9a]">
                  {pick.resourceType}
                </span>
                <h2 className="font-display text-[28px] leading-[1.05] mt-1 mb-2">
                  <Link href={pick.href} className="hover:opacity-80">
                    {pick.resourceName}
                  </Link>
                </h2>
                <p className="text-text-body text-[15px] leading-[1.7] mb-3">
                  {pick.rationale}
                </p>
                <Link
                  href={pick.href}
                  className="font-mono uppercase tracking-[1.4px] text-[11px] font-bold text-mint hover:opacity-80"
                >
                  View {pick.resourceName} →
                </Link>
              </div>
            </li>
          ))}

          {Array.from({ length: stubCount }).map((_, i) => {
            const position = useCase.picks.length + i + 1;
            return (
              <li
                key={`stub-${position}`}
                className="rounded-tile border border-white/5 bg-white/[0.02] p-5 flex items-center gap-4 opacity-50"
              >
                <span className="font-display text-[#5a5a5a] text-[40px] leading-[0.9] min-w-[50px]">
                  #{position}
                </span>
                <span className="font-mono uppercase tracking-[1.4px] text-[11px] font-bold text-[#7a7a7a]">
                  More picks coming Q3 2026
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
