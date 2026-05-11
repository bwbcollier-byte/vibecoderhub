import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChangeEvent {
  id: string;
  type: 'resource_added' | 'resource_updated' | 'price_drop' | 'deal_added';
  ts: string;
  resource: { type: string; slug: string; name: string };
  summary: string;
}

const NOW = Date.now();
const SEED: ChangeEvent[] = [
  ['model', 'gpt-5', 'GPT-5', 'resource_updated', 'Pricing updated: input −20%'],
  ['model', 'claude-opus-4-7', 'Claude Opus 4.7', 'resource_added', 'Added to directory'],
  ['mcp', 'github-mcp', 'GitHub MCP', 'resource_updated', 'New tool: pr_review'],
  ['mcp', 'postgres-mcp', 'Postgres MCP', 'resource_added', 'Added to directory'],
  ['model', 'gemini-2-5-pro', 'Gemini 2.5 Pro', 'price_drop', 'Output tokens −15%'],
  ['deal', 'cursor-annual', 'Cursor Annual 30% Off', 'deal_added', 'Member-tier deal live'],
  ['skill', 'pr-reviewer', 'PR Reviewer Skill', 'resource_added', 'Added to directory'],
  ['component', 'shadcn-data-table', 'shadcn Data Table', 'resource_updated', 'v0.4 — async sort'],
  ['model', 'llama-4-maverick', 'Llama 4 Maverick', 'resource_added', 'Open weights'],
  ['plugin', 'claude-code-deploy', 'Deploy Plugin', 'resource_updated', 'Now supports Fly.io'],
  ['workflow', 'pr-to-release', 'PR → Release', 'resource_added', 'Added to directory'],
  ['mcp', 'linear-mcp', 'Linear MCP', 'resource_updated', 'OAuth flow simplified'],
  ['model', 'deepseek-v3-1', 'DeepSeek v3.1', 'price_drop', 'Input −30% off-peak'],
  ['deal', 'vercel-pro-3mo', 'Vercel Pro 3mo Free', 'deal_added', 'Public deal live'],
  ['rule', 'no-any-types', 'No Any Types', 'resource_added', 'Added to directory'],
  ['subagent', 'code-reviewer', 'Code Reviewer Agent', 'resource_updated', 'Tighter scope'],
  ['model', 'mistral-medium-3', 'Mistral Medium 3', 'resource_added', 'Added to directory'],
  ['command', 'gh-pr-fast', '/gh-pr-fast', 'resource_added', 'Added to directory'],
  ['observability', 'langfuse', 'Langfuse', 'resource_updated', 'OTLP support'],
  ['starter', 'nextjs-saas', 'Next.js SaaS Starter', 'resource_updated', 'Bumped to Next 15'],
  ['eval', 'humaneval-x', 'HumanEval-X', 'resource_added', 'Added to directory'],
  ['mcp', 'slack-mcp', 'Slack MCP', 'resource_updated', 'Channel-write tool added'],
  ['model', 'grok-3', 'Grok 3', 'resource_added', 'Added to directory'],
  ['hook', 'pre-commit-types', 'Pre-commit Types', 'resource_added', 'Added to directory'],
  ['backend', 'supabase', 'Supabase', 'resource_updated', 'New region: SYD'],
  ['guide', 'ship-in-a-weekend', 'Ship in a Weekend', 'resource_updated', 'Step 5 rewritten'],
  ['model', 'qwen-3', 'Qwen 3', 'resource_added', 'Open weights'],
  ['marketplace', 'replicate', 'Replicate', 'resource_updated', 'New cold-boot SLA'],
  ['stack', 'saas-weekend', 'SaaS Weekend Stack', 'resource_updated', 'Added Inngest'],
  ['deal', 'openai-credits', 'OpenAI $500 Credits', 'deal_added', 'Public — new accounts'],
].map((row, i) => {
  const [type, slug, name, evType, summary] = row as [string, string, string, ChangeEvent['type'], string];
  return {
    id: `evt_${1000 + i}`,
    type: evType,
    ts: new Date(NOW - i * 1000 * 60 * 7).toISOString(),
    resource: { type, slug, name },
    summary,
  };
});

const activeConnections = new Map<string, AbortController>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function GET(req: NextRequest): Promise<Response> {
  const since = req.nextUrl.searchParams.get('since');

  if (since) {
    const cutoff = Date.parse(since);
    const events = Number.isFinite(cutoff)
      ? SEED.filter((e) => Date.parse(e.ts) > cutoff)
      : SEED;
    return Response.json(events, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const ip = clientIp(req);
  activeConnections.get(ip)?.abort();
  const controller = new AbortController();
  activeConnections.set(ip, controller);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(ctrl) {
      const send = (data: unknown) => {
        ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      const heartbeat = () => {
        try {
          ctrl.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
        } catch {
          /* closed */
        }
      };

      // Initial batch — most recent 100.
      for (const ev of SEED.slice(0, 100)) send(ev);

      const interval = setInterval(heartbeat, 25_000);

      const cleanup = () => {
        clearInterval(interval);
        if (activeConnections.get(ip) === controller) activeConnections.delete(ip);
        try {
          ctrl.close();
        } catch {
          /* already closed */
        }
      };

      req.signal.addEventListener('abort', cleanup);
      controller.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
