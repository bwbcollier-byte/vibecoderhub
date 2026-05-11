'use client';

// PricingClient — three-card price grid for /pricing.
//
// Lives in a client component because each CTA fires an overlay action
// (`openUpgrade`, `openAuth`) that requires the OverlaysProvider context.
// The surrounding /pricing page stays a Server Component.

import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { useOverlays } from '@/components/overlays/OverlaysProvider';

interface FeatureLine {
  label: string;
  /** When true, render a muted "Coming Q3 2026" tag inline. */
  comingSoon?: boolean;
}

interface PricingCardProps {
  kicker: string;
  /** Render the kicker in the mint accent (Member) or uv accent (Pro). */
  kickerTone?: 'default' | 'mint' | 'uv';
  price: string;
  priceSub: string;
  blurb: string;
  features: readonly FeatureLine[];
  cta: ReactNode;
  /** Optional outer styling — border accent + recommended badge. */
  recommended?: boolean;
  borderClass?: string;
}

function PricingCard({
  kicker,
  kickerTone = 'default',
  price,
  priceSub,
  blurb,
  features,
  cta,
  recommended,
  borderClass = 'border-surface',
}: PricingCardProps): ReactElement {
  const kickerColor =
    kickerTone === 'mint' ? 'text-mint' : kickerTone === 'uv' ? 'text-ultraviolet' : 'text-text-secondary';

  return (
    <div className="relative flex flex-col">
      {recommended && (
        <p className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint mb-3 text-center">
          ★ RECOMMENDED
        </p>
      )}
      <div
        className={`flex-1 flex flex-col border ${borderClass} rounded-tile bg-surface/30 p-6 md:p-7`}
      >
        <p className={`font-mono uppercase tracking-[1.5px] text-[11px] font-bold ${kickerColor} mb-4`}>
          {kicker}
        </p>
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-display uppercase text-white text-6xl leading-none tracking-[0.5px]">
            {price}
          </span>
          <span className="font-mono uppercase tracking-[1.5px] text-[11px] text-text-secondary">
            {priceSub}
          </span>
        </div>
        <p className="text-text-secondary text-sm mb-6 min-h-[3em]">{blurb}</p>

        <ul className="flex flex-col gap-3 mb-7 flex-1">
          {features.map((f) => (
            <li key={f.label} className="flex items-start gap-2 text-sm">
              <span className="text-mint mt-0.5 shrink-0">
                <Icon.Check size={16} aria-hidden />
              </span>
              <span className="text-white">
                {f.label}
                {f.comingSoon && (
                  <span className="ml-2 font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary">
                    Coming Q3 2026
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {cta}
      </div>
    </div>
  );
}

export function PricingClient(): ReactElement {
  const { openUpgrade, openAuth } = useOverlays();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {/* FREE */}
      <PricingCard
        kicker="FREE · ANONYMOUS"
        price="$0"
        priceSub="forever"
        blurb="Browse the directory and try things out without an account."
        features={[
          { label: 'Browse all resources' },
          { label: 'Cmd-K search' },
          { label: 'Public deals' },
          { label: '5 bookmarks' },
          { label: '1 stack' },
          { label: 'Compare up to 4 resources' },
        ]}
        cta={
          <Link href="/models" className="w-full">
            <Button variant="secondary" size="lg" block>
              Browse free →
            </Button>
          </Link>
        }
      />

      {/* MEMBER */}
      <PricingCard
        kicker="MEMBER"
        price="$0"
        priceSub="/year"
        blurb="Free account. Bookmark, submit, and track stacks across devices."
        features={[
          { label: 'Everything in Free' },
          { label: 'Unlimited bookmarks' },
          { label: '5 stacks' },
          { label: 'Member-only deals' },
          { label: 'Submit your own resources' },
          { label: '10 price alerts' },
        ]}
        cta={
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => openAuth('signup')}
          >
            Sign up free
          </Button>
        }
      />

      {/* PRO — recommended, mint-accented */}
      <PricingCard
        kicker="PRO · 14-DAY FREE TRIAL"
        kickerTone="mint"
        price="$99"
        priceSub="/year"
        blurb="Unlock $4.2M+ in deals, the hosted gateway, and the full API."
        recommended
        borderClass="border-mint-border"
        features={[
          { label: 'Everything in Member' },
          { label: 'Pro deals ($4.2M+ in offers)' },
          { label: 'Author dashboard' },
          { label: 'Unlimited price alerts' },
          { label: 'Read-only JSON API' },
          { label: 'Compare up to 6 resources' },
          { label: 'Hosted MCP gateway', comingSoon: true },
          { label: 'Secrets vault', comingSoon: true },
        ]}
        cta={
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() =>
              openUpgrade({ triggerLabel: 'Pro membership', triggerValueUsd: 99 })
            }
          >
            Start 14-day trial — $99/yr
          </Button>
        }
      />
    </div>
  );
}
