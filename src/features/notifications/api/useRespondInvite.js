import { inviteApi } from "@/api/invite";
import { UserToast } from "@/context/ToastContext";
import { BOARD_KEYS } from "@/features/boards/api/useBoards";
import { WORKSPACE_KEYS } from "@/features/workspaces/api/useWorkspaceDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "./useNotifications";

export function useRespondInvite() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const mutation = useMutation({
        mutationFn: ({ entityType, entityId, notification_id, action }) =>
            inviteApi.respondInvite(entityType, entityId, { action, notification_id }),

        onSuccess: (res, variables) => {
            const { entityType, action } = variables;

            if (res?.data?.success || res?.status === 200) {

                // Xóa notification khỏi cache (dù accept hay reject)
                queryClient.setQueryData(NOTIFICATION_KEYS.list(), (old = []) => {
                    if (!Array.isArray(old)) return old;
                    return old.filter((n) => n._id !== variables.notification_id);
                });

                queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old = 0) =>
                    Math.max(0, old - 1)
                );

                if (action === "accept") {
                    // Invalidate danh sách để sidebar/dashboard tự cập nhật khi navigate vào
                    if (entityType === "workspace") {
                        queryClient.invalidateQueries(WORKSPACE_KEYS.all);
                    } else {
                        queryClient.invalidateQueries(BOARD_KEYS.all);
                    }

                    addToast({
                        type: "success",
                        title: `Đã tham gia ${entityType === "workspace" ? "workspace" : "bảng"} thành công`,
                    });
                } else {
                    addToast({ type: "info", title: "Đã từ chối lời mời" });
                }

            } else {
                addToast({
                    type: "error",
                    title: res?.data?.message || "Không thể xử lý lời mời",
                });
            }
        },

        onError: (err) => {
            addToast({
                type: "error",
                title: err.response?.data?.message || "Lỗi kết nối",
            });
        },
    });

    return { ...mutation, isLoading: mutation.isPending };
}
