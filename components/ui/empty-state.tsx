import * as React from 'react';
import { cn } from '@/lib/shadcn/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  glyph?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  glyph = '∅',
  title,
  body,
  action,
  className,
  ...props
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center gap-4 py-16 px-6',
        className,
      )}
      {...props}
    >
      <div className="text-ultraviolet text-[80px] leading-none font-display">
        {glyph}
      </div>
      <h3 className="font-sans font-bold text-[20px] text-white">{title}</h3>
      {body && (
        <p className="text-text-secondary text-[14px] leading-[1.5] max-w-[380px]">{body}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
