import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { boardListPath } from "@/config/paths";
import { UserToast } from "@/context/ToastContext";
import { BOARD_ACTIVITIES_KEYS } from "@/features/boards/api/useBoardActivities";
import { CARD_KEYS } from "@/query/queryKeys";
import { useSocket } from "@/hooks";
import { useAuthStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const toId = (value) => (value == null ? "" : String(value));
const PRESENCE_TOAST_COOLDOWN_MS = 8000;

export const useBoardRealtime = (boardId, actions) => {
    const { socket, joinRoom, leaveRoom, isConnected } = useSocket();
    const { addToast } = UserToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const actionsRef = useRef(actions);
    const addToastRef = useRef(addToast);
    const prevActiveUsersRef = useRef([]);
    const hasPresenceBaselineRef = useRef(false);
    const recentPresenceToastsRef = useRef(new Map());

    useEffect(() => {
        actionsRef.current = actions;
    });
    useEffect(() => {
        addToastRef.current = addToast;
    });

    // Room membership only — do not tie this to toast/query identities or
    // leave/join flaps will spam "Người tham gia bảng" for everyone else.
    useEffect(() => {
        if (!boardId || !isConnected || !socket) return;

        hasPresenceBaselineRef.current = false;
        prevActiveUsersRef.current = [];
        joinRoom(ROOM_TYPES.BOARD, boardId);

        return () => {
            leaveRoom(ROOM_TYPES.BOARD, boardId);
            hasPresenceBaselineRef.current = false;
            prevActiveUsersRef.current = [];
        };
    }, [boardId, isConnected, socket, joinRoom, leaveRoom]);

    // Event listeners — safe to rebind without leaving the board room.
    useEffect(() => {
        if (!boardId || !isConnected || !socket) return;

        const safeCall = (actionName, ...args) => {
            const fn = actionsRef.current?.[actionName];
            if (typeof fn === "function") {
                fn(...args);
            }
        };

        const toast = (payload) => addToastRef.current?.(payload);

        const handleActivityCreated = () => {
            queryClient.invalidateQueries({ queryKey: BOARD_ACTIVITIES_KEYS.list(boardId) });
        };

        const handleBoardDeleted = (deletedBoardId) => {
            if (toId(deletedBoardId) === toId(boardId)) {
                toast({ title: "Bảng này đã bị xóa", type: "warning" });
                navigate(boardListPath);
            }
        };

        const handleBoardUpdated = (updatedBoard) => {
            if (toId(updatedBoard._id) === toId(boardId)) {
                safeCall("updateBoard", updatedBoard);
            }
        };

        const handleListCreated = (data) => safeCall("addList", data.list);
        const handleListUpdated = (data) => safeCall("updateList", data.listId, data.list);
        const handleListDeleted = (data) => safeCall("removeList", data.listId);
        const handleListMoved = (data) => safeCall("updateListPosition", data.listId, data.pos);

        const handleCardCreated = (data) => safeCall("addCard", data.card);
        const handleCardUpdated = (data) => safeCall("updateCard", data.cardId, data.updates);
        const handleCardDeleted = (data) => safeCall("removeCard", data.cardId);
        const handleCardMoved = (data) => {
            const cardId = toId(data.cardId);
            const targetListId = toId(data.targetListId || data.listId);
            safeCall("updateCardPosition", cardId, targetListId, data.pos);
        };

        const handleChecklistItemAdded = (data) => safeCall("addChecklistItem", data.cardId, data.checklist);
        const handleChecklistItemToggled = (data) => safeCall("toggleChecklistItem", data.cardId, data.checklist);
        const handleChecklistItemDeleted = (data) => safeCall("deleteChecklistItem", data.cardId, data.checklistId);

        const handleCardMemberAssigned = (data) => safeCall("assignCardMember", data.cardId, data.member);
        const handleCardMemberRemoved = (data) => safeCall("removeCardMember", data.cardId, data.userId);

        const handleBoardLabelCreated = (data) => safeCall("addBoardLabel", data.label);
        const handleBoardLabelUpdated = (data) =>
            safeCall("updateBoardLabel", data.label._id, data.label, {
                oldName: data.oldName,
                oldColor: data.oldColor,
            });
        const handleBoardLabelDeleted = (data) =>
            safeCall("removeBoardLabel", data.labelId, data.labelName);
        const handleCardLabelAssigned = (data) =>
            safeCall("assignCardLabel", data.cardId, data.label);
        const handleCardLabelRemoved = (data) =>
            safeCall("removeCardLabel", data.cardId, data.labelId);

        const handleAttachmentCreated = (data) => {
            const cardId = toId(data.cardId);
            if (!cardId || !data.attachment) return;
            safeCall("addAttachment", cardId, data.attachment);
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.attachments(cardId) });
        };
        const handleAttachmentDeleted = (data) => {
            const cardId = toId(data.cardId);
            const attachmentId = toId(data.attachmentId);
            if (!cardId || !attachmentId) return;
            safeCall("deleteAttachment", cardId, attachmentId);
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.attachments(cardId) });
        };

        const handleMemberJoined = (member) => {
            safeCall("addBoardMember", member);
            toast({
                title: `Thành viên mới: ${member.user.full_name}`,
                type: "info",
            });
        };
        const handleMemberRemoved = (memberId) => {
            safeCall("removeBoardMember", memberId);
        };
        const handleMemberRoleUpdated = ({ memberId, role }) => {
            safeCall("updateBoardMember", memberId, { role });
        };

        const handleJoinRequestReceived = (request) => {
            safeCall("addJoinRequest", request);
            toast({
                title: "Có yêu cầu tham gia bảng mới",
                type: "info",
            });
        };

        const shouldToastPresence = (userId) => {
            const now = Date.now();
            const recent = recentPresenceToastsRef.current;
            for (const [id, ts] of recent) {
                if (now - ts > PRESENCE_TOAST_COOLDOWN_MS) recent.delete(id);
            }
            if (recent.has(userId)) return false;
            recent.set(userId, now);
            return true;
        };

        const handlePresenceUpdate = ({ members = [] } = {}) => {
            const normalized = members.map((member) => ({
                ...member,
                _id: toId(member._id),
            }));

            if (!hasPresenceBaselineRef.current) {
                hasPresenceBaselineRef.current = true;
                prevActiveUsersRef.current = normalized;
                safeCall("setActiveUsers", normalized);
                return;
            }

            const prevIds = new Set(prevActiveUsersRef.current.map((u) => toId(u._id)));
            const selfId = toId(user?._id);
            const newcomers = normalized.filter(
                (u) => !prevIds.has(toId(u._id)) && toId(u._id) !== selfId,
            );

            newcomers.forEach((u) => {
                const id = toId(u._id);
                if (!shouldToastPresence(id)) return;
                toast({
                    title: "Người tham gia bảng",
                    description: `${u.full_name} vừa vào xem bảng này`,
                    type: "info",
                    duration: 3000,
                });
            });

            prevActiveUsersRef.current = normalized;
            safeCall("setActiveUsers", normalized);
        };

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
        socket.on(SOCKET_EVENTS.BOARD_LABEL_CREATED, handleBoardLabelCreated);
        socket.on(SOCKET_EVENTS.BOARD_LABEL_UPDATED, handleBoardLabelUpdated);
        socket.on(SOCKET_EVENTS.BOARD_LABEL_DELETED, handleBoardLabelDeleted);
        socket.on(SOCKET_EVENTS.CARD_LABEL_ASSIGNED, handleCardLabelAssigned);
        socket.on(SOCKET_EVENTS.CARD_LABEL_REMOVED, handleCardLabelRemoved);
        socket.on(SOCKET_EVENTS.ATTACHMENT_CREATED, handleAttachmentCreated);
        socket.on(SOCKET_EVENTS.ATTACHMENT_DELETED, handleAttachmentDeleted);
        socket.on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
        socket.on(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
        socket.on(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
        socket.on(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);
        socket.on(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
        socket.on(SOCKET_EVENTS.BOARD_UPDATED, handleBoardUpdated);
        socket.on(SOCKET_EVENTS.BOARD_PRESENCE_UPDATE, handlePresenceUpdate);

        return () => {
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
            socket.off(SOCKET_EVENTS.BOARD_LABEL_CREATED, handleBoardLabelCreated);
            socket.off(SOCKET_EVENTS.BOARD_LABEL_UPDATED, handleBoardLabelUpdated);
            socket.off(SOCKET_EVENTS.BOARD_LABEL_DELETED, handleBoardLabelDeleted);
            socket.off(SOCKET_EVENTS.CARD_LABEL_ASSIGNED, handleCardLabelAssigned);
            socket.off(SOCKET_EVENTS.CARD_LABEL_REMOVED, handleCardLabelRemoved);
            socket.off(SOCKET_EVENTS.ATTACHMENT_CREATED, handleAttachmentCreated);
            socket.off(SOCKET_EVENTS.ATTACHMENT_DELETED, handleAttachmentDeleted);
            socket.off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
            socket.off(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
            socket.off(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
            socket.off(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);
            socket.off(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
            socket.off(SOCKET_EVENTS.BOARD_UPDATED, handleBoardUpdated);
            socket.off(SOCKET_EVENTS.BOARD_PRESENCE_UPDATE, handlePresenceUpdate);
        };
    }, [boardId, isConnected, socket, navigate, queryClient, user?._id]);
};
