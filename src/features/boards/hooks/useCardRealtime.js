import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { CARD_KEYS } from "@/features/boards/api/useCardData";
import { useSocket } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Hook to handle real-time updates for a specific card (comments, attachments, etc.)
 * @param {string} cardId - The ID of the card to subscribe to
 */
export const useCardRealtime = (cardId) => {
    const { joinRoom, leaveRoom, on, off, isConnected } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!cardId || !isConnected) return;

        console.log(`[CardRealtime] Joining room for card: ${cardId}`);
        joinRoom(ROOM_TYPES.CARD, cardId);

        // --- Event Handlers ---

        const handleCommentAdded = (newComment) => {
            console.log("[Socket] Comment added");
            queryClient.invalidateQueries(CARD_KEYS.comments(cardId));
            if (newComment.parent_comment) {
                queryClient.invalidateQueries(CARD_KEYS.replies(newComment.parent_comment));
            }
        };

        const handleCommentDeleted = (data) => {
            console.log("[Socket] Comment deleted");
            queryClient.invalidateQueries(CARD_KEYS.comments(cardId));
            if (data.parentId) {
                queryClient.invalidateQueries(CARD_KEYS.replies(data.parentId));
            }
        };

        // --- Attachments (If implementing realtime attachments here too) ---
        // Assuming we have ATTACHMENT_ADDED events? 
        // If not, we can add them later. For now, focus on existing supported events.

        // --- Listeners ---
        on(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
        on(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);

        // Cleanup
        return () => {
            console.log(`[CardRealtime] Leaving room for card: ${cardId}`);
            off(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
            off(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);
            leaveRoom(ROOM_TYPES.CARD, cardId);
        };
    }, [cardId, isConnected, joinRoom, leaveRoom, on, off, queryClient]);
};
