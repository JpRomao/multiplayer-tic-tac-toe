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

  createRoom(): Room | void {
    const roomId = this.generateRoomId();

    const roomName = `Room ${roomId}`;

    if (!roomName) {
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
    };

    if (roomExists.byId) {
      console.error("Room already exists.");

      return;
      // throw new Error("You already created a room.");
    } else if (roomExists.byName) {
      console.error("Room already exists.");

      return;
      // throw new Error("Room with this name already exists.");
    }

    const room = new Room(roomId, roomName);

    this.rooms.push(room);

    return room;
  }

  joinRoom(
    roomId: string,
    player: Player
  ): { player: Player; room: Room } | void {
    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("join error");

      // throw new Error("Room not found.");
      return;
    }

    player.playTurn = 0;

    player = room.setPlayer(player) || player;

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
      // throw new Error("Room not found.");
      return;
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
      // throw new Error("Room not found.");
      return;
    }

    this.rooms = this.rooms.filter((room) => room.id !== roomId);
  }

  findRoomByPlayerId(playerId: string) {
    if (!playerId) {
      console.error("findByPlayerId error");
      console.error("player not found error");
      // throw new Error("Player not found.");
      return;
    }

    return this.rooms.find(
      (room) =>
        room.players["1"]?.id === playerId || room.players["2"]?.id === playerId
    );
  }

  verifyPlayerAlreadyAtRoom(
    roomId: string,
    player: Player
  ): { player: Player; room: Room } | void {
    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("Room not found error");

      return;
    }

    if (!room.players["1"]) {
      return;
    } else if (player.id === room.players["1"].id) {
      console.error("Player 1 already at room error");

      // room.players["1"].playTurn = 0;

      return {
        player: room.players["1"],
        room,
      };
    }

    if (!room.players["2"]) {
      return;
    } else if (player.id === room.players["2"].id) {
      console.error("Player 2 already at room error");

      // room.players["2"].playTurn = 1;

      return {
        player: room.players["2"],
        room,
      };
    }

    return {
      player,
      room,
    };
  }

  findRoomByRoomId(roomId: string) {
    if (!roomId) {
      console.error("findByRoomId error");
      console.error("RoomId not passed error");

      return;
    }

    const room = this.rooms.find((room) => room.id === roomId);

    if (!room) {
      console.error("findByRoomId error");
      console.error("room not found");

      return;
    }

    return room;
  }

  findRoomByRoomName(roomName: string) {
    if (!roomName) {
      console.error("findByRoomName error");
      console.error("RoomName not passed error");
      // throw new Error("Room not found.");
      return;
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

      // throw new Error("Room not found.");
      return;
    }

    if (!room.isRunning) {
      console.error("Game is not running.");

      // throw new Error("Game is not running.");
      return;
    }

    const isPositionAvailable = room.board.isPositionAvailable(position);
    console.log("isPositionAvailable -> ", isPositionAvailable);
    if (!isPositionAvailable) {
      console.error("Position not available.");

      // throw new Error("Position is not available.");
      return;
    }

    console.log("playerId", playerId);
    console.log("position", position);

    const { player } = room.getPlayerById(playerId);
    console.log("player turn -> ", player?.playTurn);
    if (!player) {
      console.error("Player not found.");

      // throw new Error("Player not found.");
      return;
    } else if (player.playTurn !== 0 && player.playTurn !== 1) {
      console.error("Player can't play.");

      // throw new Error("Player can't play.");
      return;
    }

    if (player.playTurn !== room.playerTurn) {
      console.error("It's not your turn.");

      return;
    }

    room.board.setBoardPosition(position, room.playerTurn);

    room.passTurn();
  }
}

export default new Game();
