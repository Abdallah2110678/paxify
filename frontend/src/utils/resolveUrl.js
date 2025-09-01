import api from "../services/api";

// If backend returns a relative path, prefix with api baseURL. If it's already absolute, keep as-is.
export default function resolveUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (api?.defaults?.baseURL || "").replace(/\/$/, "");
  return `${base}${path}`;
}
