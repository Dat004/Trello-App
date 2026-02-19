import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Edit, GripVertical, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useDeleteList, useUpdateList } from "@/features/boards/api/useLists";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { usePermissions } from "@/hooks";

import DeleteDialog from "@/Components/DeleteDialog";
import SortableItem from "@/Components/SortableItem";
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
} from "@/Components/UI";
import { cn } from "@/lib/utils";
import CardFormDialog from "../Card/CardFormDialog";
import CardItem from "../Card/CardItem";

function BoardList({ listId, boardId, isOverlay = false }) {
  // Use Context
  const { boardData, removeCard } = useBoardContext();
  const { currentBoard, lists } = boardData;
  const list = lists[listId];

  const [title, setTitle] = useState(list?.title || "");
  const [isEditing, setIsEditing] = useState(false);

  // React Query Mutations
  const { mutate: updateListTitle, isLoading: isUpdating } = useUpdateList();
  const { mutate: deleteList, isLoading: isDeleting } = useDeleteList();
  
  const isLoading = isUpdating || isDeleting;

  useEffect(() => {
    if (list) {
         setTitle(list.title);
    }
  }, [list]);

  // Guard if list not found (e.g. deleted externally but not synced yet)
  if (!list) return null;

  const { canDelete } = usePermissions({ board: currentBoard });

  const handleSaveTitle = () => {
    if (!title.trim() || title === list.title) {
      setIsEditing(false);
      setTitle(list.title);
      return;
    }

    updateListTitle({ 
        boardId, 
        listId, 
        data: { title: title.trim() } 
    }, {
        onSuccess: () => setIsEditing(false)
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

  const handleDelete = () => {
    deleteList({ boardId, listId });
  };

    return (
      <SortableItem
        id={listId}
        type="list"
        renderComponent={({ setNodeRef, style, attributes, listeners, isDragging }) => (
          <section
            ref={setNodeRef}
            style={style}
            className={cn(
              "flex-shrink-0 w-72 relative will-change-transform",
              isDragging && !isOverlay && "opacity-0"
            )}
          >
            <Card className={cn(
              "bg-white dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 h-fit overflow-hidden transition-shadow",
              isOverlay && "shadow-2xl ring-2 ring-primary/20",
              !isOverlay && "hover:shadow-lg"
            )}>
              <section className={cn("h-2", list.color || "bg-transparent")} />
              <CardHeader className="p-4 pb-3">
                <section className="flex items-center justify-between">
                  <section className="flex items-center gap-2 flex-1">
                    <button
                      {...attributes}
                      {...listeners}
                      className={cn(
                        "cursor-grab p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors active:cursor-grabbing"
                      )}
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 pointer-events-none" />
                    </button>
                    {isEditing ? (
                      <h3 className="flex-1">
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          onBlur={handleSaveTitle}
                          onKeyDown={handleKeyPress}
                          className="font-semibold text-gray-900 dark:text-white p-0 h-6 border-none outline-none bg-transparent focus-visible:ring-0 w-full"
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
              <CardContent className="p-4 pt-0 max-h-[calc(100vh-250px)] flex flex-col">
                <section className="overflow-y-auto overflow-x-hidden custom-scrollbar pr-1 -mr-1">
                  <SortableContext items={list.cardOrderIds} strategy={verticalListSortingStrategy}>
                    <section className="space-y-2 p-1 min-h-[10px]">
                      {list.cardOrderIds.length === 0 && !isOverlay && (
                        <section className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <p className="text-sm">Chưa có thẻ nào</p>
                          <p className="text-xs">Thêm thẻ đầu tiên của bạn</p>
                        </section>
                      )}
                      {list.cardOrderIds.map((cardId) => (
                        <CardItem
                          key={cardId}
                          cardId={cardId}
                          listId={list._id}
                          boardId={boardId}
                          card={boardData.cards[cardId]}
                          currentBoard={currentBoard}
                          removeCard={removeCard}
                        />
                      ))}
                    </section>
                  </SortableContext>
                </section>
                <div className="mt-3">
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
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      />
    );
}

export default BoardList;
