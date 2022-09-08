import Player from "./Player.js";
import Room from "./Room.js";

class Game {
  rooms;
  players;

  constructor() {
    this.players = [
      { id: 4465, name: "Junior" },
      { id: 1365, name: "Joao" },
    ];
    this.rooms = [];
  }

  getRoomsStatus() {
    return {
      roomsNumber: this.rooms.length,
      roomsRunning: this.rooms.filter((room) => room.isRunning).length,
    };
  }

  createPlayer(playerName) {
    const player = new Player(playerName);

    this.players.push(player);

    return player;
  }

  removePlayer(player) {
    const playerExists = this.verifyPlayerExists(player.id);

    if (!playerExists) {
      return null;
    }

    const playerIndex = this.players.findIndex((p) => p.id === player.id);

    this.players.splice(playerIndex, 1);
  }

  createRoom(player) {
    if (!player) {
      return null;
    }

    if (!this.verifyPlayerExists(player.id)) {
      return null;
    }

    const isPlayerAlreadyAtRoom = this.playerAlreadyAtRoom();

    if (isPlayerAlreadyAtRoom) {
      return null;
    }

    const room = new Room(player);

    this.rooms.push(room);

    return room;
  }

  joinRoom(player, roomId) {
    const room = this.findRoomById(roomId);

    if (!room) {
      return null;
    }

    const playerAlreadyAtRoom = this.playerAlreadyAtRoom(player.id);

    if (playerAlreadyAtRoom) {
      console.log("player already at room");

      return room;
    }

    const isRoomFull = this.verifyRoomIsFull(roomId);

    if (isRoomFull) {
      console.log("room is full");

      return null;
    }

    if (!room.players[1].id) {
      room.players[1] = player;

      const newRoom = this.replaceRoom(room);

      return newRoom;
    }

    if (!room.players[2] || !room.players[2].id) {
      room.players[2] = player;

      room.isRunning = true;
    }

    const newRoom = this.replaceRoom(room);

    return newRoom;
  }

  verifyRoomIsFull(roomId) {
    const room = this.findRoomById(roomId);

    if (!room) {
      return false;
    }

    if (
      room.players[1] &&
      room.players[1].id &&
      room.players[2] &&
      room.players[2].id
    ) {
      return true;
    }

    return false;
  }

  replaceRoom(newRoom) {
    const roomIndex = this.rooms.findIndex((room) => room.id === newRoom.id);

    if (roomIndex < 0) {
      return null;
    }

    this.rooms[roomIndex] = newRoom;

    return newRoom;
  }

  findRoomById(roomId) {
    const room = this.rooms.find((room) => room.id === Number(roomId));

    if (!room) {
      console.log("room not found");

      return null;
    }

    return room;
  }

  playerAlreadyAtRoom(playerId) {
    const room = this.rooms.find(
      (room) =>
        (room.players && room.players[1].id === playerId) ||
        (room.players[2] && room.players[2].id === playerId)
    );

    if (!room) {
      return false;
    }

    return room.id ? true : false;
  }

  verifyPlayerExists(playerId) {
    const player = this.players.find((player) => player.id === playerId);
    if (!player) {
      return false;
    }

    return true;
  }

  play({ roomId, position, player }) {
    if (position < 0 || position > 8) {
      return null;
    }

    const playerExists = this.verifyPlayerExists(player.id);

    if (!playerExists) {
      return null;
    }

    const room = this.findRoomById(roomId);

    if (!room) {
      console.log("room not found");

      return null;
    }

    if (!room.isRunning) {
      return null;
    }

    let playerWhoPlayed = null;

    if (room.players[1].id === player.id) {
      playerWhoPlayed = 0;
    } else if (room.players[2].id === player.id) {
      playerWhoPlayed = 1;
    } else {
      return null;
    }

    if (playerWhoPlayed !== room.playerTurn) {
      return null;
    }

    room.setBoard(position, playerWhoPlayed);

    const winner = room.checkWinner();

    room.turn += 1;

    if (winner) {
      room.isRunning = false;

      room.winner = winner;

      const newRoom = this.replaceRoom(room);

      return newRoom;
    }

    room.playerTurn = room.playerTurn === 0 ? 1 : 0;

    const newRoom = this.replaceRoom(room);

    if (!newRoom) {
      return room;
    }

    return newRoom;
  }
}

export default Game;
