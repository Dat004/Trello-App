import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  X,
  User,
  MessageSquare,
  UserPlus,
  Trello,
  Settings,
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Button,
  ScrollArea,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./UI";

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "mention",
      title: "Được nhắc đến trong thẻ",
      message: "Nguyễn Văn A đã nhắc đến bạn trong thẻ 'Fix login bug'",
      time: "5 phút trước",
      isRead: false,
      avatar: "/placeholder.svg?height=32&width=32",
      boardName: "Website Redesign",
      userName: "Nguyễn Văn A",
    },
    {
      id: "2",
      type: "assignment",
      title: "Được giao thẻ mới",
      message:
        "Bạn được giao thẻ 'Update documentation' trong bảng Marketing Campaign",
      time: "1 giờ trước",
      isRead: false,
      boardName: "Marketing Campaign",
    },
    {
      id: "3",
      type: "comment",
      title: "Bình luận mới",
      message: "Trần Thị B đã bình luận trong thẻ 'Design review'",
      time: "2 giờ trước",
      isRead: true,
      avatar: "/placeholder.svg?height=32&width=32",
      boardName: "Product Roadmap",
      userName: "Trần Thị B",
    },
    {
      id: "4",
      type: "invitation",
      title: "Lời mời workspace",
      message: "Bạn được mời tham gia workspace 'Team Development'",
      time: "3 giờ trước",
      isRead: false,
    },
    {
      id: "5",
      type: "due_date",
      title: "Thẻ sắp hết hạn",
      message: "Thẻ 'Prepare presentation' sẽ hết hạn trong 2 giờ",
      time: "4 giờ trước",
      isRead: true,
      boardName: "Team Meeting",
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter((n) => !n.isRead).length || 0
  );

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "mention":
        return <User className="h-4 w-4 text-blue-500" />;
      case "assignment":
        return <Trello className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "invitation":
        return <UserPlus className="h-4 w-4 text-orange-500" />;
      case "due_date":
        return <Bell className="h-4 w-4 text-red-500" />;
      case "board_update":
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">Không có thông báo</h4>
              <p className="text-sm text-muted-foreground">
                Bạn đã xem hết tất cả thông báo
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={notification.avatar || "/placeholder.svg"}
                            alt={notification.userName}
                          />
                          <AvatarFallback className="text-xs">
                            {notification.userName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            {notification.boardName && (
                              <>
                                <span className="text-xs text-muted-foreground">
                                  •
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {notification.boardName}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                removeNotification(notification.id)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Xem tất cả thông báo
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationsPanel;
