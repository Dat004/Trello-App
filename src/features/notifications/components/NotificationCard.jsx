import { Check, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent } from "@/Components/UI";
import { formatRelativeTime } from "@/helpers/formatTime";
import { getNotificationIcon, getNotificationIconColor } from "../helpers/getNotificationIcon";

function NotificationCard({
  notification,
  onMarkAsRead,
  onRemove,
}) {
  const ICON = getNotificationIcon(notification.type);
  const COLOR = getNotificationIconColor(notification.type);
  const senderName = notification.sender?.full_name || "Hệ thống";
  const avatarUrl = notification.sender?.avatar?.url;
  
  return (
    <Card className={`transition-all hover:shadow-md ${!notification.is_read ? "border-primary/50 bg-primary/5 shadow-sm" : "bg-card"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Sender Avatar or Type Icon */}
          <div className="flex-shrink-0 mt-1 relative">
            <Avatar className="h-10 w-10 border border-border shadow-sm">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={senderName} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                {senderName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Action Type Badge/Icon overlay */}
            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border flex items-center justify-center shadow-sm`}>
              <ICON className={`h-3 w-3 ${COLOR}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{senderName}</span>
                  <p className="text-sm text-muted-foreground inline">
                    {notification.message}
                  </p>
                  {!notification.is_read && (
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                  <span className="text-muted-foreground">
                    {formatRelativeTime(notification.create_at)}
                  </span>
                  
                  {notification.workspace && (
                    <>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-muted-foreground font-medium">
                        {notification.workspace.name || notification.workspace.title}
                      </span>
                    </>
                  )}
                  
                  {notification.board && (
                    <>
                      <span className="text-muted-foreground/30">•</span>
                      <Badge variant="outline" className="text-[10px] h-4 py-0 font-medium bg-muted/50 border-muted-foreground/20">
                        {notification.board.title}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification._id)}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(notification._id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NotificationCard;
