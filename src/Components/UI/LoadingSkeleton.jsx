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

export function PopularTemplatesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-md"></div>
              <div>
                <div className="h-6 w-22 bg-muted rounded-md mb-2"></div>
                <div className="h-5 w-16 bg-muted rounded-md"></div>
              </div>
            </div>
            <div className="h-4 bg-muted rounded-md"></div>
            <div className="flex items-center gap-2">
              <div className="w-full max-w-26 h-8 bg-muted rounded-md"></div>
              <div className="flex-1 h-8 bg-muted rounded-md"></div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.random() * (5 - 2) + 2 }).map(
                (_, i) => (
                  <div key={i} className="w-16 h-4 bg-muted rounded-md"></div>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TemplatesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-md"></div>
              <div>
                <div className="h-5 w-22 bg-muted rounded-md mb-2"></div>
                <div className="h-4 w-16 bg-muted rounded-md"></div>
              </div>
            </div>
            <div className="h-4 w-full bg-muted rounded-md"></div>
            <div>
              <div className="h-3 max-w-12 bg-muted rounded-md mb-3"></div>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.random() * (5 - 2) + 2 }).map(
                  (_, i) => (
                    <div key={i} className="w-16 h-4 bg-muted rounded-md"></div>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 bg-muted rounded-md"></div>
              <div className="flex-1 h-8 bg-muted rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MembersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center">
              <div className="flex-1 flex items-center">
                <div className="h-12 w-12 rounded-full bg-muted mr-3"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 max-w-60 bg-muted rounded-md"></div>
                  <div className="h-3 max-w-24 bg-muted rounded-md"></div>
                  <div className="h-3 max-w-2xs bg-muted rounded-md"></div>
                </div>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-x-4">
                  <div className="space-y-2">
                    <div>
                      <div className="h-4 w-16 bg-muted rounded-md ml-auto"></div>
                    </div>
                    <div className="h-3 w-28 bg-muted rounded-md"></div>
                  </div>
                  <div className="h-8 w-16 rounded-md bg-muted"></div>
                  <div className="h-8 w-8 rounded-md bg-muted"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkspaceMembersSkeleton({ count = 3 }) {
  return (
    <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function PendingRequestsSkeleton({ count = 2 }) {
  return (
    <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted rounded" />
            <div className="h-8 w-8 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
