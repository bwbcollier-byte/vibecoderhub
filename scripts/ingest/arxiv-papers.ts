// arXiv signal scanner. Cross-cutting research feed used for the news flow:
// cs.CL / cs.AI / cs.LG papers tagged "code generation" / "agents". Per
// data-sourcing spec §15 (cross-cutting news). Daily.
//
// Uses the arXiv Atom API — no auth, generous rate limit. Maps to `news`.

import { withIngestionRun } from './_shared/runs';
import { fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertNews } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(20, 60_000);

const QUERY =
  'cat:cs.CL+AND+(abs:"code+generation"+OR+abs:"coding+agent"+OR+abs:"software+engineering"+OR+abs:"LLM+agents")';

interface ArxivEntry {
  id: string;
  title: string;
  summary: string;
  updated: string;
  authors: string[];
}

function parseAtom(xml: string): ArxivEntry[] {
  const out: ArxivEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(xml)) !== null) {
    const block = m[1] ?? '';
    const get = (tag: string) => {
      const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`).exec(block);
      return (r?.[1] ?? '').trim();
    };
    const id = get('id');
    const title = get('title').replace(/\s+/g, ' ');
    const summary = get('summary').replace(/\s+/g, ' ');
    const updated = get('updated');
    const authors = Array.from(block.matchAll(/<name>([^<]+)<\/name>/g)).map((x) => (x[1] ?? '').trim());
    if (id && title) out.push({ id, title, summary, updated, authors });
  }
  return out;
}

async function main() {
  await withIngestionRun(
  { sourceSlug: 'arxiv-papers', priority: 'low' },
  async (ctx) => {
    await limiter.acquire();
    const url = `https://export.arxiv.org/api/query?search_query=${QUERY}&sortBy=submittedDate&sortOrder=descending&max_results=50`;
    const xml = await fetchText(url, { headers: { 'user-agent': 'vibecoderhub-ingest/1' } });
    await ctx.dump(xml, 'xml');

    const entries = parseAtom(xml);
    ctx.metadata.parsed = entries.length;

    for (const e of entries) {
      const arxivId = e.id.split('/abs/')[1] ?? e.id;
      const slug = slugify(`arxiv-${arxivId}`);
      const publishedAt = e.updated ? new Date(e.updated) : new Date();
      await upsertNews(ctx, {
        slug,
        title: e.title,
        summary: e.summary.slice(0, 500),
        body: e.summary,
        kind: 'ecosystem',
        sourceKind: 'rss_imported',
        sourceName: e.authors[0] ? `arXiv · ${e.authors[0]}` : 'arXiv',
        sourceUrl: e.id,
        publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        topics: ['research', 'arxiv'],
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
