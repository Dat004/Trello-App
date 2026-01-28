import { Star, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";

import BoardFormDialog from "@/Components/BoardFormDialog";
import DeleteDialog from "@/Components/DeleteDialog";
import { useBoard, useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from "@/Components/UI";

const BoardActions = ({ board, canDelete }) => {
  const { removeBoard } = useBoard();
  const { toggleBoardStar, isTogglingBoard } = useFavorites();

  const handleToggleStar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleBoardStar(board);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Nút Star */}
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 cursor-pointer hover:bg-transparent"
        onClick={(e) => handleToggleStar(e)}
        disabled={isTogglingBoard}
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

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
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
                title="Xóa bảng này?"
                description={`Bạn có chắc muốn xóa bảng "${board.title}"? Hành động này không thể hoàn tác.`}
                onConfirm={() => removeBoard(board._id, board.workspace)}
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
