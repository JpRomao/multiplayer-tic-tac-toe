import { BoardAvailablePositions, BoardValue } from "../Board/IBoard";
import Board from "../Board/Board";
import Player from "../Player/Player";
import { IRoom, RoomProps } from "./IRoom";
import { BasicAi } from "../Ai/BasicAi/BasicAi";
import { HardAi } from "../Ai/HardAi/HardAi";
import OffBoard from "../Board/Board";
import OffPlayer from "../Player/Player";

class OffRoom implements IRoom {
  id: string;
  name: string;
  players: {
    "1": Player;
    "2": Player;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 1 | 2;
  board: Board;
  isAiActive: boolean;
  ai: BasicAi | HardAi;
  winner: 0 | 1 | 2 | 3;

  constructor(room: OffRoom) {
    this.id = room.id;
    this.name = room.name;
    this.players = {
      1: new OffPlayer(room.players[1]),
      2: new OffPlayer(room.players[2]),
    };
    this.turn = room.turn;
    this.isRunning = room.isRunning;
    this.playerTurn = room.playerTurn;
    this.board = new OffBoard(room.board);
    this.isAiActive = room.isAiActive;
    this.ai = new HardAi();
    this.winner = room.winner;

    if (
      this.ai.playTurn === this.playerTurn &&
      this.board.getAvailablePositions().length === 9
    ) {
      this.aiPlay();
    }
  }

  playerPlay(position: BoardAvailablePositions): BoardValue[] {
    if (!this.isRunning) {
      return this.board.board;
    }

    if (this.board.isPositionAvailable(position)) {
      this.board.setBoardPosition(position, this.playerTurn);

      this.checkWinner();

      this.passTurn();

      this.turn += 1;

      this.aiPlay();

      this.passTurn();
    }

    return this.board.board;
  }

  checkWinner(): 0 | 1 | 2 | 3 {
    const winner = this.board.checkWinner();

    if (winner === 3) {
      this.winner = 3;

      this.stopGame();

      return winner;
    }

    this.winner = winner;

    if (winner) {
      this.players[winner].score += 1;

      this.stopGame();
    }

    return winner;
  }

  aiPlay(): void {
    if (!this.isAiActive) {
      return;
    }

    const aiMove = this.ai.getAiMove(this.board);

    this.board.setBoardPosition(aiMove, 2);
  }

  changeAiLevel(): void {
    this.ai = this.ai instanceof BasicAi ? new HardAi() : new BasicAi();
  }

  startGame(): void {
    if (this.players["1"].id && this.isAiActive) {
      this.players["1"].playTurn = this.playerTurn;

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

  passTurn(): void {
    this.playerTurn = this.playerTurn === 1 ? 2 : 1;
  }

  resetTurns(): void {
    this.playerTurn = 1;
    this.turn = 1;
  }
}

export default OffRoom;
