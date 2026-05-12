// /models/[slug] — model detail page. Server Component.
//
// Slice S01b (Session 5). 9-zone chassis simplified to the 5 zones the seed
// supports: hero, stats strip, tabs (Overview / Pricing / Performance),
// description, right rail. Remaining zones (cost calculator, prompting tips,
// rate-limit table, alternatives grid) wire in once richer seed lands.
//
// Visual reference: docs/planning/promptkit-recon/src/pages3.jsx ModelDetailPage.

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { listModels, getModelBySlug, listModelSlugs } from '@/lib/db/queries/models';

import { ModelDetailTabs } from './_components/ModelDetailTabs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listModelSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const m = await getModelBySlug(slug);
  if (!m) return { title: 'Model not found' };
  return {
    title: `${m.name} — ${m.provider}`,
    description: m.description,
  };
}

function formatContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toLocaleString();
}

export default async function ModelDetailPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const allModels = await listModels();
  const alternatives = allModels
    .filter((m) => m.slug !== model.slug)
    .slice(0, 4);

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      {/* Breadcrumb */}
      <nav className="mb-6 font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary flex items-center gap-2">
        <Link href="/models" className="hover:text-mint">
          MODELS
        </Link>
        <span aria-hidden>/</span>
        <span className="text-white">{model.provider.toUpperCase()}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* MAIN */}
        <div className="flex flex-col gap-8 min-w-0">
          {/* Zone 1 — Hero */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex items-center justify-center w-10 h-10 rounded-sm font-mono font-bold text-[14px] text-black tracking-[0.5px]"
                style={{ background: model.providerColor }}
              >
                {model.provider
                  .split(/\s+/)
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <div className="flex flex-col">
                <span className="font-mono uppercase tracking-[1.4px] text-[11px] text-text-secondary">
                  {model.provider}
                </span>
                {(model.releasedAt || model.knowledgeCutoff) && (
                  <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
                    {[
                      model.releasedAt ? `Released ${model.releasedAt}` : null,
                      model.knowledgeCutoff ? `cutoff ${model.knowledgeCutoff}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
              </div>
            </div>
            <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,9vw,112px)]">
              {model.name}.
            </h1>
            <p className="text-text-body text-[18px] leading-[1.5] max-w-prose">
              {model.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {model.tags.map((t) => (
                <Badge key={t} tone={t === 'open-weights' ? 'mint' : 'neutral'} size="md">
                  {t}
                </Badge>
              ))}
            </div>
          </header>

          {/* Zone 2 — Stats strip */}
          <section
            aria-label="Key stats"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-surface py-6"
          >
            <Stat
              label="INTELLIGENCE"
              value={model.intelligenceIndex > 0 ? model.intelligenceIndex.toFixed(1) : '—'}
              hint={model.intelligenceIndex > 0 ? 'aggregated eval index' : 'not yet ranked'}
            />
            <Stat
              label="BLENDED COST"
              value={
                model.blendedCostPerMtok > 0
                  ? `$${model.blendedCostPerMtok.toFixed(2)}`
                  : 'Free'
              }
              hint={
                model.blendedCostPerMtok > 0
                  ? 'per million tokens'
                  : 'open weights · BYOH'
              }
              accent
            />
            <Stat
              label="THROUGHPUT"
              value={
                model.outputTokensPerSecond > 0 ? `${model.outputTokensPerSecond}` : '—'
              }
              hint={
                model.outputTokensPerSecond > 0
                  ? `tok/s${model.ttftMs > 0 ? ` · ttft ${model.ttftMs}ms` : ''}`
                  : 'speed not measured'
              }
            />
            <Stat
              label="CONTEXT"
              value={
                model.contextWindowAdvertised > 0
                  ? formatContext(model.contextWindowAdvertised)
                  : '—'
              }
              hint={
                model.contextWindowEffective > 0 &&
                model.contextWindowEffective !== model.contextWindowAdvertised
                  ? `effective ${formatContext(model.contextWindowEffective)}`
                  : undefined
              }
            />
          </section>

          {/* Zones 3-5 — Tabs (hash-driven) */}
          <ModelDetailTabs model={model} />
        </div>

        {/* RIGHT RAIL */}
        <aside className="flex flex-col gap-6">
          <div className="bg-canvas border border-surface rounded-tile p-5 flex flex-col gap-3">
            <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
              TRY IT
            </div>
            <Button size="md" variant="primary">
              Open in playground
            </Button>
            <Button size="md" variant="secondary">
              <Icon.Copy size={14} className="mr-1" />
              Copy API snippet
            </Button>
            <Button size="md" variant="ghost">
              <Icon.Compare size={14} className="mr-1" />
              Add to compare
            </Button>
          </div>

          <div className="bg-canvas border border-surface rounded-tile p-5">
            <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-3">
              ALTERNATIVES
            </div>
            <ul className="flex flex-col gap-2">
              {alternatives.map((alt) => (
                <li key={alt.slug}>
                  <Link
                    href={`/models/${alt.slug}`}
                    className="flex items-center justify-between gap-3 py-1.5 hover:text-mint"
                  >
                    <span className="text-[13px] truncate">{alt.name}</span>
                    <span className="font-mono text-[10px] text-text-secondary tabular-nums shrink-0">
                      {alt.blendedCostPerMtok > 0
                        ? `$${alt.blendedCostPerMtok.toFixed(2)}`
                        : 'Free'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-canvas border border-surface rounded-tile p-5 text-[13px] text-text-secondary leading-[1.5]">
            <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-2">
              SOURCE
            </div>
            Pricing + capabilities seeded from internal benchmarks. Live
            provider feed wires in alongside Slice S22 (ingestion).
          </div>
        </aside>
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}

function Stat({ label, value, hint, accent }: StatProps): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <div className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </div>
      <div
        className={`font-mono font-bold text-[22px] tabular-nums ${
          accent ? 'text-mint' : 'text-white'
        }`}
      >
        {value}
      </div>
      {hint && (
        <div className="text-text-secondary text-[11px] leading-[1.4]">{hint}</div>
      )}
    </div>
  );
}
