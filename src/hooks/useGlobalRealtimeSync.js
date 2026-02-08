import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { UserToast } from "@/context/ToastContext";
import { useAuthStore, useBoardDetailStore, useBoardStore, useWorkspaceStore } from "@/store";
import { refetchAll } from "@/utils/refetchHelpers";
import { useNetworkStatus } from "./useNetworkStatus";
import useSocket from "./useSocket";

export function useGlobalRealtimeSync() {
    const navigate = useNavigate();
    const wasDisconnectedRef = useRef(false);
    const lastRefetchTimeRef = useRef(0);

    const { socket, isConnected, joinRoom, leaveRoom, on, off } = useSocket();
    const { addToast } = UserToast();

    // Network
    const { isOnline } = useNetworkStatus();

    // Auth
    const user = useAuthStore((state) => state.user);

    // Workspace store
    const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
    const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);
    const clearCurrentWorkspace = useWorkspaceStore((state) => state.clearCurrentWorkspace);

    const workspaces = useWorkspaceStore((state) => state.workspaces);
    const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
    const removeWorkspace = useWorkspaceStore((state) => state.removeWorkspace);

    const addJoinRequest = useWorkspaceStore((state) => state.addJoinRequest);
    const workspaceMembers = useWorkspaceStore(
        (state) => state.membersMap[currentWorkspace?._id],
        (a, b) => a === b
    ) || [];
    const addMemberToStore = useWorkspaceStore((state) => state.addMemberToStore);
    const removeMemberFromStore = useWorkspaceStore((state) => state.removeMemberFromStore);
    const updateMemberInStore = useWorkspaceStore((state) => state.updateMemberInStore);

    // Board store
    const boards = useBoardStore((state) => state.boards);
    const addBoard = useBoardStore((state) => state.addBoard);
    const updateBoard = useBoardStore((state) => state.updateBoard);
    const removeBoard = useBoardStore((state) => state.removeBoard);
    const mergeBoardsFromWorkspace = useBoardStore((state) => state.mergeBoardsFromWorkspace);
    const removeBoardsFromWorkspace = useBoardStore((state) => state.removeBoardsFromWorkspace);

    // Board detail store
    const currentBoard = useBoardDetailStore((state) => state.currentBoard);
    const updateCurrentBoard = useBoardDetailStore((state) => state.updateCurrentBoard);
    const reset = useBoardDetailStore((state) => state.reset);

    useEffect(() => {
        if (!socket) return;
        const REFETCH_COOLDOWN = 5000; // 5 giây

        const handleConnect = async () => {
            console.log("[Global] Socket connected");

            // Nếu đây là reconnect (đã bị disconnect trước đó)
            if (wasDisconnectedRef.current) {
                console.log("[Global] Reconnected after disconnect");

                // Kiểm tra cooldown
                const now = Date.now();
                if (now - lastRefetchTimeRef.current < REFETCH_COOLDOWN) {
                    console.log('[Global] Refetch skipped - cooldown active (',
                        Math.ceil((REFETCH_COOLDOWN - (now - lastRefetchTimeRef.current)) / 1000),
                        's remaining)');

                    addToast({
                        type: 'success',
                        title: 'Đã kết nối lại',
                        duration: 2000,
                    });

                    wasDisconnectedRef.current = false;
                    return;
                }

                // Update last refetch time
                lastRefetchTimeRef.current = now;

                // Refetch dữ liệu ngầm ở background
                const success = await refetchAll({
                    currentWorkspaceId: currentWorkspace?._id,
                    currentBoardId: currentBoard?._id,
                });

                console.log("success", success)

                if (success) {
                    addToast({
                        type: 'success',
                        title: 'Đã kết nối lại và đồng bộ dữ liệu',
                        duration: 2000,
                    });
                } else {
                    addToast({
                        type: 'warning',
                        title: 'Đã kết nối lại nhưng không thể đồng bộ một số dữ liệu',
                        duration: 3000,
                    });
                }

                wasDisconnectedRef.current = false;
            }
        };

        const handleDisconnect = (reason) => {
            console.warn("[Global] Socket disconnected:", reason);
            wasDisconnectedRef.current = true;
            console.log("[Global] wasDisconnected set to:", wasDisconnectedRef.current);

            // Chỉ hiển thị toast cho các lần mất kết nối không mong muốn
            if (reason !== 'io client disconnect') {
                addToast({
                    type: 'warning',
                    title: 'Mất kết nối real-time',
                    duration: 3000,
                });
            }
        };

        const handleError = (error) => {
            console.error("[Global] Socket error:", error);

            addToast({
                type: 'error',
                title: 'Lỗi kết nối real-time',
                duration: 3000,
            });
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('error', handleError);

        // Cleanup
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('error', handleError);
        };
    }, [socket, addToast, currentWorkspace, currentBoard]);

    useEffect(() => {
        if (!user || !isConnected) return;

        console.log("[Global Realtime] Initializing for user:", user._id);

        // Join user's personal room for personal events
        joinRoom(ROOM_TYPES.USER, user._id);

        // Join all workspace rooms
        if (workspaces && workspaces.length > 0) {
            console.log(`[Global Realtime] Joining ${workspaces.length} workspace rooms...`);
            workspaces.forEach(workspace => {
                joinRoom(ROOM_TYPES.WORKSPACE, workspace._id);
            });
        }

        // ==================== WORKSPACE EVENTS ====================

        const handleWorkspaceUpdated = (workspace) => {
            console.log("[Global] Workspace updated:", workspace);
            updateWorkspace(workspace);

            // Update currentWorkspace if viewing this workspace
            if (currentWorkspace?._id === workspace._id) {
                clearCurrentWorkspace();
                setCurrentWorkspace(workspace);
            }
        };

        const handleWorkspacePermissionsUpdated = ({ workspaceId, permissions }) => {
            console.log("[Global] Workspace permissions updated:", { workspaceId, permissions });

            const updatedWorkspace = { _id: workspaceId, ...permissions };
            updateWorkspace(updatedWorkspace);

            // Update currentWorkspace if viewing this workspace
            if (currentWorkspace?._id === workspaceId) {
                clearCurrentWorkspace();
                setCurrentWorkspace({ ...currentWorkspace, ...permissions });
            }
        };

        const handleWorkspaceDeleted = (workspaceId) => {
            console.log("[Global] Workspace deleted:", workspaceId);
            removeWorkspace(workspaceId);
            removeBoardsFromWorkspace(workspaceId);

            if (currentWorkspace?._id === workspaceId) {
                clearCurrentWorkspace();
                addToast({
                    type: "warning",
                    title: "Không gian làm việc này đã bị xóa"
                });
            }
        };

        const handleMemberRemoved = ({ workspaceId, member_id, userId }) => {
            console.log("[Global] Member removed:", { workspaceId, member_id, userId });

            if (member_id) {
                const targetMember = workspaceMembers.find((m) => m.user._id === member_id);
                if (targetMember) removeMemberFromStore(workspaceId, targetMember._id);
            }
            if (userId.toString() === user._id.toString()) {
                removeWorkspace(workspaceId);
                removeBoardsFromWorkspace(workspaceId);

                if (currentWorkspace?._id === workspaceId) {
                    addToast({
                        type: "warning",
                        title: "Bạn đã bị xóa khỏi không gian làm việc"
                    });
                    navigate('/workspaces');
                    clearCurrentWorkspace();
                }
            }
        };

        const handleJoinRequestReceived = ({ workspaceId, joinRequest }) => {
            console.log("[Global] Join request received:", { workspaceId, joinRequest });
            addJoinRequest(workspaceId, joinRequest);

            addToast({
                type: "info",
                title: `${joinRequest.user.full_name} đã yêu cầu tham gia workspace`
            });
        };

        const handleMemberJoined = ({ workspaceId, member }) => {
            console.log("[Global] Member joined:", { workspaceId, member });
            addMemberToStore(workspaceId, member);
        };

        const handleMemberRoleUpdated = ({ workspaceId, memberId, role }) => {
            console.log("[Global] Member role updated:", { workspaceId, memberId, role });
            updateMemberInStore(workspaceId, memberId, { role });
        };

        // ==================== BOARD EVENTS ====================
        const handleBoardCreated = (board) => {
            console.log("[Global] Board created:", board);
            addBoard(board);

            if (board.workspace) {
                const workspace = workspaces.find((w) => w._id === board.workspace);
                updateWorkspace({
                    _id: board.workspace,
                    board_count: (workspace?.board_count || 0) + 1
                });
            }
        };

        const handleBoardUpdated = (board) => {
            console.log("[Global] Board updated:", board);
            updateBoard(board);

            if (currentBoard?._id === board._id) {
                updateCurrentBoard(board);
            }
        };

        const handleBoardDeleted = (boardId) => {
            console.log("[Global] Board deleted:", boardId);
            const board = boards.find((b) => b._id === boardId);

            if (board) {
                if (board.workspace) {
                    const workspace = workspaces.find((w) => w._id === board.workspace);
                    updateWorkspace({
                        _id: board.workspace,
                        board_count: Math.max(workspace?.board_count - 1, 0),
                    });
                }

                removeBoard(boardId);

                if (currentBoard?._id.toString() === boardId.toString()) {
                    addToast({
                        type: "warning",
                        title: "Bảng này đã bị xóa"
                    });
                    navigate(currentBoard.workspace ? `/workspaces/${currentBoard.workspace}` : '/boards');
                    reset();
                }
            }
        };

        const handleBoardsAdded = ({ workspaceId, boards }) => {
            console.log("[Socket] Boards added:", boards);
            mergeBoardsFromWorkspace(boards);
            updateWorkspace({
                _id: workspaceId,
                board_count: currentWorkspace.board_count + boards.length
            })
        };

        const handleBoardsRemoved = ({ workspaceId, boardIds }) => {
            console.log("[Socket] Boards removed:", boardIds);

            const workspace = workspaces.find((w) => w._id === workspaceId);
            if (workspace) {
                updateWorkspace({
                    _id: workspaceId,
                    board_count: Math.max(workspace?.board_count - boardIds.length, 0),
                })
            }

            boardIds.forEach(boardId => {
                removeBoard(boardId);
            })
        };

        const handleBoardMemberRemoved = ({ boardId, userId }) => {
            console.log("[Global] Board member removed:", { boardId, userId });

            // If current user was removed, remove board from list
            if (userId === user._id) {
                removeBoard(boardId);

                if (currentBoard?._id === boardId) {
                    reset();

                    addToast({
                        type: "warning",
                        title: "Bạn đã bị xóa khỏi bảng"
                    });
                    navigate(currentBoard.workspace ? `/workspaces/${currentBoard.workspace}` : '/boards');
                }
            }
        };

        // ==================== WORKSPACE EVENTS ====================
        on(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
        on(SOCKET_EVENTS.WORKSPACE_PERMISSIONS_UPDATED, handleWorkspacePermissionsUpdated);
        on(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
        on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
        on(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
        on(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
        on(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);

        on(SOCKET_EVENTS.BOARD_CREATED, handleBoardCreated);
        on(SOCKET_EVENTS.BOARDS_ADDED, handleBoardsAdded);
        on(SOCKET_EVENTS.BOARDS_REMOVED, handleBoardsRemoved);
        on(SOCKET_EVENTS.BOARD_UPDATED, handleBoardUpdated);
        on(SOCKET_EVENTS.BOARD_UPDATED_IN_WORKSPACE, handleBoardUpdated);
        on(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
        on(SOCKET_EVENTS.BOARD_MEMBER_REMOVED, handleBoardMemberRemoved);

        // ==================== CLEANUP ====================
        return () => {
            // Workspace events

            off(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
            off(SOCKET_EVENTS.WORKSPACE_PERMISSIONS_UPDATED, handleWorkspacePermissionsUpdated);
            off(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
            off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
            off(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
            off(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
            off(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);

            off(SOCKET_EVENTS.BOARD_CREATED, handleBoardCreated);
            off(SOCKET_EVENTS.BOARDS_ADDED, handleBoardsAdded);
            off(SOCKET_EVENTS.BOARDS_REMOVED, handleBoardsRemoved);
            off(SOCKET_EVENTS.BOARD_UPDATED, handleBoardUpdated);
            off(SOCKET_EVENTS.BOARD_UPDATED_IN_WORKSPACE, handleBoardUpdated);
            off(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
            off(SOCKET_EVENTS.BOARD_MEMBER_REMOVED, handleBoardMemberRemoved);

            // Leave user room
            leaveRoom(ROOM_TYPES.USER, user._id);

            // Leave all workspace rooms
            if (workspaces && workspaces.length > 0) {
                console.log(`[Global Realtime] Leaving ${workspaces.length} workspace rooms...`);
                workspaces.forEach(workspace => {
                    leaveRoom(ROOM_TYPES.WORKSPACE, workspace._id);
                })
            }
        };
    }, [user, isConnected, workspaces, joinRoom, leaveRoom, on, off]);

    // ==================== NETWORK STATUS HANDLING ====================
    useEffect(() => {
        if (!isOnline) {
            console.log('[Global] Network offline detected');
            addToast({
                type: 'error',
                title: 'Không có kết nối mạng',
                duration: 0, // Không tự đóng khi offline
            });
        } else {
            console.log('[Global] Network online');

            // Reconnect socket nếu bị disconnect
            if (socket && !socket.connected) {
                console.log('[Global] Reconnecting socket after network online...');
                socket.connect();
            }
        }
    }, [isOnline, socket]);

    return null;
}
