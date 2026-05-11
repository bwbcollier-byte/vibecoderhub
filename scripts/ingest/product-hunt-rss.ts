// Product Hunt "AI" topic RSS — surfaces new tools / agents / app builders
// as launch events. Per data-sourcing spec §15 (RSS flow). Hourly.

import { withIngestionRun } from './_shared/runs';
import { fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(20, 60_000);

const FEEDS = [
  'https://www.producthunt.com/feed?category=artificial-intelligence',
  'https://www.producthunt.com/feed?category=developer-tools',
];

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

function parseRss(xml: string): RssItem[] {
  const out: RssItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1] ?? '';
    const get = (tag: string) => {
      const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`).exec(block);
      return (r?.[1] ?? '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    };
    out.push({
      title: get('title'),
      link: get('link'),
      description: get('description').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '),
      pubDate: get('pubDate'),
    });
  }
  return out;
}

await withIngestionRun(
  { sourceSlug: 'product-hunt-rss', priority: 'normal' },
  async (ctx) => {
    const all: RssItem[] = [];
    for (const feed of FEEDS) {
      await limiter.acquire();
      try {
        const xml = await fetchText(feed, { headers: { 'user-agent': 'vibecoderhub-ingest/1' } });
        all.push(...parseRss(xml));
      } catch (err) {
        ctx.logger.warn('feed failed', { feed, err: String(err).slice(0, 200) });
      }
    }

    await ctx.dump(all);
    ctx.metadata.items = all.length;

    for (const item of all) {
      if (!item.title || !item.link) continue;
      const slug = slugify(`ph-${item.title}`);
      await upsertResource(ctx, {
        typeSlug: 'news',
        slug,
        name: item.title,
        tagline: item.description.slice(0, 200),
        description: item.description,
        sourceUrl: item.link,
        stackTags: ['product-hunt'],
      }).catch(() => undefined);
    }
  },
);
