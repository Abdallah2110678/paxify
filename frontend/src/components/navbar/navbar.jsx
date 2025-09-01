import { Link } from "react-router-dom";
import useNavbar from "../../hooks/navbarHook.js";
import resolveUrl from "../../utils/resolveUrl";

/*
Palette
- Primary turquoise: #4CB5AB
- Secondary surface (beige): #F4EDE4
- CTA accents: #E68A6C (coral), #D4A44A (gold)
- Text: charcoal #2B2B2B, warm gray #6B6B6B
*/

const Navbar = () => {
  const {
    activeLink,
    isMobileMenuOpen,
    openProfile,
    setOpenProfile,
    setMobileMenuOpen,
    dropdownRef,
    user,
    logout,
    displayName,
    displayEmail,
    handleLinkClick,
    goMyDashboard,
    links,
  } = useNavbar();

  return (
    <nav
      className="
    fixed -top-[1px] left-0 right-0 z-50
    bg-[#4CB5AB]
    border-b border-white/20 -mb-[1px] transform-gpu shadow-lg
  "
      aria-label="Primary"
    >
      <div className="container mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => handleLinkClick("home")}
          className="flex items-center cursor-pointer select-none"
        >
          <img src="/logo.png" alt="Paxify logo" className="w-10 h-10 mr-2 rounded" />
          <span className="font-bold text-xl tracking-wide text-white">Paxify</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`px-3 py-2 rounded-full transition-colors border
                ${activeLink === link.id
                  ? "bg-white text-[#4CB5AB] border-white shadow-md"
                  : "text-white hover:text-white bg-transparent border-transparent hover:bg-white/20"
                }`}
            >
              <span className="mr-1" aria-hidden>{link.icon}</span>
              {link.label}
            </button>
          ))}

          {user && (
            <button
              onClick={goMyDashboard}
              className={`px-3 py-2 rounded-full transition-colors border ${activeLink.includes("dashboard")
                ? "bg-white text-[#4CB5AB] border-white shadow-md"
                : "text-white hover:text-white bg-transparent border-transparent hover:bg-white/20"
                }`}
            >
              📊 Dashboard
            </button>
          )}

          {!user && (
            <button
              onClick={() => handleLinkClick("doctor-register")}
              className="ml-3 px-4 py-2 rounded-full bg-[#E68A6C] text-white hover:bg-[#d97a5f] shadow"
            >
              Join Our Team
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button
            className="relative p-2 text-white hover:text-[#F4EDE4] transition-colors"
            aria-label="Notifications"
          >
            <span className="text-xl" aria-hidden>🔔</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4A44A] rounded-full ring-2 ring-white" />
          </button>

          <button
            onClick={() => setOpenProfile((v) => !v)}
            className="w-10 h-10 bg-white/25 hover:bg-white/35 rounded-full text-white transition-colors overflow-hidden"
            title="Profile"
            aria-haspopup="menu"
            aria-expanded={openProfile}
          >
            {user?.profilePictureUrl ? (
              <img
                src={resolveUrl(user.profilePictureUrl)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span aria-hidden>👤</span>
            )}
          </button>

          {/* Profile dropdown */}
          {openProfile && (
            <div className="absolute right-0 top-full mt-3 w-72 z-[60]">
              {/* caret */}
              <span className="absolute right-6 -top-2 h-4 w-4 rotate-45 bg-white shadow ring-1 ring-black/5" />
              <div className="bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden max-h-[70vh]">
                {/* Header */}
                <div className="px-4 py-3 border-b border-[#F4EDE4] bg-[#F9F6F1]">
                  {user ? (
                    <>
                      <p className="text-sm font-semibold text-[#2B2B2B]">{displayName}</p>
                      {displayEmail && (
                        <p className="text-xs text-[#6B6B6B] truncate">{displayEmail}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-[#2B2B2B]">Welcome</p>
                  )}
                </div>

                {/* Body */}
                <div className="py-1 text-[#2B2B2B]">
                  {user ? (
                    <>
                      <button
                        onClick={goMyDashboard}
                        className="w-full text-left px-4 py-2 hover:bg-[#F4EDE4]"
                        role="menuitem"
                      >
                        My Dashboard
                      </button>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-[#F4EDE4]"
                        role="menuitem"
                      >
                        Profile
                      </Link>
                      <div className="h-px bg-[#F4EDE4] my-1" />
                      <button
                        onClick={() => {
                          logout();
                          handleLinkClick("home");
                        }}
                        className="w-full text-left px-4 py-2 text-[#E68A6C] hover:bg-[#FCEBE6]"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 hover:bg-[#F4EDE4]"
                        role="menuitem"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 hover:bg-[#F4EDE4]"
                        role="menuitem"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu trigger */}
      <div className="md:hidden container mx-auto px-6 pb-4">
        <button
          className="text-white hover:text-[#F4EDE4]"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          ☰
        </button>
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="mt-3 bg-white/95 backdrop-blur rounded-xl p-2 ring-1 ring-white/30 shadow-lg">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`block w-full text-left px-3 py-2 rounded-full mb-1 ${activeLink === link.id
                  ? "bg-[#4CB5AB] text-white"
                  : "text-[#2B2B2B] hover:bg-[#F4EDE4]"
                  }`}
              >
                <span className="mr-1" aria-hidden>{link.icon}</span>
                {link.label}
              </button>
            ))}
            {!user ? (
              <button
                onClick={() => handleLinkClick("doctor-register")}
                className="block w-full text-left px-3 py-2 rounded-full text-white bg-[#E68A6C] hover:bg-[#d97a5f]"
              >
                Join Our Team
              </button>
            ) : (
              <button
                onClick={goMyDashboard}
                className="block w-full text-left px-3 py-2 rounded-full text-white bg-[#4CB5AB] hover:bg-[#43a79e]"
              >
                📊 Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;