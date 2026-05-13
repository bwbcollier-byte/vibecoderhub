// /design-systems/[slug] — design system detail page. Server Component.
//
// Session 20. Mirrors the /models/[slug] chassis: breadcrumb, hero (provider
// tile + kicker + display name + tagline + description), 4-up stats strip,
// hash-driven Tabs, right rail (visit website + industry profile).

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import {
  getDesignSystemBySlug,
  listDesignSystemSlugs,
} from '@/lib/db/queries/design-systems';

import { DesignSystemDetailTabs } from './_components/DesignSystemDetailTabs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listDesignSystemSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const s = await getDesignSystemBySlug(slug);
  if (!s) return { title: 'Design system not found' };
  return {
    title: `${s.name} — Design System`,
    description: s.tagline ?? undefined,
  };
}

export default async function DesignSystemDetailPage({
  params,
}: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const system = await getDesignSystemBySlug(slug);
  if (!system) notFound();

  const heroSwatches = system.primaryColors.slice(0, 3);
  const kickerParts = [
    '◐ DESIGN SYSTEM',
    system.industry,
    system.headquarters,
    system.foundedYear ? `founded ${system.foundedYear}` : null,
  ].filter(Boolean) as string[];

  const websiteHref = system.domain
    ? system.domain.startsWith('http')
      ? system.domain
      : `https://${system.domain}`
    : null;

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      {/* Breadcrumb */}
      <nav className="mb-6 font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary flex items-center gap-2">
        <Link href="/design-systems" className="hover:text-mint">
          DESIGN SYSTEMS
        </Link>
        <span aria-hidden>/</span>
        <span className="text-white">{system.name.toUpperCase()}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* MAIN */}
        <div className="flex flex-col gap-8 min-w-0">
          {/* Hero */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {heroSwatches.length > 0 ? (
                <span
                  aria-hidden
                  className="inline-flex h-10 rounded-sm overflow-hidden border border-surface"
                >
                  {heroSwatches.map((c, i) => (
                    <span
                      key={`${c.hex}-${i}`}
                      className="w-4 h-full"
                      style={{ background: c.hex }}
                    />
                  ))}
                </span>
              ) : (
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-surface font-mono font-bold text-[14px] text-text-secondary"
                >
                  ◐
                </span>
              )}
              <span className="font-mono uppercase tracking-[1.4px] text-[11px] text-text-secondary">
                {kickerParts.join(' · ')}
              </span>
            </div>

            <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,9vw,112px)]">
              {system.name}.
            </h1>
            {system.tagline && (
              <p className="text-text-body text-[18px] leading-[1.5] max-w-prose">
                {system.tagline}
              </p>
            )}
            {system.description && (
              <p className="text-text-secondary text-[15px] leading-[1.6] max-w-prose">
                {system.description}
              </p>
            )}
          </header>

          {/* Stats strip */}
          <section
            aria-label="Key stats"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-surface py-6"
          >
            <Stat
              label="QUALITY"
              value={system.qualityScore != null ? `${system.qualityScore}` : '—'}
              accent
            />
            <Stat label="INDUSTRY"  value={system.industry ?? '—'} />
            <Stat
              label="EMPLOYEES"
              value={
                system.employeeCount != null
                  ? system.employeeCount.toLocaleString()
                  : '—'
              }
            />
            <Stat
              label="FOUNDED"
              value={system.foundedYear != null ? `${system.foundedYear}` : '—'}
            />
          </section>

          {/* Tabs */}
          <DesignSystemDetailTabs system={system} />
        </div>

        {/* RIGHT RAIL */}
        <aside className="flex flex-col gap-6">
          <div className="bg-canvas border border-surface rounded-tile p-5 flex flex-col gap-3">
            <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
              VISIT
            </div>
            {websiteHref ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noreferrer noopener"
                className={buttonVariants({ size: 'md', variant: 'primary' })}
              >
                <Icon.External size={14} className="mr-1" />
                Visit website
              </a>
            ) : (
              <Button size="md" variant="primary" disabled>
                Website unavailable
              </Button>
            )}
            {system.domain && (
              <p className="font-mono text-[11px] text-text-secondary truncate">
                {system.domain}
              </p>
            )}
          </div>

          <div className="bg-canvas border border-surface rounded-tile p-5 flex flex-col gap-3">
            <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
              INDUSTRY PROFILE
            </div>
            <dl className="flex flex-col gap-2 text-[13px]">
              <RailRow label="Industry"    value={system.industry ?? '—'} />
              <RailRow label="HQ"          value={system.headquarters ?? '—'} />
              <RailRow
                label="Founded"
                value={system.foundedYear != null ? `${system.foundedYear}` : '—'}
              />
              <RailRow
                label="Employees"
                value={
                  system.employeeCount != null
                    ? system.employeeCount.toLocaleString()
                    : '—'
                }
              />
              <RailRow
                label="Quality"
                value={system.qualityScore != null ? `${system.qualityScore}` : '—'}
              />
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
  accent?: boolean;
}

function Stat({ label, value, accent }: StatProps): ReactElement {
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
    </div>
  );
}

function RailRow({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="flex justify-between gap-3 border-b border-surface pb-2 last:border-b-0 last:pb-0">
      <dt className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </dt>
      <dd className="text-white truncate">{value}</dd>
    </div>
  );
}
