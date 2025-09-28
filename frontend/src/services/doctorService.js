import api from "./api";

export async function getDoctors() {
  const { data } = await api.get("/api/users/doctors");
  return Array.isArray(data)
    ? data
    : data?.items || data?.data || data?.results || [];
}

// Public, unauthenticated list for Find Therapists page
export async function getPublicDoctors() {
  const { data } = await api.get("/api/public/doctors");
  return Array.isArray(data)
    ? data
    : data?.items || data?.data || data?.results || [];
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
export async function adminListDoctors(status) {
  const { data } = await api.get("/api/admin/doctors", {
    params: status ? { status } : {},
  });
  return data; // array of safe doctor objects from AdminController
}

export async function adminApproveDoctor(id) {
  const { data } = await api.post(`/api/admin/doctors/${id}/approve`);
  return data; // "Doctor approved."
}

export async function adminRejectDoctor(id, reason) {
  const { data } = await api.post(`/api/admin/doctors/${id}/reject`, {
    reason,
  });
  return data; // "Doctor rejected."
}
// Public, unauthenticated doctor profile with average rating and reviews count
export async function getPublicDoctorProfile(id) {
  const { data } = await api.get(`/api/public/doctors/${id}/profile`);
  return data;
}

export async function getDoctorReviews(id) {
  const { data } = await api.get(`/api/public/doctors/${id}/reviews`);
  return Array.isArray(data) ? data : data?.items || data?.data || [];
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

export async function registerDoctor(formData) {
  const { data } = await api.post("/api/auth/register-doctor", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
export async function adminGetDoctor(id) {
  const { data } = await api.get(`/api/admin/doctors/${id}`);
  return data;
}

// Update review/notes (and optionally rate)
export async function adminUpdateDoctorReview(id, { adminNotes, rate }) {
  const payload = {};
  if (adminNotes !== undefined) payload.adminNotes = adminNotes;
  if (rate !== undefined && rate !== null && String(rate).length > 0)
    payload.rate = rate;
  const { data } = await api.patch(`/api/admin/doctors/${id}/review`, payload);
  return data;
}

export async function adminUploadDoctorProfilePicture(id, file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post(`/api/users/${id}/profile-picture`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // returns updated UserResponse (with profilePictureUrl)
}
