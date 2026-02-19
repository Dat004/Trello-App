import { workspaceApi } from "@/api/workspace";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WORKSPACES_KEYS = {
    all: ['workspaces'],
    list: () => ['workspaces', 'list'],
    detail: (id) => ['workspaces', 'detail', id], // Reuse key logic globally
};

export function useWorkspacesList() {
    return useQuery({
        queryKey: WORKSPACES_KEYS.list(),
        queryFn: async () => {
            const res = await workspaceApi.getMyWorkspaces();
            if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch");
            return res.data.data.workspaces || [];
        },
        staleTime: 1000 * 60 * 5, // 5 mins
        refetchOnWindowFocus: false,
    });
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: (data) => workspaceApi.create(data),
        onSuccess: (res) => {
            if (res.data?.success) {
                // Invalidate list to refetch
                queryClient.invalidateQueries(WORKSPACES_KEYS.list());
                addToast({ type: "success", title: "Tạo workspace thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi tạo workspace" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });
}

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: ({ id, data }) => workspaceApi.update(id, data),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(WORKSPACES_KEYS.list());
                queryClient.invalidateQueries(WORKSPACES_KEYS.detail(variables.id));
                addToast({ type: "success", title: "Cập nhật workspace thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: (id) => workspaceApi.delete(id),
        onSuccess: (res) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(WORKSPACES_KEYS.list());
                addToast({ type: "success", title: "Đã xóa workspace" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa workspace" });
            }

            return res;
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối server" });
        }
    });
}
