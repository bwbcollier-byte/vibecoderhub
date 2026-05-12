'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/shadcn/cn';
import type { McpDetail } from '@/lib/seed/mcps';

export type McpCardTone = 'dark' | 'mint' | 'uv';

interface McpCardProps {
  mcp: McpDetail;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  tone?: McpCardTone;
  ribbon?: string;
}

export function McpCard({
  mcp,
  bookmarked,
  onToggleBookmark,
  tone = 'dark',
  ribbon,
}: McpCardProps): React.ReactElement {
  const toneStyles = {
    dark: {
      card: 'bg-canvas border-surface text-white hover:border-mint',
      kicker: 'text-text-secondary',
      headline: 'group-hover:text-link-hover',
      stat: 'text-text-secondary',
      bookmark: bookmarked
        ? 'text-mint bg-mint/10 hover:bg-mint/20'
        : 'text-text-secondary hover:text-white hover:bg-white/5',
    },
    mint: {
      card: 'bg-mint border-transparent text-black',
      kicker: 'text-black/65',
      headline: 'group-hover:text-link-hover',
      stat: 'text-black/70',
      bookmark: bookmarked
        ? 'text-black bg-black/15'
        : 'text-black/60 hover:text-black hover:bg-black/10',
    },
    uv: {
      card: 'bg-ultraviolet border-transparent text-white',
      kicker: 'text-white/70',
      headline: 'group-hover:text-mint',
      stat: 'text-white/70',
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
        <span className="absolute -top-2.5 left-4 z-10 bg-canvas border border-ultraviolet rounded-xs px-2 py-px font-mono uppercase tracking-[1.4px] text-[9px] font-bold text-uv-label">
          {ribbon}
        </span>
      )}

      <Link href={`/mcps/${mcp.slug}`} className="flex flex-col gap-1 mb-3">
        <span
          className={cn('font-mono uppercase tracking-[1.4px] text-[10px]', toneStyles.kicker)}
        >
          ⌖ MCP · {mcp.author}
        </span>
        <span
          className={cn(
            'font-sans font-bold text-[19px] leading-[1.15] tracking-[-0.01em]',
            'transition-colors duration-base ease-out',
            toneStyles.headline,
          )}
        >
          {mcp.name}
        </span>
        <p className={cn('text-[13px] leading-[1.5]', toneStyles.stat)}>{mcp.tagline}</p>
      </Link>

      {(mcp.toolCount > 0 || mcp.resourceCount > 0 || mcp.promptCount > 0) && (
        <dl
          className={cn(
            'flex flex-wrap gap-x-3 gap-y-1 mb-3 font-mono text-[11px] tabular-nums',
            toneStyles.stat,
          )}
        >
          {mcp.toolCount > 0 && (
            <>
              <div className="flex items-center gap-1">
                <dt className="sr-only">Tools</dt>
                <dd>{mcp.toolCount} tools</dd>
              </div>
              <span aria-hidden>·</span>
            </>
          )}
          {mcp.resourceCount > 0 && (
            <>
              <div className="flex items-center gap-1">
                <dt className="sr-only">Resources</dt>
                <dd>{mcp.resourceCount} resources</dd>
              </div>
              <span aria-hidden>·</span>
            </>
          )}
          {mcp.promptCount > 0 && (
            <div className="flex items-center gap-1">
              <dt className="sr-only">Prompts</dt>
              <dd>{mcp.promptCount} prompts</dd>
            </div>
          )}
        </dl>
      )}

      <div className={cn('flex flex-wrap items-center gap-3 mb-3 font-mono text-[11px] tabular-nums', toneStyles.stat)}>
        {mcp.ratingAvg > 0 && (
          <>
            <span>★ {mcp.ratingAvg.toFixed(1)}</span>
            <span>·</span>
          </>
        )}
        {mcp.installCount7d > 0 && (
          <>
            <span>{(mcp.installCount7d / 1000).toFixed(1)}k/wk</span>
            <span>·</span>
          </>
        )}
        <span>{mcp.updatedLabel}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {mcp.compatibleClients.slice(0, 4).map((c) => (
          <Badge key={c} tone={tone === 'dark' ? 'neutral' : 'white'} size="sm">
            {c}
          </Badge>
        ))}
        {mcp.compatibleClients.length > 4 && (
          <span className={cn('text-[10px] font-mono', toneStyles.stat)}>
            +{mcp.compatibleClients.length - 4}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleBookmark}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? `Remove ${mcp.name} bookmark` : `Bookmark ${mcp.name}`}
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
