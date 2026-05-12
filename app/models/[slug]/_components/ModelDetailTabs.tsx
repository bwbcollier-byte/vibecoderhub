'use client';

import * as React from 'react';

import { Tabs } from '@/components/ui/tabs';
import type { ModelDetail } from '@/lib/seed/models';

interface Props {
  model: ModelDetail;
}

export function ModelDetailTabs({ model }: Props): React.ReactElement {
  return (
    <Tabs
      items={[
        { value: 'overview',    label: 'Overview' },
        { value: 'pricing',     label: 'Pricing' },
        { value: 'performance', label: 'Performance' },
        { value: 'capabilities', label: 'Capabilities' },
      ]}
      defaultValue="overview"
    >
      {(active) => (
        <div className="min-h-[200px]">
          {active === 'overview' && <Overview model={model} />}
          {active === 'pricing' && <Pricing model={model} />}
          {active === 'performance' && <Performance model={model} />}
          {active === 'capabilities' && <Capabilities model={model} />}
        </div>
      )}
    </Tabs>
  );
}

function Overview({ model }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 text-[15px] leading-[1.6] text-[#cfcfcf]">
      <p>{model.description}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
        <Row label="Architecture" value={model.architecture ?? '—'} />
        <Row
          label="Parameters"
          value={
            model.parametersBillions != null
              ? `${model.parametersBillions}B`
              : 'Closed'
          }
        />
        <Row label="Released" value={model.releasedAt || '—'} />
        <Row label="Knowledge cutoff" value={model.knowledgeCutoff || '—'} />
      </dl>
    </div>
  );
}

function Pricing({ model }: Props): React.ReactElement {
  const rows = [
    { label: 'Input', value: model.priceInputPerMtok, suffix: '/Mtok' },
    { label: 'Output', value: model.priceOutputPerMtok, suffix: '/Mtok' },
    {
      label: 'Blended (3:1 in:out)',
      value: model.blendedCostPerMtok,
      suffix: '/Mtok',
      accent: true,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <table className="w-full text-left">
        <thead>
          <tr className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
            <th className="py-2">Component</th>
            <th className="py-2 text-right">Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-surface">
              <td className="py-3 text-[14px]">{r.label}</td>
              <td
                className={`py-3 text-right font-mono tabular-nums text-[14px] ${
                  r.accent ? 'text-mint font-bold' : 'text-white'
                }`}
              >
                {r.value > 0 ? `$${r.value.toFixed(2)} ${r.suffix}` : 'Free'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {model.priceDeltaPct !== 0 && (
        <div className="font-mono text-[12px] text-text-secondary tabular-nums">
          {model.priceDeltaPct < 0 ? '▼' : '▲'} {Math.abs(model.priceDeltaPct)}%
          vs 30 days ago
        </div>
      )}
    </div>
  );
}

function Performance({ model }: Props): React.ReactElement {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
      <Row
        label="Output speed"
        value={model.outputTokensPerSecond > 0 ? `${model.outputTokensPerSecond} tok/s` : '—'}
      />
      <Row
        label="Time-to-first-token"
        value={model.ttftMs > 0 ? `${model.ttftMs} ms` : '—'}
      />
      <Row
        label="Context (advertised)"
        value={
          model.contextWindowAdvertised > 0
            ? model.contextWindowAdvertised.toLocaleString()
            : '—'
        }
      />
      <Row
        label="Context (effective)"
        value={
          model.contextWindowEffective > 0
            ? model.contextWindowEffective.toLocaleString()
            : '—'
        }
      />
      <Row
        label="Intelligence index"
        value={model.intelligenceIndex > 0 ? model.intelligenceIndex.toFixed(1) : '—'}
      />
    </dl>
  );
}

function Capabilities({ model }: Props): React.ReactElement {
  const caps: Array<[string, boolean]> = [
    ['Tools', model.supportsTools],
    ['Vision', model.supportsVision],
    ['Audio', model.supportsAudio],
    ['Caching', model.supportsCaching],
    ['Reasoning', model.supportsReasoning],
    ['Open weights', model.isOpenWeights],
  ];
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[14px]">
      {caps.map(([label, on]) => (
        <li
          key={label}
          className={`flex items-center gap-2 ${on ? 'text-white' : 'text-text-secondary line-through'}`}
        >
          <span
            aria-hidden
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
              on ? 'bg-mint text-black' : 'bg-surface text-text-secondary'
            }`}
          >
            {on ? '✓' : '–'}
          </span>
          {label}
        </li>
      ))}
    </ul>
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
