// Static code-snippet preview block. Used as the Zone-5 tab content on
// /components, /prompts, /rules — anywhere we want the user to see the
// payload up front. Sandpack live playground deferred to Phase 2 (KNOWN_ISSUES).

import type { ReactElement } from 'react';

interface Props {
  code: string;
  language?: string;
}

export function CodeSnippetPreview({ code, language }: Props): ReactElement {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          {language ? `SNIPPET · ${language.toUpperCase()}` : 'SNIPPET'}
        </p>
        <p className="font-mono text-[10px] text-text-secondary">
          Live playground lands Phase 2
        </p>
      </div>
      <pre
        className="bg-canvas-deep border border-surface rounded-md p-5 overflow-auto font-mono text-[13px] leading-[1.6] text-text-muted whitespace-pre"
      >
        {code}
      </pre>
    </div>
  );
}
