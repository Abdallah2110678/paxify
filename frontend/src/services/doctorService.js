import api from "./api";

export async function getDoctors() {
  const { data } = await api.get("/api/users/doctors");
  return Array.isArray(data) ? data : (data?.items || data?.data || data?.results || []);
}

// Public, unauthenticated list for Find Therapists page
export async function getPublicDoctors() {
  const { data } = await api.get("/api/public/doctors");
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

// Public, unauthenticated doctor profile with average rating and reviews count
export async function getPublicDoctorProfile(id) {
  const { data } = await api.get(`/api/public/doctors/${id}/profile`);
  return data;
}

export async function getDoctorReviews(id) {
  const { data } = await api.get(`/api/public/doctors/${id}/reviews`);
  return Array.isArray(data) ? data : (data?.items || data?.data || []);
}

export function submitDoctorReview({ doctorId, rating, comment }) {
  return api.post(`/api/reviews`, { doctorId, rating, comment });
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
