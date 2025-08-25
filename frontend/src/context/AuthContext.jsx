import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios.jsx";
import { jwtDecode } from "jwt-decode";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  useEffect(() => {
    api.interceptors.request.use((cfg) => {
      const fullUrl = cfg.baseURL + cfg.url;
      const isAuthEndpoint =
        fullUrl.includes("/api/auth/register") ||
        fullUrl.includes("/api/auth/login");

      if (token && !isAuthEndpoint) {
        cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    });
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post(
      "/api/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    setToken(data.token);
    localStorage.setItem("token", data.token);

    const decoded = jwtDecode(data.token);
    console.log("Decoded JWT:", decoded);

    const u = {
      id: decoded.userId || decoded.id,
      role: decoded.role ? decoded.role.toUpperCase() : null,
      email: decoded.sub,
      name: decoded.name || decoded.sub.split("@")[0],
    };

    setUser(u);
    localStorage.setItem("user", JSON.stringify(u)); // ✅ FIXED
  };

  const signup = async (payload) => {
    await api.post(
      "/api/auth/register",
      {
        ...payload,
        gender: payload.gender.toUpperCase(),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
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
