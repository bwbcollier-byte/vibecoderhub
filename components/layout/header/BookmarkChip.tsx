'use client';

// Header bookmark chip — shows current bookmark count + links to the
// dashboard bookmarks page. Renders dim when the count is 0 so it doesn't
// shout at first-time visitors.

import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import { useBookmarks } from '@/components/bookmarks/BookmarksProvider';

export function BookmarkChip(): React.ReactElement {
  const { count } = useBookmarks();
  const hasAny = count > 0;
  return (
    <Link
      href="/dashboard/bookmarks"
      aria-label={hasAny ? `${count} bookmarks` : 'Bookmarks'}
      className={cn(
        'hide-mobile inline-flex items-center gap-1.5',
        'h-btn-sm px-3 rounded-pill border cursor-pointer',
        'font-mono uppercase tracking-[1.2px] text-[10px] font-bold tabular-nums',
        'transition-colors duration-base ease-out',
        hasAny
          ? 'bg-mint/5 border-mint-border text-mint'
          : 'bg-transparent border-surface text-text-secondary hover:text-white hover:border-white',
      )}
    >
      <Icon.Bookmark size={11} fill={hasAny ? 'currentColor' : 'none'} />
      <span>{hasAny ? count : 'SAVED'}</span>
    </Link>
  );
}
