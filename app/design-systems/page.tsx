// /design-systems — directory index. Server Component.
//
// Session 20. Renders the directory chrome (hero + count) and hands the live
// list, industry options, and total count down to a Client Component that
// owns search / sort / industry filter state.

import type { ReactElement } from 'react';

import {
  listDesignSystems,
  getDesignSystemCount,
  listDesignSystemIndustries,
} from '@/lib/db/queries/design-systems';

import { DesignSystemsList } from './_components/DesignSystemsList';

export const metadata = {
  title: 'Design Systems · Vibe Coder Hub',
  description:
    'Brand systems, tokens, and voice guidance from the world’s most distinctive companies — ready to drop into your prompts.',
};

export default async function DesignSystemsIndexPage(): Promise<ReactElement> {
  const [items, totalCount, industries] = await Promise.all([
    listDesignSystems(),
    getDesignSystemCount(),
    listDesignSystemIndustries(),
  ]);

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      {/* Hero */}
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
            ◐ · {(totalCount || items.length).toLocaleString()} INDEXED
          </p>
          <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,10vw,128px)]">
            Design Systems.
          </h1>
        </div>
      </header>

      <DesignSystemsList
        initialItems={items}
        industries={industries}
        totalCount={totalCount}
      />
    </div>
  );
}
