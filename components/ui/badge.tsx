import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/shadcn/cn';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 whitespace-nowrap',
    'font-mono font-bold uppercase tracking-[0.72px]',
    'rounded-xs border',
  ].join(' '),
  {
    variants: {
      tone: {
        neutral: 'bg-surface/30 border-surface text-text-secondary',
        mint:    'bg-mint/10 border-mint/40 text-mint',
        uv:      'bg-ultraviolet/10 border-ultraviolet text-ultraviolet',
        white:   'bg-white/5 border-white/30 text-white',
        danger:  'bg-error-red/10 border-error-red text-error-red',
      },
      size: {
        sm: 'text-[10px] px-2 py-px',
        md: 'text-[11px] px-3 py-0.5',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps): React.ReactElement {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}

/**
 * TypeBadge — per-resource-type chip. Uses the documented --space-9-exception
 * for padding-x (TOKEN_RECONCILIATION §4). Tint color comes from the resource
 * type registry; passed as an explicit prop so this component knows nothing
 * about the registry.
 */
export interface TypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  glyph: string;
  label: string;
  tint: string; // hex/var — comes from resource type registry; safe at this boundary
  size?: 'sm' | 'lg';
}

export function TypeBadge({
  glyph,
  label,
  tint,
  size = 'sm',
  className,
  ...props
}: TypeBadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs border font-mono font-bold uppercase tracking-[0.72px]',
        size === 'lg' ? 'text-[11px]' : 'text-[10px]',
        className,
      )}
      style={{
        borderColor: `${tint}55`,
        background: `${tint}12`,
        color: tint,
        padding: `3px var(--space-9-exception)`,
      }}
      {...props}
    >
      <span aria-hidden>{glyph}</span>
      <span>·</span>
      <span>{label}</span>
    </span>
  );
}
