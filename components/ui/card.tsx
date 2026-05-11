import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/shadcn/cn';

const cardVariants = cva(
  'rounded-tile transition-colors duration-base ease-out',
  {
    variants: {
      tone: {
        dark:   'bg-canvas border border-surface',
        mint:   'bg-mint text-black border border-transparent',
        uv:     'bg-ultraviolet text-white border border-transparent',
        yellow: 'bg-tile-yellow text-black border border-transparent',
        pink:   'bg-tile-pink text-white border border-transparent',
        orange: 'bg-tile-orange text-white border border-transparent',
        blue:   'bg-tile-blue text-white border border-transparent',
        surface:'bg-card2 border border-surface',
      },
      interactive: {
        true: 'cursor-pointer hover:border-mint',
        false: '',
      },
      padding: {
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-7',
      },
    },
    defaultVariants: { tone: 'dark', interactive: false, padding: 'md' },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: 'div' | 'article' | 'section';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, interactive, padding, as: Tag = 'div', ...props }, ref) => (
    <Tag
      ref={ref as never}
      className={cn(cardVariants({ tone, interactive, padding }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex items-center justify-between gap-2 mb-2', className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h3
      className={cn(
        'font-sans font-bold text-[19px] leading-[1.1] tracking-[-0.01em]',
        className,
      )}
      {...props}
    />
  );
}

export function CardMeta({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn('text-text-secondary text-[13px] leading-[1.5]', className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex items-center justify-between gap-3 mt-3', className)} {...props} />;
}
