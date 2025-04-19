import axios from "axios";
import { Cookies } from "react-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Create an axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
});

const cookie = new Cookies();

api.interceptors.request.use(
  (config) => {
    const token = cookie.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message === "Unauthorized"
    ) {
      // Clear token from localStorage
      cookie.remove("access_token");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
