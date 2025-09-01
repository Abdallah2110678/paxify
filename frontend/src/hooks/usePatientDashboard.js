import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function usePatientDashboard() {
  const [active, setActive] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = useCallback(() => setSidebarOpen((s) => !s), []);
  const goHome = useCallback(() => navigate("/"), [navigate]);

  const buttons = useMemo(() => (
    [
      { id: "upcoming", label: "Upcoming Appointments", icon: "📅" },
      { id: "comments", label: "Doctor's Comments", icon: "💬" },
    ]
  ), []);

  return { active, setActive, isSidebarOpen, toggleSidebar, goHome, buttons };
}
