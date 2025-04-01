import axios from "axios";

export const ROOT_URL = "localhost";
export const API_URL_IMAGE = `http://${ROOT_URL}:8082/api/images/`;
const API_URL = `http://${ROOT_URL}:8082`;

axios.defaults.baseURL = API_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      "/login",
      null,
      {
        params: { email, password },
      }
    );

    if (response.data && response.status === 200) {
      const token = response.data.token;
      const user = {
        email: response.data.identifier,
        fullName: response.data.identifier.split("@")[0] || "Thành viên",
        id: response.data.accountId,
        avatar: response.data.image || "",
      };
      // Persist token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user as JSON string
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
 
    console.error("Login error:", error);
    throw error;
  }
};

// Optional: Function to clear stored data on logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};