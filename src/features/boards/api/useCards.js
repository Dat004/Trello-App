import { cardApi } from "@/api/card";
import { UserToast } from "@/context/ToastContext";
import { CARD_KEYS } from "@/query/queryKeys";
import { cardMutationDataContract } from "@/schemas/apiContracts";
import { getApiErrorMessage, parseApiData } from "@/utils/apiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardActions } from "../context/BoardStateContext";

export { CARD_KEYS };

export function useCreateCard() {
    const { addToast } = UserToast();
    const { addCard } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, ...data }) => cardApi.create(boardId, listId, data),

        onSuccess: (res) => {
            try {
                const { card } = parseApiData(
                    res,
                    cardMutationDataContract,
                    res.data?.message || "Lỗi tạo thẻ",
                );
                addCard(card);
                addToast({ type: "success", title: "Tạo thẻ thành công!" });
            } catch (error) {
                addToast({
                    type: "error",
                    title: getApiErrorMessage(error, "Lỗi tạo thẻ"),
                });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateCard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateCard } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id, data }) => cardApi.update(boardId, listId, id, data),

        onSuccess: (res, variables) => {
            try {
                const { card } = parseApiData(
                    res,
                    cardMutationDataContract,
                    res.data?.message || "Lỗi cập nhật thẻ",
                );
                updateCard(variables.id, card);
                queryClient.setQueryData(CARD_KEYS.detail(variables.id), card);
            } catch (error) {
                addToast({
                    type: "error",
                    title: getApiErrorMessage(error, "Lỗi cập nhật thẻ"),
                });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateCardComplete() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateCard } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id, data }) => cardApi.updateComplete(boardId, listId, id, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: CARD_KEYS.detail(variables.id) });

            // Snapshot the previous value
            const previousCard = queryClient.getQueryData(CARD_KEYS.detail(variables.id));

            // Optimistically update: flip due_complete immediately
            const optimisticComplete = variables.data?.due_complete;
            updateCard(variables.id, { due_complete: optimisticComplete });

            const currentCard = queryClient.getQueryData(CARD_KEYS.detail(variables.id));
            if (currentCard) {
                queryClient.setQueryData(CARD_KEYS.detail(variables.id), {
                    ...currentCard,
                    due_complete: optimisticComplete,
                });
            }

            return { previousCard, optimisticComplete };
        },

        onSuccess: (res, variables, context) => {
            if (res.data?.success) {
                // Reconcile with server data
                const updatedCard = res.data.data.card;
                updateCard(variables.id, updatedCard);
                queryClient.setQueryData(CARD_KEYS.detail(variables.id), updatedCard);

                // Show undo toast
                const isDone = context.optimisticComplete;
                addToast({
                    type: "success",
                    title: isDone ? "Đã đánh dấu hoàn thành" : "Đã bỏ đánh dấu hoàn thành",
                    duration: 6000,
                    action: {
                        label: "Hoàn tác",
                        onClick: async () => {
                            // Reverse the toggle
                            updateCard(variables.id, { due_complete: !isDone });
                            try {
                                await cardApi.updateComplete(variables.boardId, variables.listId, variables.id, {
                                    due_complete: !isDone,
                                });
                            } catch {
                                // If undo API fails, refetch to reconcile.
                            }
                            queryClient.invalidateQueries({ queryKey: CARD_KEYS.detail(variables.id) });
                        },
                    },
                });
            } else {
                // Rollback on API-level failure
                if (context?.previousCard) {
                    updateCard(variables.id, context.previousCard);
                    queryClient.setQueryData(CARD_KEYS.detail(variables.id), context.previousCard);
                }
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật trạng thái thẻ" });
            }
        },

        onError: (err, variables, context) => {
            // Rollback on network error
            if (context?.previousCard) {
                updateCard(variables.id, context.previousCard);
                queryClient.setQueryData(CARD_KEYS.detail(variables.id), context.previousCard);
            }
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.detail(variables.id) });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteCard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { removeCard, addCard } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id }) => cardApi.delete(boardId, listId, id),

        onMutate: async (variables) => {
            // Snapshot the card data before removing it so we can restore on undo.
            // The card data lives in board context, but we can access it via query cache
            // or the variables themselves. We'll rely on the caller passing `cardData`
            // in the variables for the snapshot.
            return {
                deletedCard: variables.cardData || null,
                listId: variables.listId,
            };
        },

        onSuccess: (res, variables, context) => {
            if (res.data?.success) {
                // ✅ Remove card from UI (may already be removed if optimistic)
                removeCard(variables.id);

                // Show undo toast
                const cardTitle = context.deletedCard?.title || "Thẻ";
                addToast({
                    type: "success",
                    title: `Đã xóa "${cardTitle}"`,
                    duration: 6000,
                    action: {
                        label: "Hoàn tác",
                        onClick: async () => {
                            // Re-create the card via API
                            try {
                                const createRes = await cardApi.create(
                                    variables.boardId,
                                    variables.listId,
                                    {
                                        title: context.deletedCard?.title || "Thẻ đã khôi phục",
                                        description: context.deletedCard?.description || "",
                                        priority: context.deletedCard?.priority || "medium",
                                    }
                                );
                                const newCard = createRes?.data?.data?.card;
                                if (newCard) {
                                    addCard(newCard);
                                    addToast({ type: "success", title: `Đã khôi phục "${cardTitle}"`, duration: 3000 });
                                }
                            } catch {
                                addToast({ type: "error", title: "Không thể khôi phục thẻ", duration: 3000 });
                            }
                            // Refetch board to reconcile.
                            queryClient.invalidateQueries({ queryKey: ["boards"] });
                        },
                    },
                });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa thẻ" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

// Checklist Hooks

export function useAddChecklistItem() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { addChecklistItem } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) => cardApi.addChecklist(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: CARD_KEYS.detail(variables.cardId) });

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
    const { addToast } = UserToast();
    const { toggleChecklistItem } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) => cardApi.toggleChecklistItem(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: CARD_KEYS.detail(variables.cardId) });

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
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi cập nhật checklist" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteChecklistItem() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { deleteChecklistItem } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) => cardApi.deleteChecklist(boardId, listId, cardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: CARD_KEYS.detail(variables.cardId) });

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

export function useMoveCard() {
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, id, data }) => cardApi.move(boardId, listId, id, data),

        onSuccess: (res) => {
            if (res.data?.success !== false) {
                addToast({ type: "success", title: "Di chuyển thẻ thành công!" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi di chuyển thẻ") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useRequestReview() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateCard } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) =>
            cardApi.requestReview(boardId, listId, cardId, data),

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                const card = res.data.data.card;
                updateCard(variables.cardId, card);
                queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), card);
                addToast({ type: "success", title: "Đã gửi yêu cầu phê duyệt thẻ!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi gửi yêu cầu phê duyệt" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useMakeReviewDecision() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateCard } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, cardId, data }) =>
            cardApi.makeReviewDecision(boardId, listId, cardId, data),

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                const card = res.data.data.card;
                updateCard(variables.cardId, card);
                queryClient.setQueryData(CARD_KEYS.detail(variables.cardId), card);

                const msg = variables.data.decision === "approved" ? "Đã phê duyệt công việc!" : "Yêu cầu chỉnh sửa đã gửi!";
                addToast({ type: "success", title: msg });

                // If approved, trigger board invalidate because the card might have moved lists automatically
                if (variables.data.decision === "approved") {
                    queryClient.invalidateQueries({ queryKey: ["boards"] });
                }
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi gửi quyết định phê duyệt" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}
