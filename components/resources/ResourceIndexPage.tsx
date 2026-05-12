// Server Component shell for any generic index page. Renders the kicker +
// hero + delegates the live list to the client GenericResourceIndex.

import type { ReactElement } from 'react';

import type { GenericResource, GenericTypeConfig } from '@/lib/seed/generic';

import { GenericResourceIndex } from './GenericResourceIndex';

interface Props {
  items: GenericResource[];
  config: GenericTypeConfig;
  /** Total DB row count (unfiltered). When omitted, falls back to items.length —
      OK for small types but lies when the query layer's default LIMIT 200 caps
      the items array. Pass an explicit count via getResourceCount(typeId). */
  totalCount?: number;
}

export function ResourceIndexPage({ items, config, totalCount }: Props): ReactElement {
  const displayCount = totalCount ?? items.length;
  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
            {config.glyph} · {displayCount.toLocaleString()} INDEXED
          </p>
          <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,10vw,128px)]">
            {config.indexHeadline}
          </h1>
        </div>
      </header>
      <GenericResourceIndex items={items} config={config} />
    </div>
  );
}
