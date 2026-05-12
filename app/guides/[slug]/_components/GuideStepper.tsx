'use client';

import * as React from 'react';

import { cn } from '@/lib/shadcn/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import type { GuideStep } from '@/lib/seed/guides';

interface Props {
  steps: GuideStep[];
}

const COMPLETED_KEY = 'vch_guide_completed';

function readCompleted(slug: string): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(`${COMPLETED_KEY}:${slug}`);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function writeCompleted(slug: string, set: Set<number>): void {
  try {
    window.localStorage.setItem(
      `${COMPLETED_KEY}:${slug}`,
      JSON.stringify([...set]),
    );
  } catch {
    /* private mode — silently ignore */
  }
}

export function GuideStepper({
  steps,
  slug,
}: Props & { slug: string }): React.ReactElement {
  const [active, setActive] = React.useState(0);
  const [completed, setCompleted] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    setCompleted(readCompleted(slug));
  }, [slug]);

  const markComplete = (idx: number): void => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(idx);
      writeCompleted(slug, next);
      return next;
    });
    setActive(Math.min(idx + 1, steps.length - 1));
  };

  const progress = Math.round((completed.size / steps.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
      <aside className="hide-mobile lg:sticky lg:top-[76px] flex flex-col gap-4">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
          PROGRESS · {progress}%
        </p>
        <div className="h-1 bg-surface rounded-xs overflow-hidden">
          <div
            className="h-full bg-mint transition-[width] duration-base ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ul className="flex flex-col">
          {steps.map((s, i) => {
            const isComplete = completed.has(i);
            const isActive = i === active;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex items-center gap-3 w-full text-left',
                    'p-2.5 rounded-sm cursor-pointer',
                    'transition-colors duration-base ease-out',
                    isActive && 'bg-mint/5',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-[18px] h-[18px] rounded-full',
                      'font-mono text-[10px] font-bold shrink-0 border',
                      isComplete
                        ? 'bg-mint border-mint text-black'
                        : 'border-surface text-text-secondary',
                    )}
                  >
                    {isComplete ? '✓' : i + 1}
                  </span>
                  <span
                    className={cn(
                      'text-[13px] flex-1',
                      isComplete && 'text-text-muted',
                      isActive && !isComplete && 'text-white font-bold',
                      !isActive && !isComplete && 'text-text-secondary',
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <article className="flex flex-col gap-6 min-w-0">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
          STEP {active + 1} OF {steps.length}
        </p>
        <h2 className="font-display uppercase leading-[0.95] text-[clamp(32px,5vw,52px)] text-mint">
          {steps[active]?.title}
        </h2>
        <p className="text-text-body text-[17px] leading-[1.7]">
          {steps[active]?.body}
        </p>

        {steps[active]?.verifyCommand && (
          <div className="border border-ultraviolet bg-ultraviolet/5 rounded-tile p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-uv-label">
                VERIFY
              </span>
              <code className="font-mono text-[13px] text-white flex-1 truncate">
                {steps[active]?.verifyCommand}
              </code>
            </div>
            {steps[active]?.verifyExpect && (
              <p className="text-text-secondary text-[12px]">
                Expected: <code className="font-mono text-mint">{steps[active]?.verifyExpect}</code>
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-surface flex-wrap">
          <Button
            variant="ghost"
            disabled={active === 0}
            onClick={() => setActive((i) => Math.max(0, i - 1))}
          >
            <Icon.ArrowRight size={14} className="rotate-180 mr-1" />
            Previous
          </Button>
          <Button variant="primary" onClick={() => markComplete(active)}>
            {active === steps.length - 1 ? 'Mark complete' : 'Mark complete & continue'}
          </Button>
        </div>
      </article>
    </div>
  );
}
