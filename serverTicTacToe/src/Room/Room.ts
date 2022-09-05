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

  constructor(id: string, name: string, player: Player) {
    this.id = id;
    this.name = name;
    this.players = {
      "1": player,
      "2": null,
    };
    this.turn = 1;
    this.isRunning = false;
    this.playerTurn = 1;
    this.board = new Board();
  }

  startGame(): void {
    if (this.players["1"] && this.players["2"]) {
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

  setPlayer(player: Player): void {
    if (!this.players["1"]?.id) {
      console.log("set player 1");
      this.players["1"] = player;
    } else if (!this.players["2"]?.id) {
      console.log("set player 2");
      this.players["2"] = player;
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
      return {
        player: this.players["1"],
        playerValue: 0,
      };
    } else if (this.players["2"]?.id === playerId) {
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

  play(position: BoardAvailablePositions, playerId: string): RoomProps | void {
    if (!this.isRunning) {
      console.log("game is not running");
      return;
      // throw new Error("Game is not running.");
    }

    const isPositionAvailable = this.board.isPositionAvailable(position);

    if (!isPositionAvailable) {
      console.log("position not available");
      return;
      // throw new Error("Position not available.");
    }

    const { playerValue } = this.getPlayerById(playerId);

    if (!playerValue) {
      return;
    }

    this.board.setBoardPosition(position, playerValue);

    const isBoardFull = this.board.checkIfBoardIsFull();

    if (isBoardFull) {
      this.stopGame();
    }

    this.passTurn();

    return {
      playerTurn: this.playerTurn,
      turn: this.turn,
      board: this.board.board,
    };
  }
}

export default Room;
