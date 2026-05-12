'use client';

import * as React from 'react';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import { useSession } from '@/lib/auth/client';
import type { Deal, DealCategory, DealTier } from '@/lib/seed/deals';

import { DealCard } from './DealCard';

interface Props {
  deals: Deal[];
}

const CATEGORY_FILTERS: Array<{ id: 'all' | DealCategory; label: string }> = [
  { id: 'all',           label: 'All' },
  { id: 'AI APIs',       label: 'AI APIs' },
  { id: 'Cloud',         label: 'Cloud' },
  { id: 'Dev tools',     label: 'Dev tools' },
  { id: 'Productivity',  label: 'Productivity' },
];

const TIER_FILTERS: Array<{ id: 'all' | DealTier; label: string }> = [
  { id: 'all',     label: 'All tiers' },
  { id: 'public', label: 'Public' },
  { id: 'member', label: 'Member' },
  { id: 'pro',    label: 'Pro' },
];

type SortKey = 'value' | 'expires' | 'popular';

export function DealsList({ deals }: Props): React.ReactElement {
  const session = useSession();
  const isAuthed = !!session.user;
  // Pro tier flag will read from profile.pro once Slice S20 ships; for now
  // dummy to false so the paywall pattern actually fires on Pro deals.
  const isPro = false;

  const [category, setCategory] = React.useState<'all' | DealCategory>('all');
  const [tier, setTier] = React.useState<'all' | DealTier>('all');
  const [sort, setSort] = React.useState<SortKey>('value');

  const filtered = React.useMemo(() => {
    return deals
      .filter((d) => (category === 'all' ? true : d.category === category))
      .filter((d) => (tier === 'all' ? true : d.tier === tier))
      .sort((a, b) => {
        if (sort === 'value') return b.valueRaw - a.valueRaw;
        if (sort === 'popular') return b.claimed - a.claimed;
        // expires — string compare is rough but stable for the seed data
        return a.expires.localeCompare(b.expires);
      });
  }, [deals, category, tier, sort]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_FILTERS.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                'font-mono uppercase tracking-[1.2px] text-[11px] font-bold',
                'h-btn-sm px-4 rounded-pill border cursor-pointer',
                'transition-colors duration-base ease-out',
                active
                  ? 'bg-mint/10 border-mint-border text-mint'
                  : 'border-surface text-text-secondary hover:text-white',
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary self-center mr-1">
          TIER:
        </span>
        {TIER_FILTERS.map((t) => {
          const active = t.id === tier;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTier(t.id)}
              className={cn(
                'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
                'rounded-pill border px-3 py-1.5 cursor-pointer',
                'transition-colors duration-base ease-out',
                active
                  ? 'bg-ultraviolet/10 border-ultraviolet text-uv-label'
                  : 'border-surface text-text-secondary hover:text-white',
              )}
            >
              {t.label}
            </button>
          );
        })}
        <div className="flex-1" />
        <label className="inline-flex items-center gap-2 font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary cursor-pointer">
          <Icon.Sliders size={12} />
          Sort:
          <select
            className="bg-transparent text-white border border-surface rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:border-mint"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="value">Most valuable</option>
            <option value="popular">Most claimed</option>
            <option value="expires">Expiring soon</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <DealCard key={d.slug} deal={d} isAuthed={isAuthed} isPro={isPro} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-text-secondary text-[14px] text-center py-12">
          No deals match this filter combination.
        </p>
      )}
    </div>
  );
}
