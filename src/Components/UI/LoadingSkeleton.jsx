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
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-md"></div>
              <div>
                <div className="h-5 w-22 bg-muted rounded-md mb-2"></div>
                <div className="h-6 w-16 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkspacesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-muted rounded-full"></div>
              <div>
                <div className="h-6 w-22 bg-muted rounded-md mb-2"></div>
                <div className="h-6 w-16 bg-muted rounded-md"></div>
              </div>
            </div>
            <div className="h-4 w-full bg-muted rounded-md mb-4"></div>
            <div className="h-4 w-1/2 bg-muted rounded-md mb-4"></div>
            <div className="h-4 w-1/3 bg-muted rounded-md mb-5"></div>
            <div className="flex items-center gap-2">
              <div className="h-9 flex-1 bg-muted rounded-md"></div>
              <div className="h-9 w-9 bg-muted rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
