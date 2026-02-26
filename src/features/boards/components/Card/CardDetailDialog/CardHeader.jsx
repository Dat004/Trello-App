import { AlertCircle, Calendar, Tag } from "lucide-react";

import { Input, Label } from "@/Components/UI";
import { formatDateOnly } from "@/helpers/formatTime";
import { cn } from "@/lib/utils";

function CardHeader({ card, locks }) {
  return (
    <div className="grid gap-4">
      {/* Title */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="card-title" className="text-sm font-medium">
            Tiêu đề
          </Label>
          {locks?.title && (
            <div className="flex items-center gap-1.5 text-[10px] text-orange-500 font-medium animate-pulse">
               <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
               {locks.title.full_name} đang sửa...
            </div>
          )}
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

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
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
