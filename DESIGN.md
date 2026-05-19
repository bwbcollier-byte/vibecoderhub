# PromptKit Design System

*Last updated: 2026-05-17. Authoritative consolidation of the existing token system. Implementation lives in [lib/tokens.ts](lib/tokens.ts), [app/globals.css](app/globals.css), and [app/layout.tsx](app/layout.tsx).*

This document consolidates the existing design system into one readable spec. The CSS variables, Tailwind v4 `@theme` block, and TypeScript token export already encode every value below. **This file is the reading-order entry point; the code files are the runtime truth.** When values diverge, the code wins, then this file gets updated.

For exhaustive per-token rationale see [docs/planning/TOKEN_RECONCILIATION.md](docs/planning/TOKEN_RECONCILIATION.md).

## Register

**Hybrid.** PromptKit ships a marketing surface (landing, pricing, showcase, docs-for-llms) and a deep product surface (commands, skills, assets, design-systems, marketplaces). The brand register and product register share tokens but differ in density and motion. Landing and pricing get full editorial treatment. Product surfaces stay calm and dense.

## Internal Code Name

The codebase still references **Vibe Coder Hub** as the working title. The public brand is **PromptKit**. Treat the two names as synonyms until a rename pass lands.

## Aesthetic Position

Editorial dark UI with bold display typography. Equal parts product directory and developer magazine. The interface is what a "vibe coder" would expect: legible, opinionated, dense with data, but never apologetic about its own visual choices.

**Anti-references:** Generic Tailwind blue. Light-mode SaaS pastel. The "centered hero with three feature cards" template. Anything that looks like Vercel's homepage or Linear's marketing site without the editorial spine.

## Color System

Restrained-leaning-Committed strategy. The dark canvas does most of the work; mint and ultraviolet are the two committed accents, with a tile palette used selectively for taxonomy and content typing.

### Surface and Text

| Token | Hex | Role |
|---|---|---|
| `--color-canvas` | `#131313` | Page background. Near-black with a warm tint. |
| `--color-canvas-deep` | `#0a0a0a` | Deeper recessed surfaces. |
| `--color-surface` | `#2d2d2d` | Cards, panels, raised content. |
| `--color-image-frame` | `#313131` | Image and media frames. |
| `--color-text-primary` | `#ffffff` | Primary text. (Note: pure white. Flagged for review against the "no pure white" law; current implementation choice.) |
| `--color-text-body` | `#cfcfcf` | Body copy. |
| `--color-text-secondary` | `#949494` | Captions, metadata. |
| `--color-text-muted` | `#e9e9e9` | Quiet primary text on dark surfaces. |
| `--color-text-inverted` | `#131313` | Text on bright accents. |
| `--color-dim` | `#8c8c8c` | Dim states, disabled. |

### Brand Accents

| Token | Hex | Role |
|---|---|---|
| `--color-mint` | `#3cffd0` | Primary accent. Hero, key CTAs, the "this is alive" signal. |
| `--color-ultraviolet` | `#5200ff` | Secondary accent. Pair with mint for contrast pairs. |
| `--color-mint-border` | `#309875` | Mint border treatment. |
| `--color-purple-rule` | `#3d00bf` | UV-family rule lines and dividers. |
| `--color-uv-label` | `#b69dff` | Light UV label color on dark surface. |

### Tile Palette (taxonomy)

For content typing across resource types (skills, MCPs, components, agents, models, deals). Each tile color signals a category; use deliberately, never decoratively.

| Token | Hex | Typical Pairing |
|---|---|---|
| `--color-tile-mint` | `#3cffd0` | text-inverted |
| `--color-tile-purple` | `#5200ff` | text-primary |
| `--color-tile-yellow` | `#f5e642` | text-inverted |
| `--color-tile-pink` | `#ff3cac` | text-inverted |
| `--color-tile-orange` | `#ff6b35` | text-inverted |
| `--color-tile-blue` | `#1e6efa` | text-primary |
| `--color-tile-white` | `#ffffff` | text-inverted |

### Semantic

| Token | Hex |
|---|---|
| `--color-error` | `#5200ff` (uses UV) |
| `--color-error-red` | `#ff6b6b` |
| `--color-focus` | `#1eaedb` |
| `--color-link-hover` | `#3860be` |

## Typography

Three families loaded via `next/font/google` in [app/layout.tsx](app/layout.tsx).

| Role | Font | CSS Variable | Tailwind |
|---|---|---|---|
| Display | Bebas Neue | `--font-display` | `font-display` |
| Body / UI | DM Sans | `--font-sans` | `font-sans` |
| Data / code / monospace | Space Mono | `--font-mono` | `font-mono` |

**Scale ratio:** display uses tight industrial proportions; body uses 1.25 (major third) for hierarchy. Bebas Neue is condensed and high-impact, used at large sizes only; DM Sans handles every body and UI surface. Space Mono is for code, prompts, IDs, and tabular data.

**Portfolio convention:** Space Mono is PromptKit's data face. The cross-app Rascals convention says "data is JetBrains Mono" but PromptKit was tokenized before that decision and committing to Space Mono is a deliberate exception. See decisions.md 2026-05-17.

## Layout

### Container scale

Overrides Tailwind defaults so naming is intuitive.

| Token | Width |
|---|---|
| `--container-sm` | 640px |
| `--container-md` | 768px |
| `--container-lg` | 1024px |
| `--container-xl` | 1280px (page default) |
| `--container-xxl` | 1440px |
| `--container-prose` | 720px |

### Radius scale (11-slot)

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Hairlines, micro-controls |
| `--radius-sm` | 4px | Inputs |
| `--radius-md` | 8px | Buttons, small cards |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Panels |
| `--radius-tile` | 20px | Content tiles |
| `--radius-feature` | 24px | Feature blocks |
| `--radius-promo` | 30px | Promotional surfaces |
| `--radius-pill` | 40px | Pills, tags |

### Heights (buttons / inputs / icon buttons)

| Size | Value |
|---|---|
| xs | 24px |
| sm | 32px |
| md | 40px |
| lg | 48px |
| xl | 56px |

### Spacing

Base unit: 4px. All margins and paddings flow from multiples of this base.

## Motion

- No animation on layout properties.
- Ease-out exponential curves only.
- Reduced-motion preference respected.

## Hard Rules

1. **Never inline literal hex / px / rem values.** ESLint blocks hex literals. Reviewers grep for `px`. All values flow through tokens.
2. **Component code references CSS variables OR Tailwind utilities mapped to tokens.** Both are valid; mixing both inside one component is fine.
3. **Container widths come from `--container-*`.** Do not introduce ad-hoc max-widths.
4. **Heights come from `--height-*`.** Do not introduce ad-hoc button heights.
5. **Radii come from the 11-slot scale.** Do not introduce intermediate values.

## Open Question

**Pure `#ffffff` as `--color-text-primary` violates the impeccable "never use pure #fff" law.** Current implementation choice. Documented here for visibility; reconsider whether a tinted near-white (`#fafafa` or `#f7f7f9`, slight cool tint matching the canvas warm tint) would land better. Not a blocker; a polish call for a future session.

## Scope Wall

PromptKit is its own brand inside the Rascals portfolio. It does NOT inherit the Rascals admin token vocabulary (`ink-*` / `line-*` / `brand-blue` / `font-data`). It does NOT inherit hype.works pink or drop.limited pink. The mint+ultraviolet palette is distinct on purpose: if a user has multiple Rascals products open at once, PromptKit should be visually unmistakable.

---

## Documented Exceptions

### 2026-05-19 — Migrations folder location (S5.6 exception)
PromptKit migrations live at `app/db/migrations/` (`0001_initial.sql`, `0002_rate_limit_buckets.sql`, `0003_ingestion_runs.sql`), not the canonical `app/supabase/migrations/` path. The schema IS versioned per S5.6; the location differs because PromptKit predates the `_template/` standardisation. Migrations apply via `lib/migrate.ts` invocation rather than Supabase CLI.
**Status:** Acceptable. Do NOT move to `supabase/migrations/` without testing migration-apply path first — silent move would break the apply mechanism.
**Reviewer:** Wong, Howard.
**Re-evaluate:** if/when PromptKit moves to native Supabase migrations (>2 hours of refactor work).

### 2026-05-17 — `#ffffff` as text-primary
Open Question above. Acceptable in v1; revisit during polish.

### 2026-05-17 — Space Mono as data face
See decisions.md. Acceptable exception to portfolio JetBrains Mono default.
