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
    const { removeList } = useBoardActions();

    const mutation = useMutation({
        mutationFn: ({ boardId, listId }) => listApi.delete(boardId, listId),

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context by removing list
                removeList(variables.listId);

                addToast({ type: "success", title: "Đã xóa danh sách" });
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
