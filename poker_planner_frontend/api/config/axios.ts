import axios from "axios";

import { getUserFromLocalStorage } from "@/utils/localStorage.utils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getUserFromLocalStorage()?.user_token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  },
);

export default axiosInstance;
