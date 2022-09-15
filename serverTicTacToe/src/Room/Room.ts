import Board from "../Board/Board";
import Player from "../Player/Player";
import { IRoom, RoomProps } from "./IRoom";
import { BasicAi } from "../Ai/BasicAi/BasicAi";
import { HardAi } from "../Ai/HardAi/HardAi";

class Room implements IRoom {
  id: string;
  name: string;
  players: {
    "1": Player;
    "2": Player | BasicAi | HardAi;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 1 | 2;
  board: Board;
  isAiActive: boolean;
  ai: BasicAi | HardAi;
  winner: 0 | 1 | 2;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.players = {
      "1": {} as Player,
      "2": {} as Player,
    };
    this.turn = 1;
    this.isRunning = true;
    this.playerTurn = 1;
    this.board = new Board();
    this.isAiActive = true;
    this.ai = new BasicAi();
    this.winner = 0;
  }

  checkWinner(): 0 | 1 | 2 {
    const winner = this.board.checkWinner();

    this.winner = winner;

    if (winner) {
      this.players[winner].score += 1;

      this.stopGame();
    }

    return winner;
  }

  startGame(): void {
    if (this.players["1"].id && this.players["2"].id) {
      this.players["1"].playTurn = this.players["1"].playTurn === 1 ? 2 : 1;

      this.players["2"].playTurn = this.players["2"].playTurn === 1 ? 2 : 1;

      this.isRunning = true;
    } else if (this.players["1"].id && this.isAiActive) {
      this.players["1"].playTurn = 1;

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
      aiLevel: this.ai.level,
    };
  }

  stopGame(): void {
    this.isRunning = false;
  }

  leaveRoom(playerId: string): void {
    if (this.players["1"].id === playerId) {
      this.players["1"] = {} as Player;
    } else if (this.players["2"].id === playerId) {
      this.players["2"] = {} as Player;
    } else {
      console.log("player not found");
      return;
      // throw new Error("Player not found.");
    }
  }

  roomIsEmpty(): boolean {
    if (
      !this.players["1"].id &&
      (!this.players["2"].id || this.players["2"].type === "ai")
    ) {
      return true;
    }

    return false;
  }

  passTurn(): void {
    this.playerTurn = this.playerTurn === 1 ? 2 : 1;
  }

  resetTurns(): void {
    this.playerTurn = 1;
    this.turn = 1;
  }

  setPlayer(player: Player): Player | void {
    if (this.players["1"].id === player.id) {
      console.log("player already in room");

      return this.players["1"];
      // throw new Error("Player already in room.");
    } else if (
      this.players["2"].id === player.id &&
      this.players["2"].type !== "ai"
    ) {
      console.log("player already in room");

      return this.players["2"];
      // throw new Error("Player already in room.");
    }

    if (!this.players["1"].id) {
      this.players["1"] = player;

      this.players["1"].playTurn = 1;

      this.isAiActive = true;

      return this.players["1"];
    } else if (this.players["1"].id === player.id) {
      this.players["1"] = player;

      this.players["1"].playTurn = 1;

      this.isAiActive = true;

      return this.players["1"];
    } else if (!this.players["2"].id) {
      this.players["2"] = player;

      this.players["2"].playTurn = 2;

      this.isAiActive = false;

      return this.players["2"];
    } else if (this.players["2"].id === player.id) {
      this.players["2"] = player;

      this.players["2"].playTurn = 2;

      this.isAiActive = false;

      return this.players["2"];
    } else {
      console.log("room is full");

      return;
      // throw new Error("Room is full.");
    }
  }

  getPlayerById(playerId: string): {
    player: Player | BasicAi | HardAi;
    playerValue: 0 | 1 | 2;
  } {
    if (this.players["1"].id === playerId) {
      return {
        player: this.players["1"],
        playerValue: 1,
      };
    } else if (this.players["2"].id === playerId) {
      return {
        player: this.players["2"],
        playerValue: 2,
      };
    } else {
      return {
        player: {} as Player,
        playerValue: 0,
      };
      // throw new Error("Player not found.");
    }
  }
}

export default Room;
