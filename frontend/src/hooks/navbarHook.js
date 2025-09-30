import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

export default function useNavbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const dropdownRef = useRef(null);

  const displayName =
    user?.name ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.preferred_username ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "User";

  const displayEmail =
    user?.email || user?.userEmail || user?.username || (typeof user?.sub === "string" ? user.sub : "");

  // Moved from utils/resolveUrl.js
  function resolveUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const base = (api?.defaults?.baseURL || "").replace(/\/$/, "");
    return `${base}${path}`;
  }

  useEffect(() => {
    const currentPath = location.pathname.replace("/", "") || "home";
    setActiveLink(currentPath);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
    setMobileMenuOpen(false);
    navigate(linkId === "home" ? "/" : `/${linkId}`);
  };

  const goMyDashboard = () => {
    if (!user) return;
    if (user.role === "ADMIN") navigate("/dashboard");
    else if (user.role === "DOCTOR") navigate("/doctor-dashboard");
    else if (user.role === "PATIENT") navigate("/patient-dashboard");
    else navigate("/");
    setOpenProfile(false);
  };

  const links = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "therapists", label: "Find Therapists", icon: "👨‍⚕️" },
    { id: "Our Products", label: "Our Products", icon: "🛒" },
    { id: "games", label: "Games", icon: "🎮" },
    { id: "about", label: "About", icon: "ℹ️" },
  ];

  return {
    // state
    activeLink,
    isMobileMenuOpen,
    openProfile,
    setOpenProfile,
    setMobileMenuOpen,

    // refs
    dropdownRef,

    // auth
    user,
    logout,

    // derived
    displayName,
    displayEmail,
    resolveUrl,

    // handlers
    handleLinkClick,
    goMyDashboard,
    links,
  };
}
