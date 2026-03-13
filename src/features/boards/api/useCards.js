import { cardApi } from "@/api/card";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardContext } from "../context/BoardStateContext";
import { BOARD_KEYS } from "./useBoards";

export const CARD_KEYS = {
    detail: (cardId) => ['card', cardId],
    comments: (cardId) => ['card', cardId, 'comments'],
    replies: (commentId) => ['comment', commentId, 'replies']
};

export function useCreateCard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { addCard } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, ...data }) => cardApi.create(boardId, listId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value for rollback
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Optimistically update context with server data
                const newCard = res.data.data.card;
                addCard(newCard);

                addToast({ type: "success", title: "Tạo thẻ thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi tạo thẻ" });
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
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateCard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateCard } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id, data }) => cardApi.update(boardId, listId, id, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.id));

            // Snapshot previous values
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));
            const previousCard = queryClient.getQueryData(CARD_KEYS.detail(variables.id));

            return { previousBoard, previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with server data
                const updatedCard = res.data.data.card;
                updateCard(variables.id, updatedCard);

                // Update card detail query if it exists
                queryClient.setQueryData(CARD_KEYS.detail(variables.id), updatedCard);
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật thẻ" });
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
                    CARD_KEYS.detail(variables.id),
                    context.previousCard
                );
            }
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateCardComplete() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateCard } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id, data }) => cardApi.updateComplete(boardId, listId, id, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.id));

            // Snapshot previous values
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));
            const previousCard = queryClient.getQueryData(CARD_KEYS.detail(variables.id));

            return { previousBoard, previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // Update context with server data
                const updatedCard = res.data.data.card;
                updateCard(variables.id, updatedCard);
                queryClient.setQueryData(CARD_KEYS.detail(variables.id), updatedCard);
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật trạng thái thẻ" });
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
                    CARD_KEYS.detail(variables.id),
                    context.previousCard
                );
            }
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries(CARD_KEYS.detail(variables.id));
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteCard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { removeCard } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id }) => cardApi.delete(boardId, listId, id),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context by removing card
                removeCard(variables.id);

                addToast({ type: "success", title: "Đã xóa thẻ" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa thẻ" });
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
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

// Checklist Hooks

export function useAddChecklistItem() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { addChecklistItem } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) => cardApi.addChecklist(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.cardId));

            // Snapshot previous values
            const previousCard = queryClient.getQueryData(CARD_KEYS.detail(variables.cardId));

            return { previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with new checklist item
                const newItem = res.data.data.checklist;
                addChecklistItem(variables.cardId, newItem);

                // Update card detail query if it exists
                const currentCard = queryClient.getQueryData(CARD_KEYS.detail(variables.cardId));
                if (currentCard) {
                    queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), {
                        ...currentCard,
                        checklist: [...(currentCard.checklist || []), newItem]
                    });
                }

                addToast({ type: "success", title: "Thêm checklist thành công" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi thêm checklist" });
            }
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousCard) {
                queryClient.setQueryData(
                    CARD_KEYS.detail(variables.cardId),
                    context.previousCard
                );
            }
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useToggleChecklistItem() {
    const queryClient = useQueryClient();
    const { toggleChecklistItem } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) => cardApi.toggleChecklistItem(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.cardId));

            // Snapshot previous values
            const previousCard = queryClient.getQueryData(CARD_KEYS.detail(variables.cardId));

            return { previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with toggled item
                const updatedItem = res.data.data.checklist;
                toggleChecklistItem(variables.cardId, updatedItem);

                // Update card detail query if it exists
                const currentCard = queryClient.getQueryData(CARD_KEYS.detail(variables.cardId));
                if (currentCard) {
                    queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), {
                        ...currentCard,
                        checklist: currentCard.checklist.map(item =>
                            item._id === updatedItem._id ? updatedItem : item
                        )
                    });
                }

                addToast({ type: "success", title: "Cập nhật checklist thành công" });
            }
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousCard) {
                queryClient.setQueryData(
                    CARD_KEYS.detail(variables.cardId),
                    context.previousCard
                );
            }
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteChecklistItem() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { deleteChecklistItem } = useBoardContext();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) => cardApi.deleteChecklist(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(CARD_KEYS.detail(variables.cardId));

            // Snapshot previous values
            const previousCard = queryClient.getQueryData(CARD_KEYS.detail(variables.cardId));

            return { previousCard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context by removing checklist item
                deleteChecklistItem(variables.cardId, variables.data.checklistId);

                // Update card detail query if it exists
                const currentCard = queryClient.getQueryData(CARD_KEYS.detail(variables.cardId));
                if (currentCard) {
                    queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), {
                        ...currentCard,
                        checklist: currentCard.checklist.filter(item => item._id !== variables.data.checklistId)
                    });
                }

                addToast({ type: "success", title: "Xóa checklist thành công" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa checklist" });
            }
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousCard) {
                queryClient.setQueryData(
                    CARD_KEYS.detail(variables.cardId),
                    context.previousCard
                );
            }
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}
