import axios from 'axios';

export const ROOT_URL = "localhost";
export const API_URL_IMAGE = `http://${ROOT_URL}:8082/api/images/`;

const API_URL = `http://${ROOT_URL}:8082`; // Simplified the API URL
axios.defaults.baseURL = API_URL;

// Remove the explicit CORS headers as they should be handled by the backend
// Let the server set the appropriate CORS headers instead

export const isAuthenticated = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get(`/user/findToken?token=${token}`, {
        withCredentials: true,
      });
      const user = response.data;
      console.log("USER:", user);
      
      return user.data ? true : false;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  }
  return false;
};
export const login = async (email, password) => {
  try {
    const response = axios.post('/login', { email, password })

    
    if (response.data && response.status === 200) {
      const token = response.data.token;
      localStorage.setItem("token", token);
      return response.data;
    } else {
      return null
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};