'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';

import { MegaMenu } from './MegaMenu';

const TOP_NAV = [
  { href: '/components', label: 'Components' },
  { href: '/models',     label: 'Models' },
  { href: '/mcps',       label: 'MCPs' },
  { href: '/tools',      label: 'Tools' },
  { href: '/deals',      label: 'Deals' },
  { href: '/news',       label: 'News' },
  { href: '/guides',     label: 'Guides' },
] as const;

export function Header(): React.ReactElement {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-sticky bg-canvas border-b border-surface">
      <div className="flex items-center gap-4 px-4 md:px-8 h-[60px] max-w-xxl mx-auto">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 hide-mobile">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-mint text-black font-display text-[18px]"
            aria-hidden
          >
            V
          </span>
          <span className="font-display text-[22px] tracking-[0.5px] text-white">
            VIBE CODER HUB
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="hide-desktop inline-flex items-center justify-center w-icon-sm h-icon-sm rounded-full text-white hover:bg-white/5"
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <Icon.Menu size={18} />
        </button>

        {/* Top nav */}
        <nav className="hide-mobile flex items-center gap-1 ml-4">
          {TOP_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-mono uppercase tracking-[1.5px] text-[11px] font-bold',
                  'px-3 py-2 -mb-px border-b-2 transition-colors duration-base ease-out',
                  active
                    ? 'border-mint text-white'
                    : 'border-transparent text-[#cfcfcf] hover:text-link-hover',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <MegaMenu />
        </nav>

        <div className="flex-1" />

        {/* Search trigger */}
        <button
          type="button"
          className={cn(
            'hide-mobile inline-flex items-center gap-2',
            'bg-[#0a0a0a] border border-surface rounded-feature',
            'px-3 py-[7px] text-text-secondary hover:text-white',
            'min-w-[200px] cursor-pointer transition-colors duration-base ease-out',
          )}
          aria-label="Open search"
        >
          <Icon.Search size={14} />
          <span className="text-[13px] flex-1 text-left">Search…</span>
          <span className="font-mono uppercase tracking-[1px] text-[9px] px-1.5 py-px border border-surface rounded-xs">
            ⌘K
          </span>
        </button>

        {/* Auth buttons */}
        <div className="hide-mobile flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button variant="primary" size="sm">
            Get started
          </Button>
        </div>
      </div>

      {/* Mobile drop-down */}
      {mobileOpen && (
        <div className="hide-desktop border-t border-surface bg-canvas px-4 py-3">
          <nav className="flex flex-col gap-1">
            {TOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono uppercase tracking-[1.5px] text-[13px] font-bold text-white px-1 py-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
