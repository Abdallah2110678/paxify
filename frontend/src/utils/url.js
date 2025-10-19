import api from "../services/api.js";

export function resolveUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (api?.defaults?.baseURL || "").replace(/\/$/, "");
  return `${base}${path}`;
}