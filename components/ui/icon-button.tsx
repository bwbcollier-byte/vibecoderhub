import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/shadcn/cn';

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center shrink-0',
    'rounded-full transition-colors duration-base ease-out cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        ghost:    'bg-transparent text-white hover:bg-white/5',
        solid:    'bg-surface text-white hover:bg-[#3a3a3a]',
        primary:  'bg-mint text-black hover:bg-[#5fffd9]',
      },
      size: {
        sm: 'h-icon-sm w-icon-sm',
        md: 'h-icon-md w-icon-md',
        lg: 'h-icon-lg w-icon-lg',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'sm' },
  },
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof iconButtonVariants> {
  'aria-label': string; // required for icon-only buttons
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
IconButton.displayName = 'IconButton';
