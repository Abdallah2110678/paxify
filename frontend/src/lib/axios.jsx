import axios from "axios";

// use Vite env variable, fallback to localhost:8080
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ,
});

console.log("Axios baseURL:", api.defaults.baseURL);

export default api;
