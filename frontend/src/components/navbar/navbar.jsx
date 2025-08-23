import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "frontend/src/context/AuthContext.jsx";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const dropdownRef = useRef(null);

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
    { id: "book", label: "Book Session", icon: "📅" },
    { id: "therapists", label: "Find Therapists", icon: "👨‍⚕️" },
    { id: "games", label: "Games", icon: "🎮" },
    { id: "about", label: "About", icon: "ℹ️" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center text-white cursor-pointer select-none"
        >
          <img src="/logo.png" alt="Logo" className="w-9 h-9 mr-2" />
          <span className="font-bold text-xl tracking-wide">Paxify</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`px-3 py-2 rounded transition-colors
                ${
                  activeLink === link.id
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
            >
              <span className="mr-1">{link.icon}</span>{link.label}
            </button>
          ))}

          {user && (
            <button
              onClick={goMyDashboard}
              className={`px-3 py-2 rounded transition-colors
                ${
                  activeLink.includes("dashboard")
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
            >
              📊 Dashboard
            </button>
          )}

          {!user && (
            <button
              onClick={() => navigate("/doctor-login")}
              className="ml-3 px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
            >
              | Signin For Doctors |
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button className="relative p-2 text-white hover:text-blue-200 transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-blue-700" />
          </button>

          <button
            onClick={() => setOpenProfile((v) => !v)}
            className="w-10 h-10 bg-white/20 hover:bg-white/25 rounded-full text-white transition-colors"
            title="Profile"
          >
            👤
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl text-gray-800 overflow-hidden">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={goMyDashboard}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Dashboard
                  </button>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                    Login
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu trigger */}
      <div className="md:hidden container mx-auto px-6 pb-3">
        <button
          className="text-white/90 hover:text-white"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          ☰
        </button>
        {isMobileMenuOpen && (
          <div className="mt-3 bg-white/10 backdrop-blur rounded-xl p-2">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`block w-full text-left px-3 py-2 rounded
                  ${activeLink === link.id ? "bg-white/20 text-white" : "text-blue-100 hover:text-white hover:bg-white/10"}`}
              >
                <span className="mr-1">{link.icon}</span>{link.label}
              </button>
            ))}
            {user ? (
              <button
                onClick={goMyDashboard}
                className="block w-full text-left px-3 py-2 rounded text-blue-100 hover:text-white hover:bg-white/10"
              >
                📊 Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/doctor-login")}
                className="block w-full text-left px-3 py-2 rounded text-blue-100 hover:text-white hover:bg-white/10"
              >
                | Signin For Doctors |
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
