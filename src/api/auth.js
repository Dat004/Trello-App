import { axiosClient } from "./axiosClient";

const googleLoginRoute = "/auth/google";
const registerRoute = "/auth/register";
const logoutRoute = "/auth/logout";
const loginRoute = "/auth/login";

export const authApi = {
  async register(data) {
    return await axiosClient.post(registerRoute, data);
  },
  async login(data) {
    return await axiosClient.post(loginRoute, data);
  },
  async googleLogin(data) {
    return await axiosClient.post(googleLoginRoute, data);
  },
  async logout() {
    return await axiosClient.post(logoutRoute);
  },
  async forgotPassword(data) {
    return await axiosClient.post("/auth/forgot-password", data);
  },
  async verifyResetToken(token) {
    return await axiosClient.get(`/auth/reset-password/${token}/verify`);
  },
  async resetPassword(data) {
    return await axiosClient.post("/auth/reset-password", data);
  },
  async changePassword(data) {
    return await axiosClient.post("/auth/change-password", data);
  },
};
