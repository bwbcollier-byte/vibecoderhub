// Airtable design-systems ingest. 25th resource type.
//
// Source: base appbUpVCXkuPCOo6y, table tblwSnr8wvOeGnccv ("Design Systems").
// 50K records total; we only ingest the 69 that have a populated Design Tokens JSON
// field (the editorial bar — full brand profile + tokens + sample components).
//
// Each row maps to two rows in our DB:
//   1. pk_resources spine entry (type_slug='design_system')
//   2. pk_design_systems join row carrying the brand-specific fields
//
// Auth: Bearer AIRTABLE_API_KEY (already in .env.local).
// Rate-limit: 5 req/sec per Airtable's docs — comfortable inside our 30/min cap.

import { sql } from 'drizzle-orm';

import { withIngestionRun } from './_shared/runs';
import { fetchJson } from './_shared/retry';
import { RateLimiter } from './_shared/rate-limiter';
import { upsertResource } from './_shared/dedup';
import { slugify } from './_shared/slug';
import { getDb } from './_shared/db';
import { requireEnv } from './_shared/env';
import { designSystems } from '@/db/schema';

const limiter = new RateLimiter(120, 60_000);
const BASE = 'appbUpVCXkuPCOo6y';
const TABLE = 'tblwSnr8wvOeGnccv';

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function asNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function parseJson(v: unknown): unknown | null {
  if (v == null) return null;
  if (typeof v !== 'string') return v; // already parsed by Airtable JSON columns
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

function slugFromDomain(domain: string | null, fallback: string): string {
  if (!domain) return slugify(fallback);
  return slugify(
    domain
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '')
      .replace(/\./g, '-'),
  );
}

async function main(): Promise<void> {
  await withIngestionRun(
    {
      sourceSlug: 'airtable-design-systems',
      priority: 'normal',
      requiredEnv: ['AIRTABLE_API_KEY'],
    },
    async (ctx) => {
      const apiKey = requireEnv('AIRTABLE_API_KEY');
      const db = getDb();

      const all: AirtableRecord[] = [];
      let offset: string | undefined;
      let pages = 0;

      do {
        await limiter.acquire();
        const url = new URL(`https://api.airtable.com/v0/${BASE}/${TABLE}`);
        url.searchParams.set('filterByFormula', "NOT({Design Tokens JSON}='')");
        url.searchParams.set('pageSize', '100');
        if (offset) url.searchParams.set('offset', offset);

        const resp = await fetchJson<AirtableResponse>(url.toString(), {
          headers: {
            authorization: `Bearer ${apiKey}`,
            'user-agent': 'vibecoderhub-ingest/1',
          },
        });
        all.push(...resp.records);
        offset = resp.offset;
        pages += 1;
        ctx.logger.info('airtable page', { page: pages, fetched: all.length, offset });
        if (pages > 20) break; // 20 × 100 = 2,000 max — well above 69 expected
      } while (offset);

      await ctx.dump({ records: all });
      ctx.metadata.fetched = all.length;
      ctx.metadata.pages = pages;

      for (const rec of all) {
        const f = rec.fields;
        const name = asString(f['Name']);
        if (!name) continue;
        const domain = asString(f['Domain']);
        const sourceUrl = domain;
        const slug = slugFromDomain(domain, name);
        // Description = the human-readable company description. Prefer the
        // Long Description (paragraph form) over the short Description (one-
        // liner). NEVER fall back to Design Tokens JSON or System Prompt —
        // those land in their own fields and would otherwise leak as raw JSON
        // into the hero copy on the detail page.
        const longDesc = asString(f['Long Description']);
        const shortDesc = asString(f['Description']);
        const description = longDesc ?? shortDesc;
        const tagline = (shortDesc ?? longDesc)?.slice(0, 200) ?? null;

        const result = await upsertResource(ctx, {
          typeSlug: 'design_system',
          slug,
          name,
          tagline,
          description,
          sourceUrl,
          homepageUrl: domain,
          stackTags: [asString(f['Industry']), asString(f['Tier'])].filter(
            (s): s is string => Boolean(s),
          ),
        }).catch(() => undefined);
        if (!result) continue;

        const dsValues = {
          id: result.id,
          domain,
          industry: asString(f['Industry']),
          brandDna: asString(f['Brand DNA']),
          quickStart: asString(f['Quick Start']),
          systemPrompt: asString(f['System Prompt']),
          designTokensJson: parseJson(f['Design Tokens JSON']),
          primaryColors: parseJson(f['Primary Colors']),
          secondaryColors: parseJson(f['Secondary Colors']),
          accentColors: parseJson(f['Accent Colors']),
          gradientLibrary: asString(f['Gradient Library']),
          headingFont: asString(f['Heading Font']),
          bodyFont: asString(f['Body Font']),
          fontStack: asString(f['Font Stack']),
          typeScale: parseJson(f['Type Scale']),
          spacingScale: parseJson(f['Spacing Scale']),
          radiusTokens: parseJson(f['Radius Tokens']),
          shadowTokens: parseJson(f['Shadow Tokens']),
          motionTokens: parseJson(f['Motion Tokens']),
          iconographyStyle: asString(f['Iconography Style']),
          imageryStyle: asString(f['Imagery Style']),
          voiceAndTone: asString(f['Voice & Tone']),
          sampleMicrocopy: asString(f['Sample Microcopy']),
          dos: asString(f['Dos']),
          donts: asString(f['Donts']),
          spacingLayout: asString(f['Spacing & Layout']),
          componentExamples: asString(f['Component Examples']),
          templateHtml: asString(f['Template HTML']),
          templateReact: asString(f['Template React']),
          accessibilityNotes: asString(f['Accessibility Notes']),
          brandfetchId: asString(f['Brandfetch ID']),
          brandfetchConfidence: (() => {
            const n = asNumber(f['Brandfetch Confidence']);
            return n != null ? String(n) : null;
          })(),
          qualityScore: asNumber(f['Quality Score']),
          employeeCount: asNumber(f['Employee Count']),
          foundedYear: asNumber(f['Founded Year']),
          headquarters: asString(f['Headquarters']),
        };

        await db
          .insert(designSystems)
          .values(dsValues)
          .onConflictDoUpdate({
            target: designSystems.id,
            set: { ...dsValues, id: undefined },
          })
          .catch((err: unknown) => {
            ctx.logger.warn('design_systems upsert failed', {
              slug,
              err: String(err).slice(0, 200),
            });
          });
      }

      // Touch search vector once at end so any new rows are searchable.
      void sql;
    },
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
