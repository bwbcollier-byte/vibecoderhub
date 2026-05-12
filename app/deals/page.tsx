// /deals — Pro paywall showcase. Server Component delegates filter / sort
// to the client `DealsList`. Reference: pages4.jsx DealsPage.

import type { ReactElement } from 'react';

import { listDeals } from '@/lib/db/queries/deals';
import { totalDealValue } from '@/lib/seed/deals';

import { DealsList } from './_components/DealsList';

export const metadata = {
  title: 'Deals · Vibe Coder Hub',
  description:
    'Curated startup deals across the vibe-coding stack — AI APIs, cloud, dev tools. Public, member, and Pro tiers.',
};

function formatTotal(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M+`;
  return `$${(usd / 1_000).toFixed(0)}K+`;
}

export default async function DealsIndexPage(): Promise<ReactElement> {
  const deals = await listDeals();
  const total = totalDealValue();

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="mb-8">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          STARTUP DEALS · {deals.length} ACTIVE
        </p>
        <h1 className="font-display uppercase leading-[0.88] tracking-[0.5px] text-[clamp(72px,12vw,168px)]">
          {formatTotal(total)} in
          <br />
          credits.
        </h1>
        <p className="text-text-body text-[18px] leading-[1.5] max-w-prose mt-4">
          Curated deals from across the vibe-coding stack. Public deals visible
          to all, member deals free with sign-up, Pro deals locked behind the
          $99/yr membership.
        </p>
      </header>

      <DealsList deals={deals} />
    </div>
  );
}
