/**
 * Boot Step 1 — Zod-validated environment variables.
 *
 * App fails to start with a clear error if any required var is missing or invalid.
 * Optional vars validated where present; allowed empty otherwise.
 *
 * Per ARCHITECTURE.md §20:
 *   - Three envs: local | preview | production
 *   - Public vars prefixed NEXT_PUBLIC_ (these ship to browser)
 *   - Production secrets in Vercel; local secrets in .env.local
 *
 * Per .env.example "no external services" mode:
 *   Dummy keys (sk_test_dummy, whsec_dummy, etc.) are accepted in local-dev so
 *   the app can boot without external accounts wired up. Real services wire
 *   slice-by-slice as needed.
 */

import { z } from 'zod';

// ── Helpers ────────────────────────────────────────────────────────────────

const optionalUrl = z
  .string()
  .url()
  .or(z.literal(''))
  .optional()
  .transform((v) => (v === '' ? undefined : v));

const requiredString = z.string().min(1, 'must not be empty');

// Allows real keys OR dummy placeholders for local-dev "no external services" mode.
const apiKey = (prefix: string) =>
  z.string().refine(
    (v) => v.startsWith(prefix) || v.startsWith(`${prefix}dummy`),
    { message: `must start with "${prefix}"` },
  );

// ── Schema ──────────────────────────────────────────────────────────────────

const envSchema = z.object({
  // ── Runtime ────────────────────────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  VCH_ENV: z.enum(['local', 'preview', 'production']).default('local'),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),

  // ── Public (NEXT_PUBLIC_) ──────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: requiredString.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: requiredString,
  NEXT_PUBLIC_POSTHOG_KEY: apiKey('phc_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: apiKey('pk_'),
  NEXT_PUBLIC_SITE_URL: requiredString.url(),
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,

  // ── Supabase (server) ──────────────────────────────────────────────────
  SUPABASE_SERVICE_ROLE_KEY: requiredString,
  DATABASE_URL_POOLED: requiredString.url(),
  DATABASE_URL_DIRECT: requiredString.url(),

  // ── Auth ───────────────────────────────────────────────────────────────
  ADMIN_GITHUB_USER_IDS: z
    .string()
    .default('')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => {
          const n = parseInt(s, 10);
          if (Number.isNaN(n) || n <= 0) {
            throw new Error(`ADMIN_GITHUB_USER_IDS contains non-numeric value: "${s}"`);
          }
          return n;
        }),
    ),

  // ── Stripe ─────────────────────────────────────────────────────────────
  STRIPE_SECRET_KEY: apiKey('sk_'),
  STRIPE_WEBHOOK_SECRET: apiKey('whsec_'),
  STRIPE_PRICE_ID_PRO_YEARLY: apiKey('price_'),

  // ── Resend ─────────────────────────────────────────────────────────────
  RESEND_API_KEY: apiKey('re_'),
  RESEND_FROM_TRANSACTIONAL: z
    .string()
    .email()
    .default('notify@vibecoderhub.com'),
  RESEND_FROM_NEWSLETTER: z
    .string()
    .email()
    .default('news@vibecoderhub.com'),
  RESEND_WEBHOOK_SECRET: requiredString,

  // ── OpenAI (embeddings) ────────────────────────────────────────────────
  OPENAI_API_KEY: apiKey('sk-'),
  OPENAI_EMBEDDINGS_MONTHLY_BUDGET_USD: z.coerce.number().positive().default(50),

  // ── Replicate (NSFW) ───────────────────────────────────────────────────
  REPLICATE_API_TOKEN: apiKey('r8_'),

  // ── Cloudflare R2 ──────────────────────────────────────────────────────
  R2_ACCOUNT_ID: requiredString,
  R2_ACCESS_KEY_ID: requiredString,
  R2_SECRET_ACCESS_KEY: requiredString,
  R2_BUCKET_NAME: z.string().default('vch-raw-dumps'),
  R2_PUBLIC_URL: optionalUrl,

  // ── GitHub (ingestion) ─────────────────────────────────────────────────
  GITHUB_INGESTION_TOKEN: apiKey('ghp_'),

  // ── Sentry (server) ────────────────────────────────────────────────────
  SENTRY_AUTH_TOKEN: z.string().optional().default(''),
  SENTRY_ORG: z.string().default('vibecoderhub'),
  SENTRY_PROJECT: z.string().default('vibecoderhub-web'),

  // ── PostHog (server) ───────────────────────────────────────────────────
  POSTHOG_API_KEY: apiKey('phc_'),

  // ── Ops ────────────────────────────────────────────────────────────────
  SLACK_OPS_WEBHOOK_URL: optionalUrl,
});

// ── Parse + export ──────────────────────────────────────────────────────────

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
   
  console.error('\n❌ Invalid environment variables:\n');
  for (const issue of parsed.error.issues) {
     
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
   
  console.error(
    '\nCopy .env.example → .env.local and fill in the missing values.',
    '\nFor local-dev "no external services" mode, see the bottom of .env.example.\n',
  );
  throw new Error('Invalid environment variables — see logs above');
}

export const env = parsed.data;

// ── Derived helpers ─────────────────────────────────────────────────────────

export const isDev = env.NODE_ENV !== 'production';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const isLocalDev = env.VCH_ENV === 'local';

/**
 * Detects whether a key is a local-dev placeholder (per .env.example dummy convention).
 * Used by lib/server/* clients to mock external service calls in local dev without
 * real credentials.
 */
export function isDummyKey(key: string): boolean {
  return /^(sk|pk|phc|whsec|re|sk-|r8|ghp|price)_dummy$/.test(key) || key.endsWith('dummy');
}
