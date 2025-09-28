import axios from "axios";

// Central axios instance for the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// Always attach Authorization header from localStorage if available
api.interceptors.request.use(
  (cfg) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        cfg.headers = cfg.headers || {};
        // Do not double-set if already set by another layer
        if (!cfg.headers.Authorization) {
          cfg.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {}
    return cfg;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const status = err?.response?.status;
      // Do not auto-logout on 401. Leave handling to callers/routes.
      // This prevents unexpected redirects on public pages during refresh.
      if (status === 401) {
        // no-op
      }
    } catch (_) {}
    return Promise.reject(err);
  }
);

export default api;
