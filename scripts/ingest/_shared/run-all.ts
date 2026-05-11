// Sequentially run every ingestion script. Used by `pnpm ingest:all` for
// local smoke-testing. Each step swallows its own error so one bad source
// doesn't block the rest.

import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ingestDir = resolve(here, '..');

const SCRIPTS = [
  'openrouter',
  'shadcn',
  '21st',
  'mcp-registry',
  'smithery',
  'awesome-claude-plugins',
  'awesome-agent-skills',
  'github-code-search',
  'cursor-directory',
  'buildwithclaude',
  'arxiv-papers',
  'product-hunt-rss',
  'github-stargazer-velocity',
  'hn-algolia',
];

async function runOne(name: string) {
  return new Promise<void>((res) => {
    const child = spawn('pnpm', ['tsx', resolve(ingestDir, `${name}.ts`)], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) => {
      console.log(`[run-all] ${name} → exit ${code ?? 0}`);
      res();
    });
  });
}

void (async () => {
  for (const name of SCRIPTS) {
    console.log(`[run-all] starting ${name}`);
    await runOne(name);
  }
})();
