'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/shadcn/cn';
import type { ModelDetail } from '@/lib/seed/models';

interface ModelCardProps {
  model: ModelDetail;
  bookmarked: boolean;
  onToggleBookmark: () => void;
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
}: ModelCardProps): React.ReactElement {
  const initials = model.provider
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={cn(
        'group relative',
        'bg-canvas border border-surface rounded-tile p-5',
        'transition-colors duration-base ease-out hover:border-mint',
      )}
    >
      {/* Header: provider mark + name */}
      <Link href={`/models/${model.slug}`} className="flex items-center gap-3 mb-4">
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-8 h-8 rounded-sm font-mono font-bold text-[11px] text-black tracking-[0.5px]"
          style={{ background: model.providerColor }}
        >
          {initials}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
            {model.provider}
          </span>
          <span className="font-sans font-bold text-[16px] text-white group-hover:text-link-hover transition-colors duration-base ease-out truncate">
            {model.name}
          </span>
        </div>
      </Link>

      {/* Price headline */}
      <div className="flex items-baseline gap-2 pb-3 mb-3 border-b border-surface">
        <span className="font-mono font-bold text-[20px] text-mint tabular-nums">
          ${model.blendedCostPerMtok.toFixed(2)}
        </span>
        <span className="font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
          /MTOK BLENDED
        </span>
        {model.priceDeltaPct < 0 && (
          <span className="ml-auto font-mono font-bold text-[10px] text-mint tabular-nums">
            ▼ {Math.abs(model.priceDeltaPct)}%
          </span>
        )}
      </div>

      {/* Stat strip */}
      <dl className="flex flex-wrap gap-x-3 gap-y-1 mb-4 font-mono text-[11px] text-text-secondary tabular-nums">
        <div className="flex items-center gap-1">
          <dt className="sr-only">Intelligence</dt>
          <dd>#{model.intelligenceIndex} intelligence</dd>
        </div>
        <span aria-hidden>·</span>
        <div className="flex items-center gap-1">
          <dt className="sr-only">Context window</dt>
          <dd>{formatContext(model.contextWindowAdvertised)} ctx</dd>
        </div>
        <span aria-hidden>·</span>
        <div className="flex items-center gap-1">
          <dt className="sr-only">Speed</dt>
          <dd>{model.outputTokensPerSecond} tok/s</dd>
        </div>
      </dl>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {model.tags.slice(0, 4).map((t) => (
          <Badge key={t} tone={t === 'open-weights' ? 'mint' : 'neutral'} size="sm">
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
          bookmarked
            ? 'text-mint bg-mint/10 hover:bg-mint/20'
            : 'text-text-secondary hover:text-white hover:bg-white/5',
        )}
      >
        <Icon.Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}
