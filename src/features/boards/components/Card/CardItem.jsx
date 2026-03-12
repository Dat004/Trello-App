import { memo } from "react";
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

import { useDeleteCard } from "@/features/boards/api/useCards";
import { getChecklistProgress } from "@/helpers/card";
import { formatDueDate } from "@/helpers/formatTime";
import DeleteDialog from "@/Components/DeleteDialog";
import SortableItem from "@/Components/SortableItem";
import CardDetailDialog from "./CardDetailDialog";
import CardFormDialog from "./CardFormDialog";
import { usePermissions } from "@/hooks";
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
} from "@/Components/UI";

function CardItem({ cardId, listId, boardId, isOverlay = false, card, currentBoard, removeCard }) {
  if (!card) return null;

  const members = card._membersCache || card.members || [];
  const { canDelete } = usePermissions({
    board: currentBoard,
    entity: {
      ownerId: card?.creator,
    },
  });
  const checklistProgress = getChecklistProgress(card);
  const dueDateInfo = formatDueDate(card.due_date);

  const { mutate: deleteCard, isLoading } = useDeleteCard();

  const handleDelete = () => {
    deleteCard({ boardId, listId, id: cardId });
    removeCard(cardId);
  };

  return (
    <SortableItem
      id={cardId}
      type="card"
      data={{ listId }}
      renderComponent={({ setNodeRef, style, attributes, listeners, isDragging }) => (
        <div
          style={style}
          ref={setNodeRef}
          className={cn(
            "will-change-transform",
            isDragging && !isOverlay && "opacity-0"
          )}
        >
          <CardDetailDialog
            card={card}
            listId={listId}
            boardId={boardId}
            trigger={
              <div 
                className={cn(
                  "bg-card p-3 rounded-md shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer group",
                  isOverlay && "shadow-2xl ring-2 ring-primary/20 rotate-1"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button 
                      {...attributes}
                      {...listeners}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 cursor-grab active:cursor-grabbing p-0.5 hover:bg-muted rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-2">
                        {card.title}
                      </p>

                      {card.labels && card.labels.length > 0 && (
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
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {card.description}
                        </p>
                      )}

                      {checklistProgress && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckSquare className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
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
                            className={cn(
                              "flex items-center gap-1 text-xs",
                              dueDateInfo.color === "destructive" ? "text-red-600" :
                              dueDateInfo.color === "warning" ? "text-orange-600" :
                              dueDateInfo.color === "secondary" ? "text-blue-600" : 
                              "text-gray-600"
                            )}
                          >
                            <Calendar className="h-3 w-3" />
                            <span>{dueDateInfo.text}</span>
                          </div>
                        )}

                        {card.priority && (
                          <div className={cn(
                            "flex items-center gap-1 text-xs",
                            card.priority === "high" ? "text-red-500" : 
                            card.priority === "medium" ? "text-orange-500" : 
                            "text-gray-500"
                          )}>
                            <AlertCircle className="h-3 w-3" />
                            <span className="capitalize">{card.priority}</span>
                          </div>
                        )}

                        {card.comment_count > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MessageSquare className="h-3 w-3" />
                            <span>{card.comment_count}</span>
                          </div>
                        )}

                        {card.attachment_count > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Paperclip className="h-3 w-3" />
                            <span>{card.attachment_count}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Members - Using Hybrid Approach */}
                      {members.length > 0 && (
                        <div className="flex items-center gap-0.5 mt-2">
                          {members.slice(0, 3).map((member) => {
                            const memberName = member.full_name || member.name || 'User';
                            const memberAvatar = member.avatar.url || '';
                            
                            return (
                              <Avatar 
                                key={member._id || member.id} 
                                className="h-7 w-7 border-1 border-white dark:border-gray-800"
                                title={memberName}
                              >
                                <AvatarImage src={memberAvatar} alt={memberName} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                  {memberName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {members.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-card">
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                +{members.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu modal={false}>
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
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
                          description={`Bạn có chắc muốn xóa thẻ "${card.title}"?`}
                          onConfirm={handleDelete}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
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
        </div>
      )}
    />
  );
}

export default memo(CardItem);
