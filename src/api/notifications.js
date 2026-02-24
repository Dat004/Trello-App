import { axiosClient } from "./axiosClient";

const notificationsRoutes = '/notifications';

export const notificationApi = {
    getMyNotifications: async () => {
        try {
            return await axiosClient.get(notificationsRoutes);
        } catch (error) {
            return error.response;
        }
    },
    getUnreadNotificationsCount: async () => {
        try {
            return await axiosClient.get(`${notificationsRoutes}/unread-count`);
        } catch (error) {
            return error.response;
        }
    },
    markNotificationAsRead: async (notificationId) => {
        try {
            return await axiosClient.patch(`${notificationsRoutes}/${notificationId}/read`);
        } catch (error) {
            return error.response;
        }
    },
    markAllNotificationsAsRead: async () => {
        try {
            return await axiosClient.patch(`${notificationsRoutes}/read-all`);
        } catch (error) {
            return error.response;
        }
    },
    deleteNotification: async (notificationId, data) => {
        try {
            return await axiosClient.delete(`${notificationsRoutes}/${notificationId}`, {
                data
            });
        } catch (error) {
            return error.response;
        }
    }
};