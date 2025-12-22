import axios from "axios";

const getApiUrl = () => {
  if (import.meta.env.DEV) {
    // Em desenvolvimento, tenta detectar a porta do backend automaticamente
    const baseUrl = window.location.protocol + "//" + window.location.hostname;
    return baseUrl + ":3001";
  }
  return import.meta.env.VITE_API_URL || "";
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

let lastAuthFailureAt = 0;

api.interceptors.request.use(config => {
  const token = window.localStorage.getItem("sc_active_session");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    if (status === 401) {
      const now = Date.now();
      if (now - lastAuthFailureAt > 1000) {
        lastAuthFailureAt = now;
        window.localStorage.removeItem("sc_active_session");
        window.dispatchEvent(new Event("auth-change"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
