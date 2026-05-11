/**
 * Seed MCP records — Session 7 (Slice S02).
 *
 * Shape mirrors `resources ⋈ mcps` join (subset of the Drizzle schema in
 * db/schema.ts). The DB swap is one-line later. Tool shape mirrors the
 * `mcps.tools` jsonb column documented in canonical schema specs:
 * each tool has a name + short description + input schema (JSON Schema
 * subset). The MCP Tool Inspector renders these read-only Phase 1
 * (live invocation is Phase 2 per ANSWERS Q1.1).
 */

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    properties: Record<string, { type: string; description?: string }>;
    required?: string[];
  };
}

export interface McpListItem {
  slug: string;
  name: string;
  tagline: string;
  author: string;
  version: string;
  license: string;
  compatibleClients: string[];
  stackTags: string[];
  ratingAvg: number;
  installCount7d: number;
  installCountTotal: number;
  updatedLabel: string; // "1d ago" — coarse for now
  toolCount: number;
  resourceCount: number;
  promptCount: number;
  isFeatured: boolean;
}

export interface McpDetail extends McpListItem {
  description: string;
  tools: McpTool[];
  resources: { uri: string; description: string }[];
  prompts: { name: string; description: string }[];
}

const MCPS: McpDetail[] = [
  {
    slug: 'github-mcp',
    name: 'GitHub MCP',
    tagline: '24 tools across issues, PRs, repos',
    author: 'GitHub',
    version: '2.0.1',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline', 'claude-desktop', 'continue'],
    stackTags: [],
    ratingAvg: 4.9,
    installCount7d: 12041,
    installCountTotal: 142031,
    updatedLabel: '3d ago',
    toolCount: 24,
    resourceCount: 4,
    promptCount: 3,
    isFeatured: true,
    description:
      'Official GitHub-built MCP for AI coding agents. Covers issues, pull requests, repository ops, code search, and Actions runs. Auth via PAT or fine-grained token.',
    tools: [
      {
        name: 'list_issues',
        description: 'List issues in a repository, filtered by state, labels, assignee.',
        inputSchema: {
          properties: {
            owner: { type: 'string', description: 'Repo owner (user or org)' },
            repo: { type: 'string', description: 'Repo name' },
            state: { type: 'string', description: 'open | closed | all' },
            labels: { type: 'string', description: 'Comma-separated label names' },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'create_pull_request',
        description: 'Open a new pull request against a base branch.',
        inputSchema: {
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            title: { type: 'string' },
            head: { type: 'string', description: 'Branch with changes' },
            base: { type: 'string', description: 'Branch to merge into' },
            body: { type: 'string' },
          },
          required: ['owner', 'repo', 'title', 'head', 'base'],
        },
      },
      {
        name: 'search_code',
        description: 'Search code across repositories the token can see.',
        inputSchema: {
          properties: {
            q: { type: 'string', description: 'GitHub code-search query' },
          },
          required: ['q'],
        },
      },
    ],
    resources: [
      { uri: 'github://repo/{owner}/{repo}/readme', description: 'Repository README' },
      { uri: 'github://pr/{owner}/{repo}/{number}', description: 'Pull request body + comments' },
    ],
    prompts: [
      { name: 'review_pr', description: 'Generate a PR review against team conventions' },
      { name: 'release_notes', description: 'Draft release notes from a tag diff' },
    ],
  },
  {
    slug: 'supabase-mcp',
    name: 'Supabase MCP',
    tagline: 'Query, migrate, and manage Supabase from your IDE',
    author: 'Supabase',
    version: '1.2.0',
    license: 'Apache-2.0',
    compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline'],
    stackTags: ['Supabase', 'Postgres'],
    ratingAvg: 4.8,
    installCount7d: 4210,
    installCountTotal: 28019,
    updatedLabel: '2d ago',
    toolCount: 18,
    resourceCount: 6,
    promptCount: 2,
    isFeatured: false,
    description:
      'Official Supabase MCP. Execute SQL, manage migrations, list projects + secrets, deploy Edge Functions.',
    tools: [
      {
        name: 'execute_sql',
        description: 'Run a read-only SQL query against a project.',
        inputSchema: {
          properties: {
            project_id: { type: 'string' },
            sql: { type: 'string' },
          },
          required: ['project_id', 'sql'],
        },
      },
      {
        name: 'list_tables',
        description: 'Enumerate tables in a schema.',
        inputSchema: {
          properties: {
            project_id: { type: 'string' },
            schema: { type: 'string', description: 'Defaults to public' },
          },
          required: ['project_id'],
        },
      },
    ],
    resources: [{ uri: 'supabase://migrations/{project_id}', description: 'Migration history' }],
    prompts: [{ name: 'plan_migration', description: 'Plan a safe migration with rollback steps' }],
  },
  {
    slug: 'playwright-mcp',
    name: 'Playwright MCP',
    tagline: 'Browser automation with screenshot tools',
    author: 'Microsoft',
    version: '0.8.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: [],
    ratingAvg: 4.7,
    installCount7d: 6120,
    installCountTotal: 41203,
    updatedLabel: '1d ago',
    toolCount: 14,
    resourceCount: 0,
    promptCount: 1,
    isFeatured: true,
    description:
      'Drive a real Chromium / Firefox / WebKit instance from your agent. Screenshot, click, type, evaluate JS, read console + network.',
    tools: [
      {
        name: 'navigate',
        description: 'Navigate the browser to a URL.',
        inputSchema: {
          properties: { url: { type: 'string' } },
          required: ['url'],
        },
      },
      {
        name: 'screenshot',
        description: 'Capture the current viewport as PNG.',
        inputSchema: {
          properties: {
            full_page: { type: 'boolean', description: 'Capture full scroll instead of viewport' },
          },
        },
      },
    ],
    resources: [],
    prompts: [
      { name: 'visual_regression', description: 'Diff a page against a baseline screenshot' },
    ],
  },
  {
    slug: 'filesystem-mcp',
    name: 'Filesystem MCP',
    tagline: 'Sandboxed file ops for any directory',
    author: 'Anthropic',
    version: '0.6.1',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline', 'claude-desktop', 'continue', 'zed'],
    stackTags: [],
    ratingAvg: 4.6,
    installCount7d: 8910,
    installCountTotal: 92103,
    updatedLabel: '1w ago',
    toolCount: 8,
    resourceCount: 0,
    promptCount: 0,
    isFeatured: false,
    description: 'Read / write / list / search files within a user-allowed root.',
    tools: [
      {
        name: 'read_file',
        description: 'Read a UTF-8 file from the sandbox.',
        inputSchema: {
          properties: { path: { type: 'string' } },
          required: ['path'],
        },
      },
    ],
    resources: [],
    prompts: [],
  },
  {
    slug: 'stripe-mcp',
    name: 'Stripe MCP',
    tagline: 'Read-only access to your Stripe account',
    author: 'Stripe',
    version: '1.0.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'claude-desktop'],
    stackTags: ['Stripe'],
    ratingAvg: 4.5,
    installCount7d: 1010,
    installCountTotal: 5410,
    updatedLabel: '2w ago',
    toolCount: 12,
    resourceCount: 3,
    promptCount: 2,
    isFeatured: false,
    description: 'Read-only Stripe inspector — customers, charges, subscriptions, disputes.',
    tools: [
      {
        name: 'list_customers',
        description: 'List customers, optionally filtered by email.',
        inputSchema: {
          properties: {
            email: { type: 'string' },
            limit: { type: 'string', description: 'Max 100' },
          },
        },
      },
    ],
    resources: [{ uri: 'stripe://customer/{id}', description: 'Customer record' }],
    prompts: [],
  },
  {
    slug: 'auth0-mcp',
    name: 'Auth0 MCP',
    tagline: '12 tools for managing Auth0 tenants',
    author: 'Auth0',
    version: '0.4.2',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline', 'claude-desktop'],
    stackTags: ['Auth0'],
    ratingAvg: 4.6,
    installCount7d: 891,
    installCountTotal: 4012,
    updatedLabel: '6d ago',
    toolCount: 12,
    resourceCount: 2,
    promptCount: 1,
    isFeatured: false,
    description: 'Manage tenants, applications, rules, and users in Auth0.',
    tools: [
      {
        name: 'list_users',
        description: 'List users in a tenant.',
        inputSchema: {
          properties: {
            tenant: { type: 'string' },
            page: { type: 'string' },
          },
          required: ['tenant'],
        },
      },
    ],
    resources: [],
    prompts: [],
  },
  {
    slug: 'linear-mcp',
    name: 'Linear MCP',
    tagline: 'Issues, projects, and cycles from your agent',
    author: 'Linear',
    version: '1.1.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: [],
    ratingAvg: 4.7,
    installCount7d: 2840,
    installCountTotal: 18091,
    updatedLabel: '4d ago',
    toolCount: 16,
    resourceCount: 4,
    promptCount: 2,
    isFeatured: false,
    description: 'Create issues, update statuses, query cycles, and search Linear docs.',
    tools: [
      {
        name: 'create_issue',
        description: 'Create an issue in a Linear team.',
        inputSchema: {
          properties: {
            team_id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['team_id', 'title'],
        },
      },
    ],
    resources: [],
    prompts: [],
  },
  {
    slug: 'vercel-mcp',
    name: 'Vercel MCP',
    tagline: 'Deploy, inspect logs, manage env vars',
    author: 'Vercel',
    version: '0.9.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code'],
    stackTags: ['Vercel'],
    ratingAvg: 4.6,
    installCount7d: 1820,
    installCountTotal: 9210,
    updatedLabel: '5d ago',
    toolCount: 10,
    resourceCount: 2,
    promptCount: 1,
    isFeatured: false,
    description:
      'Trigger deploys, inspect build + runtime logs, manage project env vars from your agent.',
    tools: [
      {
        name: 'deploy',
        description: 'Trigger a production or preview deployment.',
        inputSchema: {
          properties: {
            project_id: { type: 'string' },
            target: { type: 'string', description: 'production | preview' },
          },
          required: ['project_id'],
        },
      },
    ],
    resources: [],
    prompts: [],
  },
];

export type McpSort = 'trending' | 'rating' | 'newest' | 'most-tools';

export function listMcps(): McpDetail[] {
  return MCPS;
}

export function getMcpBySlug(slug: string): McpDetail | undefined {
  return MCPS.find((m) => m.slug === slug);
}

export function sortMcps(items: McpDetail[], sort: McpSort): McpDetail[] {
  const copy = [...items];
  switch (sort) {
    case 'trending':
      return copy.sort((a, b) => b.installCount7d - a.installCount7d);
    case 'rating':
      return copy.sort((a, b) => b.ratingAvg - a.ratingAvg);
    case 'most-tools':
      return copy.sort((a, b) => b.toolCount - a.toolCount);
    case 'newest':
      return copy.reverse();
    default:
      return copy;
  }
}

export function filterMcps(
  items: McpDetail[],
  q: string,
  clientFilter: string | null,
): McpDetail[] {
  const needle = q.trim().toLowerCase();
  return items.filter((m) => {
    if (clientFilter && !m.compatibleClients.includes(clientFilter)) return false;
    if (!needle) return true;
    const hay = `${m.name} ${m.author} ${m.tagline} ${m.description} ${m.stackTags.join(' ')}`.toLowerCase();
    return hay.includes(needle);
  });
}
