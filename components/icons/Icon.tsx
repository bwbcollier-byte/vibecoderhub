import * as React from 'react';

/**
 * Icon system — ported from Promptkit's Lucide-style SVG primitives.
 *
 * Stroke width locked to 1.6 (Promptkit default). Sizes per token scale:
 * 16/18/20/24. Pass `size`/`stroke`/`strokeWidth` to override.
 *
 * Usage:
 *   <Icon.Search size={18} />
 *   <Icon.Bookmark fill="currentColor" />  // when "saved"
 */

interface SvgProps {
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

interface PathSvgProps extends SvgProps {
  d: string;
}

function PathSvg({
  d,
  size = 16,
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 1.6,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: PathSvgProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0 }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      role={ariaLabel ? 'img' : undefined}
    >
      <path d={d} />
    </svg>
  );
}

const make = (d: string) => {
  const Component = (props: SvgProps): React.ReactElement => <PathSvg d={d} {...props} />;
  return Component;
};

export const Icon = {
  Search:    make('M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z'),
  Close:     make('M18 6L6 18M6 6l12 12'),
  ChevDown:  make('M6 9l6 6 6-6'),
  ChevRight: make('M9 18l6-6-6-6'),
  ChevLeft:  make('M15 18l-6-6 6-6'),
  ChevUp:    make('M18 15l-6-6-6 6'),
  ArrowRight:make('M5 12h14M13 5l7 7-7 7'),
  ArrowUp:   make('M12 19V5M5 12l7-7 7 7'),
  ArrowDown: make('M12 5v14M19 12l-7 7-7-7'),
  Bookmark:  make('M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z'),
  Star:      make('M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.2 3.1L7 14.2 2 9.3l6.9-1z'),
  Share:     make('M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13'),
  Check:     make('M20 6L9 17l-5-5'),
  Copy:      make('M9 9h11v11H9zM5 5h11v3H9a2 2 0 00-2 2v9H5z'),
  Plus:      make('M12 5v14M5 12h14'),
  Minus:     make('M5 12h14'),
  Filter:    make('M3 4h18l-7 9v6l-4-2v-4z'),
  Bell:      make('M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M14 21a2 2 0 01-4 0'),
  User:      make('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'),
  Home:      make('M3 12l9-9 9 9M5 10v10h14V10'),
  Menu:      make('M3 6h18M3 12h18M3 18h18'),
  External:  make('M14 4h6v6M10 14L20 4M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6'),
  Download:  make('M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3'),
  Play:      make('M5 3l14 9-14 9z'),
  Command:   make('M18 3a3 3 0 010 6h-3V6a3 3 0 013-3zM6 21a3 3 0 010-6h3v3a3 3 0 01-3 3zM6 3a3 3 0 010 6h3V6a3 3 0 00-3-3zM18 21a3 3 0 010-6h-3v3a3 3 0 003 3z M9 9h6v6H9z'),
  Zap:       make('M13 2L3 14h7l-1 8 10-12h-7z'),
  Brain:     make('M9.5 2A2.5 2.5 0 007 4.5V20a2 2 0 002 2h6a2 2 0 002-2V4.5A2.5 2.5 0 0014.5 2h-5z M7 8H5a2 2 0 00-2 2v4a2 2 0 002 2h2 M17 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2'),
  Eye:       make('M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z'),
  Wrench:    make('M14.7 6.3a4 4 0 015.6 5.6l-9 9-4.6.6.6-4.6 9-9z'),
  Package:   make('M21 16V8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v9'),
  Lock:      make('M5 11h14v10H5zM8 11V7a4 4 0 018 0v4'),
  Alert:     make('M12 9v4M12 17h.01M10.3 3.86l-8.55 14.83A2 2 0 003.43 22h17.14a2 2 0 001.7-3.31L13.7 3.86a2 2 0 00-3.4 0z'),
  Flame:     make('M8.5 14.5A2.5 2.5 0 0011 17c1.4 0 2.5-1 2.5-2.5 0-2-2-2.5-2.5-5 0 0 .5 1-1 2.5-1.5 1.5-1.5 2.5-1.5 2.5z M14 5a5.5 5.5 0 015.5 5.5C19.5 16 14 19 12 22c-2-3-7.5-6-7.5-11.5A5.5 5.5 0 0110 5c1 0 2 .5 2 .5S13 5 14 5z'),
  Sliders:   make('M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4'),
  Rss:       make('M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 19a1 1 0 100-2 1 1 0 000 2z'),
  Github:    make('M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5a3 3 0 00-.9-2.1c3-.3 6.1-1.5 6.1-6.5A5 5 0 0019.9 6 4.6 4.6 0 0019.7 2S18.5 1.6 16 3.4a13.4 13.4 0 00-7 0C6.5 1.6 5.3 2 5.3 2A4.6 4.6 0 005.1 6 5 5 0 003.7 9.4c0 4.9 3 6.1 6 6.5a3 3 0 00-.9 2.1V22'),
  // Stylised mono Google "G": circle with the signature horizontal bar on the
  // right-hand side. Single-path so it picks up `currentColor` like the rest of
  // the icon set; the four-colour brand mark needs separate fills and isn't a
  // fit for the make() helper.
  Google:    make('M21 12a9 9 0 11-3.5-7.1 M21 12h-8 M21 12v0'),
  Rocket:    make('M5 19c-3 1-3 1-3 1l1-3c4-9 9-9 9-9s0 5-9 9zM12 15l-3-3M21 3s-2 .5-3.5 2-2 4-2 4-1 .5-1 2 2 1 3 0 4-2 4-2 2.5-.5 4-2 2-3.5 2-3.5z'),
  History:   make('M3 12a9 9 0 109-9 9.7 9.7 0 00-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2'),
  Link:      make('M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1'),
  Trending:  make('M22 6L13 15l-4-4-7 7M16 6h6v6'),
  Coins:     make('M12 22c5 0 9-2 9-5V7c0-3-4-5-9-5S3 4 3 7v10c0 3 4 5 9 5z M21 7c0 3-4 5-9 5S3 10 3 7 M21 12c0 3-4 5-9 5s-9-2-9-5'),
  Layers:    make('M12 2l10 6-10 6L2 8z M2 17l10 6 10-6 M2 12l10 6 10-6'),
  Compare:   make('M9 3H4a1 1 0 00-1 1v16a1 1 0 001 1h5M15 3h5a1 1 0 011 1v16a1 1 0 01-1 1h-5M9 3v18M15 3v18'),
  Trash:     make('M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2'),
  Edit:      make('M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z'),
  Refresh:   make('M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5'),
} as const;

export type IconName = keyof typeof Icon;
