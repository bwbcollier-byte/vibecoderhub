// Per-model OG image — 1200×630. Provider eyebrow + model name + price +
// stat strip (intelligence / speed / context).
//
// Inlines hex literals because Edge ImageResponse runs without our CSS
// cascade. Values match lib/tokens.ts verbatim per TOKEN_RECONCILIATION §2.

import { ImageResponse } from 'next/og';

import { getModelBySlug, listModelSlugs } from '@/lib/db/queries/models';

export const alt = 'Model · Vibe Coder Hub';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CANVAS = '#131313';
const MINT = '#3cffd0';
const TEXT_META = '#949494';
const SURFACE = '#2d2d2d';

// Pre-render at build time for every seed slug.
export async function generateImageMetadata(): Promise<Array<{ id: string }>> {
  const slugs = await listModelSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

interface Props {
  params: { slug: string };
}

function formatContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toLocaleString();
}

export default async function ModelOg({ params }: Props): Promise<Response> {
  const model = await getModelBySlug(params.slug);
  if (!model) {
    return new ImageResponse(
      <div style={{ background: CANVAS, color: '#fff', width: '100%', height: '100%' }} />,
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: CANVAS,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: TEXT_META,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: 'flex',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              background: model.providerColor,
              color: '#000',
              borderRadius: 4,
              fontSize: 16,
            }}
          >
            {model.provider
              .split(/\s+/)
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <span>◯ MODEL · {model.provider.toUpperCase()}</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: 'Impact, Helvetica, sans-serif',
            fontSize: 156,
            lineHeight: 0.92,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#fff',
            fontWeight: 900,
          }}
        >
          {model.name}.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 48,
            alignItems: 'flex-end',
            borderTop: `1px solid ${SURFACE}`,
            paddingTop: 28,
          }}
        >
          <Stat label="BLENDED" value={`$${model.blendedCostPerMtok.toFixed(2)}`} accent />
          <Stat label="INTELLIGENCE" value={`#${model.intelligenceIndex}`} />
          <Stat label="SPEED" value={`${model.outputTokensPerSecond} t/s`} />
          <Stat label="CONTEXT" value={formatContext(model.contextWindowAdvertised)} />
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: MINT,
              fontWeight: 700,
              display: 'flex',
            }}
          >
            VIBECODERHUB.COM
          </span>
        </div>
      </div>
    ),
    size,
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: TEXT_META,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 36,
          fontWeight: 700,
          color: accent ? MINT : '#fff',
        }}
      >
        {value}
      </span>
    </div>
  );
}
