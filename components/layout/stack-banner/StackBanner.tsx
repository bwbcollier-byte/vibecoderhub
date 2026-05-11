'use client';

import * as React from 'react';

import { Icon } from '@/components/icons/Icon';
import { useStack } from '@/components/stack-context/StackProvider';

/**
 * Mobile-only sticky strip surfacing the active stack — gives logged-out
 * mobile users a hint that "for your stack" filtering is on, with an Edit
 * shortcut to the Stack Picker.
 */
export function StackBanner(): React.ReactElement | null {
  const { stack, clearStack } = useStack();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || !stack || !stack.label) return null;

  return (
    <div
      className="hide-desktop bg-mint/5 border-b border-mint-border px-4 py-2.5"
      role="status"
    >
      <div className="flex items-center gap-2">
        <Icon.Layers size={12} stroke="currentColor" className="text-mint" />
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint flex-1 truncate">
          STACK · {stack.label}
        </span>
        <button
          type="button"
          className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint cursor-pointer"
          onClick={() => clearStack()}
        >
          EDIT →
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="text-text-secondary cursor-pointer"
        >
          <Icon.Close size={12} />
        </button>
      </div>
    </div>
  );
}
