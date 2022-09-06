import { Router } from "express";

import game from "./Game/Game";
import Player from "./Player/Player";

const routes = Router();

routes.get("/rooms", (request, response) => {
  console.log(game.rooms);
  try {
    return response.json(game.rooms);
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(500).json({ error: message });
  }
});

routes.post("/rooms/:roomId/join", (request, response) => {
  try {
    const { roomId } = request.params;
    const { player } = request.body;

    console.log("player > ", player);

    if (!roomId) {
      console.error("no room id");

      return response
        .status(400)
        .json({ error: "RoomId not passed correctly." });
    }

    const room = game.findRoomByRoomId(roomId);

    if (!room || !room.id) {
      return response.status(404).json({ error: "Room not found." });
    }

    const verifyPlayerAlreadyAtRoom = game.verifyPlayerAlreadyAtRoom(
      roomId,
      player
    );

    if (verifyPlayerAlreadyAtRoom) {
      return response.status(200).json(verifyPlayerAlreadyAtRoom);
    }

    const joinedRoom = game.joinRoom(roomId, player);

    if (!joinedRoom || !joinedRoom.room) {
      return response.status(400).json({ message: "Room is full." });
    }

    return response
      .status(201)
      .json({ room: joinedRoom.room, player: joinedRoom.player });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(500).json({ error: message });
  }
});

routes.post("/rooms/create", (request, response) => {
  try {
    const room = game.createRoom();

    if (!room || !room.id) {
      return response.status(400).json({ error: "Room not found." });
    }

    return response.status(201).json(room);
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(500).json({ error: message });
  }
});

routes.post("/create/player", (request, response) => {
  try {
    const { playerName } = request.body;

    const player = new Player(playerName);

    game.players.push(player);

    return response.status(200).json(player);
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(400).json({ message });
  }
});

export default routes;
