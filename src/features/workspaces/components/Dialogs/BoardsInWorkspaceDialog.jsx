import { formatRelative } from "date-fns"
import { vi } from "date-fns/locale"
import { LayoutGrid } from "lucide-react"
import { useState } from "react"

import BoardActions from "@/features/boards/components/List/BoardActions"
import { resolvePermissions } from "@/helpers/permission"
import { getRoleText, getRoleVariant } from "@/helpers/role"
import { cn } from "@/lib/utils"
import AddBoardToWorkspaceDialog from "./AddBoardToWorkspaceDialog"

import { useWorkspaceBoards } from "@/features/workspaces/api/useWorkspaceBoards"
import { useAuthStore, useFavoritesStore } from "@/store"

import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/UI"

function BoardsInWorkspaceDialog({ workspace, trigger }) {
  const [open, setOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  
  const { data: boards = [] } = useWorkspaceBoards(workspace._id);
  const members = workspace.members || [];
  const favoriteBoards = useFavoritesStore((s) => s.favoriteBoards) || [];

  const processedBoards = boards.map(b => ({
      ...b,
      is_starred: favoriteBoards.some(fb => fb._id === b._id)
  }));

  const currentUserRole = (board) => {
    const { role } = resolvePermissions({
        userId: currentUser._id,
        workspace,
        board,
        workspaceMembers: members,
    });
    return role;
  };

  const canDelete = (board) => {
    const { canDelete } = resolvePermissions({
        userId: currentUser._id,
        workspace,
        board,
        workspaceMembers: members,
    });
    return canDelete;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Bảng trong {workspace.name}
          </DialogTitle>
          <DialogDescription>Tổng cộng {processedBoards.length} bảng trong workspace này</DialogDescription>
        </DialogHeader>

        {processedBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Chưa có bảng nào trong workspace này</p>
          </div>
        ) : (
          <section className={cn("overflow-y-auto max-h-[300px]", processedBoards.length > 2 && "pr-1.5")}>
            <div className="space-y-4">
              {processedBoards.map((board) => (
                <Card key={board._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded ${board.color}`} />
                          <CardTitle className="text-base">{board.title}</CardTitle>
                        </div>
                      </div>
                      <section className="ml-auto flex items-center gap-2 flex-shrink-0">
                          <Badge variant={getRoleVariant(currentUserRole(board))}>{getRoleText(currentUserRole(board))}</Badge>
                          <BoardActions canDelete={canDelete(board)} board={board} />
                      </section>
                    </div>
                    {board.description && <p className="text-xs text-muted-foreground my-1.5">{board.description}</p>}
                  </CardHeader>
                  <CardContent className="sm:pt-3">
                  <section className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                        Số thành viên:
                        <Badge className="px-1.5 py-0" variant="secondary">{board.members?.length > 0 ? board.members.length : members.length}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs ml-auto">
                        Cập nhật lần cuối:
                        <Badge className="px-1.5 py-0 capitalize" variant="destructive">{board.updated_at ? formatRelative(new Date(board.updated_at), new Date(), { locale: vi }) : 'N/A'}</Badge>
                    </div>
                  </section>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="mt-4 flex">
          <AddBoardToWorkspaceDialog workspaceId={workspace._id} />
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default BoardsInWorkspaceDialog;
