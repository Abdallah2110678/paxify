import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useDashboard() {
  const [active, setActive] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = useCallback(() => setSidebarOpen((s) => !s), []);
  const goHome = useCallback(() => navigate("/"), [navigate]);

  const buttons = useMemo(() => (
    [
      { id: "admin", label: "Admin", icon: "🛡️" },
      { id: "doctor", label: "Doctor", icon: "🩺" },
      { id: "add-doctor", label: "Add Doctor", icon: "➕" },
      { id: "patient", label: "Patient", icon: "👤" },
      { id: "add-patient", label: "Add Patient", icon: "➕" },
      { id: "product", label: "Products", icon: "💊" },
      { id: "add-product", label: "Add Product", icon: "➕" },
    ]
  ), []);

  return { active, setActive, isSidebarOpen, toggleSidebar, goHome, buttons };
}
