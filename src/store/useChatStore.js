import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";
import { baseURL } from "../constants";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    const token = useAuthStore.getState().token;

    try {
      const res = await axios.get(`${baseURL}/messages/users`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      
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

      const token = useAuthStore.getState().token;
     
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

      const token = useAuthStore.getState().token;

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
