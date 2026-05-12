'use client';

// UpgradeModal — fired from any locked surface (a Pro-tier DealCard, the
// gateway placeholder, the API-keys page). Anchors on the specific deal /
// feature that triggered the prompt so the math feels concrete:
// "this single deal pays for Pro Nx over."
//
// Reference: docs/planning/promptkit-recon/src/overlays.jsx UpgradeModal.

import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';

export interface UpgradeContext {
  /** Display name of the locked thing that triggered the prompt. */
  triggerLabel: string;
  /** Dollar value of the triggering deal — used to compute payback math. */
  triggerValueUsd: number;
}

interface Props {
  context: UpgradeContext;
  onClose: () => void;
}

const PRO_ANNUAL_USD = 99;

const PRO_PERKS = [
  '$5K AWS Activate',
  '$10K Vercel Pro',
  '$200K Google Cloud',
  '$150K Microsoft for Startups',
  '+ 47 more deals',
  'Hosted MCP gateway (Phase 2)',
  'Secrets vault (Phase 2)',
  'Unlimited price alerts',
  'Read-only JSON API',
];

export function UpgradeModal({ context, onClose }: Props): React.ReactElement {
  const payback = Math.max(1, Math.floor(context.triggerValueUsd / PRO_ANNUAL_USD));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent width={560}>
        <DialogHeader>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-uv-label">
            UNLOCK PRO
          </p>
          <DialogTitle className="text-[clamp(40px,5vw,60px)]">
            {context.triggerLabel}.
          </DialogTitle>
          <DialogDescription>
            This single deal pays for Pro <span className="text-mint">{payback}×</span> over.
            Plus $4M+ in additional partner deals, gateway access, and unlimited price alerts.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4">
          <div className="bg-canvas border border-surface rounded-tile p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
                  PRO
                </p>
                <p className="font-sans font-bold text-[18px]">${PRO_ANNUAL_USD} / year</p>
                <p className="text-text-secondary text-[12px]">
                  14-day money-back guarantee
                </p>
              </div>
              <Button size="lg" variant="uv">
                Upgrade now →
              </Button>
            </div>
            <ul className="border-t border-surface pt-3 flex flex-col gap-1">
              {PRO_PERKS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] text-text-body">
                  <Icon.Check size={14} stroke="var(--color-mint)" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-text-secondary text-[12px] text-center">
            Member-tier deals stay free with sign-up.
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
