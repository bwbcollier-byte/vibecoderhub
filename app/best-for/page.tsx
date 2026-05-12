import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { listUseCases } from '@/lib/db/queries/best-for';
import { bestForVariantToTile } from '@/lib/seed/best-for';

export const metadata: Metadata = {
  title: 'Best for… · Vibe Coder Hub',
  description:
    'Curated stack-rankings of the top AI models, MCPs, starters, and guides for every vibe-coding use case. Updated weekly.',
};

export default async function BestForIndexPage(): Promise<ReactElement> {
  const useCases = await listUseCases();
  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="mb-8">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          BEST FOR · {useCases.length} USE CASES
        </p>
        <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(72px,12vw,144px)]">
          Best for…
        </h1>
        <p className="text-[#cfcfcf] text-[18px] leading-[1.5] max-w-prose mt-4">
          Curated stack-rankings per use case. Updated weekly.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {useCases.map((uc) => (
          <Link
            key={uc.slug}
            href={`/best-for/${uc.slug}`}
            className="rounded-tile p-6 min-h-[220px] flex flex-col transition-opacity duration-base ease-out hover:opacity-95"
            style={{ background: bestForVariantToTile(uc.variant) }}
          >
            <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-black/70 mb-3">
              BEST FOR
            </span>
            <h2 className="font-display text-[28px] leading-[1.05] text-black mb-3">
              {uc.title}
            </h2>
            <p className="text-black/75 text-[14px] leading-[1.5] mb-4">
              {uc.description}
            </p>
            <span className="mt-auto font-mono uppercase tracking-[1.4px] text-[11px] font-bold text-black">
              {uc.picks.length} picks →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
