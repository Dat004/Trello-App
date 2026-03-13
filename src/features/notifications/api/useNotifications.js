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
        queryFn: async () => {
            const res = await notificationApi.getMyNotifications();
            return res.data?.data?.notifications || [];
        },
        staleTime: 1000 * 60,
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
        queryFn: async () => {
            const res = await notificationApi.getUnreadNotificationsCount();
            return res.data?.data?.count || 0;
        },
        refetchInterval: 1000 * 60 * 2,
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: notificationApi.markNotificationAsRead,
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries(NOTIFICATION_KEYS.all);

            // Lưu cache
            const previousData = queryClient.getQueryData(NOTIFICATION_KEYS.list());

            // Cập nhật cache
            queryClient.setQueryData(NOTIFICATION_KEYS.list(), (old = []) => {
                if (!Array.isArray(old)) return old;
                return old.map((n) =>
                    n._id === notificationId ? { ...n, is_read: true } : n
                );
            });

            // Giảm số thông báo chưa đọc
            queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old = 0) =>
                Math.max(0, old - 1)
            );

            return { previousData };
        },
        onError: (err, _vars, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(NOTIFICATION_KEYS.list(), context.previousData);
            }
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());
        },
        onSettled: () => {
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());
        },
    });

    return { ...mutation, isLoading: mutation.isPending };
};

export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: notificationApi.markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(NOTIFICATION_KEYS.all);
        },
    });

    return { ...mutation, isLoading: mutation.isPending };
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }) => notificationApi.deleteNotification(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(NOTIFICATION_KEYS.list());
            queryClient.invalidateQueries(NOTIFICATION_KEYS.unreadCount());
        },
    });

    return { ...mutation, isLoading: mutation.isPending };
};
