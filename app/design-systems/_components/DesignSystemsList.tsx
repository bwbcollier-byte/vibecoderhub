'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Icon } from '@/components/icons/Icon';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/shadcn/cn';
import { useBookmarks } from '@/components/bookmarks/BookmarksProvider';
import type {
  DesignSystemListItem,
  DesignSystemSort,
} from '@/lib/db/queries/design-systems';

import { DesignSystemCard } from './DesignSystemCard';

interface DesignSystemsListProps {
  initialItems: DesignSystemListItem[];
  industries: string[];
  totalCount: number;
}

const SORT_OPTIONS: { value: DesignSystemSort; label: string }[] = [
  { value: 'quality',         label: 'Best quality' },
  { value: 'newest',          label: 'Newest' },
  { value: 'a-z',             label: 'A → Z' },
  { value: 'oldest-company',  label: 'Oldest company' },
];

const PAGE_SIZE = 9;

function sortItems(
  items: DesignSystemListItem[],
  sort: DesignSystemSort,
): DesignSystemListItem[] {
  const arr = [...items];
  switch (sort) {
    case 'newest':
      // No published-at on the list item, so preserve incoming order
      // (server already sorts newest by publishedAt when sort=newest).
      return arr;
    case 'a-z':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'oldest-company':
      return arr.sort((a, b) => {
        const ay = a.foundedYear ?? Number.POSITIVE_INFINITY;
        const by = b.foundedYear ?? Number.POSITIVE_INFINITY;
        return ay - by;
      });
    case 'quality':
    default:
      return arr.sort((a, b) => (b.qualityScore ?? -1) - (a.qualityScore ?? -1));
  }
}

function filterItems(
  items: DesignSystemListItem[],
  query: string,
  industry: string | null,
): DesignSystemListItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((it) => {
    if (industry && it.industry !== industry) return false;
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      (it.tagline?.toLowerCase().includes(q) ?? false) ||
      (it.industry?.toLowerCase().includes(q) ?? false)
    );
  });
}

export function DesignSystemsList({
  initialItems,
  industries,
  totalCount: _totalCount,
}: DesignSystemsListProps): React.ReactElement {
  const [query, setQuery] = React.useState('');
  const [industry, setIndustry] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<DesignSystemSort>('quality');
  const [visiblePages, setVisiblePages] = React.useState(1);
  const bookmarks = useBookmarks();
  const [hydrating, setHydrating] = React.useState(true);

  React.useEffect(() => {
    const id = setTimeout(() => setHydrating(false), 250);
    return () => clearTimeout(id);
  }, []);

  React.useEffect(() => {
    setVisiblePages(1);
  }, [query, sort, industry]);

  const filtered = React.useMemo(
    () => sortItems(filterItems(initialItems, query, industry), sort),
    [initialItems, query, industry, sort],
  );

  const visible = filtered.slice(0, visiblePages * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const toggleBookmark = (item: DesignSystemListItem): void => {
    const id = `design_system:${item.slug}`;
    const wasOn = bookmarks.has(id);
    if (!wasOn && bookmarks.atCap) {
      toast.error(`Bookmark limit reached (${bookmarks.limit}). Upgrade for unlimited.`);
      return;
    }
    bookmarks.toggle({
      id,
      type: 'design_system',
      name: item.name,
      href: `/design-systems/${item.slug}`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Industry pill row */}
      <div
        className="flex items-center gap-1 flex-wrap"
        role="radiogroup"
        aria-label="Filter by industry"
      >
        <PillButton
          active={industry === null}
          onClick={() => setIndustry(null)}
          label="ALL INDUSTRIES"
        />
        {industries.map((i) => (
          <PillButton
            key={i}
            active={industry === i}
            onClick={() => setIndustry(i)}
            label={i.toUpperCase()}
          />
        ))}
      </div>

      {/* Search + sort row */}
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
            placeholder="Search companies, taglines, industries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search design systems"
          />
        </div>

        <div className="flex items-center gap-1 flex-wrap" role="radiogroup" aria-label="Sort">
          {SORT_OPTIONS.map((opt) => (
            <PillButton
              key={opt.value}
              active={opt.value === sort}
              onClick={() => setSort(opt.value)}
              label={opt.label.toUpperCase()}
            />
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        {filtered.length} {filtered.length === 1 ? 'SYSTEM' : 'SYSTEMS'}
        {query ? ` MATCH "${query.toUpperCase()}"` : ''}
        {industry ? ` · ${industry.toUpperCase()}` : ''}
      </div>

      {/* Grid */}
      {hydrating ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} height={240} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          glyph="∅"
          title="No design systems match"
          body="Try clearing search or the industry filter."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((item, i) => (
              <DesignSystemCard
                key={item.slug}
                item={item}
                bookmarked={bookmarks.has(`design_system:${item.slug}`)}
                onToggleBookmark={() => toggleBookmark(item)}
                tone={i === 0 ? 'mint' : i === 4 ? 'uv' : 'dark'}
                ribbon={i === 0 ? "★ EDITOR'S PICK" : undefined}
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

interface PillButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function PillButton({ active, onClick, label }: PillButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
        'rounded-pill px-3 py-1.5 border cursor-pointer',
        'transition-colors duration-base ease-out',
        active
          ? 'bg-mint text-black border-mint'
          : 'border-surface text-text-secondary hover:border-white hover:text-white',
      )}
    >
      {label}
    </button>
  );
}
