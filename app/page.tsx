// Placeholder home page — Server Component.
//
// Boot Step 11 milestone: lets the dev server render the layout chrome
// (header, footer, mobile nav, stack banner) so visual progress is verifiable
// in the browser before any real Phase 1 page slices land. Will be replaced
// by Slice F (Foundation: landing + home) in Session 5.

import type { ReactElement } from 'react';

export default function HomePage(): ReactElement {
  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-12">
      <div className="bg-canvas border border-surface rounded-tile p-8">
        <p className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint mb-4">
          BOOT STEP 11 · CHROME PREVIEW
        </p>
        <h1 className="font-display text-[60px] leading-[0.95] text-white mb-4">
          Layout shell wired.
        </h1>
        <p className="text-text-secondary text-[14px] leading-[1.6] max-w-prose">
          Header, mega-menu, mobile nav, footer, and stack banner render from
          their token-driven components. Page content lands in Session 5 with
          the Foundation slice (landing + home + AuthModal + Stack Picker).
        </p>
      </div>
    </div>
  );
}
