import { create } from "zustand";

const useCommentsStore = create((set, get) => ({
    comments: [],
    threadCache: {},
    isLoading: false,
    hasMore: false,
    nextSkip: 0,
    total: 0,

    // Khởi tạo comments từ API response
    initComments: (data) => {
        set({
            comments: data.comments || [],
            threadCache: {},
            hasMore: data.hasMore || false,
            nextSkip: data.nextSkip || 0,
            total: data.total || 0,
        });
    },

    // Thêm comments vào list
    appendComments: (data) => {
        set((state) => ({
            comments: [...state.comments, ...(data.comments || [])],
            hasMore: data.hasMore || false,
            nextSkip: data.nextSkip || 0,
        }));
    },

    // Thêm comment mới
    addComment: (comment) => {
        if (!comment.parent_comment) {
            // Root comment
            set((state) => ({
                comments: [comment, ...state.comments],
                total: state.total + 1,
            }));
        } else {
            // Reply - thêm vào thread cache và update reply_count vào parent trực tiếp
            set((state) => {
                const parentId = comment.parent_comment;
                const existingThread = state.threadCache[parentId] || [];

                const updateThreadCache = (cache) => {
                    const newCache = { ...cache };
                    for (const [key, replies] of Object.entries(newCache)) {
                        newCache[key] = replies.map((r) =>
                            r._id === parentId
                                ? { ...r, reply_count: (r.reply_count || 0) + 1 }
                                : r
                        );
                    }
                    // Thêm comment mới vào thread của parent
                    newCache[parentId] = [...existingThread, comment];
                    return newCache;
                };

                return {
                    threadCache: updateThreadCache(state.threadCache),
                    // Update reply_count cho root comment (nếu parent là root)
                    comments: state.comments.map((c) =>
                        c._id === parentId
                            ? { ...c, reply_count: (c.reply_count || 0) + 1 }
                            : c
                    ),
                };
            });
        }
    },

    // Set thread replies (khi fetch từ API)
    setThreadReplies: (parentId, replies) => {
        set((state) => ({
            threadCache: {
                ...state.threadCache,
                [parentId]: replies,
            },
        }));
    },

    // Get thread replies từ cache
    getThreadReplies: (parentId) => {
        return get().threadCache[parentId] || [];
    },

    // Delete comment với cascade delete
    deleteComment: (commentId, parentId) => {
        set((state) => {
            const newCache = { ...state.threadCache };

            // Đệ quy xóa comment và tất cả replies của nó
            const cascadeDelete = (id) => {
                if (newCache[id]) {
                    newCache[id].forEach((reply) => cascadeDelete(reply._id));
                    delete newCache[id];
                }
            };

            // Cascade delete tất cả replies
            cascadeDelete(commentId);

            if (!parentId) {
                // Root comment - xóa khỏi list
                return {
                    comments: state.comments.filter((c) => c._id !== commentId),
                    threadCache: newCache,
                    total: Math.max(state.total - 1, 0),
                };
            } else {
                // Reply - xóa khỏi thread cache của parent và giảm reply_count
                const existingThread = newCache[parentId] || [];
                newCache[parentId] = existingThread.filter((c) => c._id !== commentId);

                // Update reply_count trong threadCache vào parent trực tiếp
                for (const [key, replies] of Object.entries(newCache)) {
                    newCache[key] = replies.map((r) =>
                        r._id === parentId
                            ? { ...r, reply_count: Math.max((r.reply_count || 1) - 1, 0) }
                            : r
                    );
                }

                return {
                    threadCache: newCache,
                    // Update reply_count của parent trực tiếp (nếu nằm trong comments)
                    comments: state.comments.map((c) =>
                        c._id === parentId
                            ? { ...c, reply_count: Math.max((c.reply_count || 1) - 1, 0) }
                            : c
                    ),
                };
            }
        });
    },

    // Clear thread cache cho một parent
    clearThreadCache: (parentId) => {
        set((state) => {
            const newCache = { ...state.threadCache };
            delete newCache[parentId];
            return { threadCache: newCache };
        });
    },

    // Reset store
    reset: () =>
        set({
            comments: [],
            threadCache: {},
            total: 0,
            hasMore: false,
            nextSkip: 0,
            isLoading: false,
        }),

    // SOCKET REALTIME ACTIONS
    addCommentFromSocket: (comment) => {
        get().addComment(comment);
    },

    deleteCommentFromSocket: (commentId, parentId) => {
        get().deleteComment(commentId, parentId);
    },
}));

export default useCommentsStore;
