import { useEffect, useState } from "react";
import { Edit, GripVertical, MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { UserToast } from "@/context/ToastContext";
import CardDetailDialog from "./CardDetailDialog";
import { useBoardDetailStore } from "@/store";
import CardFormDialog from "./CardFormDialog";
import DeleteDialog from "./DeleteDialog";
import { usePermissions } from "@/hooks";
import { listApi } from "@/api/list";
import CardItem from "./CardItem";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "./UI";

function BoardList({ listId, boardId }) {
  const currentBoard = useBoardDetailStore((state) => state.currentBoard);
  const lists = useBoardDetailStore((state) => state.lists);
  const updateList = useBoardDetailStore((state) => state.updateList);
  const removeList = useBoardDetailStore((state) => state.removeList);
  const list = lists[listId];

  const [title, setTitle] = useState(list.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const { addToast } = UserToast();
  const { canDelete } = usePermissions({ board: currentBoard });

  useEffect(() => {
    setTitle(list.title);
  }, [list]);

  const handleSaveTitle = async () => {
    if (!title.trim() || title === list.title) {
      setIsEditing(false);
      setTitle(list.title);

      return;
    }

    setIsLoading(true);
    const res = await listApi.update(boardId, listId, {
      title: title.trim(),
    });
    setIsLoading(false);
    setIsEditing(false);

    if (res.data.success) {
      updateList(listId, res.data.data.list);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(list.title);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await listApi.delete(boardId, listId);
    setIsLoading(false);

    if (res.data.success) {
      removeList(listId);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });
  };

  return (
    <>
      <section
        className={cn("flex-shrink-0 w-72 relative will-change-transform")}
      >
        <Card className="bg-white dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 h-fit overflow-hidden">
          <section className={cn("h-2", list.color)} />
          <CardHeader className="p-4 pb-3">
            <section className="flex items-center justify-between">
              <section className="flex items-center gap-2 flex-1">
                <button
                  className={cn(
                    "cursor-grab p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  )}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 pointer-events-none" />
                </button>
                {isEditing ? (
                  <h3>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={handleKeyPress}
                      className="font-semibold text-gray-900 dark:text-white p-0 h-6 border-none outline-none bg-transparent focus-visible:ring-0 flex-1"
                      autoFocus
                      disabled={isLoading}
                    />
                  </h3>
                ) : (
                  <h3
                    className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded -mx-2 -my-1 flex-1 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {list.title}
                  </h3>
                )}
              </section>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa tên
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {canDelete && (
                    <DeleteDialog
                      title="Xóa cột này?"
                      description={`Bạn có chắc muốn xóa cột "${list.title}"? Hành động này không thể hoàn tác.`}
                      onConfirm={handleDelete}
                      trigger={
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa danh sách
                        </DropdownMenuItem>
                      }
                    />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </section>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <section className="min-h-[100px] mb-3 rounded-lg transition-all duration-200 relative">
              <section className="space-y-2 p-2">
                {list.cardOrderIds.length === 0 ? (
                  <section className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Chưa có thẻ nào</p>
                    <p className="text-xs">Thêm thẻ đầu tiên của bạn</p>
                  </section>
                ) : (
                  list.cardOrderIds.map((cardId) => (
                    <CardItem
                      key={cardId}
                      cardId={cardId}
                      listId={list._id}
                      boardId={boardId}
                    />
                  ))
                )}
              </section>
            </section>
            <CardFormDialog
              listId={list._id}
              boardId={boardId}
              trigger={
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full leading-1.5 justify-start text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              }
            />
          </CardContent>
        </Card>
      </section>
      <CardDetailDialog
        card={selectedCard}
        listId={list._id}
        boardId={boardId}
        open={isCardModalOpen}
        onOpenChange={setIsCardModalOpen}
      />
    </>
  );
}

export default BoardList;
