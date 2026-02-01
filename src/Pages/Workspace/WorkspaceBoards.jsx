import { Users, Clock, Plus, FolderPlus } from "lucide-react"
import { formatRelative } from "date-fns"
import { vi } from "date-fns/locale"

import AddBoardToWorkspaceDialog from "@/Components/AddBoardToWorkspaceDialog"
import { Button, Card, CardContent } from "@/Components/UI"
import { useBoardsWithFavorites } from "@/hooks"
import BoardCard from "@/Components/BoardCard"

function WorkspaceBoards({ workspace }) {
  const allBoards = useBoardsWithFavorites();
  const boardsInWorkspace = allBoards.filter(b => b.workspace === workspace._id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tất cả bảng ({boardsInWorkspace.length})</h3>
        <AddBoardToWorkspaceDialog 
            workspaceId={workspace._id}
            trigger={
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo bảng mới
                </Button>
            }
        />
      </div>

      {boardsInWorkspace.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-muted/30">
          <FolderPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium mb-1">Chưa có bảng nào</p>
          <p className="text-sm text-muted-foreground mb-4">Tạo bảng mới để bắt đầu quản lý dự án</p>
          <AddBoardToWorkspaceDialog
            workspaceId={workspace._id}
            trigger={
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo bảng đầu tiên
                </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {boardsInWorkspace.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkspaceBoards;
