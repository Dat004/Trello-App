import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { UserToast } from "@/context/ToastContext";
import {
    NOTIFICATION_KEYS,
    REALTIME_QUERY_PREFIXES,
} from "@/query/queryKeys";
import { useAuthStore } from "@/store";
import { useNetworkStatus } from "./useNetworkStatus";
import useSocket from "./useSocket";

/**
 * App-level realtime: reconnect refetch, notification toasts, user room join.
 * Board/card entity patches live in useBoardRealtime / useCardRealtime.
 * See README "State ownership & realtime" for reconciliation rules.
 */
export function useGlobalRealtimeSync() {
    const wasDisconnectedRef = useRef(false);
    const lastRefetchTimeRef = useRef(0);

    const { socket, isConnected, joinRoom, leaveRoom } = useSocket();
    const { addToast } = UserToast();
    const { isOnline } = useNetworkStatus();

    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const prevUserIdRef = useRef(undefined);

    // Socket auth uses the httpOnly cookie at handshake. Reconnect only when
    // needed — avoid disconnect/connect flaps that spam board presence toasts.
    useEffect(() => {
        if (!socket) return;

        const userId = user?._id ? String(user._id) : null;
        const prevUserId = prevUserIdRef.current;
        prevUserIdRef.current = userId;

        // Initial mount before auth init resolves.
        if (prevUserId === undefined && userId === null) return;

        // Logout
        if (prevUserId && !userId) {
            if (socket.connected) socket.disconnect();
            return;
        }

        // Account switch
        if (prevUserId && userId && prevUserId !== userId) {
            wasDisconnectedRef.current = false;
            if (socket.connected) socket.disconnect();
            socket.connect();
            return;
        }

        // Login / auth hydration: connect only if the socket is down.
        if (userId && !socket.connected) {
            socket.connect();
        }
    }, [socket, user?._id]);

    useEffect(() => {
        if (!socket) return;
        const REFETCH_COOLDOWN = 5000;

        const handleConnect = async () => {
            if (wasDisconnectedRef.current) {
                const now = Date.now();

                if (now - lastRefetchTimeRef.current < REFETCH_COOLDOWN) {
                    addToast({ title: "Đã kết nối lại", type: 'success', duration: 2000 });
                    wasDisconnectedRef.current = false;
                    return;
                }

                lastRefetchTimeRef.current = now;

                await Promise.all(
                    REALTIME_QUERY_PREFIXES.map((queryKey) =>
                        queryClient.invalidateQueries({ queryKey })
                    )
                );

                addToast({ title: "Đã kết nối lại và đồng bộ dữ liệu", type: 'success', duration: 2000 });
                wasDisconnectedRef.current = false;
            }
        };

        const handleDisconnect = (reason) => {
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

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            const isReminder = notification.type === 'due_date_reminder';
            addToast({
                title: isReminder ? "Nhắc nhở hạn chót" : "Thông báo mới",
                description: isReminder
                    ? notification.message
                    : `${notification.sender?.full_name || "Hệ thống"} ${notification.message}`,
                type: isReminder ? "warning" : "info",
                duration: isReminder ? 8000 : 5000,
            });

            queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old = 0) => {
                return old + 1;
            });

            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
        };

        socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);

        return () => {
            socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
        };
    }, [socket, addToast, queryClient]);

    useEffect(() => {
        if (!user || !isConnected || !socket) return;

        joinRoom(ROOM_TYPES.USER, user._id);
        socket.emit(SOCKET_EVENTS.REGISTER_USER, {
            _id: user._id,
            full_name: user.full_name,
            avatar: user.avatar,
            username: user.username
        });

        return () => {
            leaveRoom(ROOM_TYPES.USER, user._id);
        };
    }, [user, isConnected, socket, joinRoom, leaveRoom]);

    useEffect(() => {
        if (!isOnline) {
            addToast({ title: "Không có kết nối mạng", type: 'error', duration: 0 });
        } else if (socket && !socket.connected) {
            socket.connect();
        }
    }, [isOnline, socket, addToast]);

    return null;
}
