import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { UserToast } from "@/context/ToastContext";
import { useSocket } from "@/hooks";
import { useAuthStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { NOTIFICATION_KEYS } from "../api/useNotifications";

export const useNotificationRealtime = () => {
    const { socket, joinRoom, leaveRoom, isConnected } = useSocket();
    const { addToast } = UserToast();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!socket || !isConnected || !user?._id) return;

        const handleNewNotification = (notification) => {
            console.log("[NotificationRealtime] You have a new notification:", notification);

            addToast({
                title: "Thông báo mới",
                description: `${notification.sender?.full_name || "Hệ thống"} ${notification.message}`,
                type: "info",
            });

            // Cập nhật số lượng thông báo chưa đọc
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());

            // Thêm thông báo vào danh sách
            queryClient.setQueryData(NOTIFICATION_KEYS.list(), (old = []) => [notification, ...old]);
        };

        socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);

        return () => {
            socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
        };
    }, [socket, isConnected, user?._id, joinRoom, leaveRoom, addToast, queryClient]);
};
