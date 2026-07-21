import { useMemo } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationApi } from "@/api/notifications";
import { NOTIFICATION_KEYS } from "@/query/queryKeys";

export { NOTIFICATION_KEYS };

const PAGE_SIZE = 20;

export const mapNotificationPages = (old, mapper) => {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      notifications: mapper(page.notifications || []),
    })),
  };
};

export const prependNotificationPage = (old, notification) => {
  if (!old?.pages?.length) {
    return {
      pages: [
        {
          notifications: [notification],
          pagination: { page: 1, limit: PAGE_SIZE, total: 1, totalPages: 1 },
        },
      ],
      pageParams: [1],
    };
  }

  return {
    ...old,
    pages: old.pages.map((page, index) =>
      index === 0
        ? {
            ...page,
            notifications: [
              notification,
              ...(page.notifications || []).filter((n) => n._id !== notification._id),
            ],
          }
        : page
    ),
  };
};

export const useNotifications = () => {
  const query = useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await notificationApi.getMyNotifications({
        page: pageParam,
        limit: PAGE_SIZE,
      });
      return {
        notifications: res.data?.data?.notifications || [],
        pagination: res.data?.data?.pagination || {
          page: pageParam,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        },
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination || {};
      if (page && totalPages && page < totalPages) return page + 1;
      return undefined;
    },
    staleTime: 1000 * 60,
  });

  const notifications = useMemo(
    () => query.data?.pages.flatMap((page) => page.notifications) || [],
    [query.data]
  );

  return {
    ...query,
    notifications,
  };
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
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });

      const previousData = queryClient.getQueryData(NOTIFICATION_KEYS.list());

      queryClient.setQueryData(NOTIFICATION_KEYS.list(), (old) =>
        mapNotificationPages(old, (items) =>
          items.map((n) =>
            n._id === notificationId ? { ...n, is_read: true } : n
          )
        )
      );

      queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old = 0) =>
        Math.max(0, old - 1)
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTIFICATION_KEYS.list(), context.previousData);
      }
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: notificationApi.markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => notificationApi.deleteNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
};
