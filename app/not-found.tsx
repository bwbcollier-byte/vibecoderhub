// Root 404 page — renders for any unmatched route OR when `notFound()` is
// called from a Server Component. Sits inside the regular root layout so
// the header / footer / mobile-nav still show.

import Link from 'next/link';
import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';

export default function NotFound(): ReactElement {
  return (
    <div className="max-w-prose mx-auto px-4 md:px-8 py-20 flex flex-col gap-6">
      <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
        404 · NOT FOUND
      </p>
      <h1 className="font-display uppercase leading-[0.92] text-[clamp(56px,9vw,128px)]">
        Page not found.
      </h1>
      <p className="text-text-secondary text-[16px] leading-[1.5]">
        Either the URL is wrong, the resource hasn&apos;t been indexed yet, or it
        was archived. Try the directory or search.
      </p>
      <div className="flex gap-3 flex-wrap">
        <Link href="/">
          <Button variant="primary">Go home</Button>
        </Link>
        <Link href="/models">
          <Button variant="secondary">Browse models</Button>
        </Link>
      </div>
    </div>
  );
}
