import type { ReactElement } from 'react';

import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

export default function McpsLoading(): ReactElement {
  return (
    <div className="max-w-xxl mx-auto px-4 md:px-8 py-10 pb-20">
      <div className="flex flex-col gap-3 mb-8">
        <Skeleton height={16} width={180} />
        <Skeleton height={88} width="50%" />
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Skeleton height={40} width={360} />
        <Skeleton height={32} width={120} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} height={220} />
        ))}
      </div>
    </div>
  );
}
