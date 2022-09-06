import { BoardAvailablePositions } from "../Board/IBoard";
import Board from "../Board/Board";
import Player from "../Player/Player";
import { IRoom, RoomProps } from "./IRoom";

class Room implements IRoom {
  id: string;
  name: string;
  players: {
    "1": Player | null;
    "2": Player | null;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 0 | 1;
  board: Board;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.players = {
      "1": null,
      "2": null,
    };
    this.turn = 1;
    this.isRunning = false;
    this.playerTurn = 0;
    this.board = new Board();
  }

  startGame(): void {
    if (this.players["1"] && this.players["2"]) {
      this.players["1"].playTurn = 0;

      this.players["2"].playTurn = 1;

      this.isRunning = true;
    } else {
      console.log("not enough players");
      return;
      // throw new Error("Room is not full.");
    }
  }

  setGame(): RoomProps {
    this.board.resetBoard();

    return {
      playerTurn: this.playerTurn,
      turn: this.turn,
      board: this.board.board,
    };
  }

  stopGame(): void {
    this.isRunning = false;
  }

  leaveRoom(playerId: string): void {
    if (this.players["1"]?.id === playerId) {
      this.players["1"] = null;
    } else if (this.players["2"]?.id === playerId) {
      this.players["2"] = null;
    } else {
      console.log("player not found");
      return;
      // throw new Error("Player not found.");
    }
  }

  roomIsEmpty(): boolean {
    if (!this.players["1"] && !this.players["2"]) {
      return true;
    }

    return false;
  }

  passTurn(): void {
    this.turn++;
    this.playerTurn = this.playerTurn === 0 ? 1 : 0;
  }

  resetTurns(): void {
    this.playerTurn = 0;
    this.turn = 0;
  }

  setPlayer(player: Player): Player | void {
    console.log("setting player", player);

    if (this.players["1"]?.id === player.id) {
      console.log("player already in room");

      return this.players["1"];
      // throw new Error("Player already in room.");
    } else if (this.players["2"]?.id === player.id) {
      console.log("player already in room");

      return this.players["2"];
      // throw new Error("Player already in room.");
    }

    if (!this.players["1"]?.id) {
      console.log("set player 1");

      this.players["1"] = player;

      this.players["1"].playTurn = 0;

      return this.players["1"];
    } else if (this.players["1"].id === player.id) {
      console.log(
        `player name: ${player.name} - id: ${player.id} already in room`
      );

      this.players["1"] = player;

      this.players["1"].playTurn = 0;

      return this.players["1"];
    } else if (!this.players["2"]?.id) {
      console.log("set player 2");

      this.players["2"] = player;

      this.players["2"].playTurn = 1;

      return this.players["2"];
    } else if (this.players["2"].id === player.id) {
      console.log(
        `player name: ${player.name} - id: ${player.id} already in room`
      );

      this.players["2"] = player;

      this.players["2"].playTurn = 1;

      return this.players["2"];
    } else {
      console.log("room is full");

      return;
      // throw new Error("Room is full.");
    }
  }

  getPlayerById(
    playerId: string
  ):
    | { player: Player; playerValue: 0 | 1 }
    | { player: null; playerValue: null } {
    if (this.players["1"]?.id === playerId) {
      console.log("find player 1");

      return {
        player: this.players["1"],
        playerValue: 0,
      };
    } else if (this.players["2"]?.id === playerId) {
      console.log("find player 2");

      return {
        player: this.players["2"],
        playerValue: 1,
      };
    } else {
      console.log("player not found");
      return {
        player: null,
        playerValue: null,
      };
      // throw new Error("Player not found.");
    }
  }
}

export default Room;
