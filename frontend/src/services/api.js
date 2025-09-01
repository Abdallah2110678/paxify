import axios from "axios";

// Central axios instance for the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

export default api;
