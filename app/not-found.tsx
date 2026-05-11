'use client';

// Root 404 page — renders for any unmatched route OR when `notFound()` is
// called from a Server Component. Sits inside the regular root layout so
// the header / footer / mobile-nav still show.

import Link from 'next/link';
import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { useOverlays } from '@/components/overlays/OverlaysProvider';

const POPULAR_DESTINATIONS: Array<{ href: string; label: string }> = [
  { href: '/models', label: 'Models' },
  { href: '/mcps', label: 'MCPs' },
  { href: '/best-for', label: 'Best For' },
  { href: '/deals', label: 'Deals' },
  { href: '/guides', label: 'Guides' },
  { href: '/pricing', label: 'Pricing' },
];

export default function NotFound(): ReactElement {
  const { openCmdK } = useOverlays();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 md:px-8 py-20">
      <div className="max-w-prose w-full flex flex-col gap-6 text-center items-center">
        <p className="font-display text-mint leading-none text-[clamp(60px,9vw,80px)]">
          404
        </p>
        <h1 className="font-display uppercase leading-[0.92] text-[clamp(40px,7vw,72px)]">
          Page not found
        </h1>
        <p className="text-text-secondary text-[16px] leading-[1.5]">
          Either the URL is wrong, the resource hasn&apos;t been indexed yet, or it
          was archived. Try the directory or search.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/">
            <Button variant="primary">Go home</Button>
          </Link>
          <Button variant="ghost" onClick={() => openCmdK()}>
            Search (⌘K)
          </Button>
        </div>
        <div className="mt-8 flex flex-col gap-3 items-center">
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-text-secondary">
            Popular destinations
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {POPULAR_DESTINATIONS.map((dest) => (
              <li key={dest.href}>
                <Link
                  href={dest.href}
                  className="text-white hover:text-mint transition-colors text-[14px]"
                >
                  {dest.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
