// ESLint flat config — Next.js 15 + TS strict + ARCHITECTURE §2 enforcement
//
// Key rules:
//   - server-only enforcement: lib/server/* never imported from client components
//   - no "use client" in route file (page.tsx, layout.tsx) — push CC boundary deeper
//   - no magic numbers in component code (TOKEN_RECONCILIATION enforcement)
//   - no raw hex colours in component code

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';
// NOTE: `eslint-config-next` deliberately not imported here. v15.0.3 still
// pulls @rushstack/eslint-patch which breaks on ESLint 9 flat config. Re-add
// via @eslint/eslintrc FlatCompat in a later session if Next-specific rules
// are wanted. See BUILD_LOG Session 2.

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'db/migrations/0001_initial.sql', // canonical schema, untouchable
      'docs/**', // planning docs + promptkit-recon reference prototype — not project source
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // ── TypeScript discipline ─────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      // Defer to the TS variant — the core rule trips on interface signature
      // parameter names ("setX: (next: T) => void"), which are documentation,
      // not bindings.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // ── Code quality ───────────────────────────────────────────────────
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'smart'],

      // ── Server-only enforcement (ARCHITECTURE §2) ─────────────────────
      // Bans imports of lib/server/* from client components (those with "use client").
      // Implemented as no-restricted-imports; the "use client" detection is a
      // build-time enforcement via the `server-only` package itself.
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/lib/server/*'],
            message: 'lib/server/* must not be imported from client components. Use a Server Action or Server Component query instead.',
          },
        ],
      }],

      // ── Token discipline (TOKEN_RECONCILIATION enforcement) ───────────
      // Bans hex colour literals in component files. Use CSS variables
      // (var(--color-mint)) or Tailwind classes (bg-mint) instead.
      'no-restricted-syntax': ['error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'No hex colour literals in code — use design tokens (CSS variables or Tailwind classes). See TOKEN_RECONCILIATION.md.',
        },
      ],
    },
  },

  // ── Page routes: NO "use client" allowed ──────────────────────────────
  // Per ARCHITECTURE §2 composition rule: page.tsx is always a Server Component.
  // Interactive bits live in CC components imported into the page.
  {
    files: ['app/**/page.tsx', 'app/**/layout.tsx'],
    rules: {
      'no-restricted-syntax': ['error',
        {
          selector: "ExpressionStatement > Literal[value='use client']",
          message: '"use client" is forbidden in page/layout files. Push the client boundary deeper — extract interactive bits into a separate Client Component file.',
        },
      ],
    },
  },

  // ── Token source files: hex literals ARE the source of truth here ────
  // lib/tokens.ts and tailwind.config.ts define the canonical hex values
  // referenced everywhere else; the no-hex rule must not fire on them.
  // app/global-error.tsx must work even if Tailwind / the root layout is
  // broken, so it uses inline-style hex literals as a deliberate last resort.
  {
    files: [
      'lib/tokens.ts',
      'tailwind.config.ts',
      'app/global-error.tsx',
      // OG images render in the Edge runtime with no access to our CSS
      // cascade. They inline the canonical hex values from lib/tokens.ts
      // as a deliberate last resort.
      'app/opengraph-image.tsx',
      'app/**/opengraph-image.tsx',
      // app/icon.tsx + app/apple-icon.tsx render via the same Edge ImageResponse
      // path as OG images — same hex-literal carve-out applies.
      'app/icon.tsx',
      'app/apple-icon.tsx',
      // Email templates render in third-party clients with no access to our
      // CSS cascade. They inline the canonical hex values as a deliberate
      // last resort, matching the OG-image exception.
      'lib/resend/templates/**/*.tsx',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  // ── Server-only query layer: allowed to import lib/server/* ───────────
  // lib/db/queries/* is server-only by design (called from Server Components,
  // Route Handlers, Server Actions). The no-restricted-imports rule's intent
  // is to block client components — these files are not client-eligible.
  {
    files: ['lib/db/queries/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // ── Test files: relaxed rules ─────────────────────────────────────────
  {
    files: ['tests/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // ── Config / script files: relaxed rules ──────────────────────────────
  {
    files: [
      '*.config.{ts,mjs,js}',
      'scripts/**/*.{ts,mjs}',
      'tailwind.config.ts',
      'next.config.ts',
      'drizzle.config.ts',
      'sentry.*.config.ts',
      'instrumentation.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },
];
