import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Create an axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
})

export default api;
