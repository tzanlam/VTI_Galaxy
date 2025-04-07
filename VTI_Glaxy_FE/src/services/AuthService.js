import axios from "axios";

export const ROOT_URL = "localhost";
export const API_URL = `http://${ROOT_URL}:8082`;
export const API_URL_IMAGE = `${API_URL}/api/images/`;

axios.defaults.baseURL = API_URL;

/**
 * Đăng nhập người dùng
 * @param {string} email Email người dùng
 * @param {string} password Mật khẩu người dùng
 * @returns {Promise<Object>} Dữ liệu người dùng và token
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post("/login", null, {
      params: { email, password },
    });

    if (response.status === 200 && response.data.token) {
      const { token, identifier, accountId, image } = response.data;
      const user = {
        email: identifier,
        fullName: identifier.split("@")[0] || "Thành viên",
        id: accountId,
        avatar: image || "",
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { ...response.data, fullName: user.fullName };
    }
    throw new Error("Phản hồi không hợp lệ từ server");
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
};

/**
 * Đăng xuất người dùng
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};