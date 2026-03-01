import { boardApi } from "@/api/board";
import { inviteApi } from "@/api/invite";
import { UserToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBoardContext } from "../context/BoardStateContext";
import { BOARD_KEYS } from "./useBoards";

export const BOARD_MEMBERS_KEYS = {
    list: (boardId) => ['board', id, 'members'], // Usually part of detail, but good to have dedicated key
    joinRequests: (boardId) => ['board', boardId, 'requests'],
};

export function useBoardMembers(boardId) {
    // This might be redundant if we use useBoardDetail, but for consistency
    return useQuery({
        queryKey: BOARD_MEMBERS_KEYS.list(boardId),
        queryFn: async () => {
            const res = await boardApi.detailBoard(boardId); // Or specific member endpoint if exists
            if (!res.data?.success) throw new Error(res.data?.message);
            return res.data.data.members || [];
        },
        enabled: !!boardId,
        staleTime: 1000 * 60 * 5,
    });
}

export function useBoardJoinRequests(boardId) {
    return useQuery({
        queryKey: BOARD_MEMBERS_KEYS.joinRequests(boardId),
        queryFn: async () => {
            const res = await boardApi.getJoinRequests(boardId);
            if (!res.data?.success) throw new Error(res.data?.message);
            return res.data.data.requests || [];
        },
        enabled: !!boardId,
    });
}


export function useUpdateBoardMemberRole() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const boardContext = useBoardContext(false); // ✅ Safe for non-board pages
    const updateBoardMember = boardContext?.updateBoardMember;

    return useMutation({
        mutationFn: ({ boardId, member_id, role }) =>
            boardApi.updateMemberRole(boardId, { member_id, role }),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context with new role if exists
                updateBoardMember?.(variables.member_id, { role: variables.role });

                addToast({ type: "success", title: "Cập nhật quyền thành công" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi cập nhật" });
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
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối" });
        }
    });
}

export function useKickBoardMember() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const boardContext = useBoardContext(false); // ✅ Safe for non-board pages
    const removeBoardMember = boardContext?.removeBoardMember;

    return useMutation({
        mutationFn: ({ boardId, member_id }) =>
            // boardApi expects (id, data), so we pass boardId and { member_id } as data
            boardApi.kickMember(boardId, { member_id }),

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(BOARD_KEYS.detail(variables.boardId));

            // Snapshot previous value
            const previousBoard = queryClient.getQueryData(BOARD_KEYS.detail(variables.boardId));

            return { previousBoard };
        },

        onSuccess: (res, variables) => {
            if (res.data?.success) {
                // ✅ Update context by removing member if exists
                removeBoardMember?.(variables.member_id);

                addToast({ type: "success", title: "Đã xóa thành viên khỏi bảng" });
            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xóa thành viên" });
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
            addToast({ type: "error", title: err.response?.data?.message || "Lỗi kết nối" });
        }
    });
}

export function useHandleBoardJoinRequest() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    return useMutation({
        mutationFn: ({ boardId, requestId, status }) => boardApi.handleJoinRequest(boardId, requestId, { status }),
        onSuccess: (res, variables) => {
            if (res.data?.success) {
                queryClient.invalidateQueries(BOARD_MEMBERS_KEYS.joinRequests(variables.boardId));
                // If accepted, members list changes
                if (variables.status === 'accepted') {
                    queryClient.invalidateQueries(BOARD_KEYS.detail(variables.boardId));
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

export function useInviteBoardMember() {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const formatFailures = (fails) => {
        if (!fails || fails.length === 0) return "Lỗi không xác định";
        const maxDisplay = 2; // Tối đa 2 email hiển thị lý do
        let msgs = fails.slice(0, maxDisplay).map(f => `${f.email} (${f.reason})`).join(", ");
        if (fails.length > maxDisplay) {
            msgs += `... và ${fails.length - maxDisplay} email khác`;
        }
        return msgs;
    };

    return useMutation({
        mutationFn: ({ boardId, emails, role, message }) =>
            inviteApi.sendInvite("board", boardId, { emails, role, message }),
        onSuccess: (res, variables) => {
            const results = res.data?.data?.results || res.data?.results;

            if (res.data?.success) {
                queryClient.invalidateQueries(BOARD_KEYS.detail(variables.boardId));

                if (results) {
                    const invitedCount = results.invited?.length || 0;
                    const failedArray = results.failed || [];
                    const failedCount = failedArray.length;

                    if (invitedCount > 0 && failedCount === 0) {
                        addToast({
                            type: "success",
                            title: "Mời thành công",
                            description: `Đã gửi lời mời đến ${invitedCount} email.`
                        });
                    } else if (invitedCount > 0 && failedCount > 0) {
                        addToast({
                            type: "warning",
                            title: "Mời thành công một phần",
                            description: `Đã mời ${invitedCount} email. Thất bại ${failedCount}: ${formatFailures(failedArray)}`,
                            duration: 6000
                        });
                    } else if (invitedCount === 0 && failedCount > 0) {
                        addToast({
                            type: "error",
                            title: "Mời thất bại",
                            description: formatFailures(failedArray),
                            duration: 6000
                        });
                    } else {
                        addToast({ type: "success", title: "Đã gửi lời mời thành công" });
                    }
                } else {
                    addToast({ type: "success", title: "Đã gửi lời mời thành công" });
                }

            } else {
                addToast({ type: "error", title: res.data?.message || "Lỗi xử lý yêu cầu" });
            }
        },
        onError: (err) => {
            const errResponse = err.response?.data;
            const results = errResponse?.data?.results || errResponse?.results;

            if (results && results.failed && results.failed.length > 0) {
                addToast({
                    type: "error",
                    title: "Mời thất bại",
                    description: formatFailures(results.failed),
                    duration: 6000
                });
            } else {
                addToast({ type: "error", title: errResponse?.message || "Lỗi kết nối" });
            }
        },
    });
}
