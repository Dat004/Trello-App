import axios from "axios";

const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Gửi kèm cookie trong các yêu cầu
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosClient;
