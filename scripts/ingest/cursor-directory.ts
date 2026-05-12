// cursor.directory rules — the canonical site (cursor.directory) sits behind
// Vercel's bot-challenge and serves HTTP 429 to non-browser User-Agents on
// every endpoint, including the sitemap. We get the same content from the
// open mirror at github.com/Qwertic/cursorrules instead — 101 directories
// under `rules/<slug>/` each with a `.cursorrules` body and a README.
//
// Daily cadence. Maps to `rule` resource type.

import { withIngestionRun } from './_shared/runs';
import { fetchJson, fetchText } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';

const limiter = new RateLimiter(60, 60_000);
const REPO = 'Qwertic/cursorrules';
const BRANCH = 'main';

interface TreeNode {
  path: string;
  type: 'blob' | 'tree';
}

interface TreeResponse {
  tree: TreeNode[];
  truncated: boolean;
}

async function main() {
  await withIngestionRun(
  { sourceSlug: 'cursor-directory', priority: 'normal' },
  async (ctx) => {
    await limiter.acquire();
    const tree = await fetchJson<TreeResponse>(
      `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`,
      {
        headers: {
          accept: 'application/vnd.github+json',
          'user-agent': 'vibecoderhub-ingest/1',
          ...(process.env.GITHUB_INGESTION_TOKEN
            ? { authorization: `Bearer ${process.env.GITHUB_INGESTION_TOKEN}` }
            : {}),
        },
      },
    );

    const ruleFiles = tree.tree
      .filter((t) => t.type === 'blob' && /^rules\/[^/]+\/\.cursorrules$/.test(t.path))
      .map((t) => t.path);

    ctx.metadata.discovered = ruleFiles.length;
    ctx.metadata.repo = REPO;
    if (tree.truncated) ctx.logger.warn('git tree truncated', { repo: REPO });

    for (const path of ruleFiles) {
      const dir = path.slice('rules/'.length, -'/.cursorrules'.length);
      const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
      const readmeUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/rules/${dir}/README.md`;
      const htmlUrl = `https://github.com/${REPO}/tree/${BRANCH}/rules/${dir}`;

      let body = '';
      let summary = '';
      try {
        await limiter.acquire();
        body = await fetchText(rawUrl);
      } catch (err) {
        ctx.logger.warn('rule fetch failed', { dir, err: String(err).slice(0, 200) });
        continue;
      }
      try {
        await limiter.acquire();
        const readme = await fetchText(readmeUrl);
        const para = readme
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .find((p) => p && !p.startsWith('#'));
        summary = (para ?? readme).slice(0, 280);
      } catch {
        summary = body.slice(0, 280);
      }

      const cleanedDir = dir.replace(/-cursorrules?-prompt-file$/i, '');
      const name = cleanedDir
        .split('-')
        .filter(Boolean)
        .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0]!.toUpperCase() + w.slice(1)))
        .join(' ');

      await upsertResource(ctx, {
        typeSlug: 'rule',
        slug: slugify(dir),
        name: name || dir,
        tagline: summary.slice(0, 200) || null,
        description: body.slice(0, 4000),
        sourceUrl: htmlUrl,
        homepageUrl: rawUrl,
        authorHandle: REPO.split('/')[0],
        stackTags: ['cursor', 'cursorrules'],
      }).catch(() => undefined);
    }
  },
);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
