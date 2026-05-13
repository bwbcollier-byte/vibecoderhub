// /design-systems/[slug] — design system detail page. Server Component.
//
// Single full-width column layout mirroring /models/[slug] and /mcps/[slug]:
// breadcrumb + visit-website pill · hero (swatch + kicker + display name +
// tagline + expandable description) · horizontal stats strip · hash-driven
// Tabs.

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import {
  getDesignSystemBySlug,
  listDesignSystemSlugs,
} from '@/lib/db/queries/design-systems';

import { DesignSystemDetailTabs } from './_components/DesignSystemDetailTabs';
import { ExpandableDescription } from './_components/ExpandableDescription';

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

  const hasHq = typeof system.headquarters === 'string' && system.headquarters.trim().length > 0;

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      {/* Breadcrumb + visit pill */}
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <nav className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary flex items-center gap-2">
          <Link href="/design-systems" className="hover:text-mint">
            DESIGN SYSTEMS
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white">{system.name.toUpperCase()}</span>
        </nav>
        {websiteHref && (
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 bg-mint text-black font-mono uppercase tracking-[1.2px] text-[10px] font-bold hover:bg-link-hover transition-colors duration-base ease-out"
          >
            <Icon.External size={12} />
            Visit website
          </a>
        )}
      </div>

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
            <ExpandableDescription text={system.description} />
          )}
        </header>

        {/* Stats strip */}
        <section
          aria-label="Key stats"
          className={`border-y border-surface py-6 grid grid-cols-2 gap-4 ${
            hasHq ? 'md:grid-cols-5' : 'md:grid-cols-4'
          }`}
        >
          <Stat
            label="QUALITY"
            value={system.qualityScore != null ? `${system.qualityScore}` : '—'}
            accent
          />
          <Stat label="INDUSTRY" value={system.industry ?? '—'} />
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
          {hasHq && (
            <Stat label="HEADQUARTERS" value={system.headquarters!} />
          )}
        </section>

        {/* Tabs */}
        <DesignSystemDetailTabs system={system} />
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
    <div className="flex flex-col gap-1 min-w-0">
      <div className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </div>
      <div
        className={`font-mono font-bold text-[22px] tabular-nums truncate ${
          accent ? 'text-mint' : 'text-white'
        }`}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
