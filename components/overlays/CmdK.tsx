'use client';

// Cmd-K palette. Built on `cmdk` (kbar / cmdk by pacocoursey) which handles
// arrow-key navigation, fuzzy filtering, focus trap, and a11y semantics for
// us. We layer on:
//   - results from every resource type in `lib/seed/_configs` + models, MCPs,
//     deals, news, guides
//   - per-row TypeBadge so users can tell a `component` from a `skill`
//   - results grouped by type when multiple types match
//   - action commands via `>` prefix
//   - recent items via localStorage (key: vch_cmdk_recent, last 6 slugs)
//
// Reference: docs/planning/promptkit-recon/src/overlays.jsx CmdK.

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/shadcn/cn';
import { listModels } from '@/lib/seed/models';
import { listMcps } from '@/lib/seed/mcps';
import { listDeals } from '@/lib/seed/deals';
import { listNews } from '@/lib/seed/news';
import { listGuides } from '@/lib/seed/guides';
import * as Configs from '@/lib/seed/_configs';
import type { GenericResource, GenericTypeConfig } from '@/lib/seed/generic';
import { useStack } from '@/components/stack-context/StackProvider';
import { signOut } from '@/lib/auth/client';
import { colors } from '@/lib/tokens';

interface CmdKProps {
  onClose: () => void;
  onOpenStackPicker: () => void;
}

interface SearchEntry {
  /** Unique key across the whole index. */
  id: string;
  /** Display label shown bold in the row. */
  label: string;
  /** Sub-label / metadata; used as the right-aligned dim text. */
  meta?: string;
  /** Concatenated searchable text; cmdk uses this for fuzzy filtering. */
  value: string;
  /** Section / group label this entry belongs to. */
  groupLabel: string;
  /** Glyph + tint for the TypeBadge on the left. */
  glyph: string;
  tint: string;
  /** Target href the row navigates to. */
  href: string;
}

interface RecentEntry {
  id: string;
  label: string;
  groupLabel: string;
  href: string;
  glyph: string;
  tint: string;
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
    const current = readRecent().filter((r) => r.id !== entry.id);
    const next = [entry, ...current].slice(0, RECENT_LIMIT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* localStorage may be disabled (Safari private mode) — silently ignore */
  }
}

// ── Build the unified search index ───────────────────────────────────────
//
// Pulls from every seed bundle in `_configs` + the type-specific seeds
// (models, MCPs, deals, news, guides) so the palette searches the entire
// directory. Returns entries in groups so rows render under the right
// section heading and stay legible when many types match at once.

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];

  // Models — typed shape, mint glyph from registry.
  for (const m of listModels()) {
    out.push({
      id: `model:${m.slug}`,
      label: m.name,
      meta: `$${m.blendedCostPerMtok.toFixed(2)}/Mtok`,
      value: `${m.name} ${m.provider} ${m.tags.join(' ')}`,
      groupLabel: 'Models',
      glyph: '◯',
      tint: colors.tilePurple,
      href: `/models/${m.slug}`,
    });
  }

  // MCPs.
  for (const x of listMcps()) {
    out.push({
      id: `mcp:${x.slug}`,
      label: x.name,
      meta: `${x.toolCount} tools`,
      value: `${x.name} ${x.author} ${x.tagline}`,
      groupLabel: 'MCPs',
      glyph: '⌖',
      tint: colors.tilePurple,
      href: `/mcps/${x.slug}`,
    });
  }

  // Every generic-type bundle (components / skills / rules / subagents /
  // plugins / prompts + the 16 closeout types). Each one is the same shape
  // pulled from `_configs.ts`.
  const bundles = Object.values(Configs) as Array<{
    items: GenericResource[];
    config: GenericTypeConfig;
  }>;
  for (const bundle of bundles) {
    if (!bundle?.config?.basePath) continue;
    for (const r of bundle.items) {
      out.push({
        id: `${bundle.config.typeId}:${r.slug}`,
        label: r.name,
        meta: `★ ${r.ratingAvg.toFixed(1)}`,
        value: `${r.name} ${r.author} ${r.tagline}`,
        groupLabel: bundle.config.plural,
        glyph: bundle.config.glyph,
        tint: colors.tileMint, // default; per-type tint lives in resource-types.ts
        href: `/${bundle.config.basePath}/${r.slug}`,
      });
    }
  }

  // Deals.
  for (const d of listDeals()) {
    out.push({
      id: `deal:${d.slug}`,
      label: d.name,
      meta: `${d.value} · ${d.tier}`,
      value: `${d.name} ${d.provider} ${d.summary} ${d.category}`,
      groupLabel: 'Deals',
      glyph: '$',
      tint: colors.tileYellow,
      href: '/deals',
    });
  }

  // News.
  for (const n of listNews()) {
    out.push({
      id: `news:${n.slug}`,
      label: n.headline,
      meta: n.time,
      value: `${n.headline} ${n.summary} ${n.source}`,
      groupLabel: 'News',
      glyph: '◆',
      tint: colors.tilePink,
      href: `/news/${n.slug}`,
    });
  }

  // Guides.
  for (const g of listGuides()) {
    out.push({
      id: `guide:${g.slug}`,
      label: g.title,
      meta: `${g.duration} · ${g.difficulty}`,
      value: `${g.title} ${g.description} ${g.kind}`,
      groupLabel: 'Guides',
      glyph: '▣',
      tint: colors.tileMint,
      href: `/guides/${g.slug}`,
    });
  }

  return out;
}

// Map group label → sorted list of entries.
function groupBy(entries: SearchEntry[]): Map<string, SearchEntry[]> {
  const groups = new Map<string, SearchEntry[]>();
  for (const entry of entries) {
    if (!groups.has(entry.groupLabel)) {
      groups.set(entry.groupLabel, []);
    }
    groups.get(entry.groupLabel)!.push(entry);
  }
  return groups;
}

// Stable group display order. Anything not in this list trails at the
// bottom alphabetically.
const GROUP_ORDER = [
  'Models',
  'MCPs',
  'Components',
  'Skills',
  'Plugins',
  'Subagents',
  'Rules',
  'Prompts',
  'Commands',
  'Hooks',
  'Workflows',
  'Tools',
  'Starters',
  'Evals',
  'Projects',
  'Sandboxes',
  'Tools', // observability "Tools" label
  'Backends',
  'Assets',
  'Docs',
  'Specs',
  'Stacks',
  'Scripts',
  'Marketplaces',
  'Deals',
  'News',
  'Guides',
];

function sortGroupKeys(keys: string[]): string[] {
  const inOrder = new Set(GROUP_ORDER);
  const ordered = GROUP_ORDER.filter((g) => keys.includes(g));
  const rest = keys.filter((k) => !inOrder.has(k)).sort();
  return [...new Set([...ordered, ...rest])];
}

export function CmdK({ onClose, onOpenStackPicker }: CmdKProps): React.ReactElement {
  const router = useRouter();
  const { clearStack } = useStack();
  const [query, setQuery] = React.useState('');
  const recent = React.useMemo(() => readRecent(), []);
  const index = React.useMemo(() => buildIndex(), []);
  const groups = React.useMemo(() => groupBy(index), [index]);
  const orderedKeys = React.useMemo(() => sortGroupKeys([...groups.keys()]), [groups]);

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

  const openEntry = (entry: SearchEntry): void => {
    pushRecent({
      id: entry.id,
      label: entry.label,
      groupLabel: entry.groupLabel,
      href: entry.href,
      glyph: entry.glyph,
      tint: entry.tint,
    });
    navigate(entry.href);
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
                  : 'Search every resource, deal, article, guide… (try > for actions)'
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
                  <ResultRow
                    key={`recent-${r.id}`}
                    value={`recent ${r.label}`}
                    glyph={r.glyph}
                    tint={r.tint}
                    kicker={r.groupLabel}
                    label={r.label}
                    onSelect={() => navigate(r.href)}
                  />
                ))}
              </Command.Group>
            )}

            {!isCommand &&
              orderedKeys.map((groupLabel) => {
                const items = groups.get(groupLabel) ?? [];
                if (items.length === 0) return null;
                return (
                  <Command.Group
                    key={groupLabel}
                    heading={groupLabel}
                    className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[1.5px] [&_[cmdk-group-heading]]:text-text-secondary"
                  >
                    {items.map((entry) => (
                      <ResultRow
                        key={entry.id}
                        value={entry.value}
                        glyph={entry.glyph}
                        tint={entry.tint}
                        kicker={entry.groupLabel}
                        label={entry.label}
                        meta={entry.meta}
                        onSelect={() => openEntry(entry)}
                      />
                    ))}
                  </Command.Group>
                );
              })}

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
                value="settings profile"
                trimmed={trimmed}
                isCommand={isCommand}
                kicker="GO"
                label="Open settings"
                onSelect={() => navigate('/settings')}
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

interface ResultRowProps {
  value: string;
  /** Glyph rendered in the type-tinted square chip on the left. */
  glyph: string;
  tint: string;
  /** Section label (Models / MCPs / Components / …) shown as kicker. */
  kicker: string;
  label: string;
  meta?: string;
  onSelect: () => void;
}

function ResultRow({
  value,
  glyph,
  tint,
  kicker,
  label,
  meta,
  onSelect,
}: ResultRowProps): React.ReactElement {
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
      <span
        aria-hidden
        className="inline-flex items-center justify-center w-5 h-5 rounded-sm font-mono font-bold text-[10px] shrink-0"
        style={{ background: `${tint}22`, color: tint }}
      >
        {glyph}
      </span>
      <span className="font-mono uppercase tracking-[1.4px] text-[9px] font-bold text-text-secondary min-w-[68px] truncate">
        {kicker}
      </span>
      <span className="flex-1 text-[14px] text-white truncate">{label}</span>
      {meta && (
        <span className="font-mono text-[11px] text-text-secondary tabular-nums shrink-0">
          {meta}
        </span>
      )}
    </Command.Item>
  );
}

interface ActionRowProps {
  value: string;
  trimmed: string;
  isCommand: boolean;
  kicker: string;
  label: string;
  onSelect: () => void;
}

function ActionRow({
  value,
  trimmed,
  isCommand,
  kicker,
  label,
  onSelect,
}: ActionRowProps): React.ReactElement | null {
  if (isCommand && trimmed && !value.toLowerCase().includes(trimmed.toLowerCase())) {
    return null;
  }
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
    </Command.Item>
  );
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
