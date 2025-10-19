import axios from "axios";

// Central axios instance for the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // e.g., http://localhost:8080
});

// Attach Authorization header automatically if token exists
api.interceptors.request.use(
  (cfg) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        cfg.headers = cfg.headers || {};
        if (!cfg.headers.Authorization) {
          cfg.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {}
    return cfg;
  },
  (err) => Promise.reject(err)
);

// Optional: handle 401s centrally (no auto-logout here)
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
