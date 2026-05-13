'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import type { DesignSystemListItem } from '@/lib/db/queries/design-systems';

export type DesignSystemCardTone = 'dark' | 'mint' | 'uv';

interface DesignSystemCardProps {
  item: DesignSystemListItem;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  tone?: DesignSystemCardTone;
  ribbon?: string;
}

export function DesignSystemCard({
  item,
  bookmarked,
  onToggleBookmark,
  tone = 'dark',
  ribbon,
}: DesignSystemCardProps): React.ReactElement {
  const toneStyles = {
    dark: {
      card: 'bg-canvas border-surface text-white hover:border-mint',
      kicker: 'text-text-secondary',
      headline: 'group-hover:text-link-hover',
      label: 'text-text-secondary',
      value: 'text-white',
      divider: 'border-surface',
      swatchRing: 'ring-surface',
    },
    mint: {
      card: 'bg-mint border-transparent text-black',
      kicker: 'text-black/65',
      headline: 'group-hover:text-link-hover',
      label: 'text-black/65',
      value: 'text-black',
      divider: 'border-black/15',
      swatchRing: 'ring-black/15',
    },
    uv: {
      card: 'bg-ultraviolet border-transparent text-white',
      kicker: 'text-white/70',
      headline: 'group-hover:text-mint',
      label: 'text-white/70',
      value: 'text-white',
      divider: 'border-white/15',
      swatchRing: 'ring-white/15',
    },
  }[tone];

  const swatches: string[] =
    item.primaryColors.length > 0
      ? item.primaryColors.slice(0, 3).map((c) => c.hex)
      : item.tokenColorsPreview.slice(0, 3);

  return (
    <article
      className={cn(
        'group relative',
        'border rounded-tile p-5',
        'transition-colors duration-base ease-out',
        toneStyles.card,
      )}
    >
      {ribbon && (
        <span className="absolute -top-2.5 left-4 z-10 bg-canvas border border-mint-border rounded-xs px-2 py-px font-mono uppercase tracking-[1.4px] text-[9px] font-bold text-mint">
          {ribbon}
        </span>
      )}

      {/* Header */}
      <Link href={`/design-systems/${item.slug}`} className="flex flex-col mb-4 min-w-0">
        <span
          className={cn(
            'font-sans font-bold text-[18px] leading-tight transition-colors duration-base ease-out truncate',
            toneStyles.headline,
          )}
        >
          {item.name}
        </span>
        {item.domain && (
          <span
            className={cn(
              'font-mono uppercase tracking-[1.4px] text-[10px] mt-1 truncate',
              toneStyles.kicker,
            )}
          >
            {item.domain}
          </span>
        )}
      </Link>

      {/* Swatches */}
      {swatches.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {swatches.map((hex, i) => (
            <span
              key={`${hex}-${i}`}
              aria-hidden
              className={cn('w-6 h-6 rounded-full ring-1', toneStyles.swatchRing)}
              style={{ background: hex }}
              title={hex}
            />
          ))}
        </div>
      )}

      {/* 2x2 mini stats */}
      <dl
        className={cn(
          'grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t',
          toneStyles.divider,
        )}
      >
        <Stat label="INDUSTRY"     value={item.industry ?? '—'}     toneStyles={toneStyles} />
        <Stat label="HEADING FONT" value={item.headingFont ?? '—'}  toneStyles={toneStyles} />
        <Stat label="BODY FONT"    value={item.bodyFont ?? '—'}     toneStyles={toneStyles} />
        <Stat
          label="QUALITY"
          value={item.qualityScore != null ? `${item.qualityScore}` : '—'}
          toneStyles={toneStyles}
        />
      </dl>

      {/* Bookmark */}
      <button
        type="button"
        onClick={onToggleBookmark}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? `Remove ${item.name} bookmark` : `Bookmark ${item.name}`}
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

interface StatProps {
  label: string;
  value: string;
  toneStyles: { label: string; value: string };
}

function Stat({ label, value, toneStyles }: StatProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <dt
        className={cn(
          'font-mono uppercase tracking-[1.3px] text-[9px] font-bold',
          toneStyles.label,
        )}
      >
        {label}
      </dt>
      <dd className={cn('text-[12px] truncate', toneStyles.value)}>{value}</dd>
    </div>
  );
}
