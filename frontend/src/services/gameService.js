import api from "./api";

function withAuth() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPublicGames() {
  const { data } = await api.get("/api/games");
  return Array.isArray(data) ? data : [];
}

export async function getAllGames() {
  const { data } = await api.get("/api/games/all", {
    headers: { ...withAuth() },
  });
  return Array.isArray(data) ? data : [];
}

export async function getGame(id) {
  const { data } = await api.get(`/api/games/${id}`, {
    headers: { ...withAuth() },
  });
  return data;
}

export async function createGame(payload) {
  const { data } = await api.post("/api/games", payload, {
    headers: { "Content-Type": "application/json", ...withAuth() },
  });
  return data;
}

export async function updateGame(id, payload) {
  const { data } = await api.put(`/api/games/${id}`, payload, {
    headers: { "Content-Type": "application/json", ...withAuth() },
  });
  return data;
}

export function deleteGame(id) {
  return api.delete(`/api/games/${id}`, {
    headers: { ...withAuth() },
  });
}

export function uploadGameImage(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/api/games/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data", ...withAuth() },
  });
}

export function uploadGameVideo(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/api/games/${id}/video`, formData, {
    headers: { "Content-Type": "multipart/form-data", ...withAuth() },
  });
}
