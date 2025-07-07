import axios from "axios";

export const ROOT_URL = "localhost";
export const API_URL = `http://${ROOT_URL}:8082`;
export const API_URL_IMAGE = `${API_URL}/api/images/`;

axios.defaults.baseURL = API_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post("/login", null, {
      params: { email, password },
    });

    if (response.status === 200 && response.data.token) {
      return response;
    }
    throw new Error("Phản hồi không hợp lệ từ server");
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Đăng nhập thất bại");
  }
};

/**
 * Đăng xuất người dùng
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
