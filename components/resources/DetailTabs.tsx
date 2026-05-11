'use client';

import * as React from 'react';

import { Tabs } from '@/components/ui/tabs';
import type { GenericResource } from '@/lib/seed/generic';

interface Props {
  resource: GenericResource;
  previewBlock?: React.ReactNode;
  previewTabLabel?: string;
}

export function DetailTabs({
  resource: r,
  previewBlock,
  previewTabLabel = 'Preview',
}: Props): React.ReactElement {
  const baseItems = [
    { value: 'overview',     label: 'Overview' },
    { value: 'compatibility',label: 'Compatibility' },
  ];
  const items = previewBlock
    ? [
        baseItems[0]!,
        { value: 'preview', label: previewTabLabel },
        baseItems[1]!,
      ]
    : baseItems;

  return (
    <Tabs items={items} defaultValue="overview">
      {(active) => (
        <div className="min-h-[200px]">
          {active === 'overview' && <Overview resource={r} />}
          {active === 'preview' && previewBlock}
          {active === 'compatibility' && <Compatibility resource={r} />}
        </div>
      )}
    </Tabs>
  );
}

function Overview({ resource: r }: { resource: GenericResource }): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 text-[15px] leading-[1.6] text-[#cfcfcf]">
      <p>{r.description}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
        <Row label="Author" value={r.author} />
        <Row label="Version" value={r.version} />
        <Row label="License" value={r.license} />
        <Row label="Last updated" value={r.updatedLabel} />
        <Row label="Installs (7d)" value={r.installCount7d.toLocaleString()} />
        <Row label="Installs (total)" value={r.installCountTotal.toLocaleString()} />
      </dl>
    </div>
  );
}

function Compatibility({ resource: r }: { resource: GenericResource }): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {r.compatibleClients.length > 0 ? (
        <>
          <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            VERIFIED CLIENTS
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[14px]">
            {r.compatibleClients.map((c) => (
              <li key={c} className="flex items-center gap-2 text-white">
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-mint text-black text-[10px]"
                >
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-text-secondary text-[14px]">
          No client compatibility data declared.
        </p>
      )}
      {r.stackTags.length > 0 && (
        <>
          <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary mt-4">
            STACK TAGS
          </p>
          <div className="flex flex-wrap gap-1.5">
            {r.stackTags.map((s) => (
              <span
                key={s}
                className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-text-secondary border border-surface rounded-pill px-3 py-1"
              >
                {s}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="flex justify-between gap-3 border-b border-surface py-2">
      <dt className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}
