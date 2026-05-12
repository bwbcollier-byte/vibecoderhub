// Landing page — Server Component.
//
// Boot Step 12 (Session 5). Anonymous public landing for the directory.
// Logged-in dashboard shell is a later slice (when auth is wired to a real
// Supabase project); for now every visitor sees the landing.
//
// Visual reference: docs/planning/promptkit-recon/src/pages.jsx LandingPage,
// reconciled to the locked tokens (TOKEN_RECONCILIATION.md). All sizes /
// radii / colors flow through `lib/tokens.ts` — zero magic numbers.

import Link from 'next/link';
import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import {
  RESOURCE_TYPE_GROUPS,
  getResourceType,
} from '@/lib/resource-types';
import { listModels } from '@/lib/db/queries/models';
import { getSiteStats } from '@/lib/db/queries/stats';
import { formatCount } from '@/lib/db/queries/_safe';

export const metadata = {
  title: 'Vibe Coder Hub — every primitive a vibe coder needs',
  description:
    'One directory. One install. Components, MCPs, agents, models, deals — all queryable by IDE and stack.',
};

function formatDealsValue(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (usd >= 1000) return `$${(usd / 1000).toFixed(0)}K`;
  return `$${usd}`;
}

const PILLARS = [
  {
    n: '01',
    tone: 'mint' as const,
    bg: 'bg-mint text-black',
    head: 'Find',
    body:
      'Cross-type search. Real install metrics. Compatibility-aware filtering for your IDE and stack.',
  },
  {
    n: '02',
    tone: 'uv' as const,
    bg: 'bg-ultraviolet text-white',
    head: 'Try',
    body:
      'Inline playgrounds for models. MCP tool inspector. Live component previews — without installing.',
  },
  {
    n: '03',
    tone: 'yellow' as const,
    bg: 'bg-tile-yellow text-black',
    head: 'Ship',
    body:
      'One-click install to Cursor, Claude Code, Windsurf, Cline. Or copy the JSON.',
  },
];

export default async function LandingPage(): Promise<ReactElement> {
  const [allModels, stats] = await Promise.all([listModels(), getSiteStats()]);
  const topModels = allModels
    .slice()
    .sort((a, b) => b.intelligenceIndex - a.intelligenceIndex)
    .slice(0, 4);

  const STATS = [
    { n: formatCount(stats.totalResources), l: 'RESOURCES INDEXED' },
    { n: '6', l: 'IDES & CLIENTS' },
    { n: formatCount(stats.totalModels), l: 'MODELS TRACKED' },
    { n: formatCount(stats.totalMcps), l: 'MCPS INDEXED' },
    {
      n: stats.activeDealsValueUsd > 0 ? formatDealsValue(stats.activeDealsValueUsd) : '—',
      l: 'IN ACTIVE DEALS',
    },
  ];

  const heroKickerCount = formatCount(stats.totalResources);

  return (
    <>
      {/* HERO */}
      <section className="px-4 md:px-8 pt-16 pb-6 max-w-xl mx-auto">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-4">
          THE DIRECTORY · {heroKickerCount} RESOURCES · 6 IDES
        </p>
        <h1 className="font-display uppercase text-white leading-[0.88] tracking-[0.5px] mb-6 text-[clamp(56px,11vw,152px)]">
          Every primitive
          <br />
          <span className="text-mint">a vibe coder needs.</span>
        </h1>
        <p className="text-[#cfcfcf] text-[20px] md:text-[22px] leading-[1.4] max-w-prose mb-8">
          One directory. One install. Components, MCPs, agents, models, deals
          — all queryable by IDE and stack.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" variant="primary">
            Sign up free →
          </Button>
          <Link href="/models">
            <Button size="lg" variant="secondary">
              Browse anonymously
            </Button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-surface bg-[#0a0a0a] px-4 md:px-8 py-6">
        <div className="max-w-xl mx-auto flex flex-wrap gap-8 justify-between">
          {STATS.map((s) => (
            <div key={s.l} className="flex flex-col gap-1">
              <div className="font-display text-[38px] leading-none text-mint">
                {s.n}
              </div>
              <div className="font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 PILLARS */}
      <section className="px-4 md:px-8 py-20 max-w-xl mx-auto">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
          HOW IT WORKS
        </p>
        <h2 className="font-display uppercase leading-[0.95] mb-12 text-[clamp(40px,7vw,96px)]">
          Find. Try. Ship.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div
              key={p.n}
              className={`${p.bg} rounded-tile p-8 min-h-[280px] flex flex-col`}
            >
              <div className="font-display text-[80px] leading-[0.9] mb-6">
                {p.n}
              </div>
              <div className="font-display uppercase text-[44px] md:text-[56px] leading-[0.95] mb-4">
                {p.head}.
              </div>
              <p className="text-[16px] leading-[1.5]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY BROWSE */}
      <section className="px-4 md:px-8 py-16 bg-[#0a0a0a] border-t border-surface">
        <div className="max-w-xl mx-auto">
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
            BY CATEGORY
          </p>
          <h2 className="font-sans font-bold text-[34px] tracking-[-0.01em] mb-8">
            24 destinations. One taxonomy.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {RESOURCE_TYPE_GROUPS.map((col) => (
              <div key={col.heading}>
                <div className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint pb-2 mb-3 border-b border-surface">
                  {col.heading}
                </div>
                <ul className="flex flex-col gap-2">
                  {col.ids.map((id) => {
                    const t = getResourceType(id);
                    if (!t) return null;
                    return (
                      <li key={id}>
                        <Link
                          href={`/${t.slug}`}
                          className="flex items-center gap-2 text-[14px] text-[#cfcfcf] hover:text-mint"
                        >
                          <span
                            className="inline-flex items-center justify-center w-4 h-4 rounded-sm font-mono text-[9px]"
                            style={{ background: `${t.tint}22`, color: t.tint }}
                            aria-hidden
                          >
                            {t.glyph}
                          </span>
                          {t.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP MODELS TEASER */}
      <section className="px-4 md:px-8 py-16 max-w-xl mx-auto">
        <div className="flex items-end justify-between gap-3 mb-6 flex-wrap">
          <div>
            <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
              FRONTIER MODELS
            </p>
            <h2 className="font-sans font-bold text-[34px] tracking-[-0.01em]">
              Smartest models, ranked.
            </h2>
          </div>
          <Link
            href="/models"
            className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint hover:text-link-hover"
          >
            See all models →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topModels.map((m) => (
            <Link
              key={m.slug}
              href={`/models/${m.slug}`}
              className="bg-canvas border border-surface rounded-tile p-5 hover:border-mint transition-colors duration-base ease-out flex flex-col gap-3"
            >
              <div className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
                {m.provider}
              </div>
              <div className="font-sans font-bold text-[16px] text-white leading-[1.2]">
                {m.name}
              </div>
              <div className="flex items-baseline gap-2 pt-2 border-t border-surface">
                <span className="font-mono font-bold text-[18px] text-mint tabular-nums">
                  ${m.blendedCostPerMtok.toFixed(2)}
                </span>
                <span className="font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
                  /MTOK
                </span>
              </div>
              <div className="font-mono text-[11px] text-text-secondary tabular-nums">
                #{m.intelligenceIndex} intelligence · {m.outputTokensPerSecond} tok/s
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CLOSER */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-prose mx-auto border border-ultraviolet rounded-tile p-10 bg-ultraviolet/5">
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-[#b69dff] mb-3">
            ONE DIRECTORY
          </p>
          <h2 className="font-display uppercase leading-[0.95] mb-4 text-[clamp(40px,7vw,72px)]">
            Free to browse.
            <br />
            Pro to unlock.
          </h2>
          <p className="text-text-secondary text-[16px] leading-[1.5] mb-6">
            $99/yr unlocks $4.2M+ in startup deals, hosted MCP gateway, secrets
            vault, unlimited price alerts, and the read-only JSON API.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button size="lg" variant="uv">
              Upgrade — $99/yr
            </Button>
            <Button size="lg" variant="ghost">
              <Icon.ArrowRight size={14} className="mr-1" />
              See what's in Pro
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
