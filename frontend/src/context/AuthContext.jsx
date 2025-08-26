import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios.jsx";
import { jwtDecode } from "jwt-decode";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Normalize various JWT claim shapes to our app's user model
function mapClaimsToUser(claims = {}) {
  // id
  const id =
    claims.userId ||
    claims.id ||
    claims.sub ||
    null;

  // role
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

  // email / username
  const email =
    claims.email ||
    claims.userEmail ||
    (claims.sub && String(claims.sub).includes("@") ? claims.sub : null) ||
    claims.username ||
    null;

  // display name
  const name =
    claims.name ||
    claims.fullName ||
    [claims.firstName, claims.lastName].filter(Boolean).join(" ").trim() ||
    claims.given_name ||
    claims.preferred_username ||
    (email ? email.split("@")[0] : null) ||
    null;

  return { id, role, email, name };
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // Attach Authorization header; clean up interceptor on change
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

  // If token exists on load/refresh, derive user from it
  useEffect(() => {
    if (token && !user) {
      try {
        const decoded = jwtDecode(token);
        const mapped = mapClaimsToUser(decoded);
        setUser(mapped);
        localStorage.setItem("user", JSON.stringify(mapped));
      } catch (e) {
        console.warn("Failed to decode token on mount:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post(
      "/api/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    setToken(data.token);
    localStorage.setItem("token", data.token);

    try {
      const decoded = jwtDecode(data.token);
      const mapped = mapClaimsToUser(decoded);
      setUser(mapped);
      localStorage.setItem("user", JSON.stringify(mapped));
    } catch (e) {
      console.error("Failed to decode login token:", e);
      // fallback so UI still shows something sensible
      const mapped = {
        id: null,
        role: null,
        email,
        name: email ? email.split("@")[0] : "User",
      };
      setUser(mapped);
      localStorage.setItem("user", JSON.stringify(mapped));
    }
  };

  const signup = async (payload) => {
    await api.post(
      "/api/auth/register",
      {
        ...payload,
        gender: payload?.gender ? String(payload.gender).toUpperCase() : undefined,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Ctx.Provider value={{ user, token, login, logout, signup }}>
      {children}
    </Ctx.Provider>
  );
};
