// Pricing page — Server Component.
//
// Pro plan is locked per docs/planning/ANSWERS.md Q3.6: single tier,
// $99/yr, 14-day money-back. This page is the public marketing surface —
// three-card grid (Free / Member / Pro), a feature comparison table, a
// money-back callout, and a small FAQ.
//
// All CTA buttons live in <PricingClient /> because they fire overlay
// actions (`openUpgrade`, `openAuth`) which require client context.

import Link from 'next/link';
import type { ReactElement } from 'react';

import { Icon } from '@/components/icons/Icon';
import { PricingClient } from './_components/PricingClient';

export const metadata = {
  title: 'Pricing — Vibe Coder Hub',
  description:
    'Browse free. Become a Member for free to submit + track. Go Pro ($99/yr) to unlock $4.2M+ in deals, the hosted gateway, secrets vault, and unlimited price alerts.',
};

// ---------------------------------------------------------------------------
// Feature comparison data — cross-reference ANSWERS Q3.6.
// `Cell` is one of: 'live' (mint check), 'none' (em dash), 'soon' ("Coming
// Q3 2026"), or a literal string for quantitative limits ("5 max", "10").
// ---------------------------------------------------------------------------

type Cell = 'live' | 'none' | 'soon' | string;

interface ComparisonRow {
  feature: string;
  free: Cell;
  member: Cell;
  pro: Cell;
}

const COMPARISON_ROWS: readonly ComparisonRow[] = [
  { feature: 'Browse all resources',  free: 'live',    member: 'live',      pro: 'live' },
  { feature: 'Cmd-K search',          free: 'live',    member: 'live',      pro: 'live' },
  { feature: 'Bookmarks',             free: '5 max',   member: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Stack picker',          free: '1 stack', member: '5 stacks',  pro: 'Unlimited' },
  { feature: 'Public deals',          free: 'live',    member: 'live',      pro: 'live' },
  { feature: 'Member deals',          free: 'none',    member: 'live',      pro: 'live' },
  { feature: 'Pro deals ($4.2M+)',    free: 'none',    member: 'none',      pro: 'live' },
  { feature: 'Submit resources',      free: 'none',    member: 'live',      pro: 'live' },
  { feature: 'Author dashboard',      free: 'none',    member: 'none',      pro: 'live' },
  { feature: 'Price alerts',          free: 'none',    member: '10',        pro: 'Unlimited' },
  { feature: 'Hosted MCP gateway',    free: 'none',    member: 'none',      pro: 'soon' },
  { feature: 'Secrets vault',         free: 'none',    member: 'none',      pro: 'soon' },
  { feature: 'Read-only JSON API',    free: 'none',    member: 'none',      pro: 'live' },
  { feature: 'Compare resources',     free: '4 max',   member: '4 max',     pro: '6 max' },
] as const;

function ComparisonCell({ value }: { value: Cell }): ReactElement {
  if (value === 'live') {
    return (
      <span className="inline-flex items-center justify-center text-mint">
        <Icon.Check size={18} aria-label="Included" />
      </span>
    );
  }
  if (value === 'none') {
    return <span className="text-text-secondary">—</span>;
  }
  if (value === 'soon') {
    return (
      <span className="font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary">
        Coming Q3 2026
      </span>
    );
  }
  return <span className="font-mono text-[11px] uppercase tracking-[1px] text-white">{value}</span>;
}

// ---------------------------------------------------------------------------
// FAQ data.
// ---------------------------------------------------------------------------

const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Is the directory free?',
    a: 'Yes. Browsing every resource — components, MCPs, models, agents, prompts — is free and requires no account. Sign up as a Member (also free) to bookmark, track stacks, and submit your own resources.',
  },
  {
    q: "What's the gateway?",
    a: 'The hosted MCP gateway lets you point any MCP-capable client (Cursor, Claude Code, Windsurf) at a single URL and get authenticated, rate-limited access to every MCP in the directory — no per-server install dance. Shipping in Q3 2026 for Pro members.',
  },
  {
    q: 'When do Pro features ship?',
    a: 'Everything marked with a check is live today. The hosted MCP gateway and secrets vault are scheduled for Q3 2026. Your $99 locks the price for life.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Pro is annual, but you can cancel renewal from your settings at any time. Your access continues until the end of the paid period.',
  },
  {
    q: "What's the refund policy?",
    a: '14-day money-back, no questions asked. Email us within 14 days of purchase and we refund the full $99.',
  },
];

// ---------------------------------------------------------------------------
// Page.
// ---------------------------------------------------------------------------

export default function PricingPage(): ReactElement {
  return (
    <>
      {/* HERO */}
      <section className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-4">
          PRICING
        </p>
        <h1 className="font-display uppercase text-white leading-[0.88] tracking-[0.5px] mb-6 text-[clamp(48px,9vw,128px)]">
          Free to browse.
          <br />
          <span className="text-mint">Pro to unlock.</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Membership is free — bookmark, submit, and track stacks without paying a cent. Pro
          ($99/yr) unlocks <span className="text-white">$4.2M+ in active deals</span>, the
          hosted MCP gateway, the secrets vault, unlimited price alerts, and a read-only JSON
          API.
        </p>
      </section>

      {/* PRICE CARDS */}
      <section className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
        <PricingClient />
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-4">
          COMPARE
        </p>
        <h2 className="font-display uppercase text-white text-4xl md:text-5xl mb-8 leading-[0.95]">
          What you get at each tier
        </h2>

        <div className="overflow-x-auto border border-surface rounded-tile">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-surface">
                <th className="text-left font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary p-4">
                  Feature
                </th>
                <th className="text-center font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary p-4">
                  Free
                </th>
                <th className="text-center font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-text-secondary p-4">
                  Member
                </th>
                <th className="text-center font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint p-4 bg-mint/5">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-surface last:border-b-0">
                  <td className="p-4 text-white text-sm">{row.feature}</td>
                  <td className="p-4 text-center"><ComparisonCell value={row.free} /></td>
                  <td className="p-4 text-center"><ComparisonCell value={row.member} /></td>
                  <td className="p-4 text-center"><ComparisonCell value={row.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Money-back guarantee callout */}
        <div className="mt-8 bg-mint/5 border border-mint-border rounded-tile p-5">
          <p className="text-white text-sm mb-2">
            Try Pro risk-free. If the gateway, deals, or API don&apos;t pay for themselves in two
            weeks, we&apos;ll refund every cent.
          </p>
          <p className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint">
            14-day money-back, no questions asked
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-4">
          FAQ
        </p>
        <h2 className="font-display uppercase text-white text-4xl md:text-5xl mb-8 leading-[0.95]">
          Questions, answered
        </h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border border-surface rounded-tile bg-surface/30 open:bg-surface/50 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 list-none">
                <span className="font-display uppercase text-white text-xl tracking-[0.5px]">
                  {item.q}
                </span>
                <span className="text-mint transition-transform group-open:rotate-45 shrink-0">
                  <Icon.Plus size={20} />
                </span>
              </summary>
              <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] text-text-secondary mb-4">
            Still have questions?
          </p>
          <Link
            href="/"
            className="font-mono uppercase tracking-[1.5px] text-[12px] font-bold text-mint hover:underline"
          >
            Back to the directory →
          </Link>
        </div>
      </section>
    </>
  );
}
