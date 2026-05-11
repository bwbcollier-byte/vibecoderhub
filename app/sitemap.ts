// Dynamic sitemap. Phase 1: marketing + indexable directory pages + every
// seed-data detail page. Authed-only routes (/admin, /dashboard, /settings)
// are intentionally absent — robots.ts disallows them too.
//
// Once Supabase is wired the seed-import sources flip to live DB queries.
// Sitemap stays unchanged; entries just grow.

import type { MetadataRoute } from 'next';

import { listModels } from '@/lib/seed/models';
import { listMcps } from '@/lib/seed/mcps';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    { url: '/',          changeFrequency: 'daily'   as const, priority: 1.0 },
    { url: '/models',    changeFrequency: 'hourly'  as const, priority: 0.9 },
    { url: '/mcps',      changeFrequency: 'hourly'  as const, priority: 0.9 },
    { url: '/components',changeFrequency: 'daily'   as const, priority: 0.8 },
    { url: '/tools',     changeFrequency: 'daily'   as const, priority: 0.7 },
    { url: '/deals',     changeFrequency: 'weekly'  as const, priority: 0.7 },
    { url: '/news',      changeFrequency: 'hourly'  as const, priority: 0.7 },
    { url: '/guides',    changeFrequency: 'weekly'  as const, priority: 0.7 },
    { url: '/pricing',   changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: '/about',     changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: '/terms',     changeFrequency: 'yearly'  as const, priority: 0.2 },
    { url: '/privacy',   changeFrequency: 'yearly'  as const, priority: 0.2 },
  ];

  const modelDetailPaths = listModels().map((m) => ({
    url: `/models/${m.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const mcpDetailPaths = listMcps().map((m) => ({
    url: `/mcps/${m.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPaths, ...modelDetailPaths, ...mcpDetailPaths].map((entry) => ({
    ...entry,
    url: `${SITE_URL}${entry.url}`,
    lastModified: now,
  }));
}
