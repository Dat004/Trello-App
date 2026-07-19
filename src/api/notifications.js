import { axiosClient } from "./axiosClient";

const notificationsRoutes = '/notifications';

export const notificationApi = {
    getMyNotifications: async () => {
        return await axiosClient.get(notificationsRoutes);
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