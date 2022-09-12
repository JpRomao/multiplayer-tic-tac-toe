import Board from "../../Board/Board";
import { BoardValue, BoardAvailablePositions } from "../../Board/IBoard";
import { IAi } from "../IAi";

class HardAi implements IAi {
  id: string;
  name: string;
  type: "ai";
  playTurn: 1 | 2;
  level: "hard";
  score: number;

  constructor() {
    this.id = "1";
    this.name = "HardAi";
    this.type = "ai";
    this.playTurn = 2;
    this.level = "hard";
    this.score = 0;
  }

  getAiMove(board: Board): BoardAvailablePositions {
    const availablePositions = board.getAvailablePositions();
    const bestMove = this.findBestMove(board);

    if (bestMove) {
      return bestMove;
    }

    const randomPosition =
      availablePositions[Math.floor(Math.random() * availablePositions.length)];

    return randomPosition;
  }

  findBestMove(board: Board): BoardAvailablePositions {
    const availablePositions = board.getAvailablePositions();

    let bestScore = -Infinity;
    let bestMove: BoardAvailablePositions = 0;

    availablePositions.forEach((position) => {
      board.board[position] = this.playTurn;

      const score = this.minimax(board, 0, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = position;
      }
    });

    return bestMove;
  }

  minimax(board: Board, depth: number, isMaximizing: boolean): number {
    if (isMaximizing) {
      let bestScore = -Infinity;

      board.getAvailablePositions().forEach((position) => {
        board.board[position] = this.playTurn;

        const score = this.minimax(board, depth + 1, false);

        bestScore = Math.max(score, bestScore);
      });

      return bestScore;
    } else {
      let bestScore = Infinity;

      board.getAvailablePositions().forEach((position) => {
        board.board[position] = this.playTurn === 1 ? 2 : 1;

        const score = this.minimax(board, depth + 1, true);

        bestScore = Math.min(score, bestScore);
      });

      return bestScore;
    }
  }
}

export { HardAi };
