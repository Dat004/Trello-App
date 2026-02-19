import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { UserToast } from "@/context/ToastContext";
import { BOARD_ACTIVITIES_KEYS } from "@/features/boards/api/useBoardActivities";
import { useSocket } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useBoardRealtime = (boardId, actions) => {
    const { socket, joinRoom, leaveRoom, isConnected } = useSocket();
    const { addToast } = UserToast();
    const queryClient = useQueryClient();

    const actionsRef = useRef(actions);
    useEffect(() => {
        actionsRef.current = actions;
    });

    useEffect(() => {
        if (!boardId || !isConnected || !socket) return;

        console.log(`[BoardRealtime] Joining board room: ${boardId}`);
        joinRoom(ROOM_TYPES.BOARD, boardId);

        const safeCall = (actionName, ...args) => {
            const fn = actionsRef.current?.[actionName];
            if (typeof fn === 'function') {
                console.log(`[BoardRealtime] Calling action: ${actionName}`, args);
                fn(...args);
            } else {
                console.warn(`[BoardRealtime] Action ${actionName} not found implementation`);
            }
        };

        // Handlers
        const handleActivityCreated = (activity) => {
            // Invalidate activities query to fetch new logs
            queryClient.invalidateQueries(BOARD_ACTIVITIES_KEYS.list(boardId));
        };


        const handleBoardDeleted = (deletedBoardId) => {
            if (deletedBoardId === boardId) {
                addToast({ title: "Bảng này đã bị xóa", type: "warning" });
                navigate('/boards');
            }
        };

        const handleBoardUpdated = (updatedBoard) => {
            if (updatedBoard._id === boardId) {
                safeCall('updateBoard', updatedBoard);
            }
        };
        const handleListCreated = (data) => safeCall('addList', data.list);
        const handleListUpdated = (data) => safeCall('updateList', data.listId, data.list);
        const handleListDeleted = (data) => safeCall('removeList', data.listId);
        const handleListMoved = (data) => safeCall('updateListPosition', data.listId, data.pos);

        const handleCardCreated = (data) => safeCall('addCard', data.card);
        const handleCardUpdated = (data) => safeCall('updateCard', data.cardId, data.updates);
        const handleCardDeleted = (data) => safeCall('removeCard', data.cardId);
        const handleCardMoved = (data) => safeCall('updateCardPosition', data.cardId, data.targetListId, data.pos);

        const handleChecklistItemAdded = (data) => safeCall('addChecklistItem', data.cardId, data.checklist);
        const handleChecklistItemToggled = (data) => safeCall('toggleChecklistItem', data.cardId, data.checklist);
        const handleChecklistItemDeleted = (data) => safeCall('deleteChecklistItem', data.cardId, data.checklistId);

        const handleCardMemberAssigned = (data) => safeCall('assignCardMember', data.cardId, data.member);
        const handleCardMemberRemoved = (data) => safeCall('removeCardMember', data.cardId, data.userId);

        const handleMemberJoined = (member) => {
            safeCall('addBoardMember', member);
            addToast({
                title: `Thành viên mới: ${member.user.full_name}`,
                type: "info"
            });
        };
        const handleMemberRemoved = (memberId) => {
            safeCall('removeBoardMember', memberId);
        };
        const handleMemberRoleUpdated = ({ memberId, role }) => {
            safeCall('updateBoardMember', memberId, { role });
        };

        const handleJoinRequestReceived = (request) => {
            safeCall('addJoinRequest', request);
            addToast({
                title: "Có yêu cầu tham gia bảng mới",
                type: "info"
            });
        };

        // Direct Socket Binding
        socket.on(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivityCreated);

        socket.on(SOCKET_EVENTS.LIST_CREATED, handleListCreated);
        socket.on(SOCKET_EVENTS.LIST_UPDATED, handleListUpdated);
        socket.on(SOCKET_EVENTS.LIST_DELETED, handleListDeleted);
        socket.on(SOCKET_EVENTS.LIST_MOVED, handleListMoved);

        socket.on(SOCKET_EVENTS.CARD_CREATED, handleCardCreated);
        socket.on(SOCKET_EVENTS.CARD_UPDATED, handleCardUpdated);
        socket.on(SOCKET_EVENTS.CARD_DELETED, handleCardDeleted);
        socket.on(SOCKET_EVENTS.CARD_MOVED, handleCardMoved);

        socket.on(SOCKET_EVENTS.CHECKLIST_ITEM_ADDED, handleChecklistItemAdded);
        socket.on(SOCKET_EVENTS.CHECKLIST_ITEM_TOGGLED, handleChecklistItemToggled);
        socket.on(SOCKET_EVENTS.CHECKLIST_ITEM_DELETED, handleChecklistItemDeleted);

        socket.on(SOCKET_EVENTS.CARD_MEMBER_ASSIGNED, handleCardMemberAssigned);
        socket.on(SOCKET_EVENTS.CARD_MEMBER_REMOVED, handleCardMemberRemoved);

        socket.on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
        socket.on(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
        socket.on(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
        socket.on(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);

        socket.on(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
        socket.on(SOCKET_EVENTS.BOARD_UPDATED, handleBoardUpdated);

        return () => {
            console.log(`[BoardRealtime] Cleanup: Leaving board room: ${boardId} and removing listeners`);

            socket.off(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivityCreated);

            socket.off(SOCKET_EVENTS.LIST_CREATED, handleListCreated);
            socket.off(SOCKET_EVENTS.LIST_UPDATED, handleListUpdated);
            socket.off(SOCKET_EVENTS.LIST_DELETED, handleListDeleted);
            socket.off(SOCKET_EVENTS.LIST_MOVED, handleListMoved);

            socket.off(SOCKET_EVENTS.CARD_CREATED, handleCardCreated);
            socket.off(SOCKET_EVENTS.CARD_UPDATED, handleCardUpdated);
            socket.off(SOCKET_EVENTS.CARD_DELETED, handleCardDeleted);
            socket.off(SOCKET_EVENTS.CARD_MOVED, handleCardMoved);

            socket.off(SOCKET_EVENTS.CHECKLIST_ITEM_ADDED, handleChecklistItemAdded);
            socket.off(SOCKET_EVENTS.CHECKLIST_ITEM_TOGGLED, handleChecklistItemToggled);
            socket.off(SOCKET_EVENTS.CHECKLIST_ITEM_DELETED, handleChecklistItemDeleted);

            socket.off(SOCKET_EVENTS.CARD_MEMBER_ASSIGNED, handleCardMemberAssigned);
            socket.off(SOCKET_EVENTS.CARD_MEMBER_REMOVED, handleCardMemberRemoved);

            socket.off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
            socket.off(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
            socket.off(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
            socket.off(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);

            socket.off(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
            socket.off(SOCKET_EVENTS.BOARD_UPDATED, handleBoardUpdated);

            leaveRoom(ROOM_TYPES.BOARD, boardId);
        };
    }, [
        boardId, isConnected, socket, // Depend on socket instance
        joinRoom, leaveRoom, addToast, queryClient,
        boardId,
    ]);
};
