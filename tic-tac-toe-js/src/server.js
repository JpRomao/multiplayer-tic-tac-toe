import express from "express";
import http from "http";
import io from "socket.io";

const app = express();
const server = http.Server(app);
const socket = io(server);

socket.on("connection", (socket) => {
  console.log("Client connected -> ", socket.id);

  socket.on("join-room", (data) => {
    console.log(data);

    socket.join(data.roomId);

    const room = {
      id: 1,
    };

    socket.in(data.roomId).emit("join-room", room);
  });
});

server.listen(3333, () => {
  console.log("Server started on port 3333!");
});
