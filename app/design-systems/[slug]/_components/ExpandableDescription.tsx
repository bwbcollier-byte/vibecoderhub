'use client';

import * as React from 'react';

import { cn } from '@/lib/shadcn/cn';

interface Props {
  text: string;
}

const CLAMP_THRESHOLD = 280;

export function ExpandableDescription({ text }: Props): React.ReactElement {
  const [expanded, setExpanded] = React.useState(false);
  const showToggle = text.length >= CLAMP_THRESHOLD;

  return (
    <div className="flex flex-col gap-2 max-w-prose">
      <p
        className={cn(
          'text-text-body text-[18px] leading-[1.5]',
          showToggle && !expanded && 'line-clamp-3',
        )}
      >
        {text}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((s) => !s)}
          className="self-start cursor-pointer font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint hover:text-link-hover transition-colors duration-base ease-out"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
