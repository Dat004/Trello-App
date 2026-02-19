import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useWorkspacesList } from "@/features/workspaces/api/useWorkspacesList";
import { useNetworkStatus } from "./useNetworkStatus";
import { UserToast } from "@/context/ToastContext";
import { useAuthStore } from "@/store";
import useSocket from "./useSocket";

export function useGlobalRealtimeSync() {
    const wasDisconnectedRef = useRef(false);
    const lastRefetchTimeRef = useRef(0);

    const { socket, isConnected, joinRoom, leaveRoom, on, off } = useSocket();
    const { addToast } = UserToast();
    const { isOnline } = useNetworkStatus();

    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    // Fetch workspaces to know which rooms to join
    const { data: workspaces = [] } = useWorkspacesList();

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
    // useEffect(() => {
    //     if (!socket) return;

    //     // ==================== HANDLERS ====================

    //     const handleWorkspaceUpdated = (workspace) => {
    //         queryClient.invalidateQueries(WORKSPACES_KEYS.list());
    //         queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspace._id));
    //     };

    //     const handleWorkspaceDeleted = (workspaceId) => {
    //         queryClient.invalidateQueries(WORKSPACES_KEYS.list());
    //         queryClient.removeQueries(WORKSPACE_KEYS.detail(workspaceId));

    //         if (pathname.includes(`/workspaces/${workspaceId}`)) {
    //             addToast({ title: "Workspace này đã bị xóa", type: "warning" });
    //             navigate('/workspaces');
    //         }
    //     };

    //     const handleMemberRemoved = ({ workspaceId, member_id, userId }) => {
    //         if (userId === user?._id) {
    //             // I was removed
    //             queryClient.invalidateQueries(WORKSPACES_KEYS.list());
    //             queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspaceId));

    //             if (pathname.includes(`/workspaces/${workspaceId}`)) {
    //                 addToast({ title: "Bạn đã bị xóa khỏi workspace", type: "warning" });
    //                 navigate('/workspaces');
    //             }
    //         } else {
    //             // Someone else removed
    //             queryClient.invalidateQueries(WORKSPACE_KEYS.members(workspaceId));
    //             queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspaceId));
    //         }
    //     };

    //     // Listeners Registry
    //     socket.on(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
    //     socket.on(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
    //     socket.on(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);

    //     return () => {
    //         socket.off(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
    //         socket.off(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
    //         socket.off(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
    //     };
    // }, [socket, user?._id, queryClient, navigate, pathname, currentBoardId]);

    // // Room Subscription Management (Optimized)
    // const workspaceIdsString = workspaces.map(w => w._id).sort().join(',');

    // useEffect(() => {
    //     if (!user || !isConnected || !socket) return;

    //     console.log("[Global] Updating room subscriptions");

    //     // Join User Room
    //     joinRoom(ROOM_TYPES.USER, user._id);

    //     // Join Workspace Rooms
    //     const ids = workspaceIdsString ? workspaceIdsString.split(',') : [];
    //     ids.forEach(wsId => joinRoom(ROOM_TYPES.WORKSPACE, wsId));

    //     return () => {
    //         leaveRoom(ROOM_TYPES.USER, user._id);
    //         ids.forEach(wsId => leaveRoom(ROOM_TYPES.WORKSPACE, wsId));
    //     };
    // }, [user, isConnected, socket, workspaceIdsString, joinRoom, leaveRoom]);

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
