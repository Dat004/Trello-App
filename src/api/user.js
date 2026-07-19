import { axiosClient } from "./axiosClient";

const updateSettingsRoute = '/users/me/settings';
const updateInfoRoute = '/users/me/info';
const meRoute = '/users/me';

export const userApi = {
    async me() {
        return await axiosClient.get(meRoute);
    },
    async updateSettings(data) {
        return await axiosClient.patch(updateSettingsRoute, data);
    },
    async updateInfo(data) {
        return await axiosClient.patch(updateInfoRoute, data);
    },
    async getMyTasks(params) {
        return await axiosClient.get(`${meRoute}/tasks`, { params });
    },
    async getMembershipDirectory() {
        return await axiosClient.get(`${meRoute}/memberships/directory`);
    }
}