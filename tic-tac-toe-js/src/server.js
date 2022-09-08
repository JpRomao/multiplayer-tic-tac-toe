import express from "express";
import http from "http";
import { Server as Socketio } from "socket.io";

import Game from "./entities/Game.js";

const app = express();

const server = http.Server(app);

const socket = new Socketio(server, {
  pingInterval: 60000,
});

app.use(express.static("public"));

const game = new Game();

socket.on("connection", (socket) => {
  console.log("Connected to server -> ", socket.id);

  socket.on("create-player", (data) => {
    const player = game.createPlayer(data);

    socket.emit("player-created", player);
  });

  socket.on("get-all-rooms", () => {
    const rooms = game.rooms;

    const roomsStatus = game.getRoomsStatus();

    socket.emit("all-rooms", { rooms, roomsStatus });
  });

  socket.on("create-room", (player) => {
    const room = game.createRoom(player);

    socket.emit("room-created", room);

    console.log(JSON.stringify(game.rooms));
    console.log(JSON.stringify(game.players));
  });

  socket.on("join-room", ({ player, roomId }) => {
    const room = game.joinRoom(player, roomId);

    console.log("join room", room, player);

    if (!room) {
      return;
    }

    socket.emit("room-joined", room);
  });

  socket.on("enter-room", ({ player, room }) => {
    if (!room) {
      return;
    }

    const existingRoom = game.findRoomById(room.id);

    if (!existingRoom) {
      socket.emit("room-not-found");

      return;
    }

    socket.join(existingRoom.name);

    if (!existingRoom) {
      return;
    }

    const isAtRoom = game.playerAlreadyAtRoom(player.id);

    socket.emit("entered-room", { room: existingRoom, isAtRoom });
  });

  socket.on("play", ({ room, position, player }) => {
    const newRoom = game.play({ roomId: room.id, position, player });

    if (!newRoom) {
      return;
    }

    socket.to(newRoom.name).emit("played", newRoom.board.board);
    socket.emit("played", newRoom.board.board);
  });

  socket.on("disconnect", (player) => {
    console.log("Disconnected from server -> ", player);
  });
});

server.listen(3333, () => {
  console.log("Server started on port 3333!");
});
