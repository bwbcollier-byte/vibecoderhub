import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/shadcn/cn';

const inputVariants = cva(
  [
    'w-full bg-transparent',
    'font-sans text-[14px] leading-[18px] text-white placeholder:text-text-secondary',
    'border border-input rounded-xs',
    'transition-colors duration-base ease-out',
    'focus:outline-none focus:border-mint',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'aria-[invalid=true]:border-error-red',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-input-sm px-[10px] py-[7px]',
        md: 'h-input-md px-3 py-[11px]',
        lg: 'h-input-lg px-4 py-[15px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, error, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={error || undefined}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
