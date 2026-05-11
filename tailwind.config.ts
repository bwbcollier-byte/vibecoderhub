import type { Config } from 'tailwindcss';
import {
  colors,
  fonts,
  type as typeTokens,
  space,
  radius,
  buttonHeight,
  inputHeight,
  zIndex,
  motion,
  shadow,
  container,
  breakpoints,
} from './lib/tokens';

/**
 * Tailwind v4 theme extension — derived from lib/tokens.ts.
 *
 * Component code uses Tailwind utility classes (bg-mint, rounded-tile,
 * h-btn-md, gap-2). Arbitrary values like bg-[#131313] are an instant fail
 * in code review (and ESLint catches hex literals).
 *
 * Tailwind v4 reads most theme config from CSS variables in @theme directives,
 * but we keep this file as a TS-source-of-truth derivation to keep parity
 * with lib/tokens.ts predictable.
 */

// ── Derive Tailwind-shaped fontSize from lib/tokens.ts type scale ─────────
const fontSize = Object.fromEntries(
  Object.entries(typeTokens).map(([key, t]) => [
    key,
    [t.size, { lineHeight: t.lh, letterSpacing: t.ls, fontWeight: t.weight.toString() }],
  ]),
) as Record<string, [string, { lineHeight: string; letterSpacing: string; fontWeight: string }]>;

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class', // Phase 2 will toggle via class; dark is default for now
  theme: {
    screens: {
      sm:  breakpoints.sm,
      md:  breakpoints.md,
      lg:  breakpoints.lg,
      xl:  breakpoints.xl,
      xxl: breakpoints.xxl,
    },
    extend: {
      // ── Colors (raw + role aliases) ──────────────────────────────────
      colors: {
        // Brand + neutrals
        mint:           colors.mint,
        ultraviolet:    colors.ultraviolet,
        'mint-border':  colors.mintBorder,
        'link-hover':   colors.linkHover,
        focus:          colors.focusCyan,
        'purple-rule': colors.purpleRule,
        canvas:         colors.canvas,
        surface:        colors.surface,
        'image-frame': colors.imageFrame,
        white:          colors.white,
        black:          colors.black,
        'text-primary':   colors.textPrimary,
        'text-secondary': colors.textSecondary,
        'text-muted':     colors.textMuted,
        'text-inverted':  colors.textInverted,
        dim:            colors.dim,
        // Tile accents
        'tile-mint':    colors.tileMint,
        'tile-purple':  colors.tilePurple,
        'tile-yellow':  colors.tileYellow,
        'tile-pink':    colors.tilePink,
        'tile-orange':  colors.tileOrange,
        'tile-blue':    colors.tileBlue,
        'tile-white':   colors.tileWhite,
        // Semantic
        error:          colors.error,
        'error-red':    colors.errorRed,
      },

      // ── Background colour role aliases ───────────────────────────────
      backgroundColor: {
        page:   'var(--bg-page)',
        card:   'var(--bg-card)',
        card2:  'var(--bg-card-2)',
        cta:    'var(--bg-cta)',
        cta2:   'var(--bg-cta-2)',
        overlay: 'var(--bg-overlay)',
      },

      // ── Text colour role aliases ─────────────────────────────────────
      textColor: {
        default:    'var(--text-default)',
        meta:       'var(--text-meta)',
        'on-mint':  'var(--text-on-mint)',
        'on-uv':    'var(--text-on-uv)',
        link:       'var(--text-link)',
        'link-hover': 'var(--text-link-hover)',
        error:      'var(--text-error)',
      },

      // ── Border colour role aliases ───────────────────────────────────
      borderColor: {
        DEFAULT:   'var(--color-surface)', // hairline default
        white:     'var(--color-white)',
        mint:      'var(--color-mint)',
        'mint-border': 'var(--color-mint-border)',
        ultraviolet: 'var(--color-ultraviolet)',
        image:     'var(--color-image-frame)',
        input:     'var(--color-text-secondary)',
        'input-focus': 'var(--color-mint)',
        hairline:  'var(--color-surface)',
      },

      // ── Spacing (4px-base) ───────────────────────────────────────────
      spacing: {
        '0':    space['0'],
        'px':   space['px'],
        '0.5':  space['0.5'],
        '1':    space['1'],
        '2':    space['2'],
        '3':    space['3'],
        '4':    space['4'],
        '5':    space['5'],
        '6':    space['6'],
        '8':    space['8'],
        '10':   space['10'],
        '12':   space['12'],
        '16':   space['16'],
        '20':   space['20'],
        '24':   space['24'],
        // 9px-exception NOT exposed as a Tailwind utility — see note in tokens.ts
      },

      // ── Border radii (11 slots) ──────────────────────────────────────
      borderRadius: {
        none:    radius.none,
        xs:      radius.xs,
        sm:      radius.sm,
        md:      radius.md,
        lg:      radius.lg,
        xl:      radius.xl,
        tile:    radius.tile,
        feature: radius.feature,
        promo:   radius.promo,
        pill:    radius.pill,
        full:    radius.full,
      },

      // ── Fonts ────────────────────────────────────────────────────────
      fontFamily: {
        display: fonts.display.split(', '),
        sans:    fonts.sans.split(', '),
        mono:    fonts.mono.split(', '),
      },

      // ── Type scale (size + lineHeight + letterSpacing + fontWeight) ──
      fontSize,

      // ── Heights — buttons + inputs + icon buttons ────────────────────
      height: {
        'btn-xs':   buttonHeight.xs,
        'btn-sm':   buttonHeight.sm,
        'btn-md':   buttonHeight.md,
        'btn-lg':   buttonHeight.lg,
        'btn-xl':   buttonHeight.xl,
        'input-sm': inputHeight.sm,
        'input-md': inputHeight.md,
        'input-lg': inputHeight.lg,
        'icon-sm':  '32px',
        'icon-md':  '40px',
        'icon-lg':  '48px',
      },
      width: {
        'icon-sm':  '32px',
        'icon-md':  '40px',
        'icon-lg':  '48px',
      },

      // ── Container max widths ─────────────────────────────────────────
      maxWidth: {
        sm:    container.sm,
        md:    container.md,
        lg:    container.lg,
        xl:    container.xl,
        xxl:   container.xxl,
        prose: container.prose,
      },

      // ── Z-index (8-tier) ─────────────────────────────────────────────
      zIndex: {
        base:     zIndex.base.toString(),
        dropdown: zIndex.dropdown.toString(),
        sticky:   zIndex.sticky.toString(),
        overlay:  zIndex.overlay.toString(),
        modal:    zIndex.modal.toString(),
        popover:  zIndex.popover.toString(),
        toast:    zIndex.toast.toString(),
        tooltip:  zIndex.tooltip.toString(),
      },

      // ── Motion ───────────────────────────────────────────────────────
      transitionDuration: {
        fast: motion.durationFast,
        base: motion.durationBase,
        slow: motion.durationSlow,
      },
      transitionTimingFunction: {
        out:    motion.easeOut,
        in:     motion.easeIn,
        'in-out': motion.easeInOut,
      },

      // ── Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        sm:        shadow.sm,
        md:        shadow.md,
        lg:        shadow.lg,
        xl:        shadow.xl,
        'inset-quiet':  'var(--elevation-quiet)',
        'inset-active': 'var(--elevation-active)',
        'inset-promo':  'var(--elevation-promo)',
        'inset-ring':   'var(--elevation-ring)',
        'nav-tab':      'var(--elevation-nav-tab)',
      },
    },
  },
  plugins: [],
};

export default config;
