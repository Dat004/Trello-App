import axiosClient from "./axiosClient";

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
}