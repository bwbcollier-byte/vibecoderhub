// Favicon — mint "V" on dark canvas. Generated via ImageResponse so the
// brand mark stays in lockstep with the locked palette in lib/tokens.ts.

import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const CANVAS = '#131312';
const MINT = '#3cffd0';

export default function Icon(): Response {
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
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '-1px',
          borderRadius: 4,
        }}
      >
        V
      </div>
    ),
    size,
  );
}
