import { BoardAvailablePositions, BoardValue } from "../Board/IBoard";
import Board from "../Board/Board";
import Player from "../Player/Player";
import { IRoom, RoomProps } from "./IRoom";
import { BasicAi } from "../Ai/BasicAi/BasicAi";
import { HardAi } from "../Ai/HardAi/HardAi";

class OffRoom implements IRoom {
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

  constructor(room: OffRoom) {
    this.id = room.id;
    this.name = room.name;
    this.players = room.players;
    this.turn = room.turn;
    this.isRunning = room.isRunning;
    this.playerTurn = room.playerTurn;
    this.board = room.board;
    this.isAiActive = room.isAiActive;
    this.ai = room.ai;
    this.winner = room.winner;
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
    }

    return this.board.board;
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

  aiPlay(): void {
    if (!this.isAiActive) {
      return;
    }

    const aiMove = this.ai.getAiMove(this.board);

    this.turn++;

    this.board.setBoardPosition(aiMove, 2);
  }

  changeAiLevel(): void {
    this.ai = this.ai instanceof BasicAi ? new HardAi() : new BasicAi();
  }

  startGame(): void {
    if (this.players["1"].id && this.isAiActive) {
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

  passTurn(): void {
    this.playerTurn = this.playerTurn === 1 ? 2 : 1;
  }

  resetTurns(): void {
    this.playerTurn = 1;
    this.turn = 1;
  }
}

export default OffRoom;
