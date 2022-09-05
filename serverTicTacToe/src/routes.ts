import { Router } from "express";

import game from "./Game/Game";
import Player from "./Player/Player";

const routes = Router();

routes.get("/rooms", (request, response) => {
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

    const room = game.findRoomByRoomId(roomId);

    if (!room) {
      return response.status(404).json({ error: "Room not found." });
    }

    if (room?.isRunning) {
      return response.status(400).json({ message: "Room is running." });
    }

    const { player: returnedPlayer, room: roomReturned } = game.joinRoom(
      roomId,
      player
    );

    return response
      .status(200)
      .json({ player: returnedPlayer, room: roomReturned });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(500).json({ error: message });
  }
});

routes.post("/rooms", (request, response) => {
  try {
    const { player } = request.body;

    const room = game.createRoom(player);

    return response.json(room);
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
