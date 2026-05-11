# TOKEN_RECONCILIATION.md

*The synthesis: Promptkit's visual identity wins, build-prompt's structural mechanism wins, both layered without contradiction.*

> **Why this document exists.** Promptkit (`src/tokens.css`) ships The Verge's editorial design system with idiosyncratic spacing (1, 2, 5, 6, 9, 14, 15, 25), 8 radius slots that don't follow a doubling scale (2, 3, 4, 20, 24, 30, 40, 50%), buttons sized by `padding + line-height` rather than locked heights, inputs at 2px radius for "typewriter feel." The build prompt locks 4px-base spacing, 5 button heights, 3 input heights, 6 radius slots, 8-tier z-index — to enforce consistency mechanically. **Both are right.** Promptkit's values are opinionated and on-brand; the build prompt's structure prevents drift. This document maps every Promptkit value into a structural slot so the codebase can reference tokens (no magic numbers) while preserving Promptkit's visual identity.

---

## §1 Methodology

Three classes of token, three reconciliation rules:

| Class | Examples | Rule |
|---|---|---|
| **Visual / brand** | colours, fonts, type scale | **Promptkit verbatim.** Build-prompt was deliberately conservative; Promptkit is the brand. |
| **Structural / mechanical** | spacing scale base, z-index tiers, animation durations, focus-ring spec | **Build-prompt wins.** These exist to enforce consistency, not to express brand. |
| **Hybrid** | button heights, input heights, radii vocabulary | **Build-prompt slot system, Promptkit values inside.** Number of slots is structural; the value living in each slot comes from Promptkit. |

**The single source of truth principle.** Every value the codebase uses must come from `lib/tokens.ts` (TS constants) or `app/globals.css` (CSS variables) or `tailwind.config.ts` (Tailwind theme extension). All three are derived from the same canonical source — `lib/tokens.ts` is authoritative, the others are generated/mirrored. **Zero magic numbers in component code.** No `mt-[13px]`, no `padding: 14px`, no `#3cffd0` — only `--space-3` / `--color-mint` / `var(--radius-tile)` etc.

---

## §2 Colours — Promptkit verbatim

Ports `src/tokens.css` lines 28–66 unchanged into `lib/tokens.ts` and `app/globals.css`. Light-mode values left undefined (deferred to Phase 2 per ruling R3); CSS variables resolve only against `:root` (which is dark) for now.

```ts
// lib/tokens.ts — colours (excerpt)
export const colors = {
  // Brand hazards
  mint:           '#3cffd0',  // Jelly Mint — primary CTA accent
  ultraviolet:    '#5200ff',  // Verge Ultraviolet — secondary hazard
  ultravioletA90: 'rgba(82, 0, 255, 0.9)',

  // Secondary accents
  mintBorder:     '#309875',  // Console Mint Border — card outlines on mint tiles
  linkHover:      '#3860be',  // Deep Link Blue — hover on ALL links
  focusCyan:      '#1eaedb',  // Focus Cyan — keyboard focus rings only
  purpleRule:     '#3d00bf',  // Purple Rule — StoryStream timeline rail

  // Surfaces
  canvas:         '#131313',  // Canvas Black — default page background
  surface:        '#2d2d2d',  // Surface Slate — secondary card bg
  imageFrame:     '#313131',  // Image Frame — 1px border on photography

  // Neutrals
  white:          '#ffffff',
  black:          '#000000',
  textPrimary:    '#ffffff',
  textSecondary:  '#949494',  // bylines, timestamps
  textMuted:      '#e9e9e9',  // button text on dark slate
  textInverted:   '#131313',  // on accent tiles
  dim:            '#8c8c8c',  // active/pressed button bg

  // Story tile accent fills (used by ResourceCard variants)
  tileMint:       '#3cffd0',
  tilePurple:     '#5200ff',
  tileYellow:     '#f5e642',
  tilePink:       '#ff3cac',
  tileOrange:     '#ff6b35',
  tileBlue:       '#1e6efa',
  tileWhite:      '#ffffff',

  // Semantic
  error:          '#5200ff',  // ultraviolet doubles as error accent
  overlay:        'rgba(0, 0, 0, 0.33)',
} as const;
```

Semantic role aliases (these are the names components reference, not the raw colours):

```ts
export const role = {
  // Backgrounds
  bgPage:        'var(--color-canvas)',
  bgCard:        'var(--color-canvas)',
  bgCard2:       'var(--color-surface)',
  bgCta:         'var(--color-mint)',
  bgCta2:        'var(--color-surface)',

  // Text
  textDefault:   'var(--color-text-primary)',
  textMeta:      'var(--color-text-secondary)',
  textOnMint:    'var(--color-black)',
  textOnUv:      'var(--color-white)',
  textLink:      'var(--color-white)',
  textLinkHover: 'var(--color-link-hover)',

  // Borders
  borderCard:        '1px solid var(--color-white)',
  borderCardMint:    '1px solid var(--color-mint-border)',
  borderImage:       '1px solid var(--color-image-frame)',
  borderActive:      '1px solid var(--color-mint)',
  borderPromo:       '1px solid var(--color-ultraviolet)',
  borderInput:       '1px solid var(--color-text-secondary)',
  borderInputFocus:  '1px solid var(--color-mint)',
  borderHairline:    '1px solid var(--color-surface)',
} as const;
```

> **Components reference role aliases, not raw hex values.** Cards say `bg: role.bgCard`, never `bg: '#131313'`. Promptkit's prototype uses inline styles like `background: '#131313'` everywhere — that's prototype-grade. We don't.

---

## §3 Typography — Promptkit verbatim, three families

Build-prompt cap: 3 fonts max. Promptkit ships 4 (Bebas Neue / DM Sans / Space Mono / Newsreader). **Newsreader dropped per ruling R4** — pull-quotes use DM Sans italic at larger size.

```ts
// lib/tokens.ts — typography
export const fonts = {
  display:  "'Bebas Neue', Impact, Helvetica, Arial, sans-serif",  // Manuka substitute
  sans:     "'DM Sans', Helvetica, Arial, sans-serif",              // PolySans substitute
  mono:     "'Space Mono', 'Courier New', Courier, monospace",      // PolySans Mono substitute
  // serif:  REMOVED — Newsreader dropped per R4
} as const;

// Type scale — Promptkit verbatim, 6 display + 4 heading + 9 label/body + 2 mono = 21 entries
export const type = {
  // Display (Bebas Neue) — marketing hero, hero wordmark, hero kickers
  hero:        { size: '6.69rem', weight: 900, lh: 0.95, ls: '0.07px' }, // 107px
  display2:    { size: '5.63rem', weight: 900, lh: 0.95 },               // 90px
  display3:    { size: '3.75rem', weight: 900, lh: 0.95 },               // 60px

  // Headings (DM Sans)
  headingXl:   { size: '2.13rem', weight: 700, lh: 1.00 },               // 34px — section headlines
  headingWide: { size: '2.00rem', weight: 400, lh: 1.10, ls: '0.32px' }, // 32px — wide headings
  headingMd:   { size: '1.50rem', weight: 700, lh: 1.00 },               // 24px — story tile
  headingSm:   { size: '1.25rem', weight: 700, lh: 1.00 },               // 20px — compact tile

  // Labels / body (DM Sans)
  labelLight:  { size: '1.19rem', weight: 300, lh: 1.20, ls: '1.9px' },  // 19px — thin caps eyebrow
  labelXl:     { size: '1.13rem', weight: 400, lh: 1.10, ls: '1.8px' },  // 18px — UPPERCASE kickers
  bodyBold:    { size: '1.00rem', weight: 700 },                         // 16px bold
  body:        { size: '1.00rem', weight: 500, lh: 1.60 },               // 16px reading body
  inline:      { size: '0.94rem', weight: 400, lh: 1.20, ls: '0.15px' }, // 15px — UI labels
  caption:     { size: '0.81rem', weight: 400, lh: 1.60 },               // 13px
  eyebrow:     { size: '0.75rem', weight: 400, lh: 1.30, ls: '1.8px' },  // 12px UPPERCASE kicker
  tag:         { size: '0.75rem',                          ls: '0.72px' }, // 12px UPPERCASE tag
  micro:       { size: '0.69rem',                          ls: '1.1px' },  // 11px UPPERCASE bylines
  nano:        { size: '0.63rem', weight: 500,             ls: '1.5px' }, // 10px UPPERCASE timestamps

  // Mono (Space Mono) — buttons, labels, timestamps
  monoBtn:     { size: '0.75rem', weight: 700, lh: 'computed', ls: '1.5px' }, // 12px button label (lh set per button height — see §6)
  monoTs:      { size: '0.69rem', weight: 700, lh: 1.20,        ls: '1.4px' }, // 11px StoryStream timestamp
} as const;
```

**Note on `monoBtn.lh: 'computed'`.** Promptkit sets `--type-mono-btn-lh: 2.00`, which gives 24px line-height for a 12px font — fine for `.btn` (40-ish total height) but not what we want now that buttons have locked heights. Per §6, the line-height for button labels is set to a constant 12px (no leading) and the height comes from padding. This is the cleanest math.

---

## §4 Spacing — 4px structural grid; Promptkit off-grid values audited

Build-prompt locks 4px base. Promptkit uses: `1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 20, 24, 25, 32, 40, 48, 64`. The off-grid values (`1, 2, 5, 6, 9, 10, 14, 15, 25`) are audited below; per Ben's guidance, **round to grid unless a specific visual reason is documented**.

### The reconciled scale

```ts
// lib/tokens.ts — spacing (4px base)
export const space = {
  0:   '0px',
  px:  '1px',   // hairlines / borders only — NOT a spacing value
  0.5: '2px',   // hairlines / borders only — NOT a spacing value
  1:   '4px',
  2:   '8px',
  3:   '12px',
  4:   '16px',
  5:   '20px',
  6:   '24px',
  8:   '32px',
  10:  '40px',
  12:  '48px',
  16:  '64px',
  20:  '80px',
  24:  '96px',
} as const;
```

`px` (1px) and `0.5` (2px) are reserved for **borders, hairlines, and letter-spacing** — they are NOT valid spacing values for `padding`, `margin`, or `gap`. Tailwind already enforces this convention; we lean on it.

### Off-grid value audit (Promptkit usages → reconciled disposition)

| Promptkit value | Where used in Promptkit | Reconciled |
|---|---|---|
| **1px** | Borders (`.btn`, `.card`, `.hairline`, focus-ring) | Keep as `--space-px`; valid for borders only. |
| **2px** | `.input` border-radius (typewriter feel), `.btn-sm` letter-spacing override (none found, in tags only) | Keep as `--space-0.5` for borders / `--radius-xs` for input radius (see §5). NOT a padding/margin value. |
| **5px** | `.btn-lg` font-size (10px in `.btn-sm`, 12px in `.btn-lg` — 5 not used directly) | Not used as spacing. Eliminated. |
| **6px** | `.btn-sm` padding (`6px 12px`); `.skeleton` gap; some `.col gap-6` instances | Replaced: button heights now derive from §6 spec (no 6px padding remains). Where `gap-6` (literal 6px) was used in cards' stat strips, **rounds to gap-2 (8px)**. Visual difference: stat-strip rows previously 28px tall → now 30px. Negligible. |
| **9px** | `.type-badge` padding (`3px 9px`) | **Documented exception kept as `--space-9-exception` for type badges only.** Rationale: 9px gives badges their distinctive thin proportion (h≈22px, fits stat strip). Rounding to 8 makes badges feel cramped (h≈20px). Single exception, single component, single CSS variable. |
| **10px** | `.btn` padding-y (`10px 18px`); `.input` padding-y (`10px 12px`); various card paddings | Replaced: button heights derive from §6 spec; input heights derive from §7 spec. Card paddings round to `--space-3` (12px) where Promptkit had 10. |
| **14px** | `.btn-lg` padding-y; `.card.hover` lift offset (some); various ad-hoc | Replaced: button-lg padding derives from §6 spec. Card lift offset becomes `transform: translateY(-1px)` which uses `--space-px`, not 14. |
| **15px** | Found once in tokens.css inline as label-light line-height computation; not an actual spacing value | Eliminated. |
| **25px** | Not found in actual usage (defined in `--space-25` but unused). | **Removed from CSS variable export.** |

**Net result.** The off-grid scale collapses to one documented exception (`--space-9-exception` for `TypeBadge` padding only) and one borders-only token (`--space-px`, `--space-0.5`). Every other value lives on the 4px grid.

### Section vertical rhythm (locked from build-prompt §B3)

```
48px (--space-12) between major sections on a page
24px (--space-6)  between subsections within a section
16px (--space-4)  between cards in a grid (default)
 8px (--space-2)  between stat-strip cells
```

### Page horizontal padding (locked from build-prompt §B3)

```
mobile  (375–767px):  16px (--space-4)
tablet  (768–1023px): 24px (--space-6)
desktop (1024px+):    32px (--space-8)
```

### Form rhythm

```
8px  (--space-2) between label and input
24px (--space-6) between fields in a vertical form
16px (--space-4) between fields in a horizontal/inline form
4px  (--space-1) between input and help-text
```

---

## §5 Border radii — slot count expanded to fit Promptkit's vocabulary

Build-prompt's 6-slot scale (`none/sm/md/lg/xl/full` → `0/4/8/12/16/9999`) **cannot fit Promptkit's vocabulary without overloading slot names**. Promptkit's actual values: `2, 3, 4, 20, 24, 30, 40, 50%`. None of `8/12/16` appear naturally; `4` appears for nested images only.

**Decision:** expand the structural slot count to 11. Each slot has a single canonical use. Component code references slots by name; designers can extend with confidence that no two components ever pick the "lg" slot meaning two different pixel values.

### The reconciled radii scale

```ts
// lib/tokens.ts — radii (expanded to fit Promptkit's vocabulary)
export const radius = {
  none:    '0px',
  xs:      '2px',     // INPUTS — typewriter feel; small badges
  sm:      '4px',     // nested / inline images
  md:      '8px',     // mid-density tiles (rare; fallback)
  lg:      '12px',    // (rare; fallback for medium cards if needed)
  xl:      '16px',    // (rare; fallback)
  tile:    '20px',    // RESOURCE CARDS, news cards, deal cards — Promptkit's primary card radius
  feature: '24px',    // INSTALL BUTTON, primary CTAs, feature tiles — Promptkit's `feature`
  promo:   '30px',    // large promotional buttons (rare — search input, hero CTAs)
  pill:    '40px',    // outlined CTA pills, stack chips, type filter chips (non-circular but rounded)
  full:    '9999px',  // avatars, icon-buttons, perfect circles
} as const;
```

### Slot assignments by component

| Component | Radius slot | Px |
|---|---|---|
| Page surface (no radius) | `none` | 0 |
| **Inputs** (text, search, textarea, select) | `xs` | **2** |
| Inline / nested image | `sm` | 4 |
| Buttons (`.btn-xs`, `.btn-sm`) | `tile` | 20 (when small / sm) — see exception below |
| **Buttons** (`.btn-md` default, `.btn-lg`, `.btn-xl`) | `feature` | **24** |
| **Cards** (ResourceCard, ModelCard, NewsCard, DealCard, all detail-page tiles) | `tile` | **20** |
| Modal | `tile` | 20 |
| Drawer, popover | `lg` | 12 |
| Stack chip, filter pill, tag chip | `pill` | 40 |
| Type badge | `xs` | 2 |
| Search input (Cmd-K hero, header search) | `promo` | 30 |
| Avatar (any size) | `full` | 9999 |
| Icon button | `full` | 9999 |
| Code block | `xs` | 2 |
| Toast | `pill` | 40 (Promptkit toasts are pill-shaped) |

> **Exception called out:** small buttons (`xs`/`sm`) use `pill` radius (40px) when their height ≤32 — at small sizes, full-pill looks more deliberate than `feature` (24). For `md`/`lg`/`xl` buttons (≥40 high), `feature` (24) is correct. Documented in §6.

### What this means for build-prompt's "Cards = lg, buttons = md, inputs = md" lock

The build-prompt's locked assignments are **wrong for this brand**. They're written for a generic "shadcn defaults" product. Promptkit's brand requires:

- Cards at 20, not 12 → use `tile`, not `lg`
- Buttons at 24 (or pill at small sizes), not 8 → use `feature` / `pill`, not `md`
- Inputs at 2, not 8 → use `xs`, not `md`

This is the kind of structural-vs-visual collision the user's tiebreaker rule (visual wins) was designed to settle. The build-prompt's *mechanism* (single source of truth, locked slots, no magic numbers) wins; its *specific assignments* are overridden by Promptkit's actual values.

---

## §6 Button heights — 5 locked slots, derived from Promptkit values

The build-prompt locks 5 button heights: `xs 24 / sm 32 / md 40 / lg 48 / xl 56`. Promptkit's `.btn` renders at ~33px (`padding 10/18` + Space Mono 11px at line-height 1.2 + 1px transparent border). Close to 32 but not exact, and inconsistent across `.btn-sm` (~26px) and `.btn-lg` (~44px).

**The fix:** lock line-height of the button label to a constant 12px (Space Mono caps render cleanly at this — no descenders, uppercase only via the `.mono-caps` class), then set padding-y to whatever produces the locked height. Math is clean and predictable.

### The reconciled button system

| Slot | Total height | Padding-y | Padding-x | Font | Line-height | Radius | Use |
|---|---|---|---|---|---|---|---|
| `xs` | **24px** | 6 (`--space-1.5` → use 6 directly as `--btn-py-xs`) | 12 (`--space-3`) | Space Mono 10/700 mono-caps | 12 | `pill` 40 | Table-row inline actions, very dense lists |
| `sm` | **32px** | 10 (`--btn-py-sm`) | 14 (`--space-3.5` → use 14 directly as `--btn-px-sm`) | Space Mono 11/700 mono-caps | 12 | `pill` 40 | Compact secondary actions, header sign-in/get-started |
| `md` | **40px** ★ default | 14 (`--space-3.5` → `--btn-py-md`) | 18 (`--space-4.5` → `--btn-px-md`) | Space Mono 12/700 mono-caps | 12 | `feature` 24 | Default CTAs, most buttons |
| `lg` | **48px** | 18 (`--btn-py-lg`) | 24 (`--space-6`) | Space Mono 13/700 mono-caps | 12 | `feature` 24 | Hero CTAs on detail pages |
| `xl` | **56px** | 22 (`--btn-py-xl`) | 32 (`--space-8`) | Space Mono 14/700 mono-caps | 12 | `feature` 24 | Landing hero CTAs only |

**Math check (md):** 14px padding-top + 12px line-height + 14px padding-bottom = **40px**. ✓
**Math check (sm):** 10 + 12 + 10 = **32px**. ✓
**Math check (xs):** 6 + 12 + 6 = **24px**. ✓
**Math check (lg):** 18 + 12 + 18 = **48px**. ✓
**Math check (xl):** 22 + 12 + 22 = **56px**. ✓

### Off-grid padding values introduced

To make button height math clean, three off-grid padding-y values are introduced as **button-only tokens** (NOT general spacing tokens — they cannot be used outside button height calculation):

```css
:root {
  --btn-py-xs:  6px;
  --btn-py-sm:  10px;
  --btn-py-md:  14px;
  --btn-py-lg:  18px;
  --btn-py-xl:  22px;
  /* And odd-numbered px values for symmetry */
  --btn-px-sm:  14px;
  --btn-px-md:  18px;
}
```

These are derived values, not free-standing primitives. They don't appear in the `space` scale; they don't appear in Tailwind's `padding` extension. They live in a single CSS file (`app/globals.css`, `.btn-{size}` class definitions) and nowhere else. **A component cannot accidentally pick a 14px padding-y elsewhere** — it has to use the spacing scale.

### Padding-x rationale

Padding-x for `xs` (12px = `--space-3`) and `lg` (24px = `--space-6`) and `xl` (32px = `--space-8`) is on-grid. `sm` (14px) and `md` (18px) are off-grid; they're derived to keep the visual proportion (px ≈ 1.4× py) consistent across sizes.

### Why Promptkit's existing `.btn` (~33px) becomes our `sm` (32px), not `md` (40px)

Promptkit's prototype renders buttons at the ~33px size everywhere — header sign-in, ResourceCard install, deal CTAs. Most of those are **secondary or compact actions** in our final taxonomy. Our `md` (40px) is for hero / primary CTAs, which Promptkit's prototype mostly under-sized. The reconciliation upgrades them to the proper hero size on detail pages and landing hero, and keeps `sm` (32px ≈ Promptkit's existing `.btn`) for inline / dense uses.

### Variant × size matrix

```ts
// All combinations valid; padding/font/radius per size; colour per variant.
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'uv' | 'danger';
```

- `primary` → `bg: --color-mint, color: --color-black, border: none`
- `secondary` → `bg: transparent, color: --color-text-primary, border: 1px solid --color-white`
- `ghost` → `bg: transparent, color: --color-text-primary, border: 1px solid transparent`
- `uv` → `bg: --color-ultraviolet, color: --color-white, border: none`
- `danger` → `bg: transparent, color: #ff6b6b, border: 1px solid #ff6b6b` (Promptkit's `.btn-danger`)

---

## §7 Input heights — 3 locked slots, math-clean

Build-prompt locks 3 input heights: `sm 32 / md 40 / lg 48`. Promptkit's `.input` renders at ~37px (`padding 10/12` + DM Sans 14px at line-height 1.2 + 1px border included via `border-box`). Close to 40 but not exact.

**The fix:** lock the input label's line-height to 18px (DM Sans 14px renders cleanly at this), set padding-y to hit each locked height.

### The reconciled input system

| Slot | Total height | Padding-y | Padding-x | Font | Line-height | Radius | Use |
|---|---|---|---|---|---|---|---|
| `sm` | **32px** | 7 (`--input-py-sm`) | 10 (`--space-2.5` → `--input-px-sm`) | DM Sans 14/400 | 18 | `xs` 2 | Inline forms, dense filters |
| `md` | **40px** ★ default | 11 (`--input-py-md`) | 12 (`--space-3`) | DM Sans 14/400 | 18 | `xs` 2 | Default inputs, settings forms |
| `lg` | **48px** | 15 (`--input-py-lg`) | 16 (`--space-4`) | DM Sans 14/400 (or 16 for hero search) | 18 (or 16 for hero search) | `xs` 2 (or `promo` 30 for hero search) | Hero search, prominent fields |

**Math check (md):** 11 + 18 + 11 = **40px**. ✓
**Math check (sm):** 7 + 18 + 7 = **32px**. ✓
**Math check (lg):** 15 + 18 + 15 = **48px**. ✓

### Input-only padding-y tokens

```css
:root {
  --input-py-sm:  7px;
  --input-py-md:  11px;
  --input-py-lg:  15px;
  --input-px-sm:  10px;
}
```

Same rule as buttons: derived, single-use, not exposed to the general spacing scale.

### Border treatment

Inputs use `border: 1px solid var(--color-text-secondary)` default, `border-color: var(--color-mint)` on focus (Promptkit verbatim). The 1px border is included in the height via `box-sizing: border-box` (project-global rule from `* { box-sizing: border-box }`).

### Critical baseline-alignment rule

A 40px input adjacent to a 40px button (`md` × `md`) **must align at top and bottom edges**. Both have `box-sizing: border-box`, both have 40px total height, both align via flexbox `align-items: center` in their parent. Verify in Phase D Pass 1.

The hero search input on landing (`lg` 48px) sits next to a `lg` 48px primary button. Same alignment guarantee.

---

## §8 Icon button sizes — match button heights, no labels

Icon-only buttons (close-X, copy, share, kebab-menu) use locked square dimensions matching button heights. Per build-prompt §B3:

| Slot | Square | Icon size | Use |
|---|---|---|---|
| `sm` | **32×32** | 16 | Header icon-buttons, card-corner bookmark |
| `md` | **40×40** | 18 | Default icon buttons in toolbars |
| `lg` | **48×48** | 20 | Hero-area icon buttons (rare) |

Radius: `full` (9999px) — circular, matches Promptkit's `.compat-icon` and avatar pattern.

---

## §9 Z-index — 8-tier structural wins

Promptkit uses a 3-tier high-numbered stack (header 90 / modal 200 / toast 300). Mega-menu pop uses 100. These work but are a code smell — high numbers are usually a sign of accumulated z-index conflicts that someone outran by jumping higher.

**Build-prompt's 8-tier structural scale wins** for maintainability. Promptkit's values map cleanly into it:

```ts
// lib/tokens.ts — z-index
export const zIndex = {
  base:     0,    // default page content
  dropdown: 10,   // header mega-menu, select dropdowns
  sticky:   20,   // sticky header, sticky table headers, mobile stack banner
  overlay:  30,   // page overlays / scrims behind modals
  modal:    40,   // modal dialogs (auth, upgrade, claim deal)
  popover:  50,   // command palette, install-button dropdown, install-options popover
  toast:    60,   // toast notifications
  tooltip:  70,   // hover tooltips, focus tooltips
} as const;
```

### Promptkit usage → reconciled mapping

| Promptkit usage | Old z-index | Reconciled |
|---|---|---|
| `Header` sticky | 90 | `sticky` 20 |
| `StackBanner` (mobile) | (default) | `sticky` 20 (same stacking context as header) |
| Mega-menu pop | 100 | `dropdown` 10 |
| Install-button options popover | 50 | `popover` 50 (matches verbatim) |
| Modal scrim | 200 | `overlay` 30 |
| Modal content | 200 | `modal` 40 |
| Drawer scrim | 200 | `overlay` 30 |
| Drawer content | 200 | `modal` 40 (drawers are modal-level) |
| Toast | 300 | `toast` 60 |
| Tweaks panel (excluded from prod) | n/a | n/a |

**Anything above 70 in production is a bug.** If you find yourself wanting `z-index: 80`, you've lost track of layering — pause and re-architect the stacking context.

---

## §10 Animation tokens

Build-prompt locks: `duration-fast 100ms / duration-base 150ms / duration-slow 300ms`. Promptkit uses 150ms ease for transitions, 200ms ease for slide-ins, 120ms for modal fade. Reconciled:

```ts
// lib/tokens.ts — motion
export const motion = {
  durationFast:    '100ms',  // micro-interactions (icon hover, focus shift)
  durationBase:    '150ms',  // ★ DEFAULT — color/opacity/transform on hover, button press
  durationSlow:    '300ms',  // panel slide-in, modal entry, drawer
  easeOut:         'cubic-bezier(0.16, 1, 0.3, 1)',  // entrances
  easeIn:          'cubic-bezier(0.7, 0, 0.84, 0)',  // exits
  easeInOut:       'cubic-bezier(0.65, 0, 0.35, 1)', // transitions
} as const;
```

### Reduced-motion rule

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This overrides every animation site-wide for users who request it. Essential motion (e.g., loading spinners) is permitted to override per-component when it would harm understanding to remove.

### Specific animation specs (Promptkit verbatim with reconciled tokens)

| Element | Trigger | Duration | Ease |
|---|---|---|---|
| Card hover | mouse enter | `durationBase` 150 | `easeOut` |
| Button hover | mouse enter | `durationBase` 150 | `easeOut` |
| Link colour | mouse enter | `durationBase` 150 | (default) |
| Modal fade-in | open | `durationFast` 100 | `easeOut` |
| Modal scale-in | open | `durationBase` 150 | `easeOut` |
| Drawer slide-in | open | `durationSlow` 300 | `easeOut` |
| Toast slide-in | mount | `durationBase` 150 | `easeOut` |
| Cmd-K palette open | ⌘K | `durationFast` 100 | `easeOut` (must feel instant) |
| Skeleton shimmer | render | (loop, no duration token) | linear |

---

## §11 Focus ring

Build-prompt locks: 2px theme-accent ring with consistent offset. Promptkit uses 1px focus-cyan with 2px offset (`outline: 1px solid #1eaedb; outline-offset: 2px;` from `app.css`).

**Reconciled:** keep Promptkit's focus colour (cyan, distinct from accent mint), promote stroke to 2px per build-prompt structural rule.

```css
:root {
  --focus-ring-color:  var(--color-focus);  /* #1eaedb */
  --focus-ring-width:  2px;
  --focus-ring-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: inherit; /* matches the element's radius */
}
```

**Never `outline: none` without replacement.** Suppressing focus rings breaks keyboard navigation; the build-prompt's a11y checklist gates on this.

---

## §12 Shadows / elevation

Build-prompt locks 5-tier (`none/sm/md/lg/xl`). Promptkit uses inset 1px coloured borders for elevation (mint border = active, ultraviolet = promo, white = quiet) — not traditional drop-shadows. Reconciled: support both.

```ts
export const shadow = {
  none:  'none',
  sm:    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md:    '0 4px 12px 0 rgba(0, 0, 0, 0.18)',   // dropdowns, install-options popover
  lg:    '0 6px 20px 0 rgba(0, 0, 0, 0.4)',    // popovers (Promptkit's mega-menu uses this)
  xl:    '0 12px 32px 0 rgba(0, 0, 0, 0.6)',   // modals (Promptkit verbatim)
} as const;

export const elevation = {
  // Promptkit-style inset rings for "active" / "promo" states (not drop shadows)
  none:    'none',
  quiet:   '0 0 0 1px var(--color-white)         inset', // quiet card outline
  active:  '0 0 0 1px var(--color-mint)          inset', // active / focused card
  promo:   '0 0 0 1px var(--color-ultraviolet)   inset', // promo / alt state
  ring:    '0 0 0 1px var(--color-overlay)       inset', // atmospheric ring
  navTab:  '0 -1px 0 0 var(--color-mint)         inset', // active tab underline
} as const;
```

**Convention:** drop-shadows for **floating UI** (popovers, modals, tooltips, install-options dropdown). Inset rings for **inline state** (active card, selected tab, promo highlight). Don't mix — a card never has both a drop shadow and an inset ring simultaneously.

---

## §13 Container widths

Build-prompt locks 6 named container widths. Promptkit uses 1280 and 1440 ad-hoc.

```ts
export const container = {
  sm:    '640px',
  md:    '768px',
  lg:    '1024px',
  xl:    '1280px',  // ★ DEFAULT — used by most pages (Promptkit footer uses 1280)
  xxl:   '1440px',  // landing hero, model detail page (max-content width)
  prose: '720px',   // guides, news articles (focused-reading mode)
} as const;
```

Page choice rule: pick one container per page, don't mix. Marketing pages use `xxl` for hero + `xl` for body. Detail pages use `xl`. Guides + news article use `prose` for the centre column. Cmd-K palette + modals have their own fixed widths (640 / 800).

---

## §14 Naming convention summary

```
--color-{semantic-or-brand-name}   /* e.g. --color-mint, --color-text-primary */
--bg-{role}                        /* e.g. --bg-page, --bg-card-2 */
--text-{role}                      /* e.g. --text-default, --text-meta */
--border-{role}                    /* e.g. --border-card, --border-input-focus */
--space-{0..24}                    /* 4px-base scale, plus --space-px and --space-0.5 for borders */
--radius-{slot-name}               /* e.g. --radius-tile, --radius-feature */
--btn-py-{xs..xl}                  /* button-only padding-y, derived */
--btn-px-{sm..md}                  /* button-only padding-x for off-grid sizes */
--input-py-{sm..lg}                /* input-only padding-y, derived */
--input-px-{sm}                    /* input-only padding-x for off-grid sizes */
--type-{name}-{prop}               /* type scale, e.g. --type-body-size, --type-mono-btn-ls */
--font-{family}                    /* --font-display, --font-sans, --font-mono */
--z-{tier}                         /* --z-modal, --z-toast */
--duration-{speed}                 /* --duration-fast, --duration-base, --duration-slow */
--ease-{kind}                      /* --ease-out, --ease-in, --ease-in-out */
--shadow-{level}                   /* --shadow-md, --shadow-lg */
--elevation-{state}                /* --elevation-active, --elevation-promo */
--focus-ring-{prop}                /* --focus-ring-color, --focus-ring-width */
```

---

## §15 Tailwind extension

`tailwind.config.ts` extends the default theme with these tokens. Components use Tailwind utility classes (`bg-canvas`, `text-meta`, `rounded-tile`, `h-btn-md`, `gap-2`) — never inline styles, never `bg-[#131313]`-style arbitrary values. Where dynamic values are unavoidable (progress-bar widths, chart positioning), they use `style={{ width: \`${pct}%\` }}` — a single inline arbitrary value, never a colour or radius.

```ts
// tailwind.config.ts (skeleton — full version generated in Phase B B3)
import { space, colors, role, radius, fonts, type, zIndex, motion, shadow, container } from './lib/tokens';

export default {
  theme: {
    extend: {
      colors: { ...colors /* exposed as bg-mint, text-ultraviolet, etc */ },
      backgroundColor:  { /* role aliases: bg-page, bg-card, bg-cta */ },
      textColor:        { /* role aliases: text-default, text-meta, text-on-mint */ },
      borderColor:      { /* role aliases: border-card, border-input-focus */ },
      spacing:          space,
      borderRadius:     radius,
      fontFamily:       fonts,
      fontSize:         { /* derived from `type` scale */ },
      letterSpacing:    { /* derived from `type` scale */ },
      lineHeight:       { /* derived from `type` scale */ },
      zIndex:           zIndex,
      transitionDuration: { fast: motion.durationFast, base: motion.durationBase, slow: motion.durationSlow },
      transitionTimingFunction: { out: motion.easeOut, in: motion.easeIn, inOut: motion.easeInOut },
      boxShadow:        shadow,
      maxWidth:         container,
      // Heights: button + input
      height: {
        'btn-xs':   '24px',
        'btn-sm':   '32px',
        'btn-md':   '40px',
        'btn-lg':   '48px',
        'btn-xl':   '56px',
        'input-sm': '32px',
        'input-md': '40px',
        'input-lg': '48px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')], // for guide-reader prose
} satisfies Config;
```

---

## §16 Translation table — every Promptkit CSS variable → reconciled token

For ports / migration. If a Promptkit variable is missing here, it was eliminated.

### Colour

| Promptkit (`tokens.css`) | Reconciled (`lib/tokens.ts`) |
|---|---|
| `--color-mint` | `colors.mint` (verbatim) |
| `--color-ultraviolet` | `colors.ultraviolet` |
| `--color-ultraviolet-90` | `colors.ultravioletA90` |
| `--color-mint-border` | `colors.mintBorder` |
| `--color-link-hover` | `colors.linkHover` |
| `--color-focus` | `colors.focusCyan` |
| `--color-purple-rule` | `colors.purpleRule` |
| `--color-canvas` | `colors.canvas` |
| `--color-surface` | `colors.surface` |
| `--color-image-frame` | `colors.imageFrame` |
| `--color-white` / `--color-black` | `colors.white` / `colors.black` |
| `--color-text-*` | `colors.text*` |
| `--color-tile-*` | `colors.tile*` |
| `--color-error` | `colors.error` |
| `--color-overlay` | `colors.overlay` |
| All `--bg-*`, `--text-*`, `--border-*`, `--font-h*`, `--font-{role}` | `role.*` |

### Spacing

| Promptkit | Reconciled |
|---|---|
| `--space-1` (1px) | `space.px` (1px — borders only) |
| `--space-2` (2px) | `space[0.5]` (2px — borders only) |
| `--space-4` | `space[1]` |
| `--space-5` (5px) | **eliminated** → use `space[1]` (4) or `space[2]` (8) per context |
| `--space-6` (6px) | **eliminated** → use `space[2]` (8) per context |
| `--space-8` | `space[2]` |
| `--space-9` (9px) | **`--space-9-exception`** — TypeBadge padding only, single documented use |
| `--space-10` (10px) | **eliminated** → button/input padding now derived (§6, §7); other usages round to `space[2]` (8) or `space[3]` (12) |
| `--space-12` | `space[3]` |
| `--space-14` (14px) | **eliminated** for spacing → `--btn-py-md` (button-only token, §6) |
| `--space-15` (15px) | **eliminated** |
| `--space-16` | `space[4]` |
| `--space-20` | `space[5]` |
| `--space-24` | `space[6]` |
| `--space-25` (25px) | **eliminated** (was unused in Promptkit anyway) |
| `--space-32` | `space[8]` |
| `--space-40` | `space[10]` |
| `--space-48` | `space[12]` |
| `--space-64` | `space[16]` |

### Radii

| Promptkit | Reconciled |
|---|---|
| `--radius-input` (2) | `radius.xs` |
| `--radius-image-sm` (3) | **eliminated** → `radius.xs` (2) or `radius.sm` (4) per context |
| `--radius-image` (4) | `radius.sm` |
| `--radius-tile` (20) | `radius.tile` (verbatim) |
| `--radius-feature` (24) | `radius.feature` |
| `--radius-promo` (30) | `radius.promo` |
| `--radius-pill` (40) | `radius.pill` |
| `--radius-circle` (50%) | `radius.full` (9999px renders identically for non-square elements; `border-radius: 9999px` is the modern equivalent of `50%` and is more predictable) |

### Type — 1:1 mapping, see §3

### Elevation

| Promptkit | Reconciled |
|---|---|
| `--elevation-0` (none) | `elevation.none` |
| `--elevation-1` | **eliminated** (was a reset, no real effect) |
| `--elevation-2` (white inset) | `elevation.quiet` |
| `--elevation-3` (mint inset) | `elevation.active` |
| `--elevation-4` (uv inset) | `elevation.promo` |
| `--elevation-5` (overlay inset) | `elevation.ring` |
| `--elevation-nav` (mint underline) | `elevation.navTab` |

### Z-index — see §9 mapping table

---

## §17 Migration impact (informational)

Porting Promptkit's prototype to the reconciled token system requires:

- **Colours:** Verbatim port. Zero visual change.
- **Spacing:** Off-grid values (5, 6, 9, 10, 14, 15, 25) audit-and-round per §4 table. ~30–40 utility class swaps in component code; visual diff is sub-pixel.
- **Radii:** Card `borderRadius: 20` → `rounded-tile`. Button `borderRadius: 24` → `rounded-feature`. Input `borderRadius: 2` → `rounded-xs`. Pill chips `borderRadius: 40` → `rounded-pill`. Verbatim values, just named.
- **Buttons:** Promptkit's `.btn` (~33px high) → reclassified as `sm` (32px). New `md` (40px) used for primary CTAs that should be more prominent than Promptkit's prototype showed. Visual diff: most "default" buttons grow ~8px taller in production. Audit Promptkit screens to confirm this is the right call (it is — Promptkit's CTAs were under-sized).
- **Inputs:** Promptkit's `.input` (~37px high) → reclassified as `md` (40px). Visual diff: ~3px taller. Negligible.
- **Z-index:** All Promptkit's high-numbered z-indexes drop to the 0–70 scale. No visual change.
- **Animation:** 150ms ease unchanged; 120ms modal fade rounds to 100ms; 200ms slide-in rounds to 300ms (drawers/sheets feel slightly slower, more deliberate).
- **Focus ring:** Promotes 1px → 2px. More visible on keyboard nav. Better a11y, slight visual change.

**No breaking visual change.** Promptkit's brand identity is fully preserved. The reconciliation **strengthens it** (locks button heights, kills off-grid drift, fixes z-index sprawl) without altering the look-and-feel.

---

## §18 What this document is for

- **Phase B `lib/tokens.ts` + `app/globals.css` + `tailwind.config.ts`** are derived from this document. If they conflict with this document, this document wins and those files get fixed.
- **Phase C component code** references tokens by name only. Code review checks for magic numbers; lint rule (`no-restricted-syntax` regex on hex colours and unprefixed pixel values) enforces.
- **Phase D Pass 1** (visual consistency sweep) walks the §16 translation table and grep-checks the codebase for any escaped Promptkit value (e.g. `#131313` literal in code is an instant fail).
- **Future contributors** read this once, understand the system, never invent new values.

---

## §19 Open questions for Ben

None — every reconciliation decision is documented above with reasoning. If any specific assignment seems wrong, give the §-number + the change you want.

The two judgement calls most likely to attract feedback:

1. **§5 — radius slot count expanded to 11.** Build-prompt locked 6. The expansion is necessary because Promptkit uses 6 distinct radius values *plus* `full`, and overloading slot names ("`lg` means 12 here, 20 there") breaks the single-source-of-truth mechanism. Alternative: shrink Promptkit's vocabulary by rounding (e.g., kill the 20px tile radius and use 16 for cards) — but that loses the brand. Sticking with expansion.
2. **§6 — Promptkit's existing `.btn` (~33px) reclassified as `sm` (32px), not `md` (40px).** This grows most buttons in the prototype by ~8px in production. The reasoning is that Promptkit's prototype under-sized its primary CTAs; the build-prompt's `md` 40px is the correct hero/primary-CTA size. Worth confirming on the landing page mockup specifically — the "Sign up free" button on the landing hero should be 40px (md) or 48px (lg), not 32px.

If both are accepted, this document locks the visual system for the entire build.
