import { FolderPlus, Loader2, Plus } from "lucide-react";

import { Button } from "@/Components/UI";
import BoardCard from "@/features/boards/components/List/BoardCard";
import { useWorkspaceBoards } from "@/features/workspaces/api/useWorkspaceBoards";
import { useFavoritesStore } from "@/store";
import AddBoardToWorkspaceDialog from "../Dialogs/AddBoardToWorkspaceDialog";

function WorkspaceBoards({ workspace, readOnly }) {
  const { data: boardsInWorkspace = [], isLoading } = useWorkspaceBoards(workspace._id);
  
  const favoriteBoards = useFavoritesStore((s) => s.favoriteBoards);
  
  const boardsWithFavorite = boardsInWorkspace.map(b => ({
    ...b,
    is_starred: favoriteBoards.some(fb => fb._id === b._id)
  }));

  if (isLoading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tất cả bảng ({boardsWithFavorite.length})</h3>
        {!readOnly && (
            <AddBoardToWorkspaceDialog 
                workspaceId={workspace._id}
                trigger={
                    <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo bảng mới
                    </Button>
                }
            />
        )}
      </div>

      {boardsWithFavorite.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-muted/30">
          <FolderPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium mb-1">Chưa có bảng nào</p>
          <p className="text-sm text-muted-foreground mb-4">Tạo bảng mới để bắt đầu quản lý dự án</p>
          {!readOnly && (
            <AddBoardToWorkspaceDialog
                workspaceId={workspace._id}
                trigger={
                    <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo bảng đầu tiên
                    </Button>
                }
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {boardsWithFavorite.map((board) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkspaceBoards;
