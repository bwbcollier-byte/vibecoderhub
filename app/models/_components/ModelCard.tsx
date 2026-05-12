'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/shadcn/cn';
import type { ModelDetail } from '@/lib/seed/models';

export type ModelCardTone = 'dark' | 'mint' | 'uv';

interface ModelCardProps {
  model: ModelDetail;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  /** Visual emphasis. `mint` is the editor's-pick accent (top of an index). */
  tone?: ModelCardTone;
  /** Optional ribbon shown above the card — e.g. "★ EDITOR'S PICK". */
  ribbon?: string;
}

function formatContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toLocaleString();
}

export function ModelCard({
  model,
  bookmarked,
  onToggleBookmark,
  tone = 'dark',
  ribbon,
}: ModelCardProps): React.ReactElement {
  const initials = model.provider
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Tone tokens — drive card bg + body text + divider line. Mint/UV invert the
  // dark-on-light layout; dark is the default surface card.
  const toneStyles = {
    dark: {
      card: 'bg-canvas border-surface text-white',
      kicker: 'text-text-secondary',
      headline: 'group-hover:text-link-hover',
      priceLabel: 'text-text-secondary',
      divider: 'border-surface',
      stat: 'text-text-secondary',
      priceColor: 'text-mint',
      drop: 'text-mint',
      tagTone: 'neutral' as const,
    },
    mint: {
      card: 'bg-mint border-transparent text-black',
      kicker: 'text-black/65',
      headline: 'group-hover:text-link-hover',
      priceLabel: 'text-black/65',
      divider: 'border-black/15',
      stat: 'text-black/70',
      priceColor: 'text-black',
      drop: 'text-black',
      tagTone: 'neutral' as const,
    },
    uv: {
      card: 'bg-ultraviolet border-transparent text-white',
      kicker: 'text-white/70',
      headline: 'group-hover:text-mint',
      priceLabel: 'text-white/70',
      divider: 'border-white/15',
      stat: 'text-white/70',
      priceColor: 'text-mint',
      drop: 'text-mint',
      tagTone: 'white' as const,
    },
  }[tone];

  return (
    <article
      className={cn(
        'group relative',
        'border rounded-tile p-5',
        'transition-colors duration-base ease-out',
        toneStyles.card,
        tone === 'dark' ? 'hover:border-mint' : '',
      )}
    >
      {ribbon && (
        <span className="absolute -top-2.5 left-4 z-10 bg-canvas border border-mint-border rounded-xs px-2 py-px font-mono uppercase tracking-[1.4px] text-[9px] font-bold text-mint">
          {ribbon}
        </span>
      )}
      {/* Header: provider mark + name */}
      <Link href={`/models/${model.slug}`} className="flex items-center gap-3 mb-4">
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-8 h-8 rounded-sm font-mono font-bold text-[11px] text-black tracking-[0.5px] shrink-0"
          style={{ background: model.providerColor }}
        >
          {initials}
        </span>
        <div className="flex flex-col min-w-0">
          <span className={cn('font-mono uppercase tracking-[1.4px] text-[10px]', toneStyles.kicker)}>
            {model.provider}
          </span>
          <span
            className={cn(
              'font-sans font-bold text-[16px] transition-colors duration-base ease-out truncate',
              toneStyles.headline,
            )}
          >
            {model.name}
          </span>
        </div>
      </Link>

      {/* Price headline */}
      <div className={cn('flex items-baseline gap-2 pb-3 mb-3 border-b', toneStyles.divider)}>
        <span className={cn('font-mono font-bold text-[20px] tabular-nums', toneStyles.priceColor)}>
          {model.blendedCostPerMtok > 0
            ? `$${model.blendedCostPerMtok.toFixed(model.blendedCostPerMtok < 1 ? 2 : 2)}`
            : 'Free'}
        </span>
        <span className={cn('font-mono uppercase tracking-[1.4px] text-[9px]', toneStyles.priceLabel)}>
          {model.blendedCostPerMtok > 0 ? '/MTOK BLENDED' : 'OPEN WEIGHTS · BYOH'}
        </span>
        {model.priceDeltaPct < 0 && (
          <span
            className={cn(
              'ml-auto font-mono font-bold text-[10px] tabular-nums',
              toneStyles.drop,
            )}
          >
            ▼ {Math.abs(model.priceDeltaPct)}%
          </span>
        )}
      </div>

      {/* Stat strip */}
      <dl
        className={cn(
          'flex flex-wrap gap-x-3 gap-y-1 mb-4 font-mono text-[11px] tabular-nums',
          toneStyles.stat,
        )}
      >
        {model.intelligenceIndex > 0 ? (
          <>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Intelligence</dt>
              <dd>{model.intelligenceIndex.toFixed(1)} intelligence</dd>
            </div>
            <span aria-hidden>·</span>
          </>
        ) : null}
        {model.contextWindowAdvertised > 0 ? (
          <>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Context window</dt>
              <dd>{formatContext(model.contextWindowAdvertised)} ctx</dd>
            </div>
            <span aria-hidden>·</span>
          </>
        ) : null}
        {model.outputTokensPerSecond > 0 ? (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Speed</dt>
            <dd>{model.outputTokensPerSecond} tok/s</dd>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-text-secondary">
            <dt className="sr-only">Speed</dt>
            <dd>speed —</dd>
          </div>
        )}
      </dl>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {model.tags.slice(0, 4).map((t) => (
          <Badge
            key={t}
            tone={
              t === 'open-weights' && tone === 'dark'
                ? 'mint'
                : tone === 'mint'
                  ? 'white'
                  : toneStyles.tagTone
            }
            size="sm"
          >
            {t}
          </Badge>
        ))}
      </div>

      {/* Bookmark — absolute top-right; doesn't navigate */}
      <button
        type="button"
        onClick={onToggleBookmark}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? `Remove ${model.name} bookmark` : `Bookmark ${model.name}`}
        className={cn(
          'absolute top-3 right-3 inline-flex items-center justify-center',
          'w-icon-sm h-icon-sm rounded-full cursor-pointer',
          'transition-colors duration-base ease-out',
          tone === 'dark'
            ? bookmarked
              ? 'text-mint bg-mint/10 hover:bg-mint/20'
              : 'text-text-secondary hover:text-white hover:bg-white/5'
            : tone === 'mint'
              ? bookmarked
                ? 'text-black bg-black/15'
                : 'text-black/60 hover:text-black hover:bg-black/10'
              : bookmarked
                ? 'text-mint bg-mint/15'
                : 'text-white/70 hover:text-white hover:bg-white/10',
        )}
      >
        <Icon.Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}
