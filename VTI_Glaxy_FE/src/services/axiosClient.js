import axios from "axios";

// Nếu đang chạy local thì gọi BE localhost, còn lại thì gọi Render
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8082"
    : "https://vti-galaxy.onrender.com";

const axiosClient = axios.create({
  baseURL,
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

      const enhancedError = new Error(data?.message || "Đã xảy ra lỗi");
      enhancedError.response = error.response;
      enhancedError.status = status;
      enhancedError.data = data;

      switch (status) {
        case 400:
          if (error.config?.url?.includes("/login")) {
            enhancedError.message =
              data?.message || "Email hoặc mật khẩu không đúng";
          } else {
            enhancedError.message = data?.message || "Dữ liệu không hợp lệ";
          }
          break;
        case 401:
          enhancedError.message = data?.message || "Phiên đăng nhập đã hết hạn";
          break;
        case 403:
          enhancedError.message = data?.message || "Bạn không có quyền truy cập";
          break;
        case 500:
          enhancedError.message =
            data?.message || "Lỗi máy chủ, vui lòng thử lại sau";
          break;
        default:
          break;
      }

      return Promise.reject(enhancedError);
    }
    return Promise.reject(new Error("Kết nối mạng không ổn định"));
  }
);

export default axiosClient;
