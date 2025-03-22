import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { socketURL } from "../constants/index.js";
import { baseURL } from "../constants/index.js";
import axios from "axios";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
// const BASE_URL = "https://chatx-f80m.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  token: localStorage.getItem("user-token") || null,

  checkAuth: async () => {
    try {
      const res = await axios.get(`${baseURL}/auth/check`);
  
      set({ authUser: res.data });
      get().connectSocket();
    } 
    catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } 
    finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${baseURL}/auth/signup`, data, {
        'Content-Type': 'application/json'
      });

      console.log("Response data: ", res);
      
      set({ authUser: res.data });
      toast.success("Account created successfully");

      const { token } = res?.data;

      console.log("token: ", token);
      if(token) {
        set({ token });
        localStorage.setItem("user-token", token);
      }

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {

      const res = await axios.post(`${baseURL}/auth/login`, data, {
        'Content-Type': 'application/json'
      });
      set({ authUser: res?.data });
      toast.success("Logged in successfully");

      console.log("Login Response: ", res);

      const { token } = res?.data;
      if(token) {
        set({ token });
        localStorage.setItem("user-token", token);
      }

      get().connectSocket();
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${baseURL}/auth/logout`);
      set({ authUser: null });
      toast.success("Logged out successfully");

      localStorage.removeItem("user-token");
      localStorage.removeItem("chat-theme");

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      console.log("update profile data:", data);
      //const res = await axiosInstance.put("/auth/update-profile", data);
      const res = await axios.put(`${baseURL}/auth/update-profile`, data, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error.message);
      toast.error(error?.response?.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    try {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;

      const socket = io(socketURL, {
        query: {
          userId: authUser._id,
        },
      });
      socket.connect();

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    } 
    catch (error) {
      console.log("Error in connectSocket:", error);
    }
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
