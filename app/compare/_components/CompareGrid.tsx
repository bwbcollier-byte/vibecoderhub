'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOverlays } from '@/components/overlays/OverlaysProvider';

import type { CompareItem } from '../_lib/resolve';

interface CompareGridProps {
  items: CompareItem[];
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function formatContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return `${n}`;
}

type Renderer = (item: CompareItem) => React.ReactNode;

interface Row {
  label: string;
  render: Renderer;
  /** True if any item has a value for this row. */
  has: (items: CompareItem[]) => boolean;
  highlight?: boolean;
}

const ROWS: Row[] = [
  {
    label: 'Rating',
    has: (xs) => xs.some((x) => typeof x.ratingAvg === 'number'),
    render: (x) =>
      typeof x.ratingAvg === 'number' ? `★ ${x.ratingAvg.toFixed(1)}` : null,
  },
  {
    label: 'Installs (7d)',
    has: (xs) => xs.some((x) => typeof x.installCount7d === 'number'),
    render: (x) =>
      typeof x.installCount7d === 'number' ? formatK(x.installCount7d) : null,
  },
  {
    label: 'License',
    has: (xs) => xs.some((x) => !!x.license),
    render: (x) => x.license ?? null,
  },
  {
    label: 'Input price',
    has: (xs) => xs.some((x) => typeof x.priceInputPerMtok === 'number'),
    render: (x) =>
      typeof x.priceInputPerMtok === 'number'
        ? `$${x.priceInputPerMtok}/Mtok`
        : null,
  },
  {
    label: 'Output price',
    has: (xs) => xs.some((x) => typeof x.priceOutputPerMtok === 'number'),
    render: (x) =>
      typeof x.priceOutputPerMtok === 'number'
        ? `$${x.priceOutputPerMtok}/Mtok`
        : null,
  },
  {
    label: 'Blended cost',
    has: (xs) => xs.some((x) => typeof x.blendedCostPerMtok === 'number'),
    highlight: true,
    render: (x) =>
      typeof x.blendedCostPerMtok === 'number'
        ? `$${x.blendedCostPerMtok.toFixed(2)}/Mtok`
        : null,
  },
  {
    label: 'Intelligence',
    has: (xs) => xs.some((x) => typeof x.intelligenceIndex === 'number'),
    render: (x) =>
      typeof x.intelligenceIndex === 'number'
        ? `#${x.intelligenceIndex.toFixed(1)}`
        : null,
  },
  {
    label: 'Context (adv.)',
    has: (xs) => xs.some((x) => typeof x.contextWindowAdvertised === 'number'),
    render: (x) =>
      typeof x.contextWindowAdvertised === 'number'
        ? formatContext(x.contextWindowAdvertised)
        : null,
  },
  {
    label: 'Speed',
    has: (xs) => xs.some((x) => typeof x.outputTokensPerSecond === 'number'),
    render: (x) =>
      typeof x.outputTokensPerSecond === 'number'
        ? `${x.outputTokensPerSecond} tok/s`
        : null,
  },
  {
    label: 'Tools',
    has: (xs) => xs.some((x) => typeof x.toolCount === 'number'),
    render: (x) =>
      typeof x.toolCount === 'number' ? `${x.toolCount}` : null,
  },
  {
    label: 'Compatible clients',
    has: (xs) =>
      xs.some((x) => Array.isArray(x.compatibleClients) && x.compatibleClients.length > 0),
    render: (x) =>
      Array.isArray(x.compatibleClients) && x.compatibleClients.length > 0 ? (
        <span className="inline-flex flex-wrap gap-1">
          {x.compatibleClients.map((c) => (
            <Badge key={c} tone="neutral" size="sm">
              {c}
            </Badge>
          ))}
        </span>
      ) : null,
  },
];

export function CompareGrid({ items }: CompareGridProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openCmdK } = useOverlays();

  const removeId = React.useCallback(
    (id: string) => {
      const current = searchParams.get('ids') ?? '';
      const next = current
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && s !== id)
        .join(',');
      const qs = next ? `?ids=${next}` : '';
      router.push(`/compare${qs}`);
    },
    [router, searchParams],
  );

  const visibleRows = ROWS.filter((r) => r.has(items));

  return (
    <div className="border border-surface rounded-tile bg-canvas overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 720 }}>
        <thead>
          <tr className="border-b border-surface">
            <th className="text-left p-4 align-top w-[180px]">
              <span className="font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary">
                Property
              </span>
            </th>
            {items.map((item) => (
              <th key={item.id} className="text-left p-4 align-top">
                <div className="flex flex-col gap-2">
                  {item.providerColor && (
                    <span
                      aria-hidden
                      className="inline-block w-6 h-6 rounded-xs border border-surface"
                      style={{ background: item.providerColor }}
                    />
                  )}
                  <span className="font-mono uppercase tracking-[1.5px] text-[10px] text-mint">
                    {item.type}
                    {item.author ? ` · ${item.author}` : ''}
                  </span>
                  <Link
                    href={item.href}
                    className="font-sans font-bold text-[16px] text-white hover:text-mint"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeId(item.id)}
                    className="self-start font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary hover:text-error-red cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.label} className="border-b border-surface/60">
              <td className="p-4 align-top">
                <span className="font-mono uppercase tracking-[1.5px] text-[11px] text-text-secondary">
                  {row.label}
                </span>
              </td>
              {items.map((item) => {
                const value = row.render(item);
                return (
                  <td key={item.id} className="p-4 align-top">
                    {value == null ? (
                      <span className="text-text-secondary">—</span>
                    ) : (
                      <span
                        className={
                          row.highlight
                            ? 'font-mono font-bold text-mint text-[13px]'
                            : 'font-mono text-white text-[13px]'
                        }
                      >
                        {value}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-4 p-4 border-t border-surface">
        <span className="font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary">
          Add to compare
        </span>
        <Button variant="secondary" size="sm" onClick={openCmdK}>
          Open Cmd-K
        </Button>
      </div>
    </div>
  );
}
