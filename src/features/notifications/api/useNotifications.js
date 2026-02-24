import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationApi } from "@/api/notifications";

export const NOTIFICATION_KEYS = {
    all: ["notifications"],
    list: () => [...NOTIFICATION_KEYS.all, "list"],
    unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"],
};

export const useNotifications = () => {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.list(),
        queryFn: notificationApi.getMyNotifications,
        select: (res) => res.data?.data?.notifications || [],
        staleTime: 1000 * 60,
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
        queryFn: notificationApi.getUnreadNotificationsCount,
        select: (res) => res.data?.data?.count || 0,
        refetchInterval: 1000 * 60 * 2,
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationApi.markNotificationAsRead,
        onMutate: async (notificationId) => {
            // Hủy các truy vấn đang chờ
            await queryClient.cancelQueries(NOTIFICATION_KEYS.all);

            // Lưu lại giá trị trước đó
            const previousNotifications = queryClient.getQueryData(NOTIFICATION_KEYS.list());

            // Cập nhật trạng thái đã đọc
            queryClient.setQueryData(NOTIFICATION_KEYS.list(), (old = []) =>
                old.map(n => n._id === notificationId ? { ...n, is_read: true } : n)
            );

            // Giảm số lượng thông báo chưa đọc
            queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old = 0) =>
                Math.max(0, old - 1)
            );

            return { previousNotifications };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(NOTIFICATION_KEYS.list(), context.previousNotifications);
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());
        },
        onSettled: () => {
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());
        },
    });
};

export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationApi.markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(NOTIFICATION_KEYS.all);
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => notificationApi.deleteNotification(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(NOTIFICATION_KEYS.list());
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());
        },
    });
};
