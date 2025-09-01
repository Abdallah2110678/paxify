import api from "./api";

export async function getDoctors() {
  const { data } = await api.get("/api/users/doctors");
  return Array.isArray(data) ? data : (data?.items || data?.data || data?.results || []);
}

export async function deleteDoctor(id) {
  return api.delete(`/api/users/${id}`);
}

export function createDoctor(payload) {
  return api.post("/api/users/doctors", payload);
}

export async function getDoctorById(id) {
  const { data } = await api.get(`/api/users/${id}`);
  return data;
}

export function updateDoctor(id, payload) {
  if (typeof FormData !== "undefined" && payload instanceof FormData) {
    return api.patch(`/api/users/${id}/doctor`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.patch(`/api/users/${id}/doctor`, payload);
}

export function registerDoctor(formData) {
  return api.post("/api/auth/register-doctor", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
