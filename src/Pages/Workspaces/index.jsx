import {
  Plus,
} from "lucide-react";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  StatsSkeleton,
  WorkspacesSkeleton,
} from "@/Components/UI";
import { useWorkspacesList } from "@/features/workspaces/api/useWorkspacesList";
import CreateWorkspaceDialog from "@/features/workspaces/components/Dialogs/CreateWorkspaceDialog";
import WorkspaceItem from "@/features/workspaces/components/List/WorkspaceItem";
import WorkspaceStats from "@/features/workspaces/components/List/WorkspaceStats";
import { useFavoritesStore } from "@/store";

function Workspaces() {
  const { data: workspacesList = [], isLoading } = useWorkspacesList();
  const favoriteWorkspaces = useFavoritesStore((s) => s.favoriteWorkspaces);

  const workspaces = useMemo(() => {
    return workspacesList.map(ws => ({
       ...ws,
       is_starred: favoriteWorkspaces.some(fw => fw._id === ws._id)
    }));
  }, [workspacesList, favoriteWorkspaces]);

  return (
    <>
      {/* Welcome Section */}
      <div className="flex mb-6 md:mb-8 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Không gian làm việc
          </h1>
          <p className="text-sm sm:text-base md:text-base text-muted-foreground">
            Quản lý và tổ chức các không gian làm việc của bạn
          </p>
        </section>
        <section className="sm:ml-auto">
          <CreateWorkspaceDialog />
        </section>
      </div>

      {/* Stats Cards */}
      <section className="mb-6 md:mb-8">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <WorkspaceStats workspaces={workspaces} />
        )}
      </section>

      {/* Workspaces Grid */}
      {isLoading ? (
        <WorkspacesSkeleton /> // Assuming WorkspacesSkeleton handles layout or creates a grid
      ) : (
        <div
          className="animate-slide-in-up"
          style={{ animationDelay: `${workspaces.length * 50}ms` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workspaces.map((workspace) => (
              <WorkspaceItem key={workspace._id} workspace={workspace} />
            ))}

            {/* Create New Workspace Card */}
            <CreateWorkspaceDialog
              trigger={
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center p-6">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">
                      Tạo workspace mới
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tạo không gian làm việc mới để tổ chức dự án
                    </p>
                  </CardContent>
                </Card>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Workspaces;
