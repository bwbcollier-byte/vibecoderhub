'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/shadcn/cn';
import { variantToTile, type NewsItem, type NewsKind, NEWS_KIND_LABELS } from '@/lib/seed/news';

interface Props {
  items: NewsItem[];
}

const ALL_KINDS: NewsKind[] = ['breaking', 'releases', 'ecosystem', 'tutorials', 'op-eds', 'price'];

export function NewsList({ items }: Props): React.ReactElement {
  const [active, setActive] = React.useState<Set<NewsKind>>(new Set(ALL_KINDS));

  const toggle = (k: NewsKind): void => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const filtered = items.filter((n) => active.has(n.kind));
  const breaking = filtered.find((n) => n.kind === 'breaking');
  const rest = filtered.filter((n) => n.kind !== 'breaking');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
      <aside className="hide-mobile flex flex-col gap-3">
        <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
          KIND
        </p>
        {ALL_KINDS.map((k) => {
          const checked = active.has(k);
          const count = items.filter((n) => n.kind === k).length;
          return (
            <label
              key={k}
              className="flex items-center gap-2 text-[13px] text-[#cfcfcf] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(k)}
                className="accent-mint"
              />
              {NEWS_KIND_LABELS[k]}{' '}
              <span className="text-text-secondary text-[11px] font-mono tabular-nums">
                ({count})
              </span>
            </label>
          );
        })}
      </aside>

      <div className="flex flex-col gap-4 min-w-0">
        {breaking && (
          <Link
            href={`/news/${breaking.slug}`}
            className="rounded-tile p-7 transition-colors duration-base ease-out hover:opacity-95 block"
            style={{ background: variantToTile(breaking.variant) }}
          >
            <p className="font-mono uppercase tracking-[1.5px] text-[12px] font-bold text-black mb-3">
              🔥 BREAKING
            </p>
            <h2 className="font-display uppercase leading-[0.95] text-[clamp(36px,5vw,56px)] text-black mb-3">
              {breaking.headline}
            </h2>
            <p className="font-mono uppercase tracking-[1.4px] text-[11px] text-black/70">
              AUTO-GENERATED · {breaking.time}
            </p>
          </Link>
        )}

        <ul className="flex flex-col">
          {rest.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/news/${n.slug}`}
                className={cn(
                  'flex items-start gap-4 py-5 border-b border-surface',
                  'transition-colors duration-base ease-out group',
                )}
              >
                <div
                  className="w-[100px] h-[100px] rounded-md shrink-0 flex items-center justify-center"
                  style={{ background: variantToTile(n.variant) }}
                  aria-hidden
                >
                  <span className="font-display text-[36px] text-black/80">
                    {n.headline[0]}
                  </span>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
                      {NEWS_KIND_LABELS[n.kind]}
                    </span>
                    {n.auto && (
                      <span className="font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
                        🤖 AUTO
                      </span>
                    )}
                    <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
                      {n.source} · {n.time}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-[22px] leading-[1.25] text-white group-hover:text-link-hover transition-colors duration-base ease-out">
                    {n.headline}
                  </h3>
                  <p className="text-text-secondary text-[14px] leading-[1.5]">
                    {n.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="text-text-secondary text-[14px] text-center py-12">
            No news matches the selected kinds.
          </p>
        )}
      </div>
    </div>
  );
}
