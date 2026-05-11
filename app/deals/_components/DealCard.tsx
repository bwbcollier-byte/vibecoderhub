'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import { useOverlays } from '@/components/overlays/OverlaysProvider';
import type { Deal } from '@/lib/seed/deals';

interface Props {
  deal: Deal;
  /** Is the viewer currently a Pro member? Pulled by the parent. */
  isPro: boolean;
  /** Is the viewer signed in (any tier)? Pulled by the parent. */
  isAuthed: boolean;
}

export function DealCard({ deal, isPro, isAuthed }: Props): React.ReactElement {
  const { openUpgrade, openAuth } = useOverlays();

  const lockedReason: 'pro' | 'member' | null =
    deal.tier === 'pro' && !isPro
      ? 'pro'
      : deal.tier === 'member' && !isAuthed
        ? 'member'
        : null;

  const tierBadge =
    deal.tier === 'pro'
      ? { color: 'text-[#b69dff]', border: 'border-ultraviolet', label: 'PRO' }
      : deal.tier === 'member'
        ? { color: 'text-mint', border: 'border-mint-border', label: 'MEMBER' }
        : { color: 'text-text-secondary', border: 'border-surface', label: 'PUBLIC' };

  return (
    <article
      className={cn(
        'relative bg-canvas border border-surface rounded-tile p-6 overflow-hidden',
        'min-h-[220px] flex flex-col gap-4 transition-colors duration-base ease-out',
        !lockedReason && 'hover:border-mint',
      )}
    >
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-10 h-10 rounded-sm font-mono font-bold text-[12px] text-black tracking-[0.5px] shrink-0"
          style={{ background: deal.providerColor }}
        >
          {deal.provider
            .split(/\s+/)
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
            {deal.category} · {deal.provider}
          </span>
          <span className="font-sans font-bold text-[18px] text-white">
            {deal.name}
          </span>
        </div>
      </header>

      <div className="font-display text-[44px] leading-[0.95] text-mint">
        {deal.value}
      </div>

      <p className="text-text-secondary text-[13px] leading-[1.5] flex-1">
        {deal.summary}
      </p>

      <footer className="flex items-center justify-between gap-3 mt-auto">
        <span
          className={cn(
            'inline-flex items-center font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
            'rounded-pill border px-2.5 py-0.5',
            tierBadge.color,
            tierBadge.border,
          )}
        >
          {tierBadge.label}
        </span>
        <span className="font-mono text-[10px] text-text-secondary tabular-nums">
          {deal.claimed.toLocaleString()} claimed · expires {deal.expires}
        </span>
        {!lockedReason && (
          <Button size="sm" variant="primary">
            Claim ▸
          </Button>
        )}
      </footer>

      {/* Paywall blur — sits above content, frosts it out */}
      {lockedReason && (
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center text-center p-6',
            'backdrop-blur-md bg-canvas/70',
          )}
        >
          <Icon.Lock
            size={20}
            stroke={lockedReason === 'pro' ? 'var(--color-ultraviolet)' : 'var(--color-mint)'}
          />
          <p
            className={cn(
              'font-mono uppercase tracking-[1.5px] text-[11px] font-bold mt-2',
              lockedReason === 'pro' ? 'text-[#b69dff]' : 'text-mint',
            )}
          >
            {lockedReason === 'pro' ? 'PRO DEAL' : 'MEMBER DEAL'}
          </p>
          <p className="text-white text-[13px] mt-2 mb-4 max-w-[260px]">
            {lockedReason === 'pro'
              ? `This single deal pays for Pro ${Math.max(1, Math.floor(deal.valueRaw / 99))}× over.`
              : 'Free with sign-up — bookmark, claim, get alerts.'}
          </p>
          {lockedReason === 'pro' ? (
            <Button
              size="sm"
              variant="uv"
              onClick={() =>
                openUpgrade({ triggerLabel: deal.name, triggerValueUsd: deal.valueRaw })
              }
            >
              Upgrade — $99/yr
            </Button>
          ) : (
            <Button size="sm" variant="primary" onClick={() => openAuth('signup')}>
              Sign up free
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
