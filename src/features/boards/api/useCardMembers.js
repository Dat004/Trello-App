import { cardApi } from "@/api/card";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardContext } from "../context/BoardStateContext";
import { BOARD_KEYS } from "./useBoardDetail";
import { CARD_KEYS } from "./useCards";

// Get members in card
export function useGetCardMembers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, listId, cardId }) =>
            cardApi.getMembersInCard(boardId, listId, cardId),
    });
}

// Assign member to card
export function useAssignCardMember() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { assignCardMember } = useBoardContext();

    return useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) =>
            cardApi.assignMemberToCard(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.cardId));

            // Snapshot previous values
            const previousBoard = queryClient.getQueryData(
                BOARD_KEYS.detail(variables.boardId)
            );
            const previousCard = queryClient.getQueryData(
                CARD_KEYS.detail(variables.cardId)
            );

            return { previousBoard, previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with assigned member (Hybrid Approach)
                const updatedCard = res.data.data;

                // Get the newly assigned member from response
                const assignedMember = updatedCard.members?.find(
                    m => m._id === variables.data.userId
                );

                if (assignedMember) {
                    assignCardMember(variables.cardId, assignedMember);
                }

                // Update card detail query if it exists
                const currentCard = queryClient.getQueryData(
                    CARD_KEYS.detail(variables.cardId)
                );
                if (currentCard) {
                    queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), {
                        ...currentCard,
                        members: updatedCard.members,
                    });
                }

                addToast({ type: "success", title: "Đã thêm thành viên vào thẻ" });
            } else {
                addToast({
                    type: "error",
                    title: res.data?.message || "Lỗi thêm thành viên",
                });
            }
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousBoard) {
                queryClient.setQueryData(
                    BOARD_KEYS.detail(variables.boardId),
                    context.previousBoard
                );
            }
            if (context?.previousCard) {
                queryClient.setQueryData(
                    CARD_KEYS.detail(variables.cardId),
                    context.previousCard
                );
            }
            addToast({
                type: "error",
                title: err.response?.data?.message || "Lỗi kết nối server",
            });
        },
    });
}

// Remove member from card
export function useRemoveCardMember() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { removeCardMember } = useBoardContext();

    return useMutation({
        mutationFn: ({ boardId, listId, cardId, userId }) =>
            cardApi.unassignMemberFromCard(boardId, listId, cardId, userId),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.cardId));

            // Snapshot previous values
            const previousBoard = queryClient.getQueryData(
                BOARD_KEYS.detail(variables.boardId)
            );
            const previousCard = queryClient.getQueryData(
                CARD_KEYS.detail(variables.cardId)
            );

            return { previousBoard, previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context by removing member (Hybrid Approach)
                removeCardMember(variables.cardId, variables.userId);

                // Update card detail query if it exists
                const currentCard = queryClient.getQueryData(
                    CARD_KEYS.detail(variables.cardId)
                );
                if (currentCard) {
                    const updatedCard = res.data.data;
                    queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), {
                        ...currentCard,
                        members: updatedCard.members,
                    });
                }

                addToast({ type: "success", title: "Đã xóa thành viên khỏi thẻ" });
            } else {
                addToast({
                    type: "error",
                    title: res.data?.message || "Lỗi xóa thành viên",
                });
            }
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousBoard) {
                queryClient.setQueryData(
                    BOARD_KEYS.detail(variables.boardId),
                    context.previousBoard
                );
            }
            if (context?.previousCard) {
                queryClient.setQueryData(
                    CARD_KEYS.detail(variables.cardId),
                    context.previousCard
                );
            }
            addToast({
                type: "error",
                title: err.response?.data?.message || "Lỗi kết nối server",
            });
        },
    });
}
