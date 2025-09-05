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
      // If token is expired/invalid, force logout and redirect to login
      if (status === 401) {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (_) {}
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    } catch (_) {}
    return Promise.reject(err);
  }
);

export default api;
