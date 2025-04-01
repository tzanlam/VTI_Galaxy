import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8082",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (
      token &&
      !config.url.includes("/login") &&
      !config.url.includes("/register")
    ) {
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
      if (status === 400 || status === 401) {
        return Promise.reject(new Error(data || "Email hoặc mật khẩu không đúng"));
      }
    }
    return Promise.reject(
      new Error(error.message || "Đã xảy ra lỗi không xác định")
    );
  }
);

export default axiosClient;