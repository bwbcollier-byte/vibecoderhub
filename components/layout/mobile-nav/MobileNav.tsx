'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';

const TABS = [
  { id: 'home',      href: '/',          label: 'Home',      Icon: Icon.Home },
  { id: 'search',    href: '/search',    label: 'Search',    Icon: Icon.Search },
  { id: 'bookmarks', href: '/dashboard', label: 'Saved',     Icon: Icon.Bookmark },
  { id: 'news',      href: '/news',      label: 'News',      Icon: Icon.Flame },
  { id: 'profile',   href: '/account',   label: 'Account',   Icon: Icon.User },
] as const;

export function MobileNav(): React.ReactElement {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        'hide-desktop fixed bottom-0 inset-x-0 z-sticky',
        'bg-canvas border-t border-surface',
        'flex items-stretch justify-around',
      )}
      aria-label="Primary"
    >
      {TABS.map((tab) => {
        const active =
          tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-label={tab.label}
            className={cn(
              'flex items-center justify-center flex-1 py-3 transition-colors duration-base ease-out',
              active ? 'text-mint' : 'text-text-secondary',
            )}
          >
            <tab.Icon size={20} aria-hidden />
          </Link>
        );
      })}
    </nav>
  );
}
