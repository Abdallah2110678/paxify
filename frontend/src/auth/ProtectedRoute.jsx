import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Accepts either `roles` (array or string) or `role` (single string)
const ProtectedRoute = ({ children, roles, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Normalize expected roles
  const expected = Array.isArray(roles)
    ? roles
    : roles
    ? [roles]
    : role
    ? [role]
    : [];

  if (expected.length > 0) {
    const ok = expected.map((r) => String(r).toUpperCase()).includes(String(user.role || "").toUpperCase());
    if (!ok) return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
