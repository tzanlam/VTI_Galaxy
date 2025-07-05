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
    console.log("Axios interceptor error:", error);

    if (error.response) {
      const { status, data } = error.response;

      // Tạo error object với thông tin chi tiết
      const enhancedError = new Error(data?.message || "Đã xảy ra lỗi");
      enhancedError.response = error.response;
      enhancedError.status = status;
      enhancedError.data = data;

      console.log("Enhanced error:", {
        status,
        message: data?.message,
        data: data,
      });

      switch (status) {
        case 400:
          // Chỉ dùng thông báo mặc định cho login endpoint
          if (error.config?.url?.includes("/login")) {
            enhancedError.message =
              data?.message || "Email hoặc mật khẩu không đúng";
          } else {
            enhancedError.message = data?.message || "Dữ liệu không hợp lệ";
          }
          return Promise.reject(enhancedError);
        case 401:
          enhancedError.message = data?.message || "Phiên đăng nhập đã hết hạn";
          return Promise.reject(enhancedError);
        case 403:
          enhancedError.message =
            data?.message || "Bạn không có quyền truy cập";
          return Promise.reject(enhancedError);
        case 500:
          enhancedError.message =
            data?.message || "Lỗi máy chủ, vui lòng thử lại sau";
          return Promise.reject(enhancedError);
        default:
          return Promise.reject(enhancedError);
      }
    }
    return Promise.reject(new Error("Kết nối mạng không ổn định"));
  }
);

export default axiosClient;
