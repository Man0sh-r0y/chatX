import { Server } from "socket.io"; // Socket.IO is a JavaScript library that allows real-time, bi-directional communication between clients (like browsers) and servers.
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app); // creating an HTTP server in Node.js that uses your Express app (app) to handle incoming requests.

// creating a new Socket.IO server instance and binds it to existing HTTP server (server)
const io = new Server(server, {
  cors: {
    origin: ["https://chatappbymanash.vercel.app"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => { // it runs every time when a new user connects via Socket.IO
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id; // creating map of user IDs to their socket IDs
  // It helps you to track who is online.

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // io.emit() means broadcast to everyone.
  // Objects.keys() returns an array of userIds.

  socket.on("disconnect", () => { // It runs when that user closes the tab, loses internet, or disconnects.
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId]; // as the user is not online now
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // updating online users
  });
});

export { io, app, server };
