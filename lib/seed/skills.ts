// Seed data for /skills (Claude Skills — capabilities packaged for the
// agent). Sandbox / runtime feature deferred per ANSWERS Q1.1.

import type { GenericResource } from './generic';

export const SKILLS_SEED: GenericResource[] = [
  {
    slug: 'pdf-reader',
    name: 'PDF Reader',
    tagline: 'Extract structured text + tables from PDFs',
    author: 'Anthropic',
    version: '1.1.0',
    license: 'MIT',
    compatibleClients: ['claude-code', 'claude-desktop'],
    stackTags: [],
    ratingAvg: 4.7,
    installCount7d: 2103,
    installCountTotal: 14021,
    updatedLabel: '4d ago',
    description:
      'Reads PDFs and returns clean structured output — paragraphs, tables, headings. Handles scanned PDFs via OCR fallback.',
  },
  {
    slug: 'design-system-builder',
    name: 'Design System Builder',
    tagline: 'Spin up token files + Storybook from a brand brief',
    author: 'lovable',
    version: '0.3.0',
    license: 'MIT',
    compatibleClients: ['claude-code'],
    stackTags: ['Storybook'],
    ratingAvg: 4.5,
    installCount7d: 612,
    installCountTotal: 2042,
    updatedLabel: '1w ago',
    description:
      'Takes a brand brief (logo, colors, voice) and generates a complete design-token export plus a starter Storybook.',
  },
  {
    slug: 'docx-author',
    name: 'DOCX Author',
    tagline: 'Generate Word documents from structured prompts',
    author: 'Anthropic',
    version: '0.6.0',
    license: 'MIT',
    compatibleClients: ['claude-code', 'claude-desktop'],
    stackTags: [],
    ratingAvg: 4.6,
    installCount7d: 1804,
    installCountTotal: 6210,
    updatedLabel: '2w ago',
    description:
      'Produces formatted .docx files. Headings, lists, tables, embedded images, headers / footers.',
  },
  {
    slug: 'sheets-analyst',
    name: 'Sheets Analyst',
    tagline: 'Analyze Excel + Google Sheets data with the agent',
    author: 'Anthropic',
    version: '1.0.0',
    license: 'MIT',
    compatibleClients: ['claude-code'],
    stackTags: [],
    ratingAvg: 4.4,
    installCount7d: 920,
    installCountTotal: 3120,
    updatedLabel: '5d ago',
    description:
      'Reads .xlsx / .csv files, runs aggregations + pivots, produces summary tables + charts.',
  },
];
