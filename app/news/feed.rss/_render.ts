// Minimal RSS 2.0 renderer. Escapes XML; keeps the feed dumb-spec compliant
// so reader software (NetNewsWire / Feedly / Slack / pg_cron pollers) won't
// choke. Move to `feed`/`@feedjs` if requirements grow (Atom, JSON Feed).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

interface FeedItem {
  title: string;
  description: string;
  slug: string;
  categories?: string[];
  pubDate?: string;
}

interface FeedInput {
  title: string;
  description: string;
  selfUrl: string;
  pageUrl: string;
  items: FeedItem[];
}

function escapeXml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderRssFeed(feed: FeedInput): string {
  const now = new Date().toUTCString();
  const itemsXml = feed.items
    .map((item) => {
      const link = `${SITE_URL}/news/${item.slug}`;
      const categoriesXml = (item.categories ?? [])
        .map((c) => `      <category>${escapeXml(c)}</category>`)
        .join('\n');
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${item.pubDate ?? now}</pubDate>
${categoriesXml}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${feed.pageUrl}</link>
    <atom:link href="${feed.selfUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(feed.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}
