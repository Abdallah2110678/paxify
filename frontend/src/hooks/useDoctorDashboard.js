import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useDoctorDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const goHome = useCallback(() => navigate("/"), [navigate]);

  const buttons = [
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "add-appointment", label: "Add Appointment", icon: "➕" },
  ];

  return { active, setActive, isSidebarOpen, toggleSidebar, goHome, buttons };
}
