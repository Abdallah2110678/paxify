// PatientDashboard.jsx
import { useMemo } from "react";
import usePatient from "../../hooks/patientHook";
import useI18n from "../../hooks/useI18n";
import PatientUpcomingAppointments from "./PatientUpcomingAppointments";
import PatientDoctorComments from "./PatientDoctorComments";
import {
  FiHome,
  FiCalendar,
  FiMessageCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const PatientDashboard = () => {
  const { dashboard } = usePatient();
  const { t, i18n } = useI18n();
  const { active, setActive, isSidebarOpen, toggleSidebar, goHome } = dashboard;

  const buttons = useMemo(
    () => [
      {
        id: "upcoming",
        label: t("doctor.overview.upcoming", "Upcoming Appointments"),
        icon: <FiCalendar />,
      },
      {
        id: "comments",
        label: t("patientDashboard.doctorComments", "Doctor's Comments"),
        icon: <FiMessageCircle />,
      },
    ],
    [t]
  );

  const isRtl = (typeof document !== "undefined" && document?.documentElement?.getAttribute("dir") === "rtl")
    || (typeof i18n?.dir === "function" && i18n.dir() === "rtl");
  const sidebarSideClass = isRtl ? "right-0" : "left-0";
  const toggleSideClass = isRtl ? "-left-3" : "-right-3";
  const mainShiftClass = isRtl
    ? (isSidebarOpen ? "mr-56" : "mr-20")
    : (isSidebarOpen ? "ml-56" : "ml-20");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${sidebarSideClass} h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-56" : "w-20"
        } bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 shadow-xl flex flex-col items-center py-8 z-40`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute ${toggleSideClass} top-9 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200`}
          aria-label={t("actions.toggleMenu", "Toggle menu")}
        >
          {isSidebarOpen
            ? (isRtl ? <FiChevronRight /> : <FiChevronLeft />)
            : (isRtl ? <FiChevronLeft /> : <FiChevronRight />)}
        </button>

        {/* Logo */}
        <div
          onClick={() => setActive("overview")}
          className={`mb-12 flex flex-col items-center cursor-pointer ${
            isSidebarOpen ? "" : "scale-90"
          } hover:opacity-80 transition-opacity duration-200`}
        >
          <div className="relative mb-2">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <img src="/logo.png" alt="Paxify Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          {isSidebarOpen && (
            <>
              <span className="text-xl font-bold text-white tracking-wide">{t("appName", "Paxify")}</span>
              <span className="text-xs text-green-200 opacity-80">{t("patientDashboard.patientPanel", "Patient Panel")}</span>
            </>
          )}
        </div>

        {/* Sidebar Buttons */}
        <div className="flex flex-col gap-4 w-full px-4 flex-1">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActive(btn.id)}
              className={`group flex items-center space-x-3 px-5 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left ${
                active === btn.id
                  ? "bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm"
                  : "text-green-100 hover:text-white hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                {btn.icon}
              </span>
              {isSidebarOpen && (
                <>
                  <span className="text-base">{btn.label}</span>
                  {active === btn.id && (
                    <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Home Button */}
        <div className="w-full px-4 pb-4">
          <button
            onClick={goHome}
            className="group flex items-center space-x-3 px-5 py-3 rounded-lg font-medium transition-colors duration-300 w-full text-left text-green-100 hover:text-white hover:bg-white hover:bg-opacity-10"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300"><FiHome /></span>
            {isSidebarOpen && <span className="text-base">{t("nav.home", "Home")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 ${mainShiftClass} transition-all duration-300 px-6 py-8`}
      >
        {active === "overview" && (
          <div className="text-lg text-gray-700">{t("patientDashboard.welcome", "Welcome to your dashboard!")}</div>
        )}
        {active === "upcoming" && <PatientUpcomingAppointments />}
        {active === "comments" && <PatientDoctorComments />}
      </main>
    </div>
  );
};

export default PatientDashboard;
