// Per-kind RSS — /news/feed/releases.rss, /news/feed/breaking.rss, etc.
// 404s on unknown kinds.

import { listNews } from '@/lib/db/queries/news';
import { NEWS_KIND_LABELS, type NewsKind } from '@/lib/seed/news';

import { renderRssFeed } from '../../feed.rss/_render';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 600;

export async function generateStaticParams(): Promise<{ kind: string }[]> {
  return (Object.keys(NEWS_KIND_LABELS) as NewsKind[]).map((k) => ({ kind: `${k}.rss` }));
}

interface Params {
  params: Promise<{ kind: string }>;
}

export async function GET(_req: Request, { params }: Params): Promise<Response> {
  const { kind: rawKind } = await params;
  const kind = rawKind.replace(/\.rss$/, '') as NewsKind;

  if (!NEWS_KIND_LABELS[kind]) {
    return new Response('Unknown news kind', { status: 404 });
  }

  const allItems = await listNews();
  const items = allItems.filter((n) => n.kind === kind);
  const xml = renderRssFeed({
    title: `Vibe Coder Hub — ${NEWS_KIND_LABELS[kind]}`,
    description: `${NEWS_KIND_LABELS[kind]} news from Vibe Coder Hub.`,
    selfUrl: `${SITE_URL}/news/feed/${kind}.rss`,
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
