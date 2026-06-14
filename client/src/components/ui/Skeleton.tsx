export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

/** A watchlist-row-shaped placeholder used before the first snapshot arrives. */
export function WatchRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-14" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      <Skeleton className="h-6 w-16" />
      <div className="w-20 space-y-1.5">
        <Skeleton className="ml-auto h-3.5 w-14" />
        <Skeleton className="ml-auto h-2.5 w-10" />
      </div>
    </div>
  );
}
