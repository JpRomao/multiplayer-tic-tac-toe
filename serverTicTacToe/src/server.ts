import "dotenv/config";

import express from "express";
import { Server as socketio } from "socket.io";
import cors from "cors";

import game from "./Game/Game";
import routes from "./routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

const sockets = new socketio(Number(process.env.websocket_port), {
  cors: {
    origin: process.env.frontend_url,
  },
});

sockets.on("connection", (socket) => {
  console.error("New connection", socket.id);

  const { roomId } = socket.handshake.query;

  socket.join(`room-${roomId}`);

  console.log(`Player [${socket.id}] joined room [room-${roomId}]`);

  const roomName = `room-${roomId}`;

  socket.on("leave-game", (roomId: string, playerId: string) => {
    game.leaveRoom(roomId, playerId);

    socket.leave(roomId);

    socket.in(roomName).emit("game-left", { roomId, playerId });
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
    } else if (!position) {
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

    socket.in(roomName).emit("played", { board, playerTurn, turn });
  });

  socket.on("disconnect", (roomId: string) => {
    console.log("disconnected", socket.id);

    const room = game.findRoomByRoomId(roomId);

    if (!room) {
      console.error("room not found");

      return;
      // throw new Error("Room not found.");
    }

    if (room.players["1"]?.id === roomId) {
      game.leaveRoom(room.id, room.players[1].id);

      console.log(`User ${room.players["1"]?.name} disconnected`);

      return;
    } else if (room.players["2"]?.id === roomId) {
      game.leaveRoom(room.id, room.players[2].id);

      console.log(`User ${room.players["2"]?.name} disconnected`);

      return;
    }
  });

  socket.on("error", (err) => {
    console.error(err);

    return;
  });
});

app.listen(process.env.server_port, () => {
  console.error(`Server listening on port 3333 and sockets on port 3334! 🚀`);
});
