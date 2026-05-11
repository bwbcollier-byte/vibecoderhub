'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/shadcn/cn';
import { useBookmarks, type BookmarkEntry } from '@/components/bookmarks/BookmarksProvider';

type SortKey = 'recent' | 'type' | 'name';

export function BookmarksClient(): React.ReactElement {
  const { items, count, limit, remove, clear } = useBookmarks();
  const [sort, setSort] = React.useState<SortKey>('recent');

  const sorted = React.useMemo<BookmarkEntry[]>(() => {
    const copy = [...items];
    switch (sort) {
      case 'name':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'type':
        return copy.sort(
          (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
        );
      case 'recent':
      default:
        return copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    }
  }, [items, sort]);

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="flex flex-col gap-4 mb-8">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
          BOOKMARKS · {count} {limit ? `/ ${limit}` : 'SAVED'}
        </p>
        <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,9vw,112px)]">
          Saved.
        </h1>
        {limit != null && (
          <p className="text-text-secondary text-[14px]">
            Free tier caps bookmarks at {limit}. Sign up free for unlimited.
          </p>
        )}
      </header>

      {count === 0 ? (
        <EmptyState
          glyph="✦"
          title="No bookmarks yet"
          body="Star resources from any index page — they'll save instantly and persist across page reloads."
          action={
            <Link href="/models">
              <Button variant="primary">Browse models</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary mr-1">
              SORT
            </span>
            {(
              [
                { id: 'recent', label: 'Recent' },
                { id: 'type', label: 'By type' },
                { id: 'name', label: 'A → Z' },
              ] as const
            ).map((opt) => {
              const active = opt.id === sort;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSort(opt.id)}
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
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Remove all ${count} bookmarks? This cannot be undone.`)) {
                  clear();
                }
              }}
              className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-text-secondary hover:text-error-red cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <ul className="flex flex-col">
            {sorted.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-4 py-4 border-b border-surface group"
              >
                <Badge tone="mint" size="sm">
                  {b.type}
                </Badge>
                <Link
                  href={b.href}
                  className="text-[15px] text-white hover:text-link-hover flex-1 truncate"
                >
                  {b.name}
                </Link>
                <span className="font-mono text-[10px] text-text-secondary tabular-nums shrink-0">
                  {timeAgo(b.addedAt)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(b.id)}
                  aria-label={`Remove ${b.name} bookmark`}
                  className="text-text-secondary hover:text-error-red cursor-pointer"
                >
                  <Icon.Trash size={14} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// Coarse "X ago" formatter. Switches to absolute date after ~30 days.
function timeAgo(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 30) return `${days}d ago`;
  return new Date(then).toLocaleDateString();
}
