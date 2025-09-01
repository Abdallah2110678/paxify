import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";
import { login as authLogin, signup as authSignup } from "../services/authService.js";
import { jwtDecode } from "jwt-decode";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Extract only minimal claims (id + role) from JWT
function mapClaimsToUser(claims = {}) {
  const id = claims.userId || claims.id || claims.sub || null;

  const roleRaw =
    claims.role ||
    (Array.isArray(claims.roles) ? claims.roles[0] : null) ||
    (Array.isArray(claims.authorities) ? claims.authorities[0] : null) ||
    claims.scope ||
    null;

  const role =
    typeof roleRaw === "string"
      ? roleRaw.toUpperCase()
      : roleRaw && roleRaw.name
      ? String(roleRaw.name).toUpperCase()
      : null;

  return { id, role };
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // Attach Authorization header
  useEffect(() => {
    const interceptorId = api.interceptors.request.use((cfg) => {
      const url = `${cfg.baseURL || ""}${cfg.url || ""}`;
      const isAuthEndpoint =
        url.includes("/api/auth/register") || url.includes("/api/auth/login");

      if (token && !isAuthEndpoint) {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    });

    return () => api.interceptors.request.eject(interceptorId);
  }, [token]);

  // On app refresh: decode token -> fetch latest user from backend
  useEffect(() => {
    if (token && !user) {
      try {
        const decoded = jwtDecode(token);
        const mapped = mapClaimsToUser(decoded);

        if (mapped.id) {
          api.get(`/api/users/${mapped.id}`).then((res) => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          });
        }
      } catch (e) {
        console.warn("Failed to decode token on mount:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Login: fetch fresh user from backend
  const login = async (email, password) => {
    const data = await authLogin(email, password);

    setToken(data.token);
    localStorage.setItem("token", data.token);

    try {
      const decoded = jwtDecode(data.token);
      const mapped = mapClaimsToUser(decoded);

      if (mapped.id) {
        const res = await api.get(`/api/users/${mapped.id}`);
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (e) {
      console.error("Failed to fetch user after login:", e);
      // fallback: at least set email so UI doesn't break
      const fallbackUser = {
        id: null,
        role: null,
        email,
        name: email.split("@")[0],
      };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
    }
  };

  const signup = async (payload) => {
    await authSignup(payload);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Refresh user (after profile update)
  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const { data } = await api.get(`/api/users/${user.id}`);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <Ctx.Provider value={{ user, token, login, logout, signup, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
};
