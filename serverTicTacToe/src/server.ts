import express from "express";
import { Server as socketio } from "socket.io";
import cors from "cors";

import game from "./Game/Game";
import routes from "./routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

const sockets = new socketio(3334, {
  cors: {
    origin: "http://localhost:3000",
  },
});

sockets.on("connection", (socket) => {
  console.error("New connection", socket.id);

  socket.on("leave-room", (roomId: string, playerId: string) => {
    game.leaveRoom(roomId, playerId);

    socket.leave(roomId);

    socket.emit("room-left", { roomId, playerId });
  });

  socket.on("play", ({ playerId, position, roomId }) => {
    console.error(roomId);

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

    socket.emit("played", { board, playerTurn, turn });
  });

  socket.on("disconnect", (roomId: string) => {
    const room = game.findRoomByRoomId(roomId);

    if (!room) {
      console.error("room not found");

      return;
      // throw new Error("Room not found.");
    }

    if (room.players["1"]?.id === roomId) {
      game.leaveRoom(roomId, room.players[1].id);

      console.error(`User ${room.players["1"]?.name} disconnected`);
    } else if (room.players["2"]?.id === roomId) {
      game.leaveRoom(roomId, room.players[2].id);

      console.error(`User ${room.players["2"]?.name} disconnected`);
    }
  });

  socket.on("error", (err) => {
    console.error(err);
  });
});

app.listen(3333, () => {
  console.error(`Server listening on port 3333 and sockets on port 3334! 🚀`);
});
