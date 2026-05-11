// Seed data for /plugins (Claude Code plugin bundles).

import type { GenericResource } from './generic';

export const PLUGINS_SEED: GenericResource[] = [
  {
    slug: 'shadcn-ui-bundle',
    name: 'shadcn/ui Plugin Bundle',
    tagline: '40+ components + theming + a11y rules',
    author: 'shadcn',
    version: '5.1.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code', 'windsurf'],
    stackTags: ['React', 'Tailwind'],
    ratingAvg: 4.9,
    installCount7d: 14021,
    installCountTotal: 218042,
    updatedLabel: '2d ago',
    description:
      'The full shadcn/ui catalog wired as a single Claude Code plugin. Generates `add` commands per component.',
  },
  {
    slug: 'drizzle-companion',
    name: 'Drizzle Companion',
    tagline: 'Schema + migration helpers for the agent',
    author: 'drizzle-team',
    version: '0.4.0',
    license: 'Apache-2.0',
    compatibleClients: ['claude-code'],
    stackTags: ['Drizzle', 'TypeScript', 'Postgres'],
    ratingAvg: 4.7,
    installCount7d: 2210,
    installCountTotal: 14210,
    updatedLabel: '6d ago',
    description:
      'Inspects `schema.ts`, suggests migrations, drafts `drizzle.config.ts`. Generates Zod schemas from tables.',
  },
  {
    slug: 'next-app-router-pack',
    name: 'Next App Router Pack',
    tagline: 'Layouts, loading, error, not-found, OG helpers',
    author: 'vercel',
    version: '2.0.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code'],
    stackTags: ['Next.js'],
    ratingAvg: 4.8,
    installCount7d: 5120,
    installCountTotal: 48201,
    updatedLabel: '1w ago',
    description:
      'One-click adds for the App Router boilerplate — layouts, error / loading / not-found boundaries, sitemap, OG.',
  },
  {
    slug: 'stripe-billing-kit',
    name: 'Stripe Billing Kit',
    tagline: 'Checkout, webhook, portal, trials',
    author: 'stripe',
    version: '1.2.0',
    license: 'MIT',
    compatibleClients: ['cursor', 'claude-code'],
    stackTags: ['Stripe'],
    ratingAvg: 4.6,
    installCount7d: 1820,
    installCountTotal: 14201,
    updatedLabel: '5d ago',
    description:
      'Bundle of Server Actions + route handlers for Stripe Checkout + webhook ingestion + customer portal.',
  },
];
