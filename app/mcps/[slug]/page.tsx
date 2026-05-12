// /mcps/[slug] — MCP detail. Server Component.
//
// Slice S02b. Zones populated: hero, stats strip, hash-driven tabs
// (Overview / Tools / Resources / Prompts / Compatibility), right rail
// (install actions, alternatives). The Tools tab is the read-only MCP Tool
// Inspector (ANSWERS Q1.1 — live invocation deferred Phase 2).

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { listMcps, getMcpBySlug, listMcpSlugs } from '@/lib/db/queries/mcps';

import { McpDetailTabs } from './_components/McpDetailTabs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listMcpSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMcpBySlug(slug);
  if (!m) return { title: 'MCP not found' };
  return {
    title: `${m.name} — ${m.author}`,
    description: m.tagline,
  };
}

export default async function McpDetailPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  const mcp = await getMcpBySlug(slug);
  if (!mcp) notFound();

  const allMcps = await listMcps();
  const alternatives = allMcps
    .filter((m) => m.slug !== mcp.slug)
    .slice(0, 4);

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <nav className="mb-6 font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary flex items-center gap-2">
        <Link href="/mcps" className="hover:text-mint">
          MCPs
        </Link>
        {mcp.author && (
          <>
            <span aria-hidden>/</span>
            <span className="text-white">{mcp.author.toUpperCase()}</span>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-8 min-w-0">
          {/* Hero */}
          <header className="flex flex-col gap-4">
            <p className="font-mono uppercase tracking-[1.4px] text-[11px] font-bold text-mint">
              {['⌖ MCP', mcp.author, mcp.version ? `v${mcp.version}` : null, mcp.license !== 'unknown' ? mcp.license : null]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,9vw,112px)]">
              {mcp.name}.
            </h1>
            {mcp.tagline && (
              <p className="text-text-body text-[18px] leading-[1.5] max-w-prose">{mcp.tagline}</p>
            )}
            {mcp.description && mcp.description.trim() !== mcp.tagline.trim() && (
              <p className="text-text-secondary text-[14px] leading-[1.6] max-w-prose">
                {mcp.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {mcp.compatibleClients.map((c) => (
                <Badge key={c} tone="neutral" size="md">
                  {c}
                </Badge>
              ))}
            </div>
          </header>

          {/* Stats */}
          <section
            aria-label="Surface area"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-surface py-6"
          >
            <Stat label="TOOLS" value={mcp.toolCount.toString()} accent hint="callable from the agent" />
            <Stat label="RESOURCES" value={mcp.resourceCount.toString()} hint="readable URI templates" />
            <Stat label="PROMPTS" value={mcp.promptCount.toString()} hint="canned instructions" />
            <Stat
              label="USAGE"
              value={
                mcp.installCount7d > 0
                  ? `${(mcp.installCount7d / 1000).toFixed(1)}k/wk`
                  : '—'
              }
              hint={
                mcp.ratingAvg > 0
                  ? `★ ${mcp.ratingAvg.toFixed(1)} · ${mcp.updatedLabel}`
                  : mcp.updatedLabel
              }
            />
          </section>

          {/* Tabs */}
          <McpDetailTabs mcp={mcp} />
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

          <div className="bg-canvas border border-surface rounded-tile p-5">
            <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-3">
              ALTERNATIVES
            </p>
            <ul className="flex flex-col gap-2">
              {alternatives.map((alt) => (
                <li key={alt.slug}>
                  <Link
                    href={`/mcps/${alt.slug}`}
                    className="flex items-center justify-between gap-3 py-1.5 hover:text-mint"
                  >
                    <span className="text-[13px] truncate">{alt.name}</span>
                    {alt.toolCount > 0 && (
                      <span className="font-mono text-[10px] text-text-secondary tabular-nums shrink-0">
                        {alt.toolCount} tools
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-canvas border border-surface rounded-tile p-5 text-[13px] text-text-secondary leading-[1.5]">
            <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint mb-2">
              READ-ONLY INSPECTOR
            </p>
            Tools are introspected from this server&rsquo;s manifest. Live
            invocation (Try It) lands Phase 2 — until then, copy the JSON
            schema into your client to test.
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
