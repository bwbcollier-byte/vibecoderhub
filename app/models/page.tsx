// /models — directory index. Server Component.
//
// Slice S01a (Session 5). Renders the model directory chrome (hero + count
// + submit CTA) and hands the live list down to a Client Component that
// owns search / sort / filter state.
//
// Data: `lib/seed/models.ts` for now. When Supabase is connected the import
// flips to `lib/queries/models.ts` (same shape) and nothing else changes.

import type { ReactElement } from 'react';

import { listModels } from '@/lib/seed/models';

import { ModelsList } from './_components/ModelsList';

export const metadata = {
  title: 'Models · Vibe Coder Hub',
  description:
    'Every frontier model ranked by intelligence, cost, speed, and context. Price drops surfaced live.',
};

export default function ModelsIndexPage(): ReactElement {
  const models = listModels();

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      {/* Hero */}
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
            ◯ · {models.length.toLocaleString()} INDEXED
          </p>
          <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,10vw,128px)]">
            Models.
          </h1>
        </div>
      </header>

      <ModelsList initialModels={models} />
    </div>
  );
}
