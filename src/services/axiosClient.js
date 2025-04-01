import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8082",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token && !config.url.includes("/login") && !config.url.includes("/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config.url;

      if (url.includes("/register")) {
        if (status === 400) {
          const errorMessage = typeof data === "string" && data.trim().length > 0
            ? data
            : "Đăng ký thất bại. Vui lòng kiểm tra thông tin.";
          return Promise.reject(new Error(errorMessage));
        } else if (status === 500) {
          return Promise.reject(new Error("Lỗi server. Vui lòng thử lại sau."));
        }
      }
    } else if (error.request) {
      return Promise.reject(new Error("Không thể kết nối đến server."));
    }
    return Promise.reject(new Error("Đã xảy ra lỗi không xác định."));
  }
);

export default axiosClient;