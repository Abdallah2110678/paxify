import axios from "axios";

// Central axios instance for the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

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
