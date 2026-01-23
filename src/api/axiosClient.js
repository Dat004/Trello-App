import axios from "axios";

import ENV_CONFIG from "@/config/env";

// Biến toàn cục để lưu socketId, sẽ được set từ SocketContext
let currentSocketId = null;

export const setSocketId = (socketId) => {
  currentSocketId = socketId;
};

const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Gửi kèm cookie trong các yêu cầu
});

const axiosCloudinaryClient = axios.create({
  baseURL: ENV_CONFIG.CLOUDINARY_API_URL,
  timeout: 30000,
});

// Request interceptor: Tự động inject x-socket-id vào mọi request
axiosClient.interceptors.request.use(
  (config) => {
    if (currentSocketId) {
      config.headers['x-socket-id'] = currentSocketId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export { axiosClient, axiosCloudinaryClient };
