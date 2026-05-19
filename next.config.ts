import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ESLint runs separately in CI; pre-existing hex-literal violations are tracked as
  // an open polish task (see audits/2026-05-19-laws-audit.md). Skip during build to
  // unblock prod deploys until the hex → CSS-var migration lands.
  eslint: {
    ignoreDuringBuilds: true,
  },

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

// S6.2 — Sentry wrap. DSN from env.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || 'promptkit',
  project: process.env.SENTRY_PROJECT || 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
