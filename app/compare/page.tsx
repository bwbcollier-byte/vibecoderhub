import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import { CompareGrid } from './_components/CompareGrid';
import { resolveCompareIds } from './_lib/resolve';

const MAX_ITEMS = 6;
const FREE_TIER_LIMIT = 4;

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { ids: idsParam } = await searchParams;
  const rawIds = (idsParam ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const truncated = rawIds.length > MAX_ITEMS;
  const limitedIds = rawIds.slice(0, MAX_ITEMS);
  const items = resolveCompareIds(limitedIds);

  if (items.length === 0) {
    return (
      <main className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
        <EmptyState
          glyph="▣"
          title="Nothing to compare yet"
          body="Add the ▣ Compare checkbox on any resource card to start a comparison."
          action={
            <Link href="/models">
              <Button variant="primary" size="md">
                Browse models
              </Button>
            </Link>
          }
        />
      </main>
    );
  }

  const count = items.length;
  const plural = count === 1 ? 'ITEM' : 'ITEMS';
  const names = items.map((i) => i.name).join(' · ');

  return (
    <main className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <div className="font-mono uppercase tracking-[1.5px] text-[11px] text-mint mb-3">
        Compare · {count} {plural}
      </div>
      <h1 className="font-display text-white text-[clamp(48px,8vw,112px)] leading-[0.92] mb-4">
        Side by side.
      </h1>
      <p className="text-text-secondary text-[14px] mb-8">{names}</p>

      {truncated && (
        <div className="font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary mb-4">
          Free tier compares up to {FREE_TIER_LIMIT}; Pro adds 2 more.
        </div>
      )}

      <CompareGrid items={items} />
    </main>
  );
}
