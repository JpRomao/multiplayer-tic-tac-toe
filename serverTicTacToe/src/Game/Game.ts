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

  createRoom(player: Player): Room {
    console.log(player);
    if (!player || !player.id) {
      console.error("createRoom error");
      console.error("player not passed");
      // throw new Error("Player not found.");
      return {} as Room;
    }
    const roomId = this.generateRoomId();

    const roomName = `Room-${roomId}`;

    if (!roomName) {
      console.error("Room name is required.");
      // throw new Error("Room name is required.");
      return {} as Room;
    } else if (!roomId) {
      console.error("create error");

      return {} as Room;
      // throw new Error("Room not found.");
    }

    const roomExists = {
      byId: this.findRoomByRoomId(roomId),
      byName: this.findRoomByRoomName(roomName),
    };

    if (roomExists.byId) {
      console.error("Room already exists.");

      return {} as Room;
      // throw new Error("You already created a room.");
    } else if (roomExists.byName) {
      console.error("Room already exists.");

      return {} as Room;
      // throw new Error("Room with this name already exists.");
    }

    const room = new Room(roomId, roomName);

    room.players["1"] = player;

    this.rooms.push(room);

    return room;
  }

  joinRoom(roomId: string, player: Player): Room {
    const playerAlreadyAtRoom = this.verifyPlayerAlreadyAtRoom(roomId, player);

    if (playerAlreadyAtRoom) {
      return playerAlreadyAtRoom;
    }

    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("join error");

      // throw new Error("Room not found.");
      return {} as Room;
    }

    console.log("room found", room);

    player.playTurn = 1;

    player = room.setPlayer(player) || player;

    room.startGame();

    this.replaceRoom(room);

    console.log(`Player ${player.name} joined ${room.name}.`);

    return room;
  }

  leaveRoom(roomId: string, playerId: string): void {
    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("leave error");
      // throw new Error("Room not found.");
      return;
    }

    room.leaveRoom(playerId);

    this.replaceRoom(room);
  }

  deleteRoom(roomId: string): void {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId);

    if (roomIndex === -1) {
      console.error("delete error");
      // throw new Error("Room not found.");
      return;
    }

    this.rooms.splice(roomIndex, 1);

    console.log("room deleted -> ", roomId);
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
        room.players["1"].id === playerId || room.players["2"].id === playerId
    );
  }

  verifyPlayerAlreadyAtRoom(roomId: string, player: Player): Room {
    if (!player.id) {
      return {} as Room;
    }

    const room = this.findRoomByRoomId(roomId);

    if (!room) {
      console.error("Room not found error");

      return {} as Room;
    }

    return room;
  }

  findRoomByRoomId(roomId: string) {
    if (!roomId) {
      return;
    }

    const room = this.rooms.find((room) => room.id === roomId);

    if (!room) {
      return;
    }

    return room;
  }

  findRoomByRoomName(roomName: string) {
    if (!roomName) {
      console.error("eeeeee");

      console.error("findByRoomName error");
      console.error("RoomName not passed error");
      // throw new Error("Room not found.");
      return;
    }

    return this.rooms.find((room) => room.name === roomName);
  }

  findPlayerByPlayerId(playerId: string): Player | void {
    if (!playerId) {
      console.error("findByPlayerId error");
      console.error("player not found error");
      // throw new Error("Player not found.");
      return;
    }

    return this.players.find((player) => player.id === playerId);
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

  replaceRoom(newRoom: Room): Room {
    const roomIndex = this.rooms.findIndex((room) => room.id === newRoom.id);

    if (roomIndex === -1) {
      console.error("replace error");
      // throw new Error("Room not found.");
      return {} as Room;
    }

    if (newRoom.roomIsEmpty()) {
      this.deleteRoom(newRoom.id);

      return {} as Room;
    }

    this.rooms[roomIndex] = newRoom;

    return newRoom;
  }

  play(playerId: string, position: BoardAvailablePositions): Room {
    const room = this.findRoomByPlayerId(playerId);

    if (!room) {
      console.error("findByPlayerId error");

      // throw new Error("Room not found.");
      return {} as Room;
    }

    if (!room.isRunning || !room.isAiActive) {
      console.error("Game is not running.");

      // throw new Error("Game is not running.");
      return room;
    }

    const isPositionAvailable = room.board.isPositionAvailable(position);

    if (!isPositionAvailable) {
      console.error("Position not available.");

      // throw new Error("Position is not available.");
      return room;
    }

    const { player } = room.getPlayerById(playerId);

    if (!player) {
      console.error("Player not found.");

      // throw new Error("Player not found.");
      return room;
    } else if (player.playTurn !== 1 && player.playTurn !== 2) {
      console.error("Player can't play.");

      // throw new Error("Player can't play.");
      return room;
    }

    if (player.playTurn !== room.playerTurn) {
      console.error("It's not your turn.");

      return room;
    }

    room.board.setBoardPosition(position, room.playerTurn);

    room.checkWinner();

    let winner = room.checkWinner();

    if (winner) {
      this.replaceRoom(room);

      return room;
    }

    room.turn++;

    room.passTurn();

    this.replaceRoom(room);

    return room;
  }
}

export default new Game();
