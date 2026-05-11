# Pass 4 — Accessibility & Performance Sweep

**Lens:** A11y auditor + perf engineer.
**Scope:** Sampled `/`, `/models`, `/models/[slug]` for a11y. Used build output for perf bundle analysis. Lighthouse was not run — `preview_*` tools don't expose Lighthouse, and a manual run is owed before launch.

## A11y

| Check | Status | Notes |
|---|---|---|
| 1. Tab order logical | ✓ | Skip-link → header buttons → main content → footer. No `tabindex` overrides found. |
| 2. Skip-to-content link | ✓ | `components/layout/skip-link/SkipLink.tsx` mounts first in layout. Targets `#main`. Visible only on focus (Tailwind `sr-only focus:not-sr-only`). |
| 3. Heading hierarchy | ✓ | Exactly 1 `<h1>` per page sampled. No skipped levels in section structure. |
| 4. Image alt text | ✓ | Site uses SVG icons (component-level `aria-label` or `aria-hidden`) and CSS backgrounds — `<img>` count is 0 on home and /models. When real avatars / OG images land (Slice 11+), audit again. |
| 5. Form inputs labelled | ✓ | All inputs have explicit `aria-label` (search, newsletter, Cmd-K) or implicit wrapping `<label>` (open-weights checkbox in ModelsList wraps `<input>` inside `<label>`, valid a11y pattern). |
| 6. Focus rings visible in dark mode | ✓ | Tailwind default focus ring uses currentColor with offset; verified via tab navigation on header chips. |
| 7. `prefers-reduced-motion` respected | ✓ | `ReducedMotionProvider` (Session 3) reads `matchMedia('(prefers-reduced-motion: reduce)')` and exposes via context; toast + Cmd-K + cookie banner respect it. Animations gated. |
| 8. Colour contrast | ✓ | Body text `rgb(255,255,255)` on canvas `rgb(19,19,19)` → contrast ratio ≈16:1 (AAA). Mint (`rgb(60,255,208)`) on black → ≈14:1 (AAA). Subtext `text-text-secondary` on canvas needs spot-check at launch — visually ≈7:1, passes AA. |
| 9. Lighthouse audit ≥95 | ⏸ | **Not run this session.** Owed before launch — run `npx lhci autorun` or open Chrome DevTools → Lighthouse on `/`, `/models`, `/models/claude-opus-4-7`. |

## Performance

| Check | Status | Notes |
|---|---|---|
| 1. Lighthouse perf audit ≥90 | ⏸ | Same as a11y — owed before launch. |
| 2. Bundle sizes ≤200 KB (≤300 for `/models/[slug]`) | ✓ | Build output: shared chunks 99.8 kB; index routes 100-131 kB First Load JS; detail routes 117 kB. `/submit` is the heaviest at 126 kB (Zod adds ~19 kB). All under budget. |
| 3. CLS <0.1 | ⏸ | Owed Lighthouse run. No obvious source of late-loading layout-shifting content (no async-injected ads/embeds; fonts via `next/font` with `display: swap` preloaded). |
| 4. `next/image` with dimensions | n/a | No real images yet (icons are SVG, avatars cookie-stubbed). When ingestion lands actual image URLs (Slice 11+), enforce. |
| 5. Fonts load without FOUT/FOIT | ✓ | `next/font/google` loads Bebas Neue, DM Sans, Space Mono with `display: swap` + variable bindings in `app/layout.tsx`. CSS variables `--font-display`, `--font-body`, `--font-mono` exposed; fonts attach correctly post-hydration. Verified `h1` computes to `Bebas Neue` after initial paint. |

## Issues found

**P0:** none.
**P1:**
- **Lighthouse audits not run this session.** Schedule a 15-min manual pass before public launch on `/`, `/models`, `/models/claude-opus-4-7`, `/pricing` at both desktop + mobile. Target a11y ≥95, perf ≥90. Capture JSON outputs.

**P2:**
- Lower-contrast secondary text (`text-text-secondary`) on dark cards (`bg-mint/5`) — visually OK but worth a contrast-checker pass before launch.

**P3:**
- Real image alt text policy will need authoring when avatars / OG images go live.

## Fixes landed this pass
None — site is in good a11y shape. Implicit-label check (initial false-alarm finding) confirmed valid HTML pattern.

## Conclusion
Pass 4 PASS with one **owed action**: run Lighthouse before launch. Site a11y posture is strong out of the box because dark-only + brutalist hierarchy + token-driven sizing all favour accessibility.
