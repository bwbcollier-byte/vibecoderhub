# Pass 1 — Visual Consistency Sweep

**Lens:** Senior designer reviewing visual coherence.
**Scope:** Sampled `/`, `/models`, `/mcps`, `/pricing`, `/compare`, `/deals`, `/best-for/saas-weekend`, `/privacy` at 1440×900. Spot-checked `/models/claude-opus-4-7` detail.
**Method:** `getComputedStyle` + screenshots + visual diff against TOKEN_RECONCILIATION.md.

## Verified

| Check | Status | Notes |
|---|---|---|
| 1. Button height variants used consistently | ✓ | Three canonical heights observed: `sm` (32px, used in header), `md` (36px, used in inline secondary CTAs / Subscribe button), `lg` (48px, used in hero CTAs). Each tied to a Button variant, not ad-hoc. |
| 2. Card density consistent | ✓ | Resource cards across all 24 types share `p-5` (20px) + `rounded-tile` (20px). Pillar tiles + pricing tiles use `p-8` (32px) — distinct purpose, deliberate. |
| 3. Section spacing | ✓ | Vertical rhythm uses 64/96/128px section gaps (`py-16` / `py-24` / `py-32`) consistently. Hero blocks always `py-16` first, content sections follow at `py-24`. |
| 4. Typography pairing | ✓ | Bebas Neue display → DM Sans body → Space Mono mono-caps kicker. All three loaded; `h1` computed `Bebas Neue` at hero sizes (verified 152px on home). |
| 5. Colour discipline | ✓ | Mint (`rgb(60,255,208)`) on primary CTAs / active-nav / editor's-pick at index pos 0 (models) or pos 4 (mcps); UV on Pro / featured / opposite editor's-pick slot; no stray accents observed. |
| 6. Icons from same set | ✓ | Custom `Icon.*` wrapper component, 1.6px stroke, Lucide-style SVGs. 15 icons rendered on home all consistent. |
| 7. Empty states | ✓ | Single `EmptyState` primitive in `components/empty-states/` consumed by every list (bookmarks, compare with no ids, search-no-results). |
| 8. Loading skeletons | ✓ | Shared `Skeleton` primitive with shimmer keyframe. ModelsList, McpsList, GenericResourceIndex all use the same skeleton card dimensions (matches real card height 204px). |
| 9. Forms consistent | ✓ | Label position above field; mono-caps `text-[10px]` kicker label style; mint focus ring; inline error in `text-[12px] text-error-red` below field. Submit + Settings + Newsletter signup all match. |

## Issues found

**P0:** none.
**P1:** none.
**P2:**
- `/compare` table on mobile (<720px viewport): table sets `minWidth: 720` and the parent `overflow-x-auto` makes it horizontally scrollable, but there's no visual *hint* that scrolling is possible. Adding a faded-edge mask or `↔` chip would improve discoverability. **Deferred to Phase 2.**

**P3:**
- Mint button height in header (32px) feels tight next to the 48px hero CTA below. Acceptable as different button variants serve different purposes, but a touch more visual harmony could be achieved by reducing hero CTAs to 44px. Subjective — not actioning.

## Fixes landed this pass
None — site is visually coherent. Header overflow (the real visual bug) was already fixed Session 13.

## Conclusion
Pass 1 PASS. Visual consistency is in shape for launch. The Promptkit-faithful palette + token-driven sizing + single-source primitive components mean inconsistencies are very rare.
