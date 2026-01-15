import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Edit,
  GripVertical,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Trash2,
} from "lucide-react";

import { useApiMutation, usePermissions } from "@/hooks";
import { getChecklistProgress } from "@/helpers/card";
import { formatDueDate } from "@/helpers/formatTime";
import CardDetailDialog from "./CardDetailDialog";
import { useBoardDetailStore } from "@/store";
import CardFormDialog from "./CardFormDialog";
import DeleteDialog from "./DeleteDialog";
import { cardApi } from "@/api/card";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Progress,
} from "./UI";

function CardItem({ cardId, listId, boardId }) {
  const currentBoard = useBoardDetailStore((state) => state.currentBoard);
  const removeCard = useBoardDetailStore((state) => state.removeCard);
  const cards = useBoardDetailStore((state) => state.cards);
  const card = cards[cardId];

  const { canDelete } = usePermissions({
    board: currentBoard,
    entity: {
      ownerId: card?.creator,
    },
  });
  const checklistProgress = getChecklistProgress(card);
  const dueDateInfo = formatDueDate(card.due_date);

  const { mutate: deleteCard, isLoading } = useApiMutation(
    () => cardApi.delete(boardId, listId, cardId),
    () => removeCard(cardId)
  );

  const handleDelete = () => {
    deleteCard();
  };

  return (
    <CardDetailDialog
      card={card}
      listId={listId}
      boardId={boardId}
      trigger={
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 cursor-grab active:cursor-grabbing">
                <GripVertical className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {card.title}
                </p>

                {card.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.labels.map((label) => (
                      <Badge
                        style={{ lineHeight: 1.15 }}
                        key={label._id}
                        className={cn(
                          "text-white text-xs px-2 py-0.5 rounded",
                          `hover:${label.color}/10`,
                          label.color
                        )}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {card.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {card.description}
                  </p>
                )}

                {checklistProgress && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckSquare className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {checklistProgress.completed}/{checklistProgress.total}
                      </span>
                    </div>
                    <Progress
                      value={checklistProgress.percentage}
                      className="h-1"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {dueDateInfo && (
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        dueDateInfo.color === "destructive"
                          ? "text-red-600 dark:text-red-400"
                          : dueDateInfo.color === "warning"
                          ? "text-orange-600 dark:text-orange-400"
                          : dueDateInfo.color === "secondary"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>{dueDateInfo.text}</span>
                    </div>
                  )}

                  {card.priority && (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs dark:text-gray-400",
                        card.priority === "high"
                          ? "text-red-500"
                          : card.priority === "medium"
                          ? "text-orange-500"
                          : "text-gray-500"
                      )}
                    >
                      <AlertCircle className="h-3 w-3" />
                      <span className="capitalize">{card.priority}</span>
                    </div>
                  )}

                  {card.comment_count > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <MessageSquare className="h-3 w-3" />
                      <span>{card.comment_count}</span>
                    </div>
                  )}

                  {card.attachment_count > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Paperclip className="h-3 w-3" />
                      <span>{card.attachment_count}</span>
                    </div>
                  )}
                </div>

                {card.members.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {card.members.slice(0, 3).map((member) => (
                      <Avatar
                        key={member.id}
                        className="h-6 w-6 border-2 border-white dark:border-gray-800"
                      >
                        <AvatarImage
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                        />
                        <AvatarFallback className="text-xs">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {card.members.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                        +{card.members.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  disabled={isLoading}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <CardFormDialog
                  isEdit
                  cardData={card}
                  boardId={boardId}
                  listId={listId}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                {canDelete && (
                  <DeleteDialog
                    title="Xóa thẻ này?"
                    description={`Bạn có chắc muốn xóa thẻ "${card.title}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleDelete}
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa thẻ
                      </DropdownMenuItem>
                    }
                  />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      }
    />
  );
}

export default CardItem;
