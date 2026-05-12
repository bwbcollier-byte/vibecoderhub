// /deals — Pro paywall showcase. Server Component delegates filter / sort
// to the client `DealsList`. Reference: pages4.jsx DealsPage.

import type { ReactElement } from 'react';

import Link from 'next/link';

import { listDeals } from '@/lib/db/queries/deals';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import { DealsList } from './_components/DealsList';

export const metadata = {
  title: 'Deals · Vibe Coder Hub',
  description:
    'Curated startup deals across the vibe-coding stack — AI APIs, cloud, dev tools. Public, member, and Pro tiers.',
};

function formatTotal(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M+`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K+`;
  return '—';
}

export default async function DealsIndexPage(): Promise<ReactElement> {
  const deals = await listDeals();
  const total = deals.reduce((sum, d) => sum + (d.valueRaw || 0), 0);

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="mb-8">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          STARTUP DEALS · {deals.length} ACTIVE
        </p>
        <h1 className="font-display uppercase leading-[0.88] tracking-[0.5px] text-[clamp(72px,12vw,168px)]">
          {deals.length > 0 ? (
            <>
              {formatTotal(total)} in
              <br />
              credits.
            </>
          ) : (
            <>
              Coming
              <br />
              soon.
            </>
          )}
        </h1>
        <p className="text-text-body text-[18px] leading-[1.5] max-w-prose mt-4">
          {deals.length > 0
            ? 'Curated deals from across the vibe-coding stack. Public deals visible to all, member deals free with sign-up, Pro deals locked behind the $99/yr membership.'
            : 'Curated startup deals are landing as the editorial bundle ships. Sign up for the newsletter to hear about each one as it goes live.'}
        </p>
      </header>

      {deals.length > 0 ? (
        <DealsList deals={deals} />
      ) : (
        <EmptyState
          glyph="◎"
          title="No deals yet"
          body="Editorial deals — startup credits, dev-tool discounts, AI API allowances — go live here as they're negotiated. Newsletter readers hear first."
          action={
            <Link href="/#newsletter">
              <Button variant="primary" size="md">
                Get notified
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
