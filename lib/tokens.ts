/**
 * Boot Step 2 — Design tokens (canonical TS source).
 *
 * Derived from TOKEN_RECONCILIATION.md (the synthesis of Promptkit's visual
 * tokens + build-prompt's structural locks).
 *
 * THIS FILE IS THE SINGLE SOURCE OF TRUTH. app/globals.css mirrors as CSS
 * variables; tailwind.config.ts mirrors as Tailwind theme extensions. If those
 * conflict with this file, this file wins and they get fixed.
 *
 * Component code references tokens via Tailwind utility classes (bg-mint,
 * rounded-tile, h-btn-md, gap-2, …) or via CSS variables (var(--color-mint))
 * for dynamic values. NEVER inline literal hex / px / rem values — ESLint
 * `no-restricted-syntax` blocks hex literals; reviewers grep for px in PRs.
 */

// ============================================================================
// COLORS — Promptkit verbatim (TOKEN_RECONCILIATION §2)
// ============================================================================

export const colors = {
  // Brand hazards
  mint:           '#3cffd0', // Jelly Mint — primary CTA accent
  ultraviolet:    '#5200ff', // Verge Ultraviolet — secondary hazard
  ultravioletA90: 'rgba(82, 0, 255, 0.9)',

  // Secondary accents
  mintBorder:     '#309875', // Console Mint Border — card outlines on mint tiles
  linkHover:      '#3860be', // Deep Link Blue — hover on ALL links
  focusCyan:      '#1eaedb', // Focus Cyan — keyboard focus rings only
  purpleRule:     '#3d00bf', // Purple Rule — StoryStream timeline rail

  // Surfaces
  canvas:         '#131313', // Canvas Black — default page background
  canvasDeep:     '#0a0a0a', // Banded section / footer / kbd-chip bg
  surface:        '#2d2d2d', // Surface Slate — secondary card bg
  imageFrame:     '#313131', // Image Frame — 1px border on photography

  // Neutrals
  white:          '#ffffff',
  black:          '#000000',
  textPrimary:    '#ffffff',
  textBody:       '#cfcfcf', // body copy on dark — between textSecondary + textMuted
  textSecondary:  '#949494', // bylines, timestamps
  textMuted:      '#e9e9e9', // button text on dark slate
  textInverted:   '#131313', // on accent tiles
  dim:            '#8c8c8c', // active/pressed button bg
  uvLabel:        '#b69dff', // Ultraviolet-tinted label (Pro chips, promo kicker)

  // Story tile accent fills (used by ResourceCard variants)
  tileMint:       '#3cffd0',
  tilePurple:     '#5200ff',
  tileYellow:     '#f5e642',
  tilePink:       '#ff3cac',
  tileOrange:     '#ff6b35',
  tileBlue:       '#1e6efa',
  tileWhite:      '#ffffff',

  // Semantic
  error:          '#5200ff', // ultraviolet doubles as error accent
  errorRed:       '#ff6b6b', // for danger button text + form errors only
  overlay:        'rgba(0, 0, 0, 0.33)',
} as const;

// ============================================================================
// SEMANTIC ROLE ALIASES — components reference these, not raw colours
// ============================================================================

export const role = {
  // Backgrounds
  bgPage:           'var(--color-canvas)',
  bgCard:           'var(--color-canvas)',
  bgCard2:          'var(--color-surface)',
  bgCta:            'var(--color-mint)',
  bgCta2:           'var(--color-surface)',
  bgOverlay:        'var(--color-overlay)',

  // Text
  textDefault:      'var(--color-text-primary)',
  textMeta:         'var(--color-text-secondary)',
  textOnMint:       'var(--color-black)',
  textOnUv:         'var(--color-white)',
  textLink:         'var(--color-white)',
  textLinkHover:    'var(--color-link-hover)',
  textError:        'var(--color-error-red)',

  // Borders
  borderCard:       '1px solid var(--color-white)',
  borderCardMint:   '1px solid var(--color-mint-border)',
  borderImage:      '1px solid var(--color-image-frame)',
  borderActive:     '1px solid var(--color-mint)',
  borderPromo:      '1px solid var(--color-ultraviolet)',
  borderInput:      '1px solid var(--color-text-secondary)',
  borderInputFocus: '1px solid var(--color-mint)',
  borderHairline:   '1px solid var(--color-surface)',
} as const;

// ============================================================================
// FONTS — 3 families (Newsreader dropped per ruling R4)
// ============================================================================

export const fonts = {
  display: "'Bebas Neue', Impact, Helvetica, Arial, sans-serif",
  sans:    "'DM Sans', Helvetica, Arial, sans-serif",
  mono:    "'Space Mono', 'Courier New', Courier, monospace",
} as const;

// ============================================================================
// TYPOGRAPHY SCALE (TOKEN_RECONCILIATION §3)
// ============================================================================
// Per-style { size, weight, lineHeight, letterSpacing }. Values shipped as
// strings to match CSS units cleanly. Tailwind extension derives `fontSize`
// entries from these.

export const type = {
  // Display (Bebas Neue)
  hero:        { size: '6.69rem', weight: 900, lh: '0.95',  ls: '0.07px' },  // 107px
  display2:    { size: '5.63rem', weight: 900, lh: '0.95',  ls: '0' },        // 90px
  display3:    { size: '3.75rem', weight: 900, lh: '0.95',  ls: '0' },        // 60px

  // Headings (DM Sans)
  headingXl:   { size: '2.13rem', weight: 700, lh: '1.00',  ls: '0' },        // 34px
  headingWide: { size: '2.00rem', weight: 400, lh: '1.10',  ls: '0.32px' },   // 32px
  headingMd:   { size: '1.50rem', weight: 700, lh: '1.00',  ls: '0' },        // 24px
  headingSm:   { size: '1.25rem', weight: 700, lh: '1.00',  ls: '0' },        // 20px

  // Labels / body (DM Sans)
  labelLight:  { size: '1.19rem', weight: 300, lh: '1.20',  ls: '1.9px' },    // 19px
  labelXl:     { size: '1.13rem', weight: 400, lh: '1.10',  ls: '1.8px' },    // 18px
  bodyBold:    { size: '1.00rem', weight: 700, lh: '1.60',  ls: '0' },        // 16px bold
  body:        { size: '1.00rem', weight: 500, lh: '1.60',  ls: '0' },        // 16px
  inline:      { size: '0.94rem', weight: 400, lh: '1.20',  ls: '0.15px' },   // 15px
  caption:     { size: '0.81rem', weight: 400, lh: '1.60',  ls: '0' },        // 13px
  eyebrow:     { size: '0.75rem', weight: 400, lh: '1.30',  ls: '1.8px' },    // 12px
  tag:         { size: '0.75rem', weight: 700, lh: '1.20',  ls: '0.72px' },   // 12px
  micro:       { size: '0.69rem', weight: 700, lh: '1.20',  ls: '1.1px' },    // 11px
  nano:        { size: '0.63rem', weight: 500, lh: '1.20',  ls: '1.5px' },    // 10px

  // Mono (Space Mono) — buttons, labels, timestamps
  // monoBtn line-height set to '12px' (constant) per §3 / §6 — buttons get total
  // height from padding, label has zero leading, math is clean.
  monoBtn:     { size: '0.75rem', weight: 700, lh: '12px',  ls: '1.5px' },    // 12px
  monoTs:      { size: '0.69rem', weight: 700, lh: '1.20',  ls: '1.4px' },    // 11px
} as const;

// ============================================================================
// SPACING — 4px-base scale (TOKEN_RECONCILIATION §4)
// ============================================================================
// 1px / 2px (`px`, `0.5`) reserved for borders / hairlines / letter-spacing —
// NOT valid for padding / margin / gap.

export const space = {
  '0':    '0px',
  'px':   '1px',
  '0.5':  '2px',
  '1':    '4px',
  '2':    '8px',
  '3':    '12px',
  '4':    '16px',
  '5':    '20px',
  '6':    '24px',
  '8':    '32px',
  '10':   '40px',
  '12':   '48px',
  '16':   '64px',
  '20':   '80px',
  '24':   '96px',
  // Documented exception per TOKEN_RECONCILIATION §4 — TypeBadge ONLY.
  // NOT exposed via Tailwind utility class; only via CSS variable `--space-9-exception`.
  // Usage: <span style={{padding: `3px var(--space-9-exception)`}}> in TypeBadge.tsx.
  '9_exception': '9px',
} as const;

// ============================================================================
// RADII — slot count expanded to 11 (TOKEN_RECONCILIATION §5)
// ============================================================================
// Each slot has a single canonical use — see slot-assignments table in §5.

export const radius = {
  none:    '0px',
  xs:      '2px',     // INPUTS — typewriter feel; small badges; code blocks
  sm:      '4px',     // nested / inline images
  md:      '8px',     // mid-density tiles (rare; fallback)
  lg:      '12px',    // (rare; fallback for medium cards if needed) — drawers + popovers
  xl:      '16px',    // (rare; fallback)
  tile:    '20px',    // RESOURCE CARDS, news cards, deal cards, modals
  feature: '24px',    // INSTALL BUTTON, primary CTAs (md/lg/xl), feature tiles
  promo:   '30px',    // large promotional buttons / hero search input
  pill:    '40px',    // outlined CTA pills, stack chips, type filter chips, small buttons (xs/sm)
  full:    '9999px',  // avatars, icon-buttons, perfect circles
} as const;

// ============================================================================
// BUTTON HEIGHTS — 5 locked slots (TOKEN_RECONCILIATION §6)
// ============================================================================
// Math: padding-y + line-height + padding-y = total
// Line-height locked to '12px' across all sizes (Space Mono caps render cleanly).

export const buttonHeight = {
  xs: '24px', // py 6  + lh 12 + py 6  = 24
  sm: '32px', // py 10 + lh 12 + py 10 = 32  ← Promptkit's existing .btn lands here
  md: '40px', // py 14 + lh 12 + py 14 = 40  ★ DEFAULT (hero/primary CTAs)
  lg: '48px', // py 18 + lh 12 + py 18 = 48
  xl: '56px', // py 22 + lh 12 + py 22 = 56  (landing hero only)
} as const;

// Button-only padding tokens — single-use, not exposed to general spacing scale.
// Defined in app/globals.css as --btn-py-* and consumed only by .btn-{size}
// class definitions. NOT available via Tailwind padding utilities.
export const buttonPadding = {
  xs: { py: '6px',  px: '12px' },
  sm: { py: '10px', px: '14px' }, // px is off-grid (4*3.5) — button-only token
  md: { py: '14px', px: '18px' }, // py + px both off-grid — button-only tokens
  lg: { py: '18px', px: '24px' },
  xl: { py: '22px', px: '32px' },
} as const;

// Button label font-size per size (Space Mono caps).
export const buttonFontSize = {
  xs: '10px',
  sm: '11px',
  md: '12px', // ★ DEFAULT
  lg: '13px',
  xl: '14px',
} as const;

// ============================================================================
// INPUT HEIGHTS — 3 locked slots (TOKEN_RECONCILIATION §7)
// ============================================================================
// Math: padding-y + line-height + padding-y = total
// Line-height locked to '18px' (DM Sans 14px renders cleanly at this).

export const inputHeight = {
  sm: '32px', // py 7  + lh 18 + py 7  = 32
  md: '40px', // py 11 + lh 18 + py 11 = 40  ★ DEFAULT
  lg: '48px', // py 15 + lh 18 + py 15 = 48
} as const;

// Input-only padding tokens (single-use).
export const inputPadding = {
  sm: { py: '7px',  px: '10px' }, // px off-grid
  md: { py: '11px', px: '12px' }, // py off-grid
  lg: { py: '15px', px: '16px' },
} as const;

// ============================================================================
// ICON BUTTON SIZES — match button heights (TOKEN_RECONCILIATION §8)
// ============================================================================

export const iconButtonSize = {
  sm: { square: '32px', icon: 16 }, // header icon-buttons, card-corner bookmark
  md: { square: '40px', icon: 18 }, // default
  lg: { square: '48px', icon: 20 }, // hero-area icon buttons (rare)
} as const;

// ============================================================================
// Z-INDEX — 8-tier (TOKEN_RECONCILIATION §9)
// ============================================================================

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

// ============================================================================
// MOTION (TOKEN_RECONCILIATION §10)
// ============================================================================

export const motion = {
  durationFast: '100ms', // micro-interactions
  durationBase: '150ms', // ★ DEFAULT — color/opacity/transform on hover, press
  durationSlow: '300ms', // panel slide-in, modal entry, drawer
  easeOut:      'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn:       'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOut:    'cubic-bezier(0.65, 0, 0.35, 1)',
} as const;

// ============================================================================
// FOCUS RING (TOKEN_RECONCILIATION §11)
// ============================================================================
// Promptkit's cyan colour, build-prompt's 2px stroke.

export const focusRing = {
  color:  'var(--color-focus)',
  width:  '2px',
  offset: '2px',
} as const;

// ============================================================================
// SHADOWS + ELEVATION (TOKEN_RECONCILIATION §12)
// ============================================================================
// Drop shadows for floating UI; inset rings for inline state.

export const shadow = {
  none: 'none',
  sm:   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md:   '0 4px 12px 0 rgba(0, 0, 0, 0.18)',  // dropdowns
  lg:   '0 6px 20px 0 rgba(0, 0, 0, 0.4)',   // popovers
  xl:   '0 12px 32px 0 rgba(0, 0, 0, 0.6)',  // modals
} as const;

export const elevation = {
  none:   'none',
  quiet:  '0 0 0 1px var(--color-white)        inset',
  active: '0 0 0 1px var(--color-mint)         inset',
  promo:  '0 0 0 1px var(--color-ultraviolet)  inset',
  ring:   '0 0 0 1px var(--color-overlay)      inset',
  navTab: '0 -1px 0 0 var(--color-mint)        inset',
} as const;

// ============================================================================
// CONTAINER WIDTHS (TOKEN_RECONCILIATION §13)
// ============================================================================

export const container = {
  sm:    '640px',
  md:    '768px',
  lg:    '1024px',
  xl:    '1280px',  // ★ DEFAULT
  xxl:   '1440px',
  prose: '720px',   // guides + news article (focused-reading)
} as const;

// ============================================================================
// BREAKPOINTS — for responsive utilities
// ============================================================================

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  xxl: '1440px',
} as const;

// ============================================================================
// PAGE PADDING (TOKEN_RECONCILIATION §4)
// ============================================================================

export const pagePadding = {
  mobile:  '16px', // < 768px
  tablet:  '24px', // 768-1023px
  desktop: '32px', // ≥ 1024px
} as const;

// ============================================================================
// SECTION RHYTHM
// ============================================================================

export const sectionRhythm = {
  major:    '48px', // between major sections on a page
  minor:    '24px', // between subsections
  card:     '16px', // between cards in a grid
  cellGap:  '8px',  // between stat-strip cells
} as const;

// ============================================================================
// FORM RHYTHM
// ============================================================================

export const formRhythm = {
  labelToInput:   '8px',
  fieldToField:   '24px',
  inlineFields:   '16px',
  inputToHelp:    '4px',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radius;
export type SpaceToken = keyof typeof space;
export type ButtonSize = keyof typeof buttonHeight;
export type InputSize = keyof typeof inputHeight;
export type IconButtonSize = keyof typeof iconButtonSize;
export type ZIndexLayer = keyof typeof zIndex;
export type ShadowLevel = keyof typeof shadow;
export type ElevationState = keyof typeof elevation;
export type ContainerWidth = keyof typeof container;
