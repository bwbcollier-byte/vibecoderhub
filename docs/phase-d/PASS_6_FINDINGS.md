# Pass 6 — Screenshot Review

**Lens:** Side-by-side visual comparison against Promptkit reference.
**Scope:** Pages screenshotted across Sessions 12, 13, and 14 at 1440×900 + 375×812. Promptkit reference at `docs/planning/promptkit-recon/Promptkit.html` is a Babel-in-browser SPA which cannot be trivially served alongside the dev server for live overlay diff. Used the recon screenshots + spec docs (TOKEN_RECONCILIATION.md) as the reference source instead.

## Pages screenshotted

| Page | 1440 | 375 | Promptkit fidelity |
|---|---|---|---|
| `/` (home) | ✓ | ✓ | Hero "EVERY PRIMITIVE / A VIBE CODER NEEDS" with mint second-line — matches Promptkit. Stats strip 5-column at desktop, 2-col at mobile. Pillar tiles (Find/Try/Ship) 3-up with mint/uv/yellow rotation. |
| `/models` | ✓ | ✓ | Editor's-pick mint at pos 0, UV at pos 4. Filter pills row + search input. Card grid 3-up desktop, 1-up mobile. |
| `/models/claude-opus-4-7` | ✓ | – | Hero + 4-up stats + 4 tabs + right rail with Try-it / Alternatives / Source. |
| `/mcps` | ✓ | – | UV pick at 0, mint pick at 4 (reverse of /models per D37). |
| `/deals` | ✓ | ✓ | "$388K+ in credits" hero. Pro deals UV-blur overlay with lock + upgrade pill. Member + public tiers distinct. |
| `/best-for/saas-weekend` | ✓ | – | Numbered ranks (60px Bebas mint #1) + cards. JSON-LD ItemList confirmed (Session 11). |
| `/compare?ids=…` | ✓ | ✓ | Side-by-side grid, 11 conditional rows, mint highlight on blended-cost row. |
| `/pricing` | ✓ | ✓ | 3 tiers, Member centred-recommended, Pro UV-accent + recommended badge. |
| `/privacy` | ✓ | ✓ | `max-w-prose` reading column, Bebas section headings, hairline dividers. |
| 404 page | ✓ | – | Mint "404" kicker, "PAGE NOT FOUND" h1, mint "Go home" CTA, ghost "Search (⌘K)" ghost, "Popular destinations" link row. |

## Visual deviations from Promptkit

**None at the structural level.** Session 6 already addressed the root-cause Tailwind v4 issue (commit `e1e9926`) where `@theme` wasn't being read — once that landed, every page snapped to the full Promptkit palette. Sessions 7–13 layered new pages on top of that fixed token foundation, so by construction they inherit the canonical palette + typography + radii.

**Minor calibration items (P2/P3) — punted to Phase 2 polish:**
- `/compare` mobile lacks a horizontal-scroll affordance (faded edge / chevron). Function works; affordance missing.
- Mobile bookmark below `2xl` loses the count-chip visibility (chip hidden, action still toasts).

## Before/After

Only one visual fix was applied this session-cluster:
- **Header overflow at 1440px** (Session 13). Before: wordmark wrapping into 99px tall stack + "Get started" button clipping past viewport right. After: header content fits inside 1440 (last button right:1408). Captured in Session 13 commit `844ad65`.

No further before/after captures were necessary this pass — pages compared to the (already-faithful) Promptkit reference required zero structural changes.

## Conclusion
Pass 6 PASS. Visual fidelity to Promptkit is in good shape because the build leans hard on tokens. The two outstanding P2 items (compare mobile affordance, bookmark below-2xl chip) are deliberate Phase-2 deferrals — they don't break the visual feel.
