// src/hooks/navbarHook.js
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";
import useI18n from "./useI18n";

const ICONS = {
  home: "\u2302",
  therapists: "\u2695",
  products: "\u{1F6D2}",
  games: "\u{1F3AE}",
  about: "\u2139"
};

export default function useNavbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const dropdownRef = useRef(null);
  const { t, i18n } = useI18n();

  const displayName =
    user?.name ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.preferred_username ||
    (user?.email ? user.email.split("@")[0] : "") ||
    t("nav.welcome");

  const displayEmail =
    user?.email || user?.userEmail || user?.username || (typeof user?.sub === "string" ? user.sub : "");

  function resolveUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const base = (api?.defaults?.baseURL || "").replace(/\/$/, "");
    return `${base}${path}`;
  }

  // Mark active link from the first path segment
  useEffect(() => {
    const seg = location.pathname.split("/")[1] || "home";
    setActiveLink(seg);
    setOpenProfile(false); // close dropdown on route change
  }, [location]);

  // Close profile when clicking outside
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

  // Use slug ids that match your Routes
  const links = useMemo(
    () => [
      { id: "home", label: t("nav.home"), icon: ICONS.home },
      { id: "therapists", label: t("nav.findTherapists"), icon: ICONS.therapists },
      { id: "Our Products", label: t("nav.products"), icon: ICONS.products },
      { id: "games", label: t("nav.games"), icon: ICONS.games },
      { id: "about", label: t("nav.about"), icon: ICONS.about }
    ],
    [t, i18n.language]
  );

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
    links
  };
}

