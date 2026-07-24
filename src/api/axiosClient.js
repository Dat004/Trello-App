import axios from "axios";

import ENV_CONFIG from "@/config/env";
import { isLikelyColdStartError, wakeBackend } from "./wakeApi";

const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return ENV_CONFIG.API_URL;
  }

  return "/api";
};

// Biến toàn cục để lưu socketId, sẽ được set từ SocketContext
let currentSocketId = null;

export const setSocketId = (socketId) => {
  currentSocketId = socketId;
};

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  // Render free cold start often needs 30–60s; default axios has no timeout
  // but browsers / proxies may cut earlier — keep a generous client budget.
  timeout: import.meta.env.PROD ? 60000 : 30000,
});

const axiosCloudinaryClient = axios.create({
  baseURL: ENV_CONFIG.CLOUDINARY_API_URL,
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    if (currentSocketId) {
      config.headers["x-socket-id"] = currentSocketId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (!config || config.__coldRetry) {
      return Promise.reject(error);
    }

    if (!isLikelyColdStartError(error)) {
      return Promise.reject(error);
    }

    config.__coldRetry = true;
    // Wake sleeping instance, then retry the original request once.
    await wakeBackend({ attempts: 3, timeoutMs: 45000 });
    return axiosClient.request(config);
  }
);

export { axiosClient, axiosCloudinaryClient };
