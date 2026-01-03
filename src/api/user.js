import { axiosClient } from "./axiosClient";

const updateSettingsRoute = '/users/me/settings';
const updateInfoRoute = '/users/me/info';
const meRoute = '/users/me';

export const userApi = {
    async me() {
        try {
            return await axiosClient.get(meRoute);
        }
        catch(err) {
            return err.response;
        }
    },
    async updateSettings(data) {
        try {
            return await axiosClient.patch(updateSettingsRoute, data);
        }
        catch(err) {
            return err.response;
        }
    },
    async updateInfo(data) {
        try {
            return await axiosClient.patch(updateInfoRoute, data);
        }
        catch(err) {
            return err.response;
        }
    }
}