import { listApi } from "@/api/list";
import { UserToast } from "@/context/ToastContext";
import { getApiErrorMessage } from "@/utils/apiError";
import { useMutation } from "@tanstack/react-query";
import { useBoardActions } from "../context/BoardStateContext";

export function useCreateList() {
    const { addToast } = UserToast();
    const { addList } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, data }) => listApi.create(boardId, data),

        onSuccess: (res) => {
            if (res.data?.success) {
                // ✅ Update context with new list
                const newList = res.data.data.list;
                addList(newList);

                addToast({ type: "success", title: "Tạo danh sách thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi tạo danh sách" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateList() {
    const { addToast } = UserToast();
    const { updateList } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId, data }) => listApi.update(boardId, listId, data),

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with updated list data
                const updatedList = res.data.data.list;
                updateList(variables.listId, updatedList);
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật danh sách" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteList() {
    const { addToast } = UserToast();
    const { removeList, addList } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId }) => listApi.delete(boardId, listId),

        onMutate: async (variables) => {
            // Snapshot list data for undo (caller passes `listData` in variables).
            return {
                deletedList: variables.listData || null,
            };
        },

        onSuccess: (res, variables, context) => {
            if (res.data?.success) {
                // ✅ Update context by removing list
                removeList(variables.listId);

                // Show undo toast
                const listTitle = context.deletedList?.title || "Danh sách";
                addToast({
                    type: "success",
                    title: `Đã xóa "${listTitle}"`,
                    duration: 6000,
                    action: {
                        label: "Hoàn tác",
                        onClick: async () => {
                            // Re-create the list via API
                            try {
                                const createRes = await listApi.create(variables.boardId, {
                                    title: context.deletedList?.title || "Danh sách đã khôi phục",
                                });
                                const newList = createRes?.data?.data?.list;
                                if (newList) {
                                    addList(newList);
                                    addToast({ type: "success", title: `Đã khôi phục "${listTitle}"`, duration: 3000 });
                                }
                            } catch {
                                addToast({ type: "error", title: "Không thể khôi phục danh sách", duration: 3000 });
                            }
                        },
                    },
                });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa danh sách" });
            }
        },

        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}
