// Apple touch icon — 180×180 mint "V" tile.

import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const CANVAS = '#131312';
const MINT = '#3cffd0';

export default function AppleIcon(): Response {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: CANVAS,
          color: MINT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: 132,
          fontWeight: 800,
          letterSpacing: '-4px',
          borderRadius: 32,
        }}
      >
        V
      </div>
    ),
    size,
  );
}
