import { workspaceApi } from "@/api/workspace";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WORKSPACE_KEYS } from "./useWorkspaceDetail";

export const WORKSPACE_MEMBERS_KEYS = {
    list: (workspaceId) => ['workspaces', 'members', workspaceId],
    joinRequests: (workspaceId) => ['workspaces', 'members', 'requests', workspaceId],
};

export function useWorkspaceMembers(workspaceId) {
    return useQuery({
        queryKey: WORKSPACE_MEMBERS_KEYS.list(workspaceId),
        queryFn: async () => {
            const res = await workspaceApi.getMemberInWorkspace(workspaceId);
            if (!res.data?.success) throw new Error(res.data?.message);
            return res.data.data.members || [];
        },
        enabled: !!workspaceId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useWorkspaceJoinRequests(workspaceId) {
    return useQuery({
        queryKey: WORKSPACE_MEMBERS_KEYS.joinRequests(workspaceId),
        queryFn: async () => {
            const res = await workspaceApi.getJoinRequests(workspaceId);
            if (!res.data?.success) throw new Error(res.data?.message);
            return res.data.data.requests || [];
        },
        enabled: !!workspaceId,
    });
}


export function useUpdateMemberRole() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: ({ workspaceId, member_id, role }) =>
            workspaceApi.updateMemberRole(workspaceId, { member_id, role }),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // Invalidate detail to refresh members list inside workspace object
                queryClient.invalidateQueries(WORKSPACE_KEYS.detail(variables.workspaceId));
                // And explicit members list if used separate hook
                // queryClient.invalidateQueries(WORKSPACE_MEMBERS_KEYS.list(variables.workspaceId));

                addToast({ type: "success", title: "Cập nhật quyền thành công" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật" });
            }
        },
        onError: (err) => {
            console.error(err);
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối" });
        }
    });
}

export function useKickMember() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: ({ workspaceId, member_id }) =>
            workspaceApi.kickMember(workspaceId, { member_id }),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(WORKSPACE_KEYS.detail(variables.workspaceId));
                addToast({ type: "success", title: "Đã xóa thành viên khỏi workspace" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa thành viên" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối" });
        }
    });
}

export function useHandleJoinRequest(workspaceId) {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: ({ requestId, status }) => workspaceApi.handleJoinRequest(workspaceId, requestId, { status }),
        onSuccess: (res) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(WORKSPACE_MEMBERS_KEYS.joinRequests(workspaceId));
                if (res.data.status === 'accepted') {
                    queryClient.invalidateQueries(WORKSPACE_MEMBERS_KEYS.list(workspaceId));
                }
                addToast({ type: "success", title: "Đã xử lý yêu cầu tham gia" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xử lý yêu cầu" });
            }
        },
        onError: (err) => {
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối" });
        }
    });
}
