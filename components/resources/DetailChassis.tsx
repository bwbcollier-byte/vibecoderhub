// Shared detail-page chassis for the simple resource types (components /
// skills / rules / subagents / plugins / prompts). Renders the standard
// hero + stats strip + tabs + right rail. Per-type pages slot a
// `previewBlock` ReactNode in as Zone 5 — typically a code snippet for
// /components and /prompts, an empty fragment otherwise.

import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import type { GenericResource, GenericTypeConfig } from '@/lib/seed/generic';

import { DetailTabs } from './DetailTabs';

interface DetailChassisProps {
  resource: GenericResource;
  config: GenericTypeConfig;
  alternatives: GenericResource[];
  /** Optional Zone 5 — preview / playground / inspector for this type. */
  previewBlock?: ReactNode;
  /** Optional Zone 5 tab label override (e.g. "Preview", "Snippet"). */
  previewTabLabel?: string;
}

export function DetailChassis({
  resource: r,
  config,
  alternatives,
  previewBlock,
  previewTabLabel = 'Preview',
}: DetailChassisProps): ReactElement {
  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <nav className="mb-6 font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary flex items-center gap-2">
        <Link href={`/${config.basePath}`} className="hover:text-mint">
          {config.plural.toUpperCase()}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-white">{r.author.toUpperCase()}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-8 min-w-0">
          {/* Hero */}
          <header className="flex flex-col gap-4">
            <p className="font-mono uppercase tracking-[1.4px] text-[11px] font-bold text-mint">
              {config.glyph} {config.singular.toUpperCase()} · {r.author} · v{r.version} ·{' '}
              {r.license}
            </p>
            <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,9vw,112px)]">
              {r.name}.
            </h1>
            <p className="text-text-body text-[18px] leading-[1.5] max-w-prose">{r.tagline}</p>
            {(r.compatibleClients.length > 0 || r.stackTags.length > 0) && (
              <div className="flex flex-wrap gap-1.5">
                {r.compatibleClients.map((c) => (
                  <Badge key={c} tone="neutral" size="md">
                    {c}
                  </Badge>
                ))}
                {r.stackTags.map((s) => (
                  <Badge key={s} tone="mint" size="md">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Stats strip */}
          <section
            aria-label="Usage stats"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-surface py-6"
          >
            <Stat label="RATING" value={`★ ${r.ratingAvg.toFixed(1)}`} accent />
            <Stat
              label="INSTALLS (7D)"
              value={`${(r.installCount7d / 1000).toFixed(1)}k`}
              hint={`${r.installCountTotal.toLocaleString()} total`}
            />
            <Stat label="UPDATED" value={r.updatedLabel} />
            <Stat label="LICENSE" value={r.license} />
          </section>

          {/* Tabs */}
          <DetailTabs
            resource={r}
            previewBlock={previewBlock}
            previewTabLabel={previewTabLabel}
          />
        </div>

        {/* Right rail */}
        <aside className="flex flex-col gap-6">
          <div className="bg-canvas border border-surface rounded-tile p-5 flex flex-col gap-3">
            <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
              INSTALL
            </p>
            <Button size="md" variant="primary">
              Install for Cursor
            </Button>
            <Button size="md" variant="secondary">
              <Icon.Copy size={14} className="mr-1" />
              Copy JSON snippet
            </Button>
            <Button size="md" variant="ghost">
              See all install options
            </Button>
          </div>

          {alternatives.length > 0 && (
            <div className="bg-canvas border border-surface rounded-tile p-5">
              <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-3">
                ALTERNATIVES
              </p>
              <ul className="flex flex-col gap-2">
                {alternatives.map((alt) => (
                  <li key={alt.slug}>
                    <Link
                      href={`/${config.basePath}/${alt.slug}`}
                      className="flex items-center justify-between gap-3 py-1.5 hover:text-mint"
                    >
                      <span className="text-[13px] truncate">{alt.name}</span>
                      <span className="font-mono text-[10px] text-text-secondary tabular-nums shrink-0">
                        ★ {alt.ratingAvg.toFixed(1)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-canvas border border-surface rounded-tile p-5 text-[13px] text-text-secondary leading-[1.5]">
            <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-2">
              SOURCE
            </p>
            Seeded from internal benchmarks. Live data pipeline lands alongside
            Slice S22 (ingestion).
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
      <p className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </p>
      <p
        className={`font-mono font-bold text-[22px] tabular-nums ${
          accent ? 'text-mint' : 'text-white'
        }`}
      >
        {value}
      </p>
      {hint && (
        <p className="text-text-secondary text-[11px] leading-[1.4]">{hint}</p>
      )}
    </div>
  );
}
