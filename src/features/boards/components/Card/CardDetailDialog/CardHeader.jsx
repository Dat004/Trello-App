import { AlertCircle, Calendar, Tag } from "lucide-react";

import { useUpdateCardComplete } from "@/features/boards/api/useCards";
import { Input, Label, Switch } from "@/Components/UI";
import { formatDateOnly } from "@/helpers/formatTime";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

function CardHeader({ card, locks, boardId, listId, currentBoard }) {
  const { user } = useAuthStore();
  const { mutateAsync: updateComplete, isLoading: isUpdatingComplete } = useUpdateCardComplete();

  const isAssigned = card.members?.some((m) => m._id === user?._id || m.user?._id === user?._id);
  const isBoardAdmin = currentBoard?.members?.some(
    (m) => m.user?._id === user?._id && m.role === "admin"
  );
  const isBoardOwner = currentBoard?.owner === user?._id;

  const canMarkComplete = isAssigned || isBoardAdmin || isBoardOwner;

  const handleToggleComplete = async (checked) => {
    if (!canMarkComplete) return;
    await updateComplete({
      boardId,
      listId,
      id: card._id,
      data: { due_complete: checked },
    });
  };
  
  return (
    <div className="grid gap-4">
      {/* Title */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="card-title" className="text-sm font-medium">
            Tiêu đề
          </Label>
          <div className="flex items-center gap-4">
            {locks?.title && (
              <div className="flex items-center gap-1.5 text-[10px] text-orange-500 font-medium animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {locks.title.full_name} đang sửa...
              </div>
            )}
            
            <div 
              className="flex items-center gap-2"
              title={!canMarkComplete ? "Chỉ người được phân công hoặc Quản trị viên bảng mới được phép đánh dấu thẻ này." : (card.due_complete ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành")}
            >
              <Label className={cn("text-xs font-medium cursor-pointer", card.due_complete ? "text-green-600" : "text-muted-foreground", !canMarkComplete && "opacity-50")}>
                {card.due_complete ? "Hoàn thành" : "Chưa hoàn thành"}
              </Label>
              <Switch 
                checked={card.due_complete || false}
                onCheckedChange={handleToggleComplete}
                disabled={!canMarkComplete || isUpdatingComplete}
              />
            </div>
          </div>
        </div>
        <Input
          id="card-title"
          value={card.title}
          readOnly
          className={cn(
            "text-base font-semibold transition-all",
            locks?.title && "bg-orange-50/50 border-orange-200"
          )}
        />
      </div>

      {/* Labels, Priority, Due Date */}
      <div className="grid gap-3">
        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-gray-500" />
            {card.labels.map((label) => (
              <div
                key={label._id}
                className={`${label.color} text-white text-xs px-2 py-1 rounded`}
              >
                {label.name}
              </div>
            ))}
          </div>
        )}

        {/* Priority & Due Date */}
        <div className="flex items-center gap-4 text-sm">
          {card.priority && (
            <div className="flex items-center gap-2">
              <AlertCircle
                className={`h-4 w-4 ${
                  card.priority === "high"
                    ? "text-red-500"
                    : card.priority === "medium"
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}
              />
              <span className="capitalize text-gray-700 dark:text-gray-300">
                Độ ưu tiên: <strong>{card.priority}</strong>
              </span>
            </div>
          )}

          <div className={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-md transition-colors",
            card.due_complete ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : ""
          )}>
            <Calendar className={cn(
              "h-4 w-4",
              card.due_complete ? "text-green-600 dark:text-green-400" : "text-gray-500"
            )} />
            <span className={cn(
               "text-sm font-medium",
               !card.due_complete && "text-gray-700 dark:text-gray-300"
            )}>
              Hạn:{" "}
              <strong>
                {card.due_date
                  ? formatDateOnly(card.due_date)
                  : "Không có hạn"}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardHeader;
