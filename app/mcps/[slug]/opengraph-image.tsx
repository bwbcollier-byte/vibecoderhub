// Per-MCP OG image — 1200×630. Author eyebrow + MCP name + surface-area
// strip (tools / resources / prompts).

import { ImageResponse } from 'next/og';

import { getMcpBySlug } from '@/lib/db/queries/mcps';

export const alt = 'MCP · Vibe Coder Hub';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CANVAS = '#131313';
const MINT = '#3cffd0';
const TEXT_META = '#949494';
const SURFACE = '#2d2d2d';

// See note in app/models/[slug]/opengraph-image.tsx — omitting
// generateImageMetadata avoids the multiplicative og:image meta-tag bug.

interface Props {
  params: { slug: string };
}

export default async function McpOg({ params }: Props): Promise<Response> {
  const mcp = await getMcpBySlug(params.slug);
  if (!mcp) {
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
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: MINT,
            fontWeight: 700,
          }}
        >
          ⌖ MCP · {mcp.author.toUpperCase()} · v{mcp.version}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Impact, Helvetica, sans-serif',
              fontSize: 144,
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#fff',
              fontWeight: 900,
            }}
          >
            {mcp.name}.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: TEXT_META,
              lineHeight: 1.3,
            }}
          >
            {mcp.tagline}
          </div>
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
          <Stat label="TOOLS" value={mcp.toolCount.toString()} accent />
          <Stat label="RESOURCES" value={mcp.resourceCount.toString()} />
          <Stat label="PROMPTS" value={mcp.promptCount.toString()} />
          <Stat label="USAGE" value={`${(mcp.installCount7d / 1000).toFixed(1)}k/wk`} />
          <div style={{ flex: 1 }} />
          <span
            style={{
              display: 'flex',
              fontFamily: 'monospace',
              fontSize: 14,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: MINT,
              fontWeight: 700,
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
