export function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-12 bg-muted rounded-md mb-3"></div>
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}