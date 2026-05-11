'use client';

// StackPicker — captures the user's AI clients + tech-stack tags, persists
// via the StackProvider (cookie `vch_stack`, ~6 month TTL). Shows 6 curated
// presets above the fold so most users can finish in one click.
//
// Reference: docs/planning/promptkit-recon/src/overlays.jsx StackPicker.

import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn/cn';
import {
  useStack,
  type ActiveStack,
} from '@/components/stack-context/StackProvider';
import {
  AI_CLIENTS,
  STACK_PRESETS,
  STACK_TAGS,
  type StackPreset,
} from '@/lib/stack/presets';

interface StackPickerProps {
  onClose: () => void;
}

function deriveLabel(clients: string[], tags: string[]): string {
  const top = [clients[0], tags[0], tags[1]].filter(Boolean).join(' · ');
  return top || 'Custom stack';
}

export function StackPicker({ onClose }: StackPickerProps): React.ReactElement {
  const { stack, setStack } = useStack();
  const [clients, setClients] = React.useState<string[]>(stack?.aiClients ?? []);
  const [tags, setTags] = React.useState<string[]>(stack?.techStack ?? []);

  const toggle = <T,>(list: T[], item: T): T[] =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const applyPreset = (p: StackPreset): void => {
    setClients(p.aiClients);
    setTags(p.techStack);
  };

  const save = (): void => {
    const next: ActiveStack = {
      id: null,
      label: deriveLabel(clients, tags),
      aiClients: clients,
      techStack: tags,
    };
    setStack(next);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent width={760}>
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
              YOUR SETUP
            </p>
            <p className="font-mono uppercase tracking-[1.6px] text-[9px] font-bold text-[#b69dff] px-2 py-0.5 border border-ultraviolet rounded-xs">
              FILTERS EVERY LIST + RECOMMENDATION
            </p>
          </div>
          <DialogTitle className="text-[clamp(40px,5vw,52px)]">
            What&rsquo;s your stack?
          </DialogTitle>
          <p className="text-text-secondary text-[14px] leading-[1.5] max-w-[480px]">
            Pick a preset or build your own. We&rsquo;ll tailor every list,
            install command, and recommendation to match.
          </p>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-6">
          {/* Presets — above the fold */}
          <section className="flex flex-col gap-3">
            <h3 className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
              POPULAR STACKS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STACK_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={cn(
                    'text-left p-3 rounded-md border bg-canvas',
                    'transition-colors duration-base ease-out cursor-pointer',
                    'hover:border-mint',
                    JSON.stringify(p.aiClients.slice().sort()) ===
                      JSON.stringify(clients.slice().sort()) &&
                      JSON.stringify(p.techStack.slice().sort()) ===
                        JSON.stringify(tags.slice().sort())
                      ? 'border-mint'
                      : 'border-surface',
                  )}
                >
                  <div className="font-sans font-bold text-[14px] text-white mb-1">
                    {p.label}
                  </div>
                  <div className="font-mono uppercase tracking-[1.2px] text-[9px] text-text-secondary">
                    {p.aiClients[0]} · {p.techStack.slice(0, 3).join(' · ')}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* AI clients */}
          <section className="flex flex-col gap-3">
            <h3 className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
              AI CLIENT(S)
            </h3>
            <div className="flex flex-wrap gap-2">
              {AI_CLIENTS.map((c) => {
                const on = clients.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClients(toggle(clients, c))}
                    aria-pressed={on}
                    className={cn(
                      'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
                      'h-btn-sm px-[14px] rounded-pill border cursor-pointer',
                      'transition-colors duration-base ease-out',
                      on
                        ? 'bg-mint text-black border-transparent'
                        : 'bg-transparent text-white border-surface hover:border-white',
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tech stack */}
          <section className="flex flex-col gap-3">
            <h3 className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
              TECH STACK
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {STACK_TAGS.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTags(toggle(tags, t))}
                    aria-pressed={on}
                    className={cn(
                      'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
                      'px-3 py-1.5 rounded-pill border cursor-pointer',
                      'transition-colors duration-base ease-out',
                      on
                        ? 'bg-mint/10 border-mint-border text-mint'
                        : 'bg-transparent text-white border-surface hover:border-white',
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Hardware placeholder — full Hardware Picker is a Phase 2 add */}
          <section className="flex flex-col gap-3">
            <h3 className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
              HARDWARE (FOR LOCAL MODELS)
            </h3>
            <p className="text-text-secondary text-[12px]">
              Hardware capture is a Phase 2 feature — the field will appear here
              once open-weights sizing recommendations ship.
            </p>
          </section>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Skip for now
          </Button>
          <Button variant="primary" onClick={save} disabled={!clients.length && !tags.length}>
            Save my stack →
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
