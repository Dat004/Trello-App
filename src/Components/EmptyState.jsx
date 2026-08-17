import { Inbox } from "lucide-react";

import { Button } from "@/Components/UI";
import { cn } from "@/lib/utils";

function EmptyState({
  icon: Icon = Inbox,
  title = "Không có dữ liệu",
  description = "Hiện tại chưa có dữ liệu nào để hiển thị.",
  action,
  actionLabel,
  onAction,
  className,
}) {
  const RenderIcon = Icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed bg-muted/10 my-4 animate-fade-in",
        className
      )}
    >
      <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3.5 shadow-2xs">
        <RenderIcon className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
        {description}
      </p>

      {action || (actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="h-9 px-4 text-xs font-semibold gap-2 shadow-2xs">
          {actionLabel}
        </Button>
      ))}
    </div>
  );
}

export default EmptyState;
