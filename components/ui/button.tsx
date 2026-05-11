import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/shadcn/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-mono font-bold uppercase tracking-[1.5px] whitespace-nowrap',
    'select-none cursor-pointer',
    'transition-colors duration-base ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-mint text-black hover:bg-[#5fffd9] active:bg-[#2fe6b8]',
        secondary:
          'bg-transparent text-white border border-white hover:border-mint hover:text-mint',
        ghost:
          'bg-transparent text-white hover:bg-white/5',
        uv:
          'bg-ultraviolet text-white hover:bg-[#6a1cff] active:bg-[#3e00cc]',
        danger:
          'bg-transparent text-error-red border border-error-red hover:bg-error-red/10',
      },
      size: {
        xs: 'h-btn-xs text-[10px] rounded-pill px-3',
        sm: 'h-btn-sm text-[11px] rounded-pill px-[14px]',
        md: 'h-btn-md text-[12px] rounded-feature px-[18px]',
        lg: 'h-btn-lg text-[13px] rounded-feature px-6',
        xl: 'h-btn-xl text-[14px] rounded-feature px-8',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, block }), className)}
        disabled={disabled ?? loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';

function Spinner(): React.ReactElement {
  return (
    <svg
      className="animate-spin"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" opacity={0.25} />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

export { buttonVariants };
