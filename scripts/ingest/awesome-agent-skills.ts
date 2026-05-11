// Awesome-agent-skills list (community-curated). README parsed for entries.
// Maps to `skill` resource type. Daily cadence.

import { withIngestionRun } from './_shared/runs';
import { fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(30, 60_000);
const SOURCE_RAW =
  'https://raw.githubusercontent.com/anthropics/skills/main/README.md';

interface Entry {
  name: string;
  url: string;
  description: string;
}

function parseList(md: string): Entry[] {
  const entries: Entry[] = [];
  const re = /^[\s]*[-*][\s]+\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*[-—:]?\s*(.*)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    entries.push({
      name: m[1]!.trim(),
      url: m[2]!.trim(),
      description: (m[3] ?? '').trim(),
    });
  }
  return entries;
}

await withIngestionRun(
  { sourceSlug: 'awesome-agent-skills', priority: 'normal' },
  async (ctx) => {
    await limiter.acquire();
    const md = await fetchText(SOURCE_RAW);
    await ctx.dump(md, 'md');
    const entries = parseList(md);
    ctx.metadata.parsed = entries.length;

    for (const e of entries) {
      const slug = slugify(e.name);
      await upsertResource(ctx, {
        typeSlug: 'skill',
        slug,
        name: e.name,
        tagline: e.description.slice(0, 200) || null,
        description: e.description || null,
        sourceUrl: e.url,
        stackTags: ['claude-code', 'agent-skills'],
      }).catch(() => undefined);
    }
  },
);
