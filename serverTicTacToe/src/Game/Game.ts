//tic tac toe

import Player from "../Player/Player";
import Room from "../Room/Room";
import { IGame } from "./IGame";
import { getRandomInt } from "../utils/rng";
import { BoardAvailablePositions } from "../Board/IBoard";

class Game implements IGame {
  rooms: Room[];
  players: Player[];

  constructor() {
    this.rooms = [];
    this.players = [];
  }

  createRoom(player: Player): { player: Player; room: Room } | void {
    const roomId = this.generateRoomId();

    const roomName = `Room ${roomId}`;

    if (!player.id) {
      console.error("player not found");
      // throw new Error("Player name is required.");
      return;
    } else if (!roomName) {
      console.error("Room name is required.");
      // throw new Error("Room name is required.");
      return;
    } else if (!roomId) {
      console.error("create error");

      return;
      // throw new Error("Room not found.");
    }

    const roomExists = {
      byId: this.findRoomByRoomId(roomId),
      byName: this.findRoomByRoomName(roomName),
      byPlayerId: this.findRoomByPlayerId(player.id),
    };

    if (roomExists.byId) {
      console.error("Room already exists.");
      return;
      // throw new Error("You already created a room.");
    } else if (roomExists.byName) {
      console.error("Room already exists.");
      return;
      // throw new Error("Room with this name already exists.");
    } else if (roomExists.byPlayerId) {
      console.error("Room already exists.");
      return;
      // throw new Error("You already joined another room.");
    }

    const room = new Room(roomId, roomName, player);

    this.rooms.push(room);

    return {
      player,
      room,
    };
  }

  joinRoom(roomId: string, player: Player): { player: Player; room: Room } {
    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("join error");

      throw new Error("Room not found.");
    }

    room.setPlayer(player);

    room.startGame();

    console.error(`Player ${player.name} joined room ${room.name}.`);

    return {
      player,
      room,
    };
  }

  leaveRoom(roomId: string, playerId: string): void {
    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("leave error");
      throw new Error("Room not found.");
    }

    room.leaveRoom(playerId);

    const isRoomEmpty = room.roomIsEmpty();

    if (isRoomEmpty) {
      this.deleteRoom(roomId);
    }
  }

  deleteRoom(roomId: string): void {
    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("delete error");
      throw new Error("Room not found.");
    }

    this.rooms = this.rooms.filter((room) => room.id !== roomId);
  }

  findRoomByPlayerId(playerId: string) {
    if (!playerId) {
      throw new Error("Player not found.");
    }

    return this.rooms.find(
      (room) =>
        room.players["1"]?.id === playerId || room.players["2"]?.id === playerId
    );
  }

  findRoomByRoomId(roomId: string) {
    if (!roomId) {
      console.error("findByRoomId error");
      throw new Error("Room not found.");
    }

    return this.rooms.find((room) => room.id === roomId);
  }

  findRoomByRoomName(roomName: string) {
    if (!roomName) {
      console.error("findByRoomName error");
      throw new Error("Room not found.");
    }

    return this.rooms.find((room) => room.name === roomName);
  }

  generateRoomId(): string {
    const min = 1;
    const max = 99999;

    const roomId = getRandomInt(min, max).toString();

    const roomExists = this.findRoomByRoomId(roomId);

    if (roomExists) {
      return this.generateRoomId();
    }

    return roomId;
  }

  play(playerId: string, position: BoardAvailablePositions): void {
    const room = this.findRoomByPlayerId(playerId);

    if (!room) {
      console.error("findByPlayerId error");

      throw new Error("Room not found.");
    }

    if (!room.isRunning) {
      throw new Error("Game is not running.");
    }

    const isPositionAvailable = room.board.isPositionAvailable(position);

    if (!isPositionAvailable) {
      throw new Error("Position is not available.");
    }

    room.board.setBoardPosition(position, room.playerTurn);

    room.passTurn();
  }
}

export default new Game();
