import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (user) {
      return JSON.parse(user);
    }

    const legacyToken = localStorage.getItem("token");

    return legacyToken ? { token: legacyToken } : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const setStoredUser = (user, remember = true) => {
  const storage = remember ? localStorage : sessionStorage;

  clearStoredUser();
  storage.setItem("user", JSON.stringify(user));
  storage.setItem("token", user.token);
};

export const clearStoredUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

API.interceptors.request.use((config) => {
  const user = getStoredUser();

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default API;
