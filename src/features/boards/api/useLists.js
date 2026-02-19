import { listApi } from "@/api/list";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardContext } from "../context/BoardStateContext";
import { BOARD_KEYS } from "./useBoards";

export function useCreateList() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { addList } = useBoardContext();

    return useMutation({
        mutationFn: ({ boardId, data }) => listApi.create(boardId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with new list
                const newList = res.data.data;
                addList(newList);

                addToast({ type: "success", title: "Tạo danh sách thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi tạo danh sách" });
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
}

export function useUpdateList() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { updateList } = useBoardContext();

    return useMutation({
        mutationFn: ({ boardId, listId, data }) => listApi.update(boardId, listId, data),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with updated list data
                const updatedList = res.data.data;
                updateList(variables.listId, updatedList);
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật danh sách" });
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
}

export function useDeleteList() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const { removeList } = useBoardContext();

    return useMutation({
        mutationFn: ({ boardId, listId }) => listApi.delete(boardId, listId),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context by removing list
                removeList(variables.listId);

                addToast({ type: "success", title: "Đã xóa danh sách" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa danh sách" });
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
}
