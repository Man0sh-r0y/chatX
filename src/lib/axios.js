import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  //baseURL: "https://chatx-f80m.onrender.com/api",
  //withCredentials: true,
});
