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
});

sockets.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

sockets.on("connection", (socket) => {
  console.error("New connection", socket.id);

  socket.on("room-create", (player) => {
    const room = game.createRoom(player);

    socket.emit("room-created", room);
  });

  socket.on("room-join", (roomId: string, player: Player) => {
    if (!player.id) {
      return;
    }

    const room = game.joinRoom(roomId, player);

    if (!room) {
      return;
    }

    socket.join(room.name);

    socket.to(room.name).emit("room-joined", { room });
    socket.emit("room-joined", {
      room,
    });
  });

  socket.on("play", ({ playerId, position, roomId }) => {
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

    const room = game.play(playerId, position);

    if (!room) {
      console.error("room not found");

      return;
      // throw new Error("Room not found.");
    }

    console.log("Emiting played to ", room.name);

    socket.to(room.name).emit("played", room);
    socket.emit("played", room);
  });

  socket.on("error", (err) => {
    console.error("error -> ", err);
  });
});

app.listen(process.env.server_port || 3333, () => {
  console.error(
    `Server listening on port ${process.env.server_port} and sockets on port ${process.env.websocket_port}! 🚀`
  );
});
