import axios from "axios";

const env = import.meta.env;
const BASE_URI = env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URI,
  withCredentials: true, // Gửi kèm cookie trong các yêu cầu
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosClient;
