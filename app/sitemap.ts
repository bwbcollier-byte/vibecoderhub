// Dynamic sitemap. Phase 1: marketing + indexable directory pages + every
// detail page sourced from the live query layer (with fallback to seed when
// DB is unavailable — queries return [] gracefully).

import type { MetadataRoute } from 'next';

import { listModelSlugs } from '@/lib/db/queries/models';
import { listMcpSlugs } from '@/lib/db/queries/mcps';
import { listDeals } from '@/lib/db/queries/deals';
import { listNewsSlugs } from '@/lib/db/queries/news';
import { listGuideSlugs } from '@/lib/db/queries/guides';
import { listUseCaseSlugs } from '@/lib/db/queries/best-for';
import { listResourceSlugs } from '@/lib/db/queries/resources';
import { listDesignSystemSlugs } from '@/lib/db/queries/design-systems';
import * as Configs from '@/lib/seed/_configs';
import type { GenericResource, GenericTypeConfig } from '@/lib/seed/generic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { url: '/best-for',  changeFrequency: 'weekly'  as const, priority: 0.7 },
    { url: '/pricing',   changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: '/design-systems', changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: '/about',     changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: '/terms',     changeFrequency: 'yearly'  as const, priority: 0.2 },
    { url: '/privacy',   changeFrequency: 'yearly'  as const, priority: 0.2 },
  ];

  const modelSlugs = await listModelSlugs();
  const modelDetailPaths = modelSlugs.map((slug) => ({
    url: `/models/${slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const mcpSlugs = await listMcpSlugs();
  const mcpDetailPaths = mcpSlugs.map((slug) => ({
    url: `/mcps/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const designSystemSlugs = await listDesignSystemSlugs();
  const designSystemPaths = designSystemSlugs.map((slug) => ({
    url: `/design-systems/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Walk every generic-type bundle and emit index + detail URLs from queries.
  const genericPaths: Array<{ url: string; changeFrequency: 'weekly'; priority: number }> = [];
  for (const value of Object.values(Configs) as Array<{
    items: GenericResource[];
    config: GenericTypeConfig;
  }>) {
    if (!value?.config?.basePath) continue;
    genericPaths.push({
      url: `/${value.config.basePath}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
    const slugs = await listResourceSlugs(value.config.typeId);
    for (const slug of slugs) {
      genericPaths.push({
        url: `/${value.config.basePath}/${slug}`,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  const deals = await listDeals();
  const dealsPaths = [
    { url: '/deals', changeFrequency: 'weekly' as const, priority: 0.7 },
    ...deals.map((d) => ({
      url: `/deals/${d.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];

  const newsSlugs = await listNewsSlugs();
  const newsPaths = [
    { url: '/news', changeFrequency: 'hourly' as const, priority: 0.7 },
    ...newsSlugs.map((slug) => ({
      url: `/news/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];

  const guideSlugs = await listGuideSlugs();
  const guidePaths = [
    { url: '/guides', changeFrequency: 'weekly' as const, priority: 0.7 },
    ...guideSlugs.map((slug) => ({
      url: `/guides/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];

  const useCaseSlugs = await listUseCaseSlugs();
  const bestForPaths = useCaseSlugs.map((slug) => ({
    url: `/best-for/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPaths,
    ...modelDetailPaths,
    ...mcpDetailPaths,
    ...designSystemPaths,
    ...genericPaths,
    ...dealsPaths,
    ...newsPaths,
    ...guidePaths,
    ...bestForPaths,
  ].map((entry) => ({
    ...entry,
    url: `${SITE_URL}${entry.url}`,
    lastModified: now,
  }));
}
