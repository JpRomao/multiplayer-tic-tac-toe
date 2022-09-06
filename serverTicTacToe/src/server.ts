import "dotenv/config";

import express from "express";
import { Server as socketio } from "socket.io";
import cors from "cors";

import game from "./Game/Game";
import routes from "./routes";
import Player from "./Player/Player";

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

const sockets = new socketio(Number(process.env.websocket_port) || 3334, {
  cors: {
    origin: process.env.frontend_url,
  },
  pingTimeout: 60000,
  transports: ["websocket"],
});

console.log(sockets.listeners("connection"));

sockets.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

sockets.on("connection", (socket) => {
  console.error("New connection", socket.id);

  let roomName: string;

  socket.on("join-room", (roomId: string, player: Player) => {
    roomName = `room-${roomId}`;
    console.log("roomName -> ", roomName);

    socket.join(roomName);

    console.log(`Player [${socket.id}] joined [${roomName}]`);

    const response = game.joinRoom(roomId, player);

    socket.to(roomName).emit("room-joined", response);
  });

  socket.on("play", ({ playerId, position, roomId }) => {
    console.log("play", playerId, position, roomId);

    if (!roomId) {
      console.error("no room id");

      return;
      // throw new Error("RoomId not found.");
    } else if (!playerId) {
      console.error("no player id");

      return;
      // throw new Error("Player not found.");
    } else if (position < 0 || position > 8) {
      console.error("no position");

      return;
      // throw new Error("Position not found.");
    }

    game.play(playerId, position);

    const room = game.findRoomByRoomId(roomId);

    if (!room) {
      console.error("room not found");

      return;
      // throw new Error("Room not found.");
    }

    const { board, playerTurn, turn } = room;

    console.log("Emiting played to ", roomName);

    socket.in(roomName).emit("played", { board, playerTurn, turn });
  });

  // socket.on("disconnect", (roomId: string) => {
  //   console.log("disconnected", socket.id);

  //   const room = game.findRoomByRoomId(roomId);

  //   if (!room) {
  //     console.error("room not found");

  //     return;
  //     // throw new Error("Room not found.");
  //   }

  //   if (room.players["1"]?.id === roomId) {
  //     game.leaveRoom(room.id, room.players[1].id);

  //     console.log(`User ${room.players["1"]?.name} disconnected`);
  //   } else if (room.players["2"]?.id === roomId) {
  //     game.leaveRoom(room.id, room.players[2].id);

  //     console.log(`User ${room.players["2"]?.name} disconnected`);
  //   }
  // });

  socket.on("error", (err) => {
    console.error("error -> ", err);

    return;
  });
});

app.listen(process.env.server_port || 3333, () => {
  console.error(
    `Server listening on port ${process.env.server_port} and sockets on port ${process.env.websocket_port}! 🚀`
  );
});
