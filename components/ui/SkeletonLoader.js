'use client';

export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-12" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  );
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
