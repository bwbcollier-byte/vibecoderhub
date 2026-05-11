'use client';

import * as React from 'react';

import { cn } from '@/lib/shadcn/cn';

/**
 * Hash-based Tabs (Phase 1, per ANSWERS B2).
 *
 * The active tab is reflected in `window.location.hash`. Bookmarks + back-button
 * survive. SSR-safe: defaults to the first tab on the server; hydrates from the
 * hash on the client. Convertible to nested routes post-launch without API
 * change at the component level.
 */

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  children: (active: string) => React.ReactNode;
  className?: string;
}

export function Tabs({
  items,
  defaultValue,
  children,
  className,
}: TabsProps): React.ReactElement {
  const initial = defaultValue ?? items[0]?.value ?? '';
  const [active, setActive] = React.useState<string>(initial);

  React.useEffect(() => {
    const sync = (): void => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && items.some((i) => i.value === hash)) {
        setActive(hash);
      } else {
        setActive(initial);
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [items, initial]);

  const select = (value: string): void => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hash = value;
      window.history.pushState(null, '', url.toString());
    }
    setActive(value);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <TabList items={items} active={active} onSelect={select} />
      <div>{children(active)}</div>
    </div>
  );
}

interface TabListProps {
  items: TabItem[];
  active: string;
  onSelect: (value: string) => void;
}

function TabList({ items, active, onSelect }: TabListProps): React.ReactElement {
  return (
    <div
      role="tablist"
      className="flex gap-1 border-b border-surface overflow-x-auto"
    >
      {items.map((item) => {
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onSelect(item.value)}
            className={cn(
              'font-mono font-bold uppercase tracking-[1.5px] text-[11px]',
              'px-3 py-3 -mb-px border-b-2 transition-colors duration-base ease-out',
              'whitespace-nowrap cursor-pointer',
              isActive
                ? 'border-mint text-white'
                : 'border-transparent text-text-secondary hover:text-white',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
