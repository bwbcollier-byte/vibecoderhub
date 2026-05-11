'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import {
  filterGeneric,
  sortGeneric,
  type GenericResource,
  type GenericSort,
  type GenericTypeConfig,
} from '@/lib/seed/generic';

import { GenericResourceCard } from './GenericResourceCard';

interface Props {
  items: GenericResource[];
  config: GenericTypeConfig;
}

const SORT_OPTIONS: { value: GenericSort; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'rating',   label: 'Top rated' },
  { value: 'newest',   label: 'Newest' },
];

const CLIENT_FILTERS = [
  { value: null,             label: 'All clients' },
  { value: 'cursor',         label: 'Cursor' },
  { value: 'claude-code',    label: 'Claude Code' },
  { value: 'windsurf',       label: 'Windsurf' },
  { value: 'cline',          label: 'Cline' },
  { value: 'claude-desktop', label: 'Claude Desktop' },
] as const;

const PAGE_SIZE = 6;

export function GenericResourceIndex({ items, config }: Props): React.ReactElement {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<GenericSort>('trending');
  const [client, setClient] = React.useState<string | null>(null);
  const [visiblePages, setVisiblePages] = React.useState(1);
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());
  const [hydrating, setHydrating] = React.useState(true);

  React.useEffect(() => {
    const id = setTimeout(() => setHydrating(false), 250);
    return () => clearTimeout(id);
  }, []);

  React.useEffect(() => {
    setVisiblePages(1);
  }, [query, sort, client]);

  const filtered = React.useMemo(
    () => sortGeneric(filterGeneric(items, query, client), sort),
    [items, query, sort, client],
  );

  const visible = filtered.slice(0, visiblePages * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const toggleBookmark = (slug: string): void => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-[360px]">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            aria-hidden
          >
            <Icon.Search size={16} />
          </span>
          <Input
            type="search"
            placeholder={`Search ${config.plural.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label={`Search ${config.plural}`}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {config.showClientFilter && (
            <div
              className="flex items-center gap-1 flex-wrap"
              role="radiogroup"
              aria-label="Client filter"
            >
              {CLIENT_FILTERS.map((opt) => {
                const active = opt.value === client;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setClient(opt.value)}
                    className={cn(
                      'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
                      'rounded-pill px-3 py-1.5 border cursor-pointer',
                      'transition-colors duration-base ease-out',
                      active
                        ? 'bg-ultraviolet/10 border-ultraviolet text-[#b69dff]'
                        : 'border-surface text-text-secondary hover:text-white',
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-1 flex-wrap" role="radiogroup" aria-label="Sort">
            {SORT_OPTIONS.map((opt) => {
              const active = opt.value === sort;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
                    'rounded-pill px-3 py-1.5 border cursor-pointer',
                    'transition-colors duration-base ease-out',
                    active
                      ? 'bg-mint/10 border-mint-border text-mint'
                      : 'border-surface text-text-secondary hover:text-white',
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        {filtered.length}{' '}
        {filtered.length === 1 ? config.singular.toUpperCase() : config.plural.toUpperCase()}
        {query ? ` MATCH "${query.toUpperCase()}"` : ''}
      </div>

      {hydrating ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} height={220} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          glyph="∅"
          title={`No ${config.plural.toLowerCase()} match`}
          body="Try clearing the search and filters, or be the first to submit one."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((r, i) => (
              <GenericResourceCard
                key={r.slug}
                resource={r}
                config={config}
                bookmarked={bookmarks.has(r.slug)}
                onToggleBookmark={() => toggleBookmark(r.slug)}
                tone={i === 0 ? 'mint' : i === 4 ? 'uv' : 'dark'}
                ribbon={i === 0 ? '★ EDITOR’S PICK' : undefined}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setVisiblePages((p) => p + 1)}
                className={cn(
                  'font-mono uppercase tracking-[1.5px] text-[11px] font-bold',
                  'h-btn-sm px-[14px] rounded-pill border border-white text-white',
                  'hover:bg-white/5 cursor-pointer',
                )}
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
