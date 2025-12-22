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

api.interceptors.request.use(config => {
  const token = window.localStorage.getItem("sc_active_session");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
