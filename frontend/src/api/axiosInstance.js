import axios from 'axios';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

const instance = axios.create({
  baseURL: backendUrl,
  withCredentials: true, 
});

export default instance;
