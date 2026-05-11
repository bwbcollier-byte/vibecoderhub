import * as React from 'react';
import { cn } from '@/lib/shadcn/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
  rounded?: 'xs' | 'sm' | 'md' | 'pill' | 'full';
}

const roundedMap = {
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  pill: 'rounded-pill',
  full: 'rounded-full',
} as const;

export function Skeleton({
  className,
  height,
  width,
  rounded = 'sm',
  style,
  ...props
}: SkeletonProps): React.ReactElement {
  return (
    <div
      aria-hidden
      className={cn('skeleton', roundedMap[rounded], className)}
      style={{
        ...(height !== undefined ? { height } : null),
        ...(width !== undefined ? { width } : null),
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonCard({ height = 200 }: { height?: number }): React.ReactElement {
  return (
    <div
      className="bg-canvas border border-surface rounded-tile p-5"
      style={{ minHeight: height }}
    >
      <Skeleton height={12} width="40%" className="mb-3" />
      <Skeleton height={24} width="85%" className="mb-2" />
      <Skeleton height={12} width="60%" className="mb-6" />
      <div className="flex gap-2">
        <Skeleton height={18} width={18} rounded="sm" />
        <Skeleton height={18} width={18} rounded="sm" />
        <Skeleton height={18} width={18} rounded="sm" />
      </div>
    </div>
  );
}
