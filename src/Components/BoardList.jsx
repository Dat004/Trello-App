import { useState, useRef, useCallback, forwardRef } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Plus,
  GripVertical,
} from "lucide-react";

import CardDetailDialog from "./CardDetailDialog";
import AddCardForm from "./AddCardForm";
import CardItem from "./CardItem";
import { cn } from "@/lib/utils";
import {
  Input,
  Button,
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./UI";

const getColorClass = (color) => {
  const colorMap = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
  };
  return colorMap[color || "emerald"] || "bg-emerald-500";
};

const BoardList = forwardRef(
  (
    {
      list,
      index,
      boardId,
      isOverlay = false,
      isDragging = false,
      onPointerUp = () => {},
      onPointerDown = () => {},
    },
    ref
  ) => {
    const [title, setTitle] = useState(list.title);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);

    const handleSaveTitle = async () => {
      if (!title.trim() || title === list.title) {
        setIsEditing(false);
        setTitle(list.title);
        return;
      }
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoading(false);
      setIsEditing(false);
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
      if (confirm(`Bạn có chắc chắn muốn xóa danh sách "${list.title}"?`)) {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
      }
    };

    const handleCopy = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    const handleCardEdit = (card) => {
      setSelectedCard(card);
      setIsCardModalOpen(true);
    };

    return (
      <>
        <section
          ref={ref}
          data-order={list.order}
          onPointerDown={isOverlay ? null : (e) => onPointerDown(e, list.order)}
          onPointerUp={isOverlay ? null : onPointerUp}
          className={cn("flex-shrink-0 w-72 relative will-change-transform")}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 h-fit overflow-hidden">
            <section className={cn("h-2", getColorClass(list.color))} />
            <CardHeader className="p-4 pb-3">
              <section className="flex items-center justify-between">
                <section className="flex items-center gap-2 flex-1">
                  <button
                    className={cn(
                      "cursor-grab p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors",
                      isDragging && "cursor-grabbing"
                    )}
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 pointer-events-none" />
                  </button>
                  {isEditing ? (
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={handleKeyPress}
                      className="font-semibold text-gray-900 dark:text-white border-none p-0 h-auto bg-transparent focus-visible:ring-0 flex-1"
                      autoFocus
                      disabled={isLoading}
                    />
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
                    <DropdownMenuItem onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Sao chép danh sách
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa danh sách
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </section>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <section className="min-h-[100px] mb-3 rounded-lg transition-all duration-200 relative">
                <section className="space-y-2 p-2">
                  {list.cards.length === 0 ? (
                    <section className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">Chưa có thẻ nào</p>
                      <p className="text-xs">Thêm thẻ đầu tiên của bạn</p>
                    </section>
                  ) : (
                    list.cards
                      .sort((a, b) => a.order - b.order)
                      .map((card, cardIndex) => (
                        <CardItem
                          key={card.id}
                          card={card}
                          listId={list.id}
                          boardId={boardId}
                          index={cardIndex}
                          onEdit={handleCardEdit}
                        />
                      ))
                  )}
                </section>
              </section>
              {showAddCard ? (
                <AddCardForm
                  listId={list.id}
                  boardId={boardId}
                  onCancel={() => setShowAddCard(false)}
                  onSuccess={() => setShowAddCard(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setShowAddCard(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
        <CardDetailDialog
          card={selectedCard}
          listId={list.id}
          boardId={boardId}
          open={isCardModalOpen}
          onOpenChange={setIsCardModalOpen}
        />
      </>
    );
  }
);

export default BoardList;
