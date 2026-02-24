import {
  Bell,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "./UI";
import { getNotificationIcon, getNotificationIconColor } from "@/features/notifications/helpers/getNotificationIcon";
import { formatRelativeTime } from "@/helpers/formatTime";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount
} from "@/features/notifications/api/useNotifications";

function NotificationsPanel() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();
  const { mutate: removeNotification } = useDeleteNotification();

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeNotification({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 rounded-full hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 items-center justify-center rounded-full p-0 text-[9px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-xl border-border/50" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <h3 className="font-bold text-sm">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              className="text-[11px] h-7 px-2 text-primary hover:text-primary hover:bg-primary/10 font-medium"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Đang tải...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Không có thông báo</h4>
              <p className="text-xs text-muted-foreground">
                Chúng tôi sẽ thông báo cho bạn khi có cập nhật mới.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => {
                const ICON = getNotificationIcon(notification.type);
                const COLOR = getNotificationIconColor(notification.type);
                const senderName = notification.sender?.full_name || "Hệ thống";
                const avatarUrl = notification.sender?.avatar?.url;

                return (
                  <div
                    key={notification._id}
                    className={`p-4 transition-all duration-200 cursor-default hover:bg-muted/30 relative group ${
                      !notification.is_read ? "bg-primary/5 shadow-[inset_3px_0_0_0_rgba(var(--primary),0.5)]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 relative">
                        <Avatar className="h-9 w-9 border border-background shadow-sm">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={senderName} />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {senderName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background border flex items-center justify-center shadow-sm">
                           <ICON className={`h-2.5 w-2.5 ${COLOR}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-xs font-bold truncate leading-tight">{senderName}</span>
                              {!notification.is_read && (
                                <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-3 leading-snug">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[10px] text-muted-foreground/70 font-medium">
                                {formatRelativeTime(notification.create_at)}
                              </span>
                              {notification.board && (
                                <>
                                  <span className="text-muted-foreground/30 text-[10px]">•</span>
                                  <span className="text-[10px] text-primary truncate max-w-[100px] font-semibold">
                                    {notification.board.title}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                                onClick={(e) => handleMarkAsRead(e, notification._id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                              onClick={(e) => handleRemove(e, notification._id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t bg-muted/5">
          <Link to="/notifications">
            <Button variant="ghost" size="sm" className="w-full text-xs font-bold hover:bg-primary/5 hover:text-primary h-8">
              Xem tất cả thông báo
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationsPanel;
