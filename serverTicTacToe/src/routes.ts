import { Router } from "express";

import game from "./Game/Game";
import Player from "./Player/Player";

const routes = Router();

routes.get("/rooms", (request, response) => {
  try {
    return response.json({ rooms: game.rooms });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(500).json({ error: message });
  }
});

routes.get("/rooms/:roomId", (request, response) => {
  try {
    const { roomId } = request.params;

    const room = game.findRoomByRoomId(roomId);

    if (!room) {
      return response.status(404).json({ error: "Room not found." });
    }

    return response.status(200).json({ room });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(500).json({ error: message });
  }
});

routes.post("/create/player", (request, response) => {
  try {
    const { name, id } = request.body;

    if (id) {
      const existingPlayer = game.findPlayerByPlayerId(id);

      if (existingPlayer) {
        return response.status(200).json({ player: existingPlayer });
      }
    }

    if (!name) {
      return response.status(400).json({ error: "Player name not passed." });
    }

    const player = new Player(name);

    game.players.push(player);

    return response.status(201).json({ player });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(400).json({ message });
  }
});

routes.get("/players/:id", (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({ error: "Player id not passed." });
    }

    const player = game.findPlayerByPlayerId(id);

    if (!player) {
      return response.status(404).json({ error: "Player not found." });
    }

    return response.status(200).json({ player });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;

    return response.status(400).json({ message });
  }
});

export default routes;
