import { workspaceApi } from "@/api/workspace";
import { UserToast } from "@/context/ToastContext";
import { WORKSPACES_KEYS } from "@/query/queryKeys";
import { useFavoritesStore } from "@/store";
import { getApiErrorMessage, unwrapApiData } from "@/utils/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export { WORKSPACES_KEYS };

export function useWorkspacesList() {
    return useQuery({
        queryKey: WORKSPACES_KEYS.list(),
        queryFn: async () => {
            const res = await workspaceApi.getMyWorkspaces();
            return unwrapApiData(res, "Failed to fetch").workspaces || [];
        },
        staleTime: 1000 * 60 * 5, // 5 mins
        refetchOnWindowFocus: false,
    });
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: (data) => workspaceApi.create(data),
        onSuccess: (res) => {
            if (res.data?.success) {
                // Invalidate list to refetch
                queryClient.invalidateQueries({ queryKey: WORKSPACES_KEYS.list() });
                addToast({ type: "success", title: "Tạo workspace thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi tạo workspace" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: ({ id, data }) => workspaceApi.update(id, data),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                queryClient.invalidateQueries({ queryKey: WORKSPACES_KEYS.list() });
                queryClient.invalidateQueries({ queryKey: WORKSPACES_KEYS.detail(variables.id) });
                addToast({ type: "success", title: "Cập nhật workspace thành công!" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const removeFavoriteWorkspace = useFavoritesStore((state) => state.removeFavoriteWorkspace);
    const removeFavoriteBoardsByWorkspace = useFavoritesStore(
        (state) => state.removeFavoriteBoardsByWorkspace
    );

    const mutation = useMutation({
        mutationFn: (id) => workspaceApi.delete(id),
        onSuccess: (res, workspaceId) => {
            if (res.data?.success) {
                removeFavoriteWorkspace(workspaceId);
                removeFavoriteBoardsByWorkspace(workspaceId);
                queryClient.invalidateQueries({ queryKey: WORKSPACES_KEYS.list() });
                addToast({ type: "success", title: "Đã xóa workspace" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa workspace" });
            }

            return res;
        },
        onError: (err) => {
            addToast({ type: "error", title: getApiErrorMessage(err, "Lỗi kết nối server") });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
}
