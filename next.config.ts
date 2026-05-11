import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ── Image optimisation (per ARCHITECTURE §11) ──────────────────────────
  images: {
    remotePatterns: [
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      // Cloudflare R2
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      // Provider logos hosted on their own CDNs (whitelist on demand in Phase C)
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ── Security headers (per ARCHITECTURE) ────────────────────────────────
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Strict-Transport-Security set by Vercel automatically on production
          // CSP set per-route via next-safe-action middleware (TBD Phase C)
        ],
      },
    ];
  },

  // ── Experimental flags ──────────────────────────────────────────────────
  experimental: {
    // Tighter compile mode for Server Actions
    serverActions: {
      bodySizeLimit: '2mb', // larger uploads go via signed URL direct-to-Storage
    },
  },

  // ── Logging ─────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

export default nextConfig;
