import axiosClient from "./axiosClient";

const registerRoute = '/auth/register';
const loginRoute = '/auth/login';

export const authApi = {
    async register(data) {
        try {
            return await axiosClient.post(registerRoute, data);
        }
        catch(err) {
            return err.response;
        }
    },
    async login(data) {
        try {
            return await axiosClient.post(loginRoute, data);
        }
        catch(err) {
            return err.response;
        }
    },
}