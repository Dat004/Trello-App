import { useState, useEffect } from "react"
import { LayoutGrid } from "lucide-react"
import { formatRelative } from "date-fns"
import { vi } from "date-fns/locale"

import { useAuthStore, useBoardStore, useWorkspaceStore } from "@/store"
import { getRoleVariant, getRoleText } from "@/helpers/role"
import { resolvePermissions } from "@/helpers/permission"
import BoardActions from "@/Pages/Boards/BoardActions"
import { boardApi } from "@/api/board"
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
  const allBoards = useBoardStore((state) => state.boards);
  const mergeBoardsFromWorkspace = useBoardStore((state) => state.mergeBoardsFromWorkspace);
  const members = useWorkspaceStore((state) => state.membersMap[workspace._id] || []);
  
  // Filter các board theo workspace
  const boards = allBoards.filter(b => b.workspace === workspace._id);

  // Fetch và merge boards khi mở dialog (để có data mới nhất)
  useEffect(() => {
    if (!open || !workspace) return;

    const fetchBoards = async () => {
      const res = await boardApi.getBoardsInWorkspace(workspace._id);
      if (res.data?.success) {
        // Merge vào store
        mergeBoardsFromWorkspace(res.data.data.boards);
      }
    };
    fetchBoards();
  }, [open, workspace, mergeBoardsFromWorkspace]);

  const currentUserRole = (board) => {
    const { role } = resolvePermissions({
        userId: currentUser._id,
        workspace,
        board,
    });

    return role;
  };

  const canDelete = (board) => {
    const { canDelete } = resolvePermissions({
        userId: currentUser._id,
        workspace,
        board,
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
          <DialogDescription>Tổng cộng {boards.length} bảng trong workspace này</DialogDescription>
        </DialogHeader>

        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Chưa có bảng nào trong workspace này</p>
          </div>
        ) : (
          <div className="space-y-4">
            {boards.map((board) => (
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
                        <BoardActions canDelete={canDelete} board={board} />
                    </section>
                  </div>
                  {board.description && <p className="text-xs text-muted-foreground my-1.5">{board.description}</p>}
                </CardHeader>
                <CardContent className="sm:pt-3">
                <section className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                        Số thành viên:
                        <Badge className="px-1.5 py-0" variant="secondary">{board.members.length > 0 ? board.members.length : members.length}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs ml-auto">
                        Cập nhật lần cuối:
                        <Badge className="px-1.5 py-0 capitalize" variant="destructive">{formatRelative(board.updated_at, new Date(), { locale: vi })}</Badge>
                    </div>
                </section>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BoardsInWorkspaceDialog;
