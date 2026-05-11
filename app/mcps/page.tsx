// /mcps — directory index. Server Component.
//
// Slice S02a (Session 7). Pattern-mirror of /models with MCP-specific filters
// (compatible client) + sorts (trending / rating / newest / most-tools).

import type { ReactElement } from 'react';

import { listMcps } from '@/lib/seed/mcps';

import { McpsList } from './_components/McpsList';

export const metadata = {
  title: 'MCPs · Vibe Coder Hub',
  description:
    'Browse every MCP server — tools, resources, and prompts your AI agent can call. Filtered by IDE compatibility.',
};

export default function McpsIndexPage(): ReactElement {
  const mcps = listMcps();

  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
            ⌖ · {mcps.length.toLocaleString()} INDEXED
          </p>
          <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,10vw,128px)]">
            MCPs.
          </h1>
        </div>
      </header>

      <McpsList initialMcps={mcps} />
    </div>
  );
}
