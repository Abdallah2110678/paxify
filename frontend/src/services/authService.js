import api from "./api";

export async function login(email, password) {
  const { data } = await api.post(
    "/api/auth/login",
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  return data; // expects { token }
}

export async function signup(payload) {
  return api.post(
    "/api/auth/register",
    {
      ...payload,
      gender: payload?.gender ? String(payload.gender).toUpperCase() : undefined,
    },
    { headers: { "Content-Type": "application/json" } }
  );
}
