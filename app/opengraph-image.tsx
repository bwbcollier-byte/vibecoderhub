// Default site-wide OG image — 1200×630, Canvas Black, mint accent.
// Used for /, /about, and any route that doesn't ship its own image.
//
// Bebas Neue isn't easily loaded at the Edge — we use heavy Helvetica /
// Impact-style system fallbacks that preserve the brutalist visual
// character without the cold-start cost of fetching a webfont per render.
// When the canonical OG generator gets a custom font asset, swap in
// `{ name: 'Bebas Neue', data: ... }` per the next/og font option.

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Vibe Coder Hub — every primitive a vibe coder needs.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Token literals — OG renders in an isolated Edge runtime that can't read
// our Tailwind / globals.css, so the canonical hex values from
// lib/tokens.ts are inlined here. Keep in sync with TOKEN_RECONCILIATION §2.
const CANVAS = '#131313';
const MINT = '#3cffd0';
const TEXT_META = '#949494';

export default function OgImage(): Response {
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
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: MINT,
            fontWeight: 700,
          }}
        >
          ▣ VIBE CODER HUB · THE DIRECTORY
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontFamily: 'Impact, Helvetica, sans-serif',
              fontSize: 132,
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#fff',
              fontWeight: 900,
            }}
          >
            Every primitive
          </div>
          <div
            style={{
              fontFamily: 'Impact, Helvetica, sans-serif',
              fontSize: 132,
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: MINT,
              fontWeight: 900,
            }}
          >
            a vibe coder needs.
          </div>
        </div>

        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: TEXT_META,
            fontWeight: 700,
          }}
        >
          12,407 RESOURCES · 47 IDES · 120+ MODELS · $4.2M IN DEALS
        </div>
      </div>
    ),
    size,
  );
}
