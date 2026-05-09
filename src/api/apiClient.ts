import axios from "axios";
import viteConfig from "../config/viteconfig";

const API_BASE_URL = viteConfig.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding the bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bloom_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear store)
      localStorage.removeItem("bloom_token");
      localStorage.removeItem("bloom_user");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
