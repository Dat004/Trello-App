import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { UserToast } from "@/context/ToastContext";
import { CARD_KEYS } from "@/features/boards/api/useCardData";
import { useSocket } from "@/hooks";
import { useAuthStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export const useCardRealtime = (cardId) => {
    const { socket, joinRoom, leaveRoom, isConnected } = useSocket();
    const { addToast } = UserToast();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    // Local state for presence/typing/locks
    const [activeUsers, setActiveUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]); // Array of user objects
    const [fieldLocks, setFieldLocks] = useState({}); // { title: userObj, description: userObj }
    const prevActiveUsersRef = useRef([]);

    useEffect(() => {
        if (!cardId || !isConnected || !socket) return;

        console.log(`[CardRealtime] Joining room for card: ${cardId}`);
        joinRoom(ROOM_TYPES.CARD, cardId);

        // --- Event Handlers ---

        const handleCommentAdded = (newComment) => {
            queryClient.invalidateQueries(CARD_KEYS.comments(cardId));
            if (newComment.parent_comment) {
                queryClient.invalidateQueries(CARD_KEYS.replies(newComment.parent_comment));
            }
        };

        const handleCommentDeleted = (data) => {
            queryClient.invalidateQueries(CARD_KEYS.comments(cardId));
            if (data.parentId) {
                queryClient.invalidateQueries(CARD_KEYS.replies(data.parentId));
            }
        };

        const handlePresenceUpdate = ({ members }) => {
            const prevIds = prevActiveUsersRef.current.map(u => u._id);
            const newcomers = members.filter(u => !prevIds.includes(u._id) && u._id !== user?._id);

            newcomers.forEach(u => {
                addToast({
                    title: "Người cùng xem thẻ",
                    description: `${u.full_name} vừa vào xem thẻ này`,
                    type: "info",
                    duration: 2000
                });
            });

            prevActiveUsersRef.current = members;
            setActiveUsers(members);
        };

        const handleTypingUpdate = ({ user, isTyping }) => {
            setTypingUsers(prev => {
                if (isTyping) {
                    // Lọc người dùng đã tồn tại để tránh trùng lặp, sau đó thêm người dùng mới
                    return [...prev.filter(u => u._id !== user._id), user];
                } else {
                    return prev.filter(u => u._id !== user._id);
                }
            });
        };

        const handleFieldLocked = ({ field, user }) => {
            setFieldLocks(prev => ({ ...prev, [field]: user }));
        };

        const handleFieldUnlocked = ({ field }) => {
            setFieldLocks(prev => {
                const newState = { ...prev };
                delete newState[field];
                return newState;
            });
        };

        const handleLocksInit = ({ locks }) => {
            const lockMap = {};
            locks.forEach(l => {
                lockMap[l.field] = l.user;
            });
            setFieldLocks(lockMap);
        };

        // --- Listeners ---
        socket.on(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
        socket.on(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);
        socket.on(SOCKET_EVENTS.CARD_PRESENCE_UPDATE, handlePresenceUpdate);
        socket.on(SOCKET_EVENTS.CARD_TYPING_UPDATE, handleTypingUpdate);
        socket.on(SOCKET_EVENTS.CARD_FIELD_LOCKED, handleFieldLocked);
        socket.on(SOCKET_EVENTS.CARD_FIELD_UNLOCKED, handleFieldUnlocked);
        socket.on(SOCKET_EVENTS.CARD_LOCKS_INIT, handleLocksInit);

        // Cleanup
        return () => {
            console.log(`[CardRealtime] Leaving room for card: ${cardId}`);
            socket.off(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
            socket.off(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);
            socket.off(SOCKET_EVENTS.CARD_PRESENCE_UPDATE, handlePresenceUpdate);
            socket.off(SOCKET_EVENTS.CARD_TYPING_UPDATE, handleTypingUpdate);
            socket.off(SOCKET_EVENTS.CARD_FIELD_LOCKED, handleFieldLocked);
            socket.off(SOCKET_EVENTS.CARD_FIELD_UNLOCKED, handleFieldUnlocked);
            socket.off(SOCKET_EVENTS.CARD_LOCKS_INIT, handleLocksInit);
            leaveRoom(ROOM_TYPES.CARD, cardId);
        };
    }, [cardId, isConnected, socket, joinRoom, leaveRoom, queryClient, addToast, user?._id]);

    return {
        activeUsers,
        typingUsers,
        fieldLocks
    };
};
