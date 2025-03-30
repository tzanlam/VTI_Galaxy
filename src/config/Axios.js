// src/services/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/movie", // Đảm bảo khớp với backend
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
      console.log("Response Error:", { status, data }); // Log chi tiết để debug

      if (error.config.url.includes("/login")) {
        if (status === 400) {
          return Promise.reject(new Error("Thông tin không hợp lệ. Vui lòng kiểm tra lại."));
        } else if (status === 401) {
          return Promise.reject(new Error(data.message || "Email hoặc mật khẩu không đúng."));
        } else if (status === 500) {
          return Promise.reject(new Error(data.message || "Lỗi server. Vui lòng thử lại sau."));
        }
      }
      return Promise.reject(new Error(`Lỗi từ server: ${status} - ${data.message || "Không rõ chi tiết"}`));
    } else if (error.request) {
      console.log("Request Error:", error.request);
      return Promise.reject(new Error("Không thể kết nối đến server. Kiểm tra backend hoặc mạng."));
    }
    console.log("Unknown Error:", error);
    return Promise.reject(new Error("Đã xảy ra lỗi không xác định."));
  }
);

export default axiosClient;