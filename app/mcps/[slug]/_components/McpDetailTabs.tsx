'use client';

import * as React from 'react';

import { Tabs } from '@/components/ui/tabs';
import { Icon } from '@/components/icons/Icon';
import type { McpDetail, McpTool } from '@/lib/seed/mcps';

interface Props {
  mcp: McpDetail;
}

export function McpDetailTabs({ mcp }: Props): React.ReactElement {
  return (
    <Tabs
      items={[
        { value: 'overview',      label: 'Overview' },
        { value: 'tools',         label: `Tools (${mcp.toolCount})` },
        { value: 'resources',     label: `Resources (${mcp.resourceCount})` },
        { value: 'prompts',       label: `Prompts (${mcp.promptCount})` },
        { value: 'compatibility', label: 'Compatibility' },
      ]}
      defaultValue="overview"
    >
      {(active) => (
        <div className="min-h-[200px]">
          {active === 'overview' && <Overview mcp={mcp} />}
          {active === 'tools' && <ToolInspector tools={mcp.tools} />}
          {active === 'resources' && <Resources mcp={mcp} />}
          {active === 'prompts' && <Prompts mcp={mcp} />}
          {active === 'compatibility' && <Compatibility mcp={mcp} />}
        </div>
      )}
    </Tabs>
  );
}

function Overview({ mcp }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 text-[15px] leading-[1.6] text-[#cfcfcf]">
      <p>{mcp.description}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
        <Row label="Version" value={mcp.version} />
        <Row label="License" value={mcp.license} />
        <Row label="Author" value={mcp.author} />
        <Row label="Last updated" value={mcp.updatedLabel} />
        <Row label="Installs (7d)" value={mcp.installCount7d.toLocaleString()} />
        <Row label="Installs (total)" value={mcp.installCountTotal.toLocaleString()} />
      </dl>
    </div>
  );
}

function ToolInspector({ tools }: { tools: McpTool[] }): React.ReactElement {
  if (tools.length === 0) {
    return <p className="text-text-secondary text-[14px]">This MCP exposes no tools.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary text-[13px] leading-[1.5]">
        Read-only inspector. Live invocation (Try It) ships Phase 2.
      </p>
      {tools.map((t) => (
        <ToolCard key={t.name} tool={t} />
      ))}
    </div>
  );
}

function ToolCard({ tool }: { tool: McpTool }): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const propKeys = Object.keys(tool.inputSchema.properties);

  return (
    <div className="bg-canvas border border-surface rounded-tile overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint shrink-0">
          TOOL
        </span>
        <code className="font-mono text-[14px] text-white">{tool.name}</code>
        <span className="text-text-secondary text-[13px] flex-1 truncate">
          {tool.description}
        </span>
        <Icon.ChevDown
          size={14}
          className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
        />
      </button>

      {open && (
        <div className="border-t border-surface px-5 py-4 flex flex-col gap-3">
          <p className="text-[14px] text-[#cfcfcf] leading-[1.6]">{tool.description}</p>
          {propKeys.length > 0 ? (
            <>
              <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
                INPUT SCHEMA
              </p>
              <ul className="flex flex-col gap-2">
                {propKeys.map((key) => {
                  const prop = tool.inputSchema.properties[key];
                  if (!prop) return null;
                  const required = tool.inputSchema.required?.includes(key) ?? false;
                  return (
                    <li
                      key={key}
                      className="flex items-baseline gap-3 border-b border-surface pb-2"
                    >
                      <code className="font-mono text-[13px] text-mint shrink-0">{key}</code>
                      <span className="font-mono text-[10px] text-text-secondary uppercase tracking-[1.2px] shrink-0">
                        {prop.type}
                        {required && ' · required'}
                      </span>
                      {prop.description && (
                        <span className="text-[12px] text-text-secondary leading-[1.5]">
                          {prop.description}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-text-secondary text-[13px]">No input parameters.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Resources({ mcp }: Props): React.ReactElement {
  if (mcp.resources.length === 0) {
    return <p className="text-text-secondary text-[14px]">This MCP exposes no resources.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {mcp.resources.map((r) => (
        <li key={r.uri} className="flex flex-col gap-1 border-b border-surface pb-3">
          <code className="font-mono text-[13px] text-mint">{r.uri}</code>
          <span className="text-text-secondary text-[13px]">{r.description}</span>
        </li>
      ))}
    </ul>
  );
}

function Prompts({ mcp }: Props): React.ReactElement {
  if (mcp.prompts.length === 0) {
    return <p className="text-text-secondary text-[14px]">This MCP exposes no prompts.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {mcp.prompts.map((p) => (
        <li key={p.name} className="flex flex-col gap-1 border-b border-surface pb-3">
          <code className="font-mono text-[13px] text-mint">{p.name}</code>
          <span className="text-text-secondary text-[13px]">{p.description}</span>
        </li>
      ))}
    </ul>
  );
}

function Compatibility({ mcp }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary">
        VERIFIED CLIENTS
      </p>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[14px]">
        {mcp.compatibleClients.map((c) => (
          <li key={c} className="flex items-center gap-2 text-white">
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-mint text-black text-[10px]"
            >
              ✓
            </span>
            {c}
          </li>
        ))}
      </ul>
      {mcp.stackTags.length > 0 && (
        <>
          <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-text-secondary mt-4">
            STACK TAGS
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mcp.stackTags.map((t) => (
              <span
                key={t}
                className="font-mono uppercase tracking-[1.2px] text-[10px] font-bold text-text-secondary border border-surface rounded-pill px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="flex justify-between gap-3 border-b border-surface py-2">
      <dt className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
        {label}
      </dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}
