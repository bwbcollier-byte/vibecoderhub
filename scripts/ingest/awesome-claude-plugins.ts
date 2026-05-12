// Mirror the awesome-claude-plugins list (community-curated). README on
// GitHub; we parse markdown links under headings as plugin entries.
// Daily cadence. Maps to `plugin` resource type.

import { withIngestionRun } from './_shared/runs';
import { fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(30, 60_000);
const SOURCE_RAW =
  'https://raw.githubusercontent.com/quemsah/awesome-claude-plugins/main/README.md';

interface Entry {
  name: string;
  url: string;
  description: string;
  stars: number;
}

// Repo README is a markdown table:
//   | # | [name](url) | description | stars | subs | plugins |
function parseAwesome(md: string): Entry[] {
  const entries: Entry[] = [];
  const lineRe = /^\|\s*\d+\s*\|\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*\|\s*([^|]*?)\s*\|\s*(\d+)\s*\|/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(md)) !== null) {
    const [, name, url, desc, stars] = m;
    if (!name || !url) continue;
    entries.push({
      name: name.trim(),
      url: url.trim(),
      description: (desc ?? '').trim(),
      stars: Number.parseInt(stars ?? '0', 10) || 0,
    });
  }
  return entries;
}

async function main() {
  await withIngestionRun(
  { sourceSlug: 'awesome-claude-plugins', priority: 'normal' },
  async (ctx) => {
    await limiter.acquire();
    const md = await fetchText(SOURCE_RAW);
    await ctx.dump(md, 'md');
    const entries = parseAwesome(md);
    ctx.metadata.parsed = entries.length;

    for (const e of entries) {
      const slug = slugify(e.name);
      await upsertResource(ctx, {
        typeSlug: 'plugin',
        slug,
        name: e.name,
        tagline: e.description.slice(0, 200) || null,
        description: e.description || null,
        sourceUrl: e.url,
        stackTags: ['claude-code'],
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
