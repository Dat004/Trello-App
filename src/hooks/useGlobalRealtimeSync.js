import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { UserToast } from "@/context/ToastContext";
import { NOTIFICATION_KEYS } from "@/features/notifications";
import { useAuthStore } from "@/store";
import { useNetworkStatus } from "./useNetworkStatus";
import useSocket from "./useSocket";

export function useGlobalRealtimeSync() {
    const wasDisconnectedRef = useRef(false);
    const lastRefetchTimeRef = useRef(0);

    const { socket, isConnected, joinRoom, leaveRoom, on, off } = useSocket();
    const { addToast } = UserToast();
    const { isOnline } = useNetworkStatus();

    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    // // Fetch workspaces to know which rooms to join
    // const { data: workspaces = [] } = useWorkspacesList();

    // Reconnect & Refetch Logic
    useEffect(() => {
        if (!socket) return;
        const REFETCH_COOLDOWN = 5000;

        const handleConnect = async () => {
            console.log("[Global] Socket connected");

            if (wasDisconnectedRef.current) {
                console.log("[Global] Reconnected after disconnect");
                const now = Date.now();

                if (now - lastRefetchTimeRef.current < REFETCH_COOLDOWN) {
                    addToast({ title: "Đã kết nối lại", type: 'success', duration: 2000 });
                    wasDisconnectedRef.current = false;
                    return;
                }

                lastRefetchTimeRef.current = now;

                // Invalidate valid queries to force refetch
                await queryClient.invalidateQueries();

                addToast({ title: "Đã kết nối lại và đồng bộ dữ liệu", type: 'success', duration: 2000 });
                wasDisconnectedRef.current = false;
            }
        };

        const handleDisconnect = (reason) => {
            console.warn("[Global] Socket disconnected:", reason);
            wasDisconnectedRef.current = true;
            if (reason !== 'io client disconnect') {
                addToast({ title: "Mất kết nối real-time", type: 'warning', duration: 3000 });
            }
        };

        const handleError = (error) => {
            console.error("[Global] Socket error:", error);
            addToast({ title: "Lỗi kết nối real-time", type: 'error', duration: 3000 });
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('error', handleError);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('error', handleError);
        };
    }, [socket, addToast, queryClient]);

    // Event Handling (Stable Listeners)
    useEffect(() => {
        if (!socket) return;

        // ==================== NOTIFICATION HANDLERS ====================
        const handleNewNotification = (notification) => {
            console.log("[GlobalSync] New notification received:", notification);

            const isReminder = notification.type === 'due_date_reminder';
            addToast({
                title: isReminder ? "Nhắc nhở hạn chót" : "Thông báo mới",
                description: isReminder
                    ? notification.message
                    : `${notification.sender?.full_name || "Hệ thống"} ${notification.message}`,
                type: isReminder ? "warning" : "info",
                duration: isReminder ? 8000 : 5000,
            });

            // Cập nhật số lượng thông báo chưa đọc
            queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old = 0) => {
                return old + 1;
            });

            // Cập nhật danh sách thông báo
            queryClient.setQueryData(NOTIFICATION_KEYS.list(), (oldRes) => {
                if (!oldRes?.data?.data) return oldRes;

                const currentNotifications = oldRes.data.data.notifications || [];
                const alreadyExists = currentNotifications.some(n => n._id === notification._id);

                let updatedNotifications;
                if (alreadyExists) {
                    // Cập nhật thông báo và đưa lên đầu
                    updatedNotifications = [
                        notification,
                        ...currentNotifications.filter(n => n._id !== notification._id)
                    ];
                } else {
                    // Thêm thông báo mới vào đầu danh sách
                    updatedNotifications = [notification, ...currentNotifications];
                }

                return {
                    ...oldRes,
                    data: {
                        ...oldRes.data,
                        data: {
                            ...oldRes.data.data,
                            notifications: updatedNotifications
                        }
                    }
                };
            });
        };

        // Listen for notifications
        socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);

        return () => {
            socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
        };
    }, [socket, addToast, queryClient]);

    // // Room Subscription Management
    // const workspaceIdsString = workspaces.map(w => w._id).sort().join(',');

    useEffect(() => {
        if (!user || !isConnected || !socket) return;

        // Join User Room
        joinRoom(ROOM_TYPES.USER, user._id);
        socket.emit(SOCKET_EVENTS.REGISTER_USER, {
            _id: user._id,
            full_name: user.full_name,
            avatar: user.avatar,
            username: user.username
        });

        // // Join Workspace Rooms
        // const ids = workspaceIdsString ? workspaceIdsString.split(',') : [];
        // ids.forEach(wsId => joinRoom(ROOM_TYPES.WORKSPACE, wsId));

        return () => {
            leaveRoom(ROOM_TYPES.USER, user._id);
            // ids.forEach(wsId => leaveRoom(ROOM_TYPES.WORKSPACE, wsId));
        };
    }, [user?._id, isConnected, socket, joinRoom, leaveRoom]);

    // Network Status Toast
    useEffect(() => {
        if (!isOnline) {
            addToast({ title: "Không có kết nối mạng", type: 'error', duration: 0 });
        } else {
            if (socket && !socket.connected) socket.connect();
        }
    }, [isOnline, socket]);

    return null;
}
