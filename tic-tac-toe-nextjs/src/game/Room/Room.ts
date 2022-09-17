import { BoardAvailablePositions, BoardValue } from "../Board/IBoard";
import Board from "../Board/Board";
import Player from "../Player/Player";
import { IRoom, RoomProps } from "./IRoom";
import { BasicAi } from "../Ai/BasicAi/BasicAi";
import { HardAi } from "../Ai/HardAi/HardAi";
import OffBoard from "../Board/Board";
import OffPlayer from "../Player/Player";
import { sleep } from "../../utils/sleep";

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
  draws: number;

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
    this.ai =
      room.ai.level === "easy" ? new BasicAi(room.ai) : new HardAi(room.ai);
    this.winner = room.winner;
    this.draws = room.draws;
  }

  playerPlay(position: BoardAvailablePositions): BoardValue[] {
    if (!this.isRunning) {
      return this.board.board;
    }

    if (!this.board.isPositionAvailable(position)) {
      return this.board.board;
    }

    this.board.setBoardPosition(position, this.playerTurn);

    this.passTurn();

    return this.board.board;
  }

  checkWinner(): 0 | 1 | 2 | 3 {
    const winner = this.board.checkWinner();

    if (winner === 3) {
      this.winner = 3;

      this.draws++;

      this.stopGame();

      return winner;
    }

    this.winner = winner;

    if (winner) {
      if (this.players[winner].id) {
        this.players[winner].score += 1;
      } else {
        this.ai.score += 1;
      }

      this.stopGame();
    }

    return winner;
  }

  aiPlay(): void {
    if (!this.isAiActive) {
      return;
    }

    const aiMove = this.ai.getAiMove(this.board);

    this.board.setBoardPosition(aiMove, this.ai.playTurn);
  }

  changeAiLevel(): void {
    this.ai = this.ai instanceof BasicAi ? new HardAi() : new BasicAi();
  }

  startGame(): void {
    if (this.turn % 2 === 0) {
      this.players["1"].playTurn = 2;
      this.ai.playTurn = 1;
    } else {
      this.players["1"].playTurn = 1;
      this.ai.playTurn = 2;
    }

    this.isRunning = true;
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
    this.turn++;
    this.playerTurn = this.playerTurn === 1 ? 2 : 1;
  }
}

export default OffRoom;
