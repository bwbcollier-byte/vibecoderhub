'use client';

import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import {
  RESOURCE_TYPE_GROUPS,
  getResourceType,
} from '@/lib/resource-types';
import { cn } from '@/lib/shadcn/cn';

export function MegaMenu(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          'font-mono uppercase tracking-[1.5px] text-[11px] font-bold',
          'px-3 py-2 cursor-pointer transition-colors duration-base ease-out',
          open ? 'text-white' : 'text-[#cfcfcf] hover:text-link-hover',
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        All 24 types <Icon.ChevDown size={11} className="inline-block ml-1" />
      </button>
      {open && (
        <div
          className={cn(
            'absolute top-full -left-[120px] z-dropdown',
            'bg-canvas border border-mint-border rounded-md p-6',
            'grid grid-cols-4 gap-6 shadow-lg',
            'min-w-[760px]',
          )}
        >
          {RESOURCE_TYPE_GROUPS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2">
              <div
                className={cn(
                  'font-mono uppercase tracking-[1.4px] text-[9px] font-bold',
                  'text-mint pb-2 mb-1 border-b border-surface',
                )}
              >
                {col.heading}
              </div>
              {col.ids.map((id) => {
                const t = getResourceType(id);
                if (!t) return null;
                return (
                  <Link
                    key={id}
                    href={`/${t.slug}`}
                    onClick={close}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 rounded-sm',
                      'text-[13px] text-white hover:bg-mint/5 hover:text-mint',
                    )}
                  >
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-sm font-mono text-[9px]"
                      style={{ background: `${t.tint}22`, color: t.tint }}
                      aria-hidden
                    >
                      {t.glyph}
                    </span>
                    <span>{t.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
