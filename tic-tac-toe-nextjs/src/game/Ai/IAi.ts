import { BoardAvailablePositions } from "./../Board/IBoard";
import Board from "../Board/Board";

export interface IAi {
  id: string;
  name: string;
  type: "ai";
  score: number;
  playTurn: 1 | 2;
  level: "easy" | "hard";

  getAiMove(board: Board, playerTurn?: 1 | 2): BoardAvailablePositions;
}
