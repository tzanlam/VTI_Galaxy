import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8082",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor cho request
axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (
      token &&
      !["/login", "/register"].some((url) => config.url.includes(url))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
        case 401:
          return Promise.reject(
            new Error(data.message || "Email hoặc mật khẩu không đúng")
          );
        case 403:
          return Promise.reject(new Error("Bạn không có quyền truy cập"));
        case 500:
          return Promise.reject(new Error("Lỗi máy chủ, vui lòng thử lại sau"));
        default:
          return Promise.reject(new Error(data.message || "Đã xảy ra lỗi"));
      }
    }
    return Promise.reject(new Error("Kết nối mạng không ổn định"));
  }
);

export default axiosClient;
