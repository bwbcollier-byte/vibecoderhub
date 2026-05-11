'use client';

// Cmd-K palette. Built on `cmdk` (kbar / cmdk by pacocoursey) which handles
// arrow-key navigation, fuzzy filtering, focus trap, and a11y semantics for
// us. We layer on:
//   - type filters via `>models` / `>mcps` prefix
//   - action commands via `>` prefix
//   - recent items via localStorage (key: vch_cmdk_recent, last 6 slugs)
//
// Reference: docs/planning/promptkit-recon/src/overlays.jsx CmdK.

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import { listModels, type ModelDetail } from '@/lib/seed/models';
import { useStack } from '@/components/stack-context/StackProvider';
import { signOut } from '@/lib/auth/client';

interface CmdKProps {
  onClose: () => void;
  onOpenStackPicker: () => void;
}

interface RecentEntry {
  slug: string;
  name: string;
  kind: 'model' | 'mcp';
}

const RECENT_KEY = 'vch_cmdk_recent';
const RECENT_LIMIT = 6;

function readRecent(): RecentEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, RECENT_LIMIT) : [];
  } catch {
    return [];
  }
}

function pushRecent(entry: RecentEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const current = readRecent().filter((r) => r.slug !== entry.slug);
    const next = [entry, ...current].slice(0, RECENT_LIMIT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* localStorage may be disabled (Safari private mode) — silently ignore */
  }
}

export function CmdK({ onClose, onOpenStackPicker }: CmdKProps): React.ReactElement {
  const router = useRouter();
  const { clearStack } = useStack();
  const [query, setQuery] = React.useState('');
  const recent = React.useMemo(() => readRecent(), []);
  const models = React.useMemo(() => listModels(), []);

  // Escape closes (cmdk handles arrow keys + enter on its own).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isCommand = query.startsWith('>');
  const trimmed = query.replace(/^>/, '').trim();

  const navigate = (href: string): void => {
    onClose();
    router.push(href);
  };

  const openModel = (m: ModelDetail): void => {
    pushRecent({ slug: m.slug, name: m.name, kind: 'model' });
    navigate(`/models/${m.slug}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search and commands"
      onClick={onClose}
      className="fixed inset-0 z-popover bg-black/70 flex items-start justify-center pt-[12vh] px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] max-h-[64vh] bg-canvas border border-mint-border rounded-md overflow-hidden flex flex-col shadow-xl"
      >
        <Command label="Search" loop shouldFilter={!isCommand}>
          {/* Search row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface">
            <Icon.Search
              size={16}
              stroke={isCommand ? 'var(--color-ultraviolet)' : 'var(--color-mint)'}
            />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={
                isCommand
                  ? 'Run a command…'
                  : "Search models, MCPs, news… (type > for actions)"
              }
              autoFocus
              className="bg-transparent border-none outline-none text-[16px] text-white flex-1 font-sans"
            />
            {isCommand && (
              <span className="font-mono uppercase tracking-[1.4px] text-[9px] font-bold text-[#b69dff] px-1.5 py-0.5 border border-ultraviolet rounded-xs">
                COMMAND MODE
              </span>
            )}
            <Kbd>ESC</Kbd>
          </div>

          {/* Results list */}
          <Command.List className="overflow-auto flex-1 max-h-[48vh]">
            <Command.Empty className="p-8 text-center text-[13px] text-text-secondary">
              No matches for &ldquo;{query}&rdquo;.
            </Command.Empty>

            {!query && recent.length > 0 && (
              <Command.Group
                heading="Recent"
                className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[1.5px] [&_[cmdk-group-heading]]:text-text-secondary"
              >
                {recent.map((r) => (
                  <Row
                    key={`recent-${r.slug}`}
                    value={`recent ${r.name}`}
                    kicker={r.kind.toUpperCase()}
                    label={r.name}
                    onSelect={() => navigate(`/${r.kind === 'model' ? 'models' : 'mcps'}/${r.slug}`)}
                  />
                ))}
              </Command.Group>
            )}

            {!isCommand && (
              <Command.Group
                heading="Models"
                className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[1.5px] [&_[cmdk-group-heading]]:text-text-secondary"
              >
                {models.map((m) => (
                  <Row
                    key={m.slug}
                    value={`${m.name} ${m.provider} ${m.tags.join(' ')}`}
                    kicker="MODEL"
                    label={m.name}
                    meta={`$${m.blendedCostPerMtok.toFixed(2)}/Mtok`}
                    onSelect={() => openModel(m)}
                  />
                ))}
              </Command.Group>
            )}

            {/* Actions — always visible. Filtered by cmdk's internal search
                when not in command mode; manually filtered when in command
                mode so the > prefix is stripped before matching. */}
            <Command.Group
              heading={isCommand ? 'Commands' : 'Actions'}
              className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[1.5px] [&_[cmdk-group-heading]]:text-text-secondary"
            >
              <ActionRow
                value="update stack picker"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="STACK"
                label="Update my stack"
                onSelect={() => {
                  onOpenStackPicker();
                }}
              />
              <ActionRow
                value="submit resource new"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="NEW"
                label="Submit a resource"
                onSelect={() => navigate('/submit')}
              />
              <ActionRow
                value="dashboard account"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="GO"
                label="Open my dashboard"
                onSelect={() => navigate('/dashboard')}
              />
              <ActionRow
                value="deals startup credits"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="GO"
                label="Browse all deals"
                onSelect={() => navigate('/deals')}
              />
              <ActionRow
                value="clear my stack"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="STACK"
                label="Clear my stack"
                onSelect={() => {
                  clearStack();
                  onClose();
                }}
              />
              <ActionRow
                value="sign out logout auth"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="AUTH"
                label="Sign out"
                onSelect={() => {
                  void signOut('/');
                  onClose();
                }}
              />
            </Command.Group>
          </Command.List>

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-surface flex-wrap">
            <Hint>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate
            </Hint>
            <Hint>
              <Kbd>↵</Kbd> open
            </Hint>
            <Hint>
              <Kbd>esc</Kbd> close
            </Hint>
            <span className="ml-auto font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
              Vibe Coder Hub · ⌘K
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

// ── Row primitives ──────────────────────────────────────────────────────────

interface RowProps {
  value: string; // cmdk filter key
  kicker: string;
  label: string;
  meta?: string;
  onSelect: () => void;
}

function Row({ value, kicker, label, meta, onSelect }: RowProps): React.ReactElement {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={cn(
        'px-4 py-2.5 flex items-center gap-3 cursor-pointer',
        'data-[selected=true]:bg-mint/5 data-[selected=true]:border-l-2 data-[selected=true]:border-mint',
        'border-l-2 border-transparent',
      )}
    >
      <span className="font-mono uppercase tracking-[1.5px] text-[9px] font-bold text-mint min-w-[44px]">
        {kicker}
      </span>
      <span className="flex-1 text-[14px] text-white truncate">{label}</span>
      {meta && (
        <span className="font-mono text-[11px] text-text-secondary tabular-nums">{meta}</span>
      )}
    </Command.Item>
  );
}

// In command mode (>foo) cmdk's internal filter doesn't see the > so we mount
// the row conditionally on a manual substring match against the trimmed query.
interface ActionRowProps extends RowProps {
  trimmed: string;
  isCommand: boolean;
}

function ActionRow({
  value,
  trimmed,
  isCommand,
  ...rest
}: ActionRowProps): React.ReactElement | null {
  if (isCommand && trimmed && !value.toLowerCase().includes(trimmed.toLowerCase())) {
    return null;
  }
  return <Row value={value} {...rest} />;
}

// ── UI primitives ───────────────────────────────────────────────────────────

function Kbd({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 bg-[#0a0a0a] border border-surface rounded-sm font-mono text-[10px] text-text-muted">
      {children}
    </kbd>
  );
}

function Hint({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">{children}</span>
  );
}

// Link is unused for now; keeping the import-friendly path so future entries
// (e.g. real news / guide items) can use Link wrappers without re-importing.
void Link;
