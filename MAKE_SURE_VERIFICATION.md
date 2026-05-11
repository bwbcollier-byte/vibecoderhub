# MAKE_SURE_VERIFICATION.md

*The Make-Sure checklist walked per slice. Append a section per slice with checked items + notes.*

> **Convention.** Per the build prompt's per-slice ritual: every slice walks the applicable Make-Sure items from the build prompt + DEFINITION_OF_DONE.md, marks each ✓ verified or ▸ N/A or ✗ deferred (with reason → KNOWN_ISSUES.md). No silent skips.

---

## Session 1 — Boot Steps 1-2 (foundation tokens layer)

This isn't a user-facing slice; it's the foundation that the foundation slice + every later slice depends on. Make-Sure items applicable here are the cross-cutting **Code Quality** + **Documentation** + **Visual Consistency (token foundation only)** sections.

### Cross-cutting "every slice" gates (DEFINITION_OF_DONE §15)

- ✗ `pnpm typecheck` zero errors — NOT VALIDATED. Cowork sandbox didn't run `pnpm install` (network/time cost). Ben to validate locally before Session 2.
- ✗ `pnpm lint` zero warnings — NOT VALIDATED. Same.
- ✗ `pnpm build` zero warnings — NOT VALIDATED. Same.
- ▸ Vitest tests — N/A (no test code yet).
- ▸ Playwright tests — N/A (no e2e yet).
- ✓ `BUILD_LOG.md` updated.
- ▸ Conventional Commits commit + push — N/A (no `git init` yet; Ben initialises repo on first push).
- ✓ Brief checkpoint to Ben (in chat).

### Visual consistency (token foundation only)

- ✓ All colours come from CSS variables in globals.css; no hex literals in component code (none exist yet to check).
- ✓ All spacing values come from the 4px-base scale (`--space-1` … `--space-24`); off-grid values restricted (`--space-px` + `--space-0.5` for borders only; `--space-9-exception` for TypeBadge only).
- ✓ All radii from the 11-slot scale (`--radius-none` … `--radius-full`).
- ✓ Button heights locked (5 slots `--btn-h-xs` … `--btn-h-xl`).
- ✓ Input heights locked (3 slots).
- ✓ Z-index 8-tier scale; nothing above `--z-tooltip` (70).
- ✓ Animation tokens locked (`--duration-fast/base/slow` + `--ease-out/in/in-out`).
- ✓ Focus ring spec locked (cyan colour, 2px stroke, 2px offset).

### Code quality

- ✓ TS strict + `noUncheckedIndexedAccess` + `noImplicitOverride` + `noFallthroughCasesInSwitch` enabled.
- ✓ ESLint flat config — no `any`, no `console.log` (warn/error allowed), no `debugger`, prefer-const, eqeqeq.
- ✓ Server-only enforcement: `no-restricted-imports` blocks `@/lib/server/*` from client components.
- ✓ Route file enforcement: `no-restricted-syntax` blocks `"use client"` in `app/**/page.tsx` and `app/**/layout.tsx`.
- ✓ Hex literal block: `no-restricted-syntax` blocks `^#[0-9a-fA-F]{3,8}$` literals.
- ✓ Test files have relaxed rules (no `any` ban, console allowed).
- ✓ Config files have relaxed rules.
- ✗ ESLint zero warnings — NOT VALIDATED (no `pnpm lint` run yet).

### Documentation

- ✓ `.env.example` — every required env var documented with comment + local-dev mode instructions at bottom.
- ✓ `BUILD_LOG.md` — Session 1 entry complete.
- ✓ `KNOWN_ISSUES.md` — created with deferrals from Phase A + Session 1.
- ✓ `IDEAS_DURING_BUILD.md` — created (empty).
- ✓ `MAKE_SURE_VERIFICATION.md` — this file.
- ✗ `README.md` — pending Session 2.
- ✗ `CONTRIBUTING.md` — pending Session 2.

### Items NOT applicable to Session 1 (will validate per slice)

- Visual consistency (per-component) — N/A (no components yet)
- List/index views — N/A (no pages yet)
- Detail pages — N/A
- Buttons / forms / overlays — N/A
- Responsive design — N/A
- Theming (dark mode default; light deferred) — N/A
- Accessibility — N/A (will validate per page)
- Performance — N/A
- Data integrity — N/A (no DB queries yet)
- State management — N/A
- URL routing — N/A
- Security (rate-limit / auth / RLS / Stripe / sanitize) — N/A
- Auth flows — N/A (Boot Step 6)
- Stripe — N/A (Foundation slice)
- Ingestion jobs — N/A (Track E sliced separately)
- Email — N/A
- SEO — N/A (Foundation slice partially; full SEO slice 29)
- Analytics — N/A (Boot Step 7)
- Error handling — N/A (Boot Step 11 route group error boundaries)
- Microcopy + content quality — N/A
- Onboarding + first-run — N/A (Foundation slice)
- Print / share / embed — N/A
- i18n — N/A (Boot Step 12 sets up t() helper)
- Privacy + cookie consent — N/A (Boot Step 7 wires CookieBanner)
- Production readiness — N/A
- Cross-browser — N/A

---

## (Future sessions append below per slice)
