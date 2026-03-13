import { boardApi } from "@/api/board";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const BOARD_KEYS = {
    all: ['boards'],
    detail: (id) => ['board', id],
    list: (workspaceId) => ['workspace-boards', workspaceId]
};

export function useMyBoards() {
    return useQuery({
        queryKey: BOARD_KEYS.all,
        queryFn: async () => {
            const res = await boardApi.getMyBoards();
            if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch boards");
            return res.data.data.boards || [];
        },
        staleTime: 1000 * 60 * 5
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: (data) => boardApi.create(data),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // Invalidate my boards list
                queryClient.invalidateQueries(BOARD_KEYS.all);

                if (variables.workspace) {
                    queryClient.invalidateQueries(BOARD_KEYS.list(variables.workspace));
                }
                addToast({ type: "success", title: "Tạo bảng thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi tạo bảng" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: ({ id, data }) => boardApi.update(id, data),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(BOARD_KEYS.detail(variables.id));
                queryClient.invalidateQueries(BOARD_KEYS.all);
                if (res.data.data?.workspace) {
                    queryClient.invalidateQueries(BOARD_KEYS.list(res.data.data.workspace));
                }
                addToast({ type: "success", title: "Cập nhật bảng thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật bảng" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: ({ id }) => boardApi.delete(id),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(BOARD_KEYS.all);
                if (variables.workspaceId) {
                    queryClient.invalidateQueries(BOARD_KEYS.list(variables.workspaceId));
                } else {
                    queryClient.invalidateQueries(['workspace-boards']);
                }
                addToast({ type: "success", title: "Đã xóa bảng" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa bảng" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}
