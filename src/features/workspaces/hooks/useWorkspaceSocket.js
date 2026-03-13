import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { BOARD_KEYS } from "@/features/workspaces/api/useWorkspaceBoards";
import { WORKSPACE_KEYS } from "@/features/workspaces/api/useWorkspaceDetail";
import { WORKSPACES_KEYS } from "@/features/workspaces/api/useWorkspacesList";
import { WORKSPACE_ACTIVITIES_KEYS } from "../api/useWorkspaceActivities";
import { WORKSPACE_MEMBERS_KEYS } from "../api/useWorkspaceMembers";
import { UserToast } from "@/context/ToastContext";
import { useAuthStore } from "@/store";
import { useSocket } from "@/hooks";

export function useWorkspaceSocket(workspaceId) {
    const { on, off, joinRoom, leaveRoom, isConnected } = useSocket();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { addToast } = UserToast();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!workspaceId || !isConnected) return;

        // Join workspace room
        joinRoom(ROOM_TYPES.WORKSPACE, workspaceId);

        // --- Granular Invalidation Handlers ---

        const handleWorkspaceInfoUpdate = () => {
            queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspaceId));
            queryClient.invalidateQueries(WORKSPACE_ACTIVITIES_KEYS.list(workspaceId));
        };

        const handleWorkspaceDelete = (wsId) => {
            queryClient.invalidateQueries(WORKSPACE_ACTIVITIES_KEYS.list(workspaceId));
            queryClient.removeQueries(WORKSPACE_KEYS.detail(workspaceId));

            if (wsId === workspaceId) {
                addToast({ title: "Workspace này đã bị xóa", type: "warning" });
                navigate("/workspaces");
            }
        }

        const handleRemoveMember = ({ workspaceId: wsId, member_id, userId }) => {
            if (userId === user?._id) {
                queryClient.invalidateQueries(WORKSPACES_KEYS.list());
                queryClient.invalidateQueries(WORKSPACE_KEYS.detail(wsId));

                if (wsId === workspaceId) {
                    addToast({ title: "Bạn đã bị xóa khỏi workspace", type: "warning" });
                }
            } else {
                queryClient.invalidateQueries(WORKSPACE_KEYS.detail(wsId));
                queryClient.invalidateQueries(WORKSPACE_ACTIVITIES_KEYS.list(wsId));
            }
        }

        const handleMembersUpdate = () => {
            // Invalidate workspace detail (chứa members bên trong)
            queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspaceId));
            // Activities often involve member actions
            queryClient.invalidateQueries(WORKSPACE_ACTIVITIES_KEYS.list(workspaceId));
        };

        const handleJoinRequestsUpdate = () => {
            addToast({
                title: "Có yêu cầu tham gia không gian làm việc",
                type: "info"
            });

            queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspaceId));
            queryClient.invalidateQueries(WORKSPACE_MEMBERS_KEYS.joinRequests(workspaceId));
            queryClient.invalidateQueries(WORKSPACE_ACTIVITIES_KEYS.list(workspaceId));
        };

        const handleBoardsUpdate = () => {
            // Only invalidate boards list
            queryClient.invalidateQueries(BOARD_KEYS.list(workspaceId));
            queryClient.invalidateQueries(WORKSPACE_ACTIVITIES_KEYS.list(workspaceId));
            queryClient.invalidateQueries(WORKSPACES_KEYS.list());
        };

        // Listen to workspace-related events

        // General Workspace
        on(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceInfoUpdate);
        on(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDelete);

        // Members
        on(SOCKET_EVENTS.MEMBER_JOINED, handleMembersUpdate);
        on(SOCKET_EVENTS.MEMBER_REMOVED, handleRemoveMember);
        on(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMembersUpdate);

        // Join Requests
        on(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestsUpdate);

        // Boards
        on(SOCKET_EVENTS.BOARDS_ADDED, handleBoardsUpdate);
        on(SOCKET_EVENTS.BOARDS_REMOVED, handleBoardsUpdate);
        on(SOCKET_EVENTS.BOARD_CREATED, handleBoardsUpdate);
        on(SOCKET_EVENTS.BOARD_DELETED, handleBoardsUpdate);
        on(SOCKET_EVENTS.BOARD_UPDATED, handleBoardsUpdate);
        on(SOCKET_EVENTS.BOARD_UPDATED_IN_WORKSPACE, handleBoardsUpdate);

        return () => {
            // Cleanup
            off(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceInfoUpdate);
            off(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDelete);

            off(SOCKET_EVENTS.MEMBER_JOINED, handleMembersUpdate);
            off(SOCKET_EVENTS.MEMBER_REMOVED, handleRemoveMember);
            off(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMembersUpdate);

            off(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestsUpdate);

            off(SOCKET_EVENTS.BOARDS_ADDED, handleBoardsUpdate);
            off(SOCKET_EVENTS.BOARDS_REMOVED, handleBoardsUpdate);
            off(SOCKET_EVENTS.BOARD_CREATED, handleBoardsUpdate);
            off(SOCKET_EVENTS.BOARD_DELETED, handleBoardsUpdate);
            off(SOCKET_EVENTS.BOARD_UPDATED, handleBoardsUpdate);
            off(SOCKET_EVENTS.BOARD_UPDATED_IN_WORKSPACE, handleBoardsUpdate);

            leaveRoom(ROOM_TYPES.WORKSPACE, workspaceId);
        };
    }, [workspaceId, isConnected, joinRoom, leaveRoom, on, off, queryClient]);
}
