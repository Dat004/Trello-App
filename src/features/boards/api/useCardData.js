import { attachmentsApi } from "@/api/attachments";
import { commentsApi } from "@/api/comments";
import { UserToast } from "@/context/ToastContext";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CARD_KEYS = {
    comments: (cardId) => ['card', cardId, 'comments'],
    replies: (commentId) => ['comment', commentId, 'replies'],
    attachments: (cardId) => ['card', cardId, 'attachments'],
};

// --- COMMENTS ---

export const useCardComments = (boardId, cardId) => {
    return useInfiniteQuery({
        queryKey: CARD_KEYS.comments(cardId),
        queryFn: async ({ pageParam = 0 }) => {
            const res = await commentsApi.getCommentsByCardId(boardId, cardId, 10, pageParam);
            // Ensure we return the raw data structure that getNextPageParam expects
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            // API response structure: { success: true, data: { comments: [], hasMore: true, nextSkip: 10 } }
            if (lastPage?.success && lastPage.data?.hasMore) {
                return lastPage.data.nextSkip;
            }
            return undefined;
        },
        enabled: !!cardId,
        refetchOnWindowFocus: false,
    });
};

export const useCardCommentReplies = (boardId, cardId, commentId, enabled = false) => {
    return useQuery({
        queryKey: CARD_KEYS.replies(commentId),
        queryFn: async () => {
            const response = await commentsApi.getThreadComment(boardId, cardId, commentId);
            return response.data?.data?.comments || [];
        },
        enabled: !!commentId && enabled,
        staleTime: 1000 * 60 * 5,
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const mutation = useMutation({
        mutationFn: ({ boardId, cardId, data }) => commentsApi.addComment(boardId, cardId, data),
        onSuccess: (data, variables) => {
            // If it's a reply (data likely has parentId or similar, but the API might handle it)
            // Invalidating the card comments will refresh the top-level count/list if needed
            queryClient.invalidateQueries(CARD_KEYS.comments(variables.cardId));
            addToast({ type: "success", title: "Thêm bình luận thành công" });

            // If we knew the parentId, we could invalidate replies too. 
            // Assuming variables.data contains parent info if it is a reply.
            // But usually refreshing the main list or the specific thread is needed.
        },
        onError: () => {
            addToast({ type: "error", title: "Có lỗi xảy ra khi thêm bình luận" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const mutation = useMutation({
        mutationFn: ({ boardId, cardId, commentId }) => commentsApi.deleteComment(boardId, cardId, commentId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(CARD_KEYS.comments(variables.cardId));
            // Also invalidate replies if we deleted a reply, but difficult to know parentId without passing it
            // Ideally we iterate valid keys or just rely on parent invalidation
            addToast({ type: "success", title: "Xóa bình luận thành công" });
        },
        onError: () => {
            addToast({ type: "error", title: "Có lỗi xảy ra khi xóa bình luận" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
};

// --- ATTACHMENTS ---

export const useCardAttachments = (boardId, cardId) => {
    return useInfiniteQuery({
        queryKey: CARD_KEYS.attachments(cardId),
        queryFn: async ({ pageParam = 0 }) => {
            const res = await attachmentsApi.getAttachmentsByCardId(boardId, cardId, 10, pageParam);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage?.success && lastPage.data?.hasMore) {
                return lastPage.data.nextSkip;
            }
            return undefined;
        },
        enabled: !!cardId,
        refetchOnWindowFocus: false,
    });
};

export const useAddAttachment = () => {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const mutation = useMutation({
        mutationFn: ({ boardId, cardId, data }) => attachmentsApi.addAttachment(boardId, cardId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(CARD_KEYS.attachments(variables.cardId));
            addToast({ type: "success", title: "Thêm tệp đính kèm thành công" });
        },
        onError: () => {
            addToast({ type: "error", title: "Có lỗi xảy ra khi thêm tệp" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
};

export const useDeleteAttachment = () => {
    const queryClient = useQueryClient();
    const { addToast } = UserToast();
    const mutation = useMutation({
        mutationFn: ({ boardId, cardId, attachmentId }) => attachmentsApi.deleteAttachment(boardId, cardId, attachmentId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(CARD_KEYS.attachments(variables.cardId));
            addToast({ type: "success", title: "Xóa tệp đính kèm thành công" });
        },
        onError: () => {
            addToast({ type: "error", title: "Có lỗi xảy ra khi xóa tệp" });
        }
    });

    return { ...mutation, isLoading: mutation.isPending };
};
