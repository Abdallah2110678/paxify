import api from "./api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET /api/users/admins  -> adjust if your backend uses a different path
export async function getAdmins() {
  const { data } = await api.get("/api/users/admins", {
    headers: { ...authHeaders() },
  });
  // support multiple backend list shapes
  return Array.isArray(data)
    ? data
    : data?.items || data?.data || data?.results || [];
}

// Optional: DELETE admin
export function deleteAdmin(id) {
  return api.delete(`/api/users/${id}`, {
    headers: { ...authHeaders() },
  });
}
