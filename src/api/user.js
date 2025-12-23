import axiosClient from "./axiosClient";

const registerRoute = '/auth/register';

export const authApi = {
    async register(data) {
        try {
            return await axiosClient.post(registerRoute, data);
        }
        catch(err) {
            return err.response;
        }
    },
}