import Link from 'next/link';
import type { ReactElement } from 'react';

import { listGuides } from '@/lib/db/queries/guides';
import { variantToTile, GUIDE_KIND_LABELS, DIFFICULTY_LABELS } from '@/lib/seed/guides';

export const metadata = {
  title: 'Guides · Vibe Coder Hub',
  description:
    'Step-by-step guides for installing, wiring, troubleshooting, and migrating across the vibe-coding stack.',
};

export default async function GuidesIndexPage(): Promise<ReactElement> {
  const guides = await listGuides();
  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="mb-8">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          GUIDES · {guides.length} INDEXED
        </p>
        <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(72px,12vw,144px)]">
          How to
          <br />
          ship it.
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="rounded-tile p-6 min-h-[220px] flex flex-col transition-opacity duration-base ease-out hover:opacity-95"
            style={{ background: variantToTile(g.variant) }}
          >
            <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-black/70 mb-3">
              {GUIDE_KIND_LABELS[g.kind]}
            </span>
            <h2 className="font-display text-[28px] leading-[1.05] text-black mb-3">
              {g.title}
            </h2>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-black bg-black/15 rounded-xs px-2 py-1">
                ⏱ {g.duration}
              </span>
              <span className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-black bg-black/15 rounded-xs px-2 py-1">
                {DIFFICULTY_LABELS[g.difficulty]}
              </span>
              {g.os.length > 0 && (
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-black bg-black/15 rounded-xs px-2 py-1">
                  {g.os.join(' / ')}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
