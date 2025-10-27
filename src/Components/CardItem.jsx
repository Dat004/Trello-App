import { useState } from "react";
import {
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  GripVertical,
  Calendar,
  CheckSquare,
  MessageSquare,
  Paperclip,
  AlertCircle,
} from "lucide-react";

import {
  Progress,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./UI";

const getChecklistProgress = (card) => {
  if (card.checklist.length === 0) return null;
  const completed = card.checklist.filter((item) => item.completed).length;
  const total = card.checklist.length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
};

const formatDueDate = (date) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { text: "Quá hạn", color: "destructive" };
  if (days === 0) return { text: "Hôm nay", color: "warning" };
  if (days === 1) return { text: "Ngày mai", color: "warning" };
  if (days <= 3) return { text: `${days} ngày`, color: "warning" };
  return {
    text: date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" }),
    color: "default",
  };
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

const getLabelColor = (color) => {
  const colors = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    gray: "bg-gray-500",
  };
  return colors[color] || "bg-gray-500";
};

function CardItem({
  card,
  listId,
  boardId,
  index,
  onEdit,
  isDragging = false,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const checklistProgress = getChecklistProgress(card);
  const dueDateInfo = card.dueDate ? formatDueDate(card.dueDate) : null;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa thẻ "${card.title}"?`)) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    }
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCard = {
      ...card,
      id: Date.now().toString(),
      title: `${card.title} (Sao chép)`,
      order: card.order + 0.1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setIsLoading(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(card);
  };

  if (isDragging) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg border-2 border-blue-300 dark:border-blue-600 opacity-90 rotate-3 scale-105 cursor-grabbing">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {card.title}
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onEdit(card)}
    >
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
                  <div
                    key={label.id}
                    className={`${getLabelColor(
                      label.color
                    )} text-white text-xs px-2 py-0.5 rounded`}
                  >
                    {label.name}
                  </div>
                ))}
              </div>
            )}
            {/* </CHANGE> */}

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
            {/* </CHANGE> */}

            <div className="flex items-center gap-3 flex-wrap">
              {dueDateInfo && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    dueDateInfo.color === "destructive"
                      ? "text-red-600 dark:text-red-400"
                      : dueDateInfo.color === "warning"
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{dueDateInfo.text}</span>
                </div>
              )}

              {card.priority && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <AlertCircle
                    className={`h-3 w-3 ${
                      card.priority === "high"
                        ? "text-red-500"
                        : card.priority === "medium"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="capitalize">{card.priority}</span>
                </div>
              )}

              {card.comments.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <MessageSquare className="h-3 w-3" />
                  <span>{card.comments.length}</span>
                </div>
              )}

              {card.attachments.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Paperclip className="h-3 w-3" />
                  <span>{card.attachments.length}</span>
                </div>
              )}
            </div>
            {/* </CHANGE> */}

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
            {/* </CHANGE> */}
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
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa thẻ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default CardItem;
