import axios from "axios";

const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API_URL;

const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Gửi kèm cookie trong các yêu cầu
});

const axiosCloudinaryClient = axios.create({
  baseURL: CLOUDINARY_API_URL,
  timeout: 30000,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export { axiosClient, axiosCloudinaryClient };
