import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { formatActivityMessage, getActivityContext } from "@/utils/activityFormatter";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI";
import { getActivityConfig } from "@/config/activityConfig";
import { cn } from "@/lib/utils";

function ActivityItem({ activity }) {
  const config = getActivityConfig(activity.action);
  const message = formatActivityMessage(activity);
  const context = getActivityContext(activity);
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
      <div className={cn(`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0`, config.bgColor)}>
        <Icon className={cn(`h-5 w-5`, config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="flex items-start gap-2 text-sm text-foreground">
          <Avatar className="h-5 w-5 inline-block">
            <AvatarImage src={activity.actor?.avatar?.url} alt={activity.actor?.full_name} />
            <AvatarFallback className="text-[10px]">
              {activity.actor?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">
            <b className="mr-1">
                {activity.actor?.full_name || "Người dùng"}
            </b>
            {message}
          </span>
        </p>

        {context && (
          <p className="text-xs text-muted-foreground mt-1">
            {context}
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-1.5">
          {formatDistanceToNow(new Date(activity.created_at), { 
            addSuffix: true, 
            locale: vi 
          })}
        </p>
      </div>
    </div>
  );
}

export default ActivityItem;

