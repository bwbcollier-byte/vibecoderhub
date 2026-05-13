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

  return (
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

// ──────────────────── Tokens ────────────────────

function Tokens({ system }: Props): React.ReactElement {
  const sections: { label: string; value: unknown }[] = [
    { label: 'DESIGN TOKENS',  value: system.designTokensJson },
    { label: 'TYPE SCALE',     value: system.typeScale },
    { label: 'SPACING SCALE',  value: system.spacingScale },
    { label: 'RADIUS TOKENS',  value: system.radiusTokens },
    { label: 'SHADOW TOKENS',  value: system.shadowTokens },
    { label: 'MOTION TOKENS',  value: system.motionTokens },
  ].filter((s) => hasJson(s.value));

  return (
    <div className="flex flex-col gap-6">
      {sections.map((s) => (
        <div key={s.label} className="flex flex-col gap-2">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            {s.label}
          </span>
          <pre className="font-mono text-[12px] whitespace-pre-wrap p-4 bg-canvas-deep border border-surface rounded-md text-text-body overflow-x-auto">
            {typeof s.value === 'string' ? s.value : JSON.stringify(s.value, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}

// ──────────────────── Typography ────────────────────

function Typography({ system }: Props): React.ReactElement {
  const headingStack = system.headingFont ?? system.fontStack ?? undefined;
  const bodyStack = system.bodyFont ?? system.fontStack ?? undefined;

  return (
    <div className="flex flex-col gap-6">
      <dl className="flex flex-col gap-3 text-[14px]">
        <Row label="Font stack"   value={system.fontStack} />
        <Row label="Heading font" value={system.headingFont} />
        <Row label="Body font"    value={system.bodyFont} />
      </dl>

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
    </div>
  );
}

// ──────────────────── Colours ────────────────────

function Colours({ system }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <SwatchSection label="PRIMARY"   colors={system.primaryColors} />
      <SwatchSection label="SECONDARY" colors={system.secondaryColors} />
      <SwatchSection label="ACCENTS"   colors={system.accentColors} />
      {hasText(system.gradientLibrary) && (
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            GRADIENT LIBRARY
          </span>
          <pre className="font-mono text-[12px] whitespace-pre-wrap p-4 bg-canvas-deep border border-surface rounded-md text-text-body overflow-x-auto">
            {system.gradientLibrary}
          </pre>
        </div>
      )}
    </div>
  );
}

function SwatchSection({
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
      <div className="flex flex-wrap gap-4">
        {colors.map((c, i) => (
          <div key={`${c.hex}-${i}`} className="flex flex-col gap-1.5 items-start">
            <span
              aria-hidden
              className="w-20 h-20 rounded-md border border-surface"
              style={{ background: c.hex }}
            />
            <span className="font-mono uppercase tracking-[1.2px] text-[10px] text-text-secondary">
              {c.hex}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────── Components ────────────────────

function Components({ system }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {hasText(system.componentExamples) && (
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
            EXAMPLES
          </span>
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
