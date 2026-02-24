import { ArrowLeft, Bell, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, CardContent } from "@/Components/UI";
import { useDeleteNotification, useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/features/notifications/api/useNotifications";
import { NotificationCard, NotificationFilter } from "@/features/notifications/components";

function NotificationContent() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");

    const { data: notifications = [], isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationRead();
    const { mutate: markAllAsRead } = useMarkAllNotificationsRead();
    const { mutate: removeNotification } = useDeleteNotification();

    const unreadNotifications = notifications.filter((n) => !n.is_read);
    const readNotifications = notifications.filter((n) => n.is_read);
    const unreadCount = unreadNotifications.length;

    const getFilteredNotifications = () => {
        switch (filter) {
            case "unread": return unreadNotifications;
            case "read": return readNotifications;
            default: return notifications;
        }
    };
    const filteredNotifications = getFilteredNotifications();

    const handleRemove = (id) => {
        removeNotification({ id });
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
                        <Bell className="h-8 w-8 text-primary" />
                        Thông báo
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : "Bạn đã đọc tất cả thông báo"}
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            {unreadCount > 0 && (
                <div className="flex gap-2 mb-6">
                    <Button 
                        onClick={() => markAllAsRead()} 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-medium"
                    >
                    <Check className="h-4 w-4" />
                    Đánh dấu tất cả đã đọc
                    </Button>
                </div>
            )}

            {/* Filter Tabs */}
            <NotificationFilter 
                filter={filter}
                counts={{
                    all: notifications.length,
                    unread: unreadCount,
                    read: readNotifications.length
                }}
                onFilterChange={setFilter}
            />

            {/* Content */}
            <div className="space-y-3 mt-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="animate-pulse">Đang tải thông báo...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <Card className="border-dashed bg-muted/20">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                <Bell className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <p className="font-semibold text-foreground">Không có thông báo nào</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {filter === 'all' ? 'Tất cả thông báo sẽ được hiển thị ở đây.' : 'Không có thông báo nào trong danh mục này.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredNotifications.map((notification) => (
                            <NotificationCard
                                key={notification._id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default NotificationContent;