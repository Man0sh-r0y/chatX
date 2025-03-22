import axios from "axios";

export const axiosInstance = axios.create({
   //baseURL: process.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  //baseURL: "https://chatx-387m.onrender.com/api",
  baseURL: "http://localhost:5001/api", // for local development
  withCredentials: true,
});
