'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/shadcn/cn';
import type { GenericResource, GenericTypeConfig } from '@/lib/seed/generic';

export type GenericCardTone = 'dark' | 'mint' | 'uv';

interface Props {
  resource: GenericResource;
  config: GenericTypeConfig;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  tone?: GenericCardTone;
  ribbon?: string;
}

export function GenericResourceCard({
  resource: r,
  config,
  bookmarked,
  onToggleBookmark,
  tone = 'dark',
  ribbon,
}: Props): React.ReactElement {
  const toneStyles = {
    dark: {
      card: 'bg-canvas border-surface text-white hover:border-mint',
      kicker: 'text-text-secondary',
      headline: 'group-hover:text-link-hover',
      stat: 'text-text-secondary',
      ribbonBorder: 'border-mint-border text-mint',
      bookmark: bookmarked
        ? 'text-mint bg-mint/10 hover:bg-mint/20'
        : 'text-text-secondary hover:text-white hover:bg-white/5',
    },
    mint: {
      card: 'bg-mint border-transparent text-black',
      kicker: 'text-black/65',
      headline: 'group-hover:text-link-hover',
      stat: 'text-black/70',
      ribbonBorder: 'border-mint-border text-mint',
      bookmark: bookmarked
        ? 'text-black bg-black/15'
        : 'text-black/60 hover:text-black hover:bg-black/10',
    },
    uv: {
      card: 'bg-ultraviolet border-transparent text-white',
      kicker: 'text-white/70',
      headline: 'group-hover:text-mint',
      stat: 'text-white/70',
      ribbonBorder: 'border-ultraviolet text-[#b69dff]',
      bookmark: bookmarked
        ? 'text-mint bg-mint/15'
        : 'text-white/70 hover:text-white hover:bg-white/10',
    },
  }[tone];

  return (
    <article
      className={cn(
        'group relative border rounded-tile p-5 transition-colors duration-base ease-out',
        toneStyles.card,
      )}
    >
      {ribbon && (
        <span
          className={cn(
            'absolute -top-2.5 left-4 z-10 bg-canvas border rounded-xs px-2 py-px',
            'font-mono uppercase tracking-[1.4px] text-[9px] font-bold',
            toneStyles.ribbonBorder,
          )}
        >
          {ribbon}
        </span>
      )}

      <Link href={`/${config.basePath}/${r.slug}`} className="flex flex-col gap-1 mb-3">
        <span
          className={cn('font-mono uppercase tracking-[1.4px] text-[10px]', toneStyles.kicker)}
        >
          {config.glyph} {config.singular.toUpperCase()} · {r.author}
        </span>
        <span
          className={cn(
            'font-sans font-bold text-[19px] leading-[1.15] tracking-[-0.01em]',
            'transition-colors duration-base ease-out',
            toneStyles.headline,
          )}
        >
          {r.name}
        </span>
        <p className={cn('text-[13px] leading-[1.5]', toneStyles.stat)}>{r.tagline}</p>
      </Link>

      <div
        className={cn(
          'flex flex-wrap items-center gap-3 mb-3 font-mono text-[11px] tabular-nums',
          toneStyles.stat,
        )}
      >
        <span>★ {r.ratingAvg.toFixed(1)}</span>
        <span aria-hidden>·</span>
        <span>{(r.installCount7d / 1000).toFixed(1)}k/wk</span>
        <span aria-hidden>·</span>
        <span>{r.updatedLabel}</span>
      </div>

      {(r.compatibleClients.length > 0 || r.stackTags.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {r.compatibleClients.slice(0, 3).map((c) => (
            <Badge key={c} tone={tone === 'dark' ? 'neutral' : 'white'} size="sm">
              {c}
            </Badge>
          ))}
          {r.stackTags.slice(0, 3).map((s) => (
            <Badge key={s} tone={tone === 'dark' ? 'neutral' : 'white'} size="sm">
              {s}
            </Badge>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onToggleBookmark}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? `Remove ${r.name} bookmark` : `Bookmark ${r.name}`}
        className={cn(
          'absolute top-3 right-3 inline-flex items-center justify-center',
          'w-icon-sm h-icon-sm rounded-full cursor-pointer',
          'transition-colors duration-base ease-out',
          toneStyles.bookmark,
        )}
      >
        <Icon.Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}
