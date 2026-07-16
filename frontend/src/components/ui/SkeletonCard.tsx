export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="shimmer-bg aspect-[3/4] animate-shimmer rounded-2xl" />
      <div className="shimmer-bg h-3 w-1/3 animate-shimmer rounded" />
      <div className="shimmer-bg h-4 w-4/5 animate-shimmer rounded" />
      <div className="shimmer-bg h-3 w-2/5 animate-shimmer rounded" />
      <div className="shimmer-bg h-5 w-1/3 animate-shimmer rounded" />
    </div>
  )
}
