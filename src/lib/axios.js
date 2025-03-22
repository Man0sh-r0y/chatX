import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const token = useAuthStore.getState().token;

export const axiosInstance = axios.create({
  // baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  baseURL: "https://chatx-f80m.onrender.com/api",
  withCredentials: true,
  headers: token ? {Authorization: `Bearer ${token}`} : null
});
