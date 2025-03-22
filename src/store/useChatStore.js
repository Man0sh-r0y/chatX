import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";

const baseURL = "https://chatx-f80m.onrender.com/api";

const token = useAuthStore.getState().token;

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    if(token) console.log("token found while fetching user details (in frontend): ", token);
    else console.log("No token found while fetching user details (in frontend)");

    try {
      // const res = await axiosInstance.get("/messages/users");
      const res = await axios.get(`${baseURL}/messages/users`, {
        headers: { Authorization: `Bearer ${token}`}
      })

      console.log("Token: ", token);

      console.log("Get Users response: ", res);
      
      if(res?.data) {
        set({ users: res.data });
      }

    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      //const res = await axiosInstance.get(`/messages/${userId}`);
      const res = await axios.get(`${baseURL}/messages/${userId}`,{
        headers: { Authorization: `Bearer ${token}`}
      });
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      // const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      const res = await axios.post(`${baseURL}/messages/send/${selectedUser._id}`, messageData, {
        headers: { Authorization: `Bearer ${token}`},
        'Content-Type': 'application/json'
      });

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
