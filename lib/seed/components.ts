// Seed data for /components. Code snippet shown in detail page's "Snippet"
// tab; Sandpack live playground deferred to Phase 2 (KNOWN_ISSUES).

import type { GenericResource } from './generic';

const SHADCN_PRICING_CODE = `import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function PricingCard({ tier, price, features, cta, accent }) {
  return (
    <Card className={accent ? 'border-mint' : ''}>
      <CardHeader>
        <p className="text-xs uppercase tracking-wider text-mint">{tier}</p>
        <CardTitle className="text-5xl">{price}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((f) => (
            <li key={f} className="flex gap-2 text-sm">
              <Check className="size-4 text-mint" />{f}
            </li>
          ))}
        </ul>
        <Button className="w-full">{cta}</Button>
      </CardContent>
    </Card>
  );
}`;

const CMDK_PALETTE_CODE = `'use client';
import { Command } from 'cmdk';
import { useState } from 'react';

export function CmdKPalette() {
  const [open, setOpen] = useState(false);
  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command palette">
      <Command.Input placeholder="Search…" />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
        <Command.Group heading="Suggestions">
          <Command.Item>Open settings</Command.Item>
          <Command.Item>Switch theme</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}`;

const MAGIC_BUTTON_CODE = `export function MagicGlowButton({ children }) {
  return (
    <button className="relative px-6 py-3 rounded-full text-black font-bold
      bg-gradient-to-r from-mint to-cyan-400 hover:shadow-[0_0_24px_-4px_#3cffd0]
      transition-shadow duration-300">
      {children}
    </button>
  );
}`;

const DATA_TABLE_CODE = `import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

export function DataTable({ data, columns }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <table className="w-full text-sm">
      <thead>{table.getHeaderGroups().map(/* … */)}</thead>
      <tbody>{table.getRowModel().rows.map(/* … */)}</tbody>
    </table>
  );
}`;

export const COMPONENTS_SEED: GenericResource[] = [
  {
    slug: '21st-pricing-toggle',
    name: 'Pricing card with monthly/yearly toggle',
    tagline: 'Animated price card with savings ribbon and feature checklist',
    author: '21st.dev',
    version: '1.4.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: ['React', 'Tailwind', 'TypeScript'],
    ratingAvg: 4.8,
    installCount7d: 4321,
    installCountTotal: 18432,
    updatedLabel: '3d ago',
    description:
      'Drop-in pricing card. Monthly / annual toggle animates a savings ribbon. shadcn/ui compatible. Tailwind + Framer Motion.',
    codeLanguage: 'tsx',
    codeSnippet: SHADCN_PRICING_CODE,
  },
  {
    slug: 'shadcn-cmd-palette',
    name: 'Cmd-K command palette',
    tagline: 'Keyboard-first palette with grouped results',
    author: 'shadcn',
    version: '2.1.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf', 'cline'],
    stackTags: ['React', 'Tailwind'],
    ratingAvg: 4.9,
    installCount7d: 8210,
    installCountTotal: 92041,
    updatedLabel: '1d ago',
    description:
      'Composable command palette built on `cmdk`. Arrow-key navigation, fuzzy filter, focus trap.',
    codeLanguage: 'tsx',
    codeSnippet: CMDK_PALETTE_CODE,
  },
  {
    slug: 'magic-glow-button',
    name: 'Magic Glow Button',
    tagline: 'Animated gradient ring on hover',
    author: 'magicui',
    version: '0.9.2',
    license: 'MIT',
    compatibleClients: ['cursor', 'windsurf'],
    stackTags: ['React', 'Tailwind'],
    ratingAvg: 4.5,
    installCount7d: 1842,
    installCountTotal: 8210,
    updatedLabel: '1w ago',
    description: 'Tailwind-only glow effect with a mint-to-cyan gradient on hover.',
    codeLanguage: 'tsx',
    codeSnippet: MAGIC_BUTTON_CODE,
  },
  {
    slug: 'data-table-pro',
    name: 'Data table with sorting + selection',
    tagline: 'Linear-style table with virtualization',
    author: 'tremor',
    version: '4.2.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: ['React', 'TypeScript'],
    ratingAvg: 4.7,
    installCount7d: 3010,
    installCountTotal: 21043,
    updatedLabel: '4d ago',
    description:
      'TanStack Table v8 wrapper with virtualization, column sorting, row selection, and inline editing.',
    codeLanguage: 'tsx',
    codeSnippet: DATA_TABLE_CODE,
  },
];
