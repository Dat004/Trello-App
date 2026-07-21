import { Archive, Edit, Loader2, MoreHorizontal, RotateCcw, Star, Trash2 } from "lucide-react";

import DeleteDialog from "@/Components/DeleteDialog";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/UI";
import {
  useArchiveBoard,
  useDeleteBoard,
  useUnarchiveBoard,
} from "@/features/boards/api/useBoards";
import { useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";
import BoardFormDialog from "../Dialogs/BoardFormDialog";

const BoardActions = ({ board, canDelete, archived = false }) => {
  const { toggleBoardStar, isTogglingBoard } = useFavorites();
  const { mutateAsync: deleteBoard } = useDeleteBoard();
  const { mutate: archiveBoard, isLoading: isArchiving } = useArchiveBoard();
  const { mutateAsync: unarchiveBoard, isLoading: isUnarchiving } = useUnarchiveBoard();

  const handleToggleStar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleBoardStar(board);
  };

  const handleDelete = async () => {
      await deleteBoard({ id: board._id, workspaceId: board.workspace });
  };

  if (archived) {
    return (
      <div className="flex items-center gap-1">
        <DeleteDialog
          title="Khôi phục bảng này?"
          description={`Bảng "${board.title}" sẽ xuất hiện lại trong danh sách bảng đang hoạt động.`}
          onConfirm={() => unarchiveBoard({ id: board._id })}
          confirmLabel="Khôi phục"
          confirmVariant="default"
          loadingLabel="Đang khôi phục..."
          trigger={
            <Button
              size="sm"
              variant="secondary"
              className="h-8 gap-1.5 px-2.5"
              disabled={isUnarchiving}
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label={`Khôi phục bảng ${board.title}`}
            >
              {isUnarchiving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              <span className="text-xs font-medium">Khôi phục</span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Nút Star */}
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 cursor-pointer hover:bg-transparent"
        onClick={(e) => handleToggleStar(e)}
        disabled={isTogglingBoard}
        aria-label={board.is_starred ? "Bỏ đánh dấu yêu thích" : "Đánh dấu yêu thích"}
      >
        {isTogglingBoard ? (
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
        ) : (
          <Star
            className={cn(
              "h-4 w-4 transition-all hover:scale-110",
              board.is_starred
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            )}
          />
        )}
      </Button>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label={`Thao tác với bảng ${board.title}`}
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <BoardFormDialog
            isEdit
            boardData={board}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa bảng
              </DropdownMenuItem>
            }
          />

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="Lưu trữ bảng này?"
                description={`Bảng "${board.title}" sẽ được ẩn khỏi danh sách bảng.`}
                onConfirm={() => archiveBoard({ id: board._id })}
                trigger={
                  <DropdownMenuItem
                    disabled={isArchiving}
                    onSelect={(event) => event.preventDefault()}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Lưu trữ bảng
                  </DropdownMenuItem>
                }
              />
              <DeleteDialog
                title="Xóa bảng này?"
                description={`Bạn có chắc muốn xóa bảng "${board.title}"? Hành động này không thể hoàn tác.`}
                onConfirm={handleDelete}
                trigger={
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa bảng
                  </DropdownMenuItem>
                }
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BoardActions;
