import { axiosClient } from "./axiosClient";

const notificationsRoutes = '/notifications';

export const notificationApi = {
    getMyNotifications: async ({ page = 1, limit = 20 } = {}) => {
        return await axiosClient.get(notificationsRoutes, {
            params: { page, limit },
        });
    },
    getUnreadNotificationsCount: async () => {
        return await axiosClient.get(`${notificationsRoutes}/unread-count`);
    },
    markNotificationAsRead: async (notificationId) => {
        return await axiosClient.patch(`${notificationsRoutes}/${notificationId}/read`);
    },
    markAllNotificationsAsRead: async () => {
        return await axiosClient.patch(`${notificationsRoutes}/read-all`);
    },
    deleteNotification: async (notificationId, data) => {
        return await axiosClient.delete(`${notificationsRoutes}/${notificationId}`, {
            data
        });
    }
};