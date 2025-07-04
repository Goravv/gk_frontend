import axios from "axios";

const API = axios.create({
  // baseURL: "https://gk-backend-c2ih.onrender.com",
  baseURL: "http://127.0.0.1:8000",
  withCredentials: false,
});

// Add access token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh on 401 error
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ensure it's a 401, not already retried, and refresh token exists
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        // const res = await axios.post("https://gk-backend-c2ih.onrender.com/api/token/refresh/", {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
