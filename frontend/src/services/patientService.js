import api from "./api";

export async function getPatients() {
  const { data } = await api.get("/api/users/patients");
  return Array.isArray(data) ? data : (data?.items || data?.data || data?.results || []);
}

export function deletePatient(id) {
  return api.delete(`/api/users/${id}`);
}

export async function getPatientById(id) {
  const { data } = await api.get(`/api/users/${id}`);
  return data;
}

export function createPatient(payload) {
  return api.post("/api/users/patients", payload, {
    headers: { "Content-Type": "application/json" },
  });
}

export function updatePatient(id, payload) {
  return api.patch(`/api/users/${id}/patient`, payload);
}
