'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import {
  filterModels,
  sortModels,
  type ModelDetail,
  type ModelSort,
} from '@/lib/seed/models';

import { ModelCard } from './ModelCard';

interface ModelsListProps {
  initialModels: ModelDetail[];
}

const SORT_OPTIONS: { value: ModelSort; label: string }[] = [
  { value: 'intelligence', label: 'Smartest' },
  { value: 'cost-low',     label: 'Cheapest' },
  { value: 'speed',        label: 'Fastest' },
  { value: 'context',      label: 'Longest ctx' },
  { value: 'newest',       label: 'Newest' },
];

const PAGE_SIZE = 6;

export function ModelsList({ initialModels }: ModelsListProps): React.ReactElement {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<ModelSort>('intelligence');
  const [openOnly, setOpenOnly] = React.useState(false);
  const [visiblePages, setVisiblePages] = React.useState(1);
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());
  // Loading skeleton flag — proves the skeleton path renders. Flips off after
  // one frame; real loading state lands when the DB query becomes async.
  const [hydrating, setHydrating] = React.useState(true);

  React.useEffect(() => {
    const id = setTimeout(() => setHydrating(false), 250);
    return () => clearTimeout(id);
  }, []);

  // Reset pagination whenever the result set changes shape.
  React.useEffect(() => {
    setVisiblePages(1);
  }, [query, sort, openOnly]);

  const filtered = React.useMemo(
    () => sortModels(filterModels(initialModels, query, openOnly), sort),
    [initialModels, query, sort, openOnly],
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
      {/* Filter + sort row */}
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
            placeholder="Search models, providers, capabilities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search models"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-pill cursor-pointer',
              'font-mono uppercase tracking-[1.2px] text-[10px] font-bold border',
              'transition-colors duration-base ease-out',
              openOnly
                ? 'bg-mint/10 border-mint-border text-mint'
                : 'border-surface text-text-secondary hover:text-white',
            )}
          >
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="sr-only"
            />
            Open weights only
          </label>

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

      {/* Result count */}
      <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        {filtered.length} {filtered.length === 1 ? 'MODEL' : 'MODELS'}
        {query ? ` MATCH "${query.toUpperCase()}"` : ''}
      </div>

      {/* Grid */}
      {hydrating ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} height={220} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          glyph="∅"
          title="No models match"
          body="Try clearing search, sort, or the open-weights filter — the underlying directory has many more once Supabase is wired up."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((m) => (
              <ModelCard
                key={m.slug}
                model={m}
                bookmarked={bookmarks.has(m.slug)}
                onToggleBookmark={() => toggleBookmark(m.slug)}
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
