// Site-wide news RSS feed. Per ANSWERS Q2.4: 5 feeds Phase 1 — site-wide
// + 4 of the most-subscribed kinds. The per-kind feed at
// /news/feed/[kind].rss is the generic generator; this one is the
// 'all kinds' shortcut at the canonical path.

import { listNews } from '@/lib/db/queries/news';

import { renderRssFeed } from './_render';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 600; // 10 min

export async function GET(): Promise<Response> {
  const items = await listNews();
  const xml = renderRssFeed({
    title: 'Vibe Coder Hub — News',
    description: 'Vibe-coding news, auto-generated and editorially curated.',
    selfUrl: `${SITE_URL}/news/feed.rss`,
    pageUrl: `${SITE_URL}/news`,
    items: items.map((n) => ({
      title: n.headline,
      description: n.summary,
      slug: n.slug,
      categories: [n.kind, ...n.topics],
    })),
  });
  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 's-maxage=600, stale-while-revalidate=86400',
    },
  });
}
