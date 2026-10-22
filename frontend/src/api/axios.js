
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL?.trim();

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL is missing. Check your frontend environment configuration."
  );
}

const api = axios.create({
  baseURL: apiUrl.replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
