'use client';

import * as React from 'react';

import { Tabs, type TabItem } from '@/components/ui/tabs';
import { Icon } from '@/components/icons/Icon';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/shadcn/cn';
import type {
  DesignSystemDetail,
  PrimaryColor,
} from '@/lib/db/queries/design-systems';

interface Props {
  system: DesignSystemDetail;
}

function hasText(...vals: (string | null | undefined)[]): boolean {
  return vals.some((v) => typeof v === 'string' && v.trim().length > 0);
}

function hasJson(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v as object).length > 0;
  return true;
}

/**
 * Best-effort parse: returns the parsed value if `v` is a string that's
 * valid JSON, the value itself if it's already an object/array, or `null`
 * for everything else (including parse failures + empty strings). The
 * caller decides whether to fall back to rendering the raw string.
 */
function tryParseJson(v: unknown): unknown {
  if (v == null) return null;
  if (typeof v === 'object') return v;
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  if (trimmed.length === 0) return null;
  // Cheap pre-check — only attempt parse on strings that look JSON-ish.
  // Avoids spamming console.warn on `font-family: 'Helvetica', …` declarations.
  if (!/^[[{]/.test(trimmed)) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

interface FontStackEntry {
  name?: string;
  type?: string;
  origin?: string;
  weights?: (number | string)[];
}

interface GradientEntry {
  name?: string;
  value?: string;
}

export function DesignSystemDetailTabs({ system }: Props): React.ReactElement {
  const panels = {
    overview: hasText(
      system.brandDna,
      system.voiceAndTone,
      system.iconographyStyle,
      system.imageryStyle,
    ),
    'system-prompt': hasText(system.systemPrompt),
    'quick-start':   hasText(system.quickStart),
    tokens: hasJson(system.designTokensJson)
      || hasJson(system.typeScale)
      || hasJson(system.spacingScale)
      || hasJson(system.radiusTokens)
      || hasJson(system.shadowTokens)
      || hasJson(system.motionTokens),
    typography: hasText(system.fontStack, system.headingFont, system.bodyFont),
    colours:
      system.primaryColors.length > 0
      || system.secondaryColors.length > 0
      || system.accentColors.length > 0
      || hasText(system.gradientLibrary),
    components: hasText(system.componentExamples, system.templateHtml),
    'voice-tone': hasText(
      system.voiceAndTone,
      system.sampleMicrocopy,
      system.dos,
      system.donts,
    ),
  } as const;

  const items: TabItem[] = [
    panels.overview         && { value: 'overview',       label: 'Overview' },
    panels['system-prompt'] && { value: 'system-prompt',  label: 'System Prompt' },
    panels['quick-start']   && { value: 'quick-start',    label: 'Quick Start' },
    panels.tokens           && { value: 'tokens',         label: 'Tokens' },
    panels.typography       && { value: 'typography',     label: 'Typography' },
    panels.colours          && { value: 'colours',        label: 'Colours' },
    panels.components       && { value: 'components',     label: 'Components' },
    panels['voice-tone']    && { value: 'voice-tone',     label: 'Voice & Tone' },
  ].filter(Boolean) as TabItem[];

  if (items.length === 0) {
    return (
      <p className="text-text-secondary text-[14px]">
        No detailed system documentation available yet.
      </p>
    );
  }

  return (
    <Tabs items={items} defaultValue={items[0]!.value}>
      {(active) => (
        <div className="min-h-[200px]">
          {active === 'overview'      && <Overview system={system} />}
          {active === 'system-prompt' && <CodeBlock label="System Prompt" text={system.systemPrompt ?? ''} />}
          {active === 'quick-start'   && <CodeBlock label="Quick Start"   text={system.quickStart ?? ''} />}
          {active === 'tokens'        && <Tokens system={system} />}
          {active === 'typography'    && <Typography system={system} />}
          {active === 'colours'       && <Colours system={system} />}
          {active === 'components'    && <Components system={system} />}
          {active === 'voice-tone'    && <VoiceTone system={system} />}
        </div>
      )}
    </Tabs>
  );
}

// ──────────────────── Overview ────────────────────

function Overview({ system }: Props): React.ReactElement {
  const rows: { label: string; value: string | null }[] = [
    { label: 'Brand DNA',         value: system.brandDna },
    { label: 'Voice & tone',      value: system.voiceAndTone },
    { label: 'Iconography style', value: system.iconographyStyle },
    { label: 'Imagery style',     value: system.imageryStyle },
  ].filter((r) => hasText(r.value));

  // Inline swatch row — prefer explicit primaryColors, fall back to token colours.
  const tokenColors = parseTokenColors(system.designTokensJson);
  const swatchHexes: string[] = (
    system.primaryColors.length > 0
      ? system.primaryColors.map((c) => c.hex)
      : tokenColors.map((c) => c.hex)
  ).slice(0, 8);

  const meta: { label: string; value: string }[] = [
    { label: 'INDUSTRY',  value: system.industry ?? '—' },
    { label: 'HQ',        value: system.headquarters ?? '—' },
    { label: 'FOUNDED',   value: system.foundedYear != null ? `${system.foundedYear}` : '—' },
    {
      label: 'EMPLOYEES',
      value:
        system.employeeCount != null
          ? system.employeeCount.toLocaleString()
          : '—',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {swatchHexes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {swatchHexes.map((hex, i) => (
            <span
              key={`${hex}-${i}`}
              aria-hidden
              title={hex}
              className="w-8 h-8 rounded-md border border-surface"
              style={{ background: hex }}
            />
          ))}
        </div>
      )}

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-surface py-5">
        {meta.map((m) => (
          <div key={m.label} className="flex flex-col gap-1 min-w-0">
            <dt className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
              {m.label}
            </dt>
            <dd className="text-white text-[15px] truncate" title={m.value}>
              {m.value}
            </dd>
          </div>
        ))}
      </dl>

      {rows.length > 0 && (
        <dl className="flex flex-col gap-5 text-[15px] leading-[1.6] text-text-body">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col gap-1">
              <dt className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
                {r.label}
              </dt>
              <dd className="whitespace-pre-wrap">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

// ──────────────────── Code blocks (System Prompt / Quick Start) ────────────────────

function CodeBlock({ label, text }: { label: string; text: string }): React.ReactElement {
  const onCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          {label}
        </span>
        <button
          type="button"
          onClick={() => {
            void onCopy();
          }}
          className={cn(
            'inline-flex items-center gap-1 cursor-pointer',
            'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
            'rounded-pill px-3 py-1.5 border border-surface text-text-secondary',
            'hover:border-mint hover:text-mint transition-colors duration-base ease-out',
          )}
        >
          <Icon.Copy size={12} />
          Copy
        </button>
      </div>
      <pre className="font-mono text-[13px] whitespace-pre-wrap p-4 bg-canvas-deep border border-surface rounded-md text-text-body overflow-x-auto">
        {text}
      </pre>
    </div>
  );
}

// ──────────────────── Token parsing helpers ────────────────────

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

interface NamedColor { name: string; hex: string }
interface RadiusToken { name: string; px: number }
interface NamedValue { name: string; value: string }
interface TypeRow {
  name: string;
  size: string;
  weight?: string;
  lineHeight?: string;
  tracking?: string;
}

function asString(v: unknown): string | null {
  if (typeof v === 'string') return v;
  return null;
}

function parseRadiusTokens(v: unknown): RadiusToken[] {
  const text = asString(v);
  if (!text) return [];
  const out: RadiusToken[] = [];
  for (const ln of text.split(/\r?\n/)) {
    const m = ln.match(/^\s*([\w-]+)\s*:\s*(\d+)\s*px/i);
    if (m) out.push({ name: m[1]!, px: parseInt(m[2]!, 10) });
  }
  return out;
}

function parseShadowTokens(v: unknown): NamedValue[] {
  const text = asString(v);
  if (!text) return [];
  const out: NamedValue[] = [];
  for (const ln of text.split(/\r?\n/)) {
    const trimmed = ln.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(':');
    if (idx < 0) continue;
    const name = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (name && value) out.push({ name, value });
  }
  return out;
}

function parseSpacingScale(v: unknown): number[] {
  const text = asString(v);
  if (!text) return [];
  // Pull the "4, 8, 12,..." chunk before any parenthetical or descriptor.
  const head = text.split(/[\n(]/)[0] ?? '';
  const nums: number[] = [];
  for (const m of head.matchAll(/\d+/g)) {
    const n = parseInt(m[0], 10);
    if (!Number.isNaN(n)) nums.push(n);
  }
  return nums;
}

function parseMotionTokens(v: unknown): NamedValue[] {
  // Same shape as shadow.
  return parseShadowTokens(v);
}

function parseTypeScale(v: unknown): TypeRow[] {
  const text = asString(v);
  if (!text) return [];
  const out: TypeRow[] = [];
  for (const ln of text.split(/\r?\n/)) {
    const m = ln.match(
      /^\s*([\w-]+)\s*:\s*(\d+(?:\.\d+)?(?:rem|px|em))\b(.*)$/i,
    );
    if (!m) continue;
    const rest = m[3] ?? '';
    const weight = rest.match(/weight\s+(\d{3})/i)?.[1];
    const lh = rest.match(/(?:^|\/)\s*(\d+(?:\.\d+)?)(?:\s*\/|\s*$|\s+weight|\s+tracking)/i)?.[1];
    const tracking = rest.match(/tracking\s+(-?\d+(?:\.\d+)?(?:em|px)?)/i)?.[1];
    out.push({
      name: m[1]!,
      size: m[2]!,
      weight,
      lineHeight: lh,
      tracking,
    });
  }
  return out;
}

function flattenColors(v: unknown, prefix = ''): NamedColor[] {
  const out: NamedColor[] = [];
  if (v == null) return out;
  if (typeof v === 'string') {
    if (HEX_RE.test(v.trim())) out.push({ name: prefix || 'color', hex: v.trim() });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((item, i) => {
      const key = prefix ? `${prefix}-${i}` : String(i);
      if (item && typeof item === 'object' && 'hex' in item && typeof (item as { hex: unknown }).hex === 'string') {
        const name = (item as { name?: unknown }).name;
        out.push({ name: typeof name === 'string' ? name : key, hex: (item as { hex: string }).hex });
      } else {
        out.push(...flattenColors(item, key));
      }
    });
    return out;
  }
  if (typeof v === 'object') {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const next = prefix ? `${prefix}-${k}` : k;
      out.push(...flattenColors(val, next));
    }
    return out;
  }
  return out;
}

function parseTokenColors(v: unknown): NamedColor[] {
  if (v == null || typeof v !== 'object') return [];
  const obj = v as Record<string, unknown>;
  if ('colors' in obj) return flattenColors(obj.colors);
  return [];
}

/**
 * Returns the non-`colors` top-level keys of designTokensJson, stringified
 * for a clean dl. Skips colors (rendered as swatches) and anything not parseable.
 */
// Keys covered by other tabs / sections — never re-render here as a JSON
// dl row inside the Tokens tab. Each one has a dedicated visual elsewhere
// (Typography tab; the per-kind parsed token sections below).
const TOKEN_EXTRA_SKIP = new Set([
  'colors',
  'typography',
  'fonts',
  'font',
  'type',
  'typeScale',
  'type_scale',
  'spacing',
  'spacingScale',
  'spacing_scale',
  'radius',
  'radii',
  'radiusTokens',
  'radius_tokens',
  'shadow',
  'shadows',
  'shadowTokens',
  'shadow_tokens',
  'motion',
  'motionTokens',
  'motion_tokens',
  'gradients',
  'gradientLibrary',
  'gradient_library',
]);

function tokenJsonExtras(v: unknown): { key: string; value: string }[] {
  if (v == null || typeof v !== 'object' || Array.isArray(v)) return [];
  const obj = v as Record<string, unknown>;
  const out: { key: string; value: string }[] = [];
  for (const [k, val] of Object.entries(obj)) {
    if (TOKEN_EXTRA_SKIP.has(k)) continue;
    if (val == null) continue;
    // Only render scalars (string / number / boolean). Nested objects /
    // arrays would dump as raw JSON — skip them rather than leak structure.
    if (typeof val === 'object') continue;
    const str =
      typeof val === 'string'
        ? val
        : String(val);
    if (str.trim().length === 0) continue;
    out.push({ key: k, value: str });
  }
  return out;
}

// ──────────────────── Tokens ────────────────────

function Tokens({ system }: Props): React.ReactElement {
  const tokenColors = parseTokenColors(system.designTokensJson);
  const extras = tokenJsonExtras(system.designTokensJson);
  const typeRows = parseTypeScale(system.typeScale);
  const spacing = parseSpacingScale(system.spacingScale);
  const radii = parseRadiusTokens(system.radiusTokens);
  const shadows = parseShadowTokens(system.shadowTokens);
  const motions = parseMotionTokens(system.motionTokens);

  const sections: React.ReactNode[] = [];

  if (tokenColors.length > 0 || extras.length > 0) {
    sections.push(
      <div key="design-tokens" className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          DESIGN TOKENS
        </span>
        {tokenColors.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {tokenColors.map((c, i) => (
              <div key={`${c.name}-${i}`} className="flex flex-col gap-1.5 items-start">
                <span
                  aria-hidden
                  className="w-20 h-20 rounded-md border border-surface"
                  style={{ background: c.hex }}
                />
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-white">
                  {c.name}
                </span>
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary">
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        )}
        {extras.length > 0 && (
          <dl className="flex flex-col gap-2 mt-2">
            {extras.map((e) => (
              <div key={e.key} className="flex flex-col gap-1 border-b border-surface pb-2">
                <dt className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary">
                  {e.key}
                </dt>
                <dd className="font-mono text-[12px] whitespace-pre-wrap text-text-body">
                  {e.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>,
    );
  }

  if (typeRows.length > 0) {
    const headingStack = system.headingFont ?? system.fontStack ?? undefined;
    sections.push(
      <div key="type-scale" className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          TYPE SCALE
        </span>
        <div className="flex flex-col gap-3">
          {typeRows.map((t, i) => (
            <div key={`${t.name}-${i}`} className="flex items-baseline gap-4 border-b border-surface pb-3">
              <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary w-16 shrink-0">
                {t.name}
              </span>
              <span
                className="text-white"
                style={{
                  fontFamily: headingStack,
                  fontSize: t.size,
                  fontWeight: t.weight ? Number(t.weight) : undefined,
                  lineHeight: t.lineHeight,
                  letterSpacing: t.tracking,
                }}
              >
                Quick brown fox jumps.
              </span>
              <span className="font-mono text-[10px] text-text-secondary ml-auto shrink-0">
                {t.size}
                {t.weight ? ` / ${t.weight}` : ''}
                {t.lineHeight ? ` / ${t.lineHeight}` : ''}
                {t.tracking ? ` / ${t.tracking}` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>,
    );
  }

  if (spacing.length > 0) {
    const max = Math.max(...spacing);
    sections.push(
      <div key="spacing" className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          SPACING SCALE
        </span>
        <div className="flex flex-col gap-2">
          {spacing.map((n, i) => (
            <div key={`${n}-${i}`} className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-text-secondary w-10 shrink-0 text-right">
                {n}
              </span>
              <span
                aria-hidden
                className="bg-mint h-3 max-w-[280px] rounded-sm"
                style={{ width: `${Math.min(n * 2, 280)}px` }}
              />
              <span className="font-mono text-[10px] text-text-secondary">
                {n}px
              </span>
            </div>
          ))}
          <span className="font-mono text-[10px] text-text-secondary">
            scale max: {max}
          </span>
        </div>
      </div>,
    );
  }

  if (radii.length > 0) {
    sections.push(
      <div key="radius" className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          RADIUS TOKENS
        </span>
        <div className="flex flex-wrap gap-4">
          {radii.map((r, i) => (
            <div key={`${r.name}-${i}`} className="flex flex-col gap-1.5 items-start">
              <span
                aria-hidden
                className="w-16 h-16 border border-surface bg-canvas-deep"
                style={{ borderRadius: `${r.px}px` }}
              />
              <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-white">
                {r.name}
              </span>
              <span className="font-mono text-[10px] text-text-secondary">
                {r.px}px
              </span>
            </div>
          ))}
        </div>
      </div>,
    );
  }

  if (shadows.length > 0) {
    sections.push(
      <div key="shadows" className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          SHADOW TOKENS
        </span>
        <div className="flex flex-wrap gap-6">
          {shadows.map((s, i) => (
            <div key={`${s.name}-${i}`} className="flex flex-col gap-1.5 items-start">
              <span
                aria-hidden
                className="w-32 h-20 rounded-md bg-canvas"
                style={{ boxShadow: s.value }}
              />
              <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-white">
                {s.name}
              </span>
              <span className="font-mono text-[10px] text-text-secondary line-clamp-1 max-w-[160px]">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>,
    );
  }

  if (motions.length > 0) {
    sections.push(
      <div key="motion" className="flex flex-col gap-3">
        <style>{`
          @keyframes ds-motion-pulse {
            0%, 100% { opacity: 0.35; transform: scale(0.85); }
            50%      { opacity: 1;    transform: scale(1.15); }
          }
        `}</style>
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          MOTION TOKENS
        </span>
        <div className="flex flex-col gap-2">
          {motions.map((m, i) => {
            const isDuration = /^duration[-_]/i.test(m.name);
            return (
              <div key={`${m.name}-${i}`} className="flex items-center gap-3 border-b border-surface py-2">
                {isDuration ? (
                  <span
                    aria-hidden
                    className="w-6 h-6 rounded-full bg-mint shrink-0"
                    style={{ animation: `ds-motion-pulse ${m.value} ease-in-out infinite` }}
                  />
                ) : (
                  <span aria-hidden className="w-6 h-6 shrink-0" />
                )}
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-white w-40 shrink-0">
                  {m.name}
                </span>
                <span className="font-mono text-[11px] text-text-secondary">
                  {m.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>,
    );
  }

  if (sections.length === 0) {
    return (
      <p className="text-text-secondary text-[14px]">
        No token data available.
      </p>
    );
  }

  return <div className="flex flex-col gap-8">{sections}</div>;
}

// ──────────────────── Typography ────────────────────

const GOOGLE_FONTS = new Set(
  [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Oswald',
    'Source Sans 3',
    'Source Sans Pro',
    'Manrope',
    'Plus Jakarta Sans',
    'Mulish',
    'Karla',
    'IBM Plex Sans',
    'IBM Plex Serif',
    'Playfair Display',
    'Merriweather',
    'Lora',
    'EB Garamond',
    'Cormorant Garamond',
    'Crimson Pro',
    'Inter Tight',
    'JetBrains Mono',
    'Fira Code',
    'Space Grotesk',
    'Space Mono',
  ].map((s) => s.toLowerCase()),
);

/** Pull the first plain family name from a font stack string. */
function firstFontFamily(stack: string | null | undefined): string | null {
  if (!stack) return null;
  const first = stack.split(',')[0]?.trim().replace(/^["']|["']$/g, '');
  return first && first.length > 0 ? first : null;
}

function googleFontHref(name: string | null): string | null {
  if (!name) return null;
  if (!GOOGLE_FONTS.has(name.toLowerCase())) return null;
  const fam = name.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${fam}:wght@400;700&display=swap`;
}

function Typography({ system }: Props): React.ReactElement {
  const headingStack = system.headingFont ?? system.fontStack ?? undefined;
  const bodyStack = system.bodyFont ?? system.fontStack ?? undefined;
  const typeRows = parseTypeScale(system.typeScale);

  const headingFamily = firstFontFamily(system.headingFont) ?? firstFontFamily(system.fontStack);
  const bodyFamily = firstFontFamily(system.bodyFont) ?? firstFontFamily(system.fontStack);
  const headingHref = googleFontHref(headingFamily);
  const bodyHref = googleFontHref(bodyFamily);

  // Signature sample word — first non-empty word from sampleMicrocopy, else system name.
  const sampleWord = (() => {
    const m = (system.sampleMicrocopy ?? '').match(/[A-Za-z][A-Za-z'’-]+/);
    if (m && m[0]) return m[0];
    return system.name;
  })();

  return (
    <div className="flex flex-col gap-8">
      {headingHref && <link rel="stylesheet" href={headingHref} />}
      {bodyHref && bodyHref !== headingHref && (
        <link rel="stylesheet" href={bodyHref} />
      )}

      {headingStack && (
        <div className="flex flex-col gap-3 border-b border-surface pb-6">
          <div
            className="text-white font-bold leading-[0.9] break-words"
            style={{
              fontFamily: headingStack,
              fontSize: 'clamp(64px, 12vw, 160px)',
            }}
          >
            {sampleWord}
          </div>
          {headingFamily && (
            <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
              {headingFamily}
            </span>
          )}
        </div>
      )}

      <dl className="flex flex-col gap-3 text-[14px]">
        <Row label="Heading font" value={system.headingFont} />
        <Row label="Body font"    value={system.bodyFont} />
      </dl>
      <FontStackBlock value={system.fontStack} />

      {headingStack && (
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            HEADING SAMPLE
          </span>
          <p className="text-[36px] leading-tight text-white" style={{ fontFamily: headingStack }}>
            The quick brown fox jumps.
          </p>
        </div>
      )}
      {bodyStack && (
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            BODY SAMPLE
          </span>
          <p
            className="text-[16px] leading-[1.6] text-text-body max-w-prose"
            style={{ fontFamily: bodyStack }}
          >
            Body text rolls down with calm rhythm — readable at every size, the
            workhorse of the system.
          </p>
        </div>
      )}

      {typeRows.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            TYPE SCALE
          </span>
          <div className="flex flex-col gap-3">
            {typeRows.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="flex items-baseline gap-4 border-b border-surface pb-3"
              >
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary w-16 shrink-0">
                  {t.name}
                </span>
                <span
                  className="text-white"
                  style={{
                    fontFamily: headingStack ?? bodyStack,
                    fontSize: t.size,
                    fontWeight: t.weight ? Number(t.weight) : undefined,
                    lineHeight: t.lineHeight,
                    letterSpacing: t.tracking,
                  }}
                >
                  Aa Quick brown fox.
                </span>
                <span className="font-mono text-[10px] text-text-secondary ml-auto shrink-0">
                  {t.size}
                  {t.weight ? ` / ${t.weight}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(system.headingFont || system.bodyFont) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <FontSpecCard
            kind="HEADING"
            name={system.headingFont}
            family={headingFamily}
            stack={headingStack}
            rows={typeRows.filter((t) => /h[1-6]|display|heading|title/i.test(t.name))}
          />
          <FontSpecCard
            kind="BODY"
            name={system.bodyFont}
            family={bodyFamily}
            stack={bodyStack}
            rows={typeRows.filter((t) => /body|p|text|caption|small/i.test(t.name))}
          />
        </div>
      )}
    </div>
  );
}

function FontSpecCard({
  kind,
  name,
  family,
  stack,
  rows,
}: {
  kind: string;
  name: string | null;
  family: string | null;
  stack: string | undefined;
  rows: TypeRow[];
}): React.ReactElement {
  return (
    <div className="border border-surface rounded-md p-4 flex flex-col gap-2">
      <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
        {kind}
      </span>
      <span
        className="text-white text-[22px] leading-tight"
        style={{ fontFamily: stack }}
      >
        {family ?? name ?? '—'}
      </span>
      {name && (
        <span className="font-mono text-[11px] text-text-secondary truncate">
          {name}
        </span>
      )}
      {rows.length > 0 && (
        <ul className="flex flex-col gap-1 mt-2 font-mono text-[11px] text-text-secondary">
          {rows.slice(0, 6).map((r, i) => (
            <li key={`${r.name}-${i}`} className="flex justify-between gap-2">
              <span className="uppercase tracking-[1.2px]">{r.name}</span>
              <span>
                {r.size}
                {r.weight ? ` · ${r.weight}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ──────────────────── Colours ────────────────────

function Colours({ system }: Props): React.ReactElement {
  const tokenColors = parseTokenColors(system.designTokensJson);

  return (
    <div className="flex flex-col gap-8">
      <WideSwatchSection label="PRIMARY"   colors={system.primaryColors} />
      <WideSwatchSection label="SECONDARY" colors={system.secondaryColors} />
      <WideSwatchSection label="ACCENTS"   colors={system.accentColors} />
      {tokenColors.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            TOKEN PALETTE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokenColors.map((c, i) => (
              <WideSwatch key={`${c.name}-${i}`} hex={c.hex} name={c.name} />
            ))}
          </div>
        </div>
      )}
      <GradientLibraryBlock value={system.gradientLibrary} />
    </div>
  );
}

/**
 * Approximate luminance per WCAG; picks black text on light swatches, white on
 * dark. Accepts #rgb, #rrggbb, #rrggbbaa. Returns true if light-ish.
 */
function isLightHex(hex: string): boolean {
  const cleaned = hex.replace('#', '').trim();
  let r = 0,
    g = 0,
    b = 0;
  if (cleaned.length === 3) {
    r = parseInt(cleaned[0]! + cleaned[0]!, 16);
    g = parseInt(cleaned[1]! + cleaned[1]!, 16);
    b = parseInt(cleaned[2]! + cleaned[2]!, 16);
  } else if (cleaned.length >= 6) {
    r = parseInt(cleaned.slice(0, 2), 16);
    g = parseInt(cleaned.slice(2, 4), 16);
    b = parseInt(cleaned.slice(4, 6), 16);
  } else {
    return false;
  }
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

function WideSwatch({
  hex,
  name,
}: {
  hex: string;
  name?: string;
}): React.ReactElement {
  const dark = !isLightHex(hex);
  return (
    <div className="flex flex-col gap-2">
      <div
        className="min-h-[120px] rounded-md border border-surface p-4 flex items-end justify-between gap-3"
        style={{ background: hex }}
      >
        <span
          className={cn(
            'font-mono uppercase tracking-[1.2px] text-[12px] font-bold',
            dark ? 'text-white' : 'text-black',
          )}
        >
          {hex}
        </span>
      </div>
      {name && (
        <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary">
          {name}
        </span>
      )}
    </div>
  );
}

function WideSwatchSection({
  label,
  colors,
}: {
  label: string;
  colors: PrimaryColor[];
}): React.ReactElement | null {
  if (colors.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        {label}
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.map((c, i) => (
          <WideSwatch key={`${c.hex}-${i}`} hex={c.hex} name={c.type} />
        ))}
      </div>
    </div>
  );
}

// ──────────────────── Components ────────────────────

function Components({ system }: Props): React.ReactElement {
  const onCopyHtml = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(system.componentExamples ?? '');
      toast.success('Copied!');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {hasText(system.componentExamples) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
              EXAMPLES
            </span>
            <button
              type="button"
              onClick={() => {
                void onCopyHtml();
              }}
              className={cn(
                'inline-flex items-center gap-1 cursor-pointer',
                'font-mono uppercase tracking-[1.2px] text-[10px] font-bold',
                'rounded-pill px-3 py-1.5 border border-surface text-text-secondary',
                'hover:border-mint hover:text-mint transition-colors duration-base ease-out',
              )}
            >
              <Icon.Copy size={12} />
              Copy HTML
            </button>
          </div>
          {/*
           * Trust assumption: componentExamples comes from our editorial Airtable
           * (curated by us), not user submissions, so we render it as raw HTML.
           * If we later accept user-submitted markup here, this MUST be sanitized
           * (e.g. via DOMPurify) before render.
           */}
          <div
            className="bg-canvas-deep border border-surface p-6 rounded-md"
            dangerouslySetInnerHTML={{ __html: system.componentExamples ?? '' }}
          />
        </div>
      )}
      {hasText(system.templateHtml) && (
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            TEMPLATE HTML
          </span>
          <pre className="font-mono text-[12px] whitespace-pre-wrap p-4 bg-canvas-deep border border-surface rounded-md text-text-body overflow-x-auto">
            {system.templateHtml}
          </pre>
        </div>
      )}
    </div>
  );
}

// ──────────────────── Voice & Tone ────────────────────

function VoiceTone({ system }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-[1.6] text-text-body">
      {hasText(system.voiceAndTone) && (
        <Block label="Voice & tone" text={system.voiceAndTone!} />
      )}
      {hasText(system.sampleMicrocopy) && (
        <Block label="Sample microcopy" text={system.sampleMicrocopy!} />
      )}
      {hasText(system.dos) && (
        <BulletBlock label="Do" text={system.dos!} tone="positive" />
      )}
      {hasText(system.donts) && (
        <BulletBlock label="Don't" text={system.donts!} tone="negative" />
      )}
    </div>
  );
}

function Block({ label, text }: { label: string; text: string }): React.ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        {label}
      </span>
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function BulletBlock({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: 'positive' | 'negative';
}): React.ReactElement {
  // Items are lines that begin with "-" (after trim). Other lines render as
  // plain prose inside the block so we don't lose context if the source mixes
  // intro paragraphs with bullets.
  const lines = text.split(/\r?\n/);
  const bullets: string[] = [];
  const prose: string[] = [];
  for (const ln of lines) {
    const trimmed = ln.trim();
    if (trimmed.startsWith('-')) bullets.push(trimmed.replace(/^-\s*/, ''));
    else if (trimmed.length > 0) prose.push(trimmed);
  }

  return (
    <div className="flex flex-col gap-2">
      <span
        className={cn(
          'font-mono uppercase tracking-[1.4px] text-[10px] font-bold',
          tone === 'positive' ? 'text-mint' : 'text-error-red',
        )}
      >
        {label}
      </span>
      {prose.length > 0 && <p className="whitespace-pre-wrap">{prose.join('\n')}</p>}
      {bullets.length > 0 && (
        <ul className="flex flex-col gap-1 list-disc pl-5">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | null;
}): React.ReactElement {
  return (
    <div className="flex justify-between gap-3 border-b border-surface py-2">
      <dt className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </dt>
      <dd className="text-white">{value ?? '—'}</dd>
    </div>
  );
}

/**
 * Font stack renderer — handles both shapes that arrive from Airtable:
 *   1. Plain string (CSS font-family declaration like
 *      `'Helvetica Now Text', 'Inter', system-ui, …`) → render as mono line.
 *   2. JSON array of `{name, type, origin, weights}` objects → render each
 *      entry as a card with name + type/origin badges + weights.
 * Returns null when no usable data so the parent can skip the section.
 */
function FontStackBlock({ value }: { value: string | null }): React.ReactElement | null {
  if (!hasText(value)) return null;
  const parsed = tryParseJson(value);

  if (Array.isArray(parsed) && parsed.length > 0) {
    const entries = parsed as FontStackEntry[];
    return (
      <div className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          FONT STACK
        </span>
        <ul className="flex flex-col gap-2">
          {entries.map((e, i) => (
            <li
              key={`${e.name ?? 'font'}-${i}`}
              className="flex flex-wrap items-center gap-3 border border-surface rounded-md p-3 bg-canvas-deep"
            >
              <span
                className="text-[18px] text-white truncate"
                style={{ fontFamily: e.name ? `"${e.name}", system-ui, sans-serif` : undefined }}
              >
                {e.name ?? '—'}
              </span>
              {e.type && (
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-mint">
                  {e.type}
                </span>
              )}
              {e.origin && (
                <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary">
                  · {e.origin}
                </span>
              )}
              {Array.isArray(e.weights) && e.weights.length > 0 && (
                <span className="font-mono text-[10px] text-text-secondary ml-auto">
                  {e.weights.join(', ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Fallback: real string CSS font-family declaration.
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        FONT STACK
      </span>
      <p className="font-mono text-[12px] text-text-body whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

/**
 * Gradient library renderer — same dual-shape pattern as FontStackBlock.
 *   1. JSON array of `{name, value}` → render each as a wide block with
 *      the actual CSS gradient applied.
 *   2. Plain string (CSS gradient declaration / prose) → render mono.
 */
function GradientLibraryBlock({ value }: { value: string | null }): React.ReactElement | null {
  if (!hasText(value)) return null;
  const parsed = tryParseJson(value);

  if (Array.isArray(parsed) && parsed.length > 0) {
    const entries = parsed as GradientEntry[];
    const usable = entries.filter((e) => typeof e.value === 'string' && e.value.length > 0);
    if (usable.length === 0) return null;
    return (
      <div className="flex flex-col gap-3">
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
          GRADIENT LIBRARY
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usable.map((g, i) => (
            <div
              key={`${g.name ?? 'gradient'}-${i}`}
              className="flex flex-col gap-2"
            >
              <div
                aria-hidden
                className="min-h-[120px] rounded-md border border-surface"
                style={{ background: g.value }}
              />
              <div className="flex flex-col gap-1">
                {g.name && (
                  <span className="font-mono uppercase tracking-[1.2px] text-[11px] font-bold text-white">
                    {g.name}
                  </span>
                )}
                <span className="font-mono text-[10px] text-text-secondary break-all">
                  {g.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        GRADIENT LIBRARY
      </span>
      <p className="font-mono text-[12px] text-text-body whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}
