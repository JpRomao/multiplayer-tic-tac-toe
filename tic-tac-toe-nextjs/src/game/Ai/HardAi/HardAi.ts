import Board from "../../Board/Board";
import { BoardAvailablePositions } from "../../Board/IBoard";
import { IAi } from "../IAi";

class HardAi implements IAi {
  id: string;
  name: string;
  type: "Ai";
  playTurn: 1 | 2;
  level: "hard";
  score: number;

  constructor() {
    this.id = "AiSpecial";
    this.name = "HardAi";
    this.type = "Ai";
    this.playTurn = 2;
    this.level = "hard";
    this.score = 0;
  }

  getAiMove(board: Board): BoardAvailablePositions {
    const move = this.bestMove(board);

    return move;
  }

  bestMove(board: Board): BoardAvailablePositions {
    let bestScore = -Infinity;
    let move: BoardAvailablePositions = 0;

    for (let i = 0; i < 9; i++) {
      if (board.board[i] === 0) {
        board.board[i] = this.playTurn;
        let score = this.minimax(board, 0, false);
        board.board[i] = 0;
        if (score > bestScore) {
          bestScore = score;
          move = i as BoardAvailablePositions;
        }
      }
    }

    return move;
  }

  minimax(newBoard: Board, depth: number, isMaximizing: boolean) {
    const result = newBoard.checkWinner();

    if (result === 1) {
      return -10;
    } else if (result === 2) {
      return 10;
    } else if (result === 3) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;

      for (let i = 0; i < 9; i++) {
        if (newBoard.board[i] === 0) {
          newBoard.board[i] = this.playTurn;
          let score = this.minimax(newBoard, depth + 1, false);
          newBoard.board[i] = 0;
          bestScore = Math.max(score, bestScore);
        }
      }

      return bestScore;
    } else {
      let bestScore = Infinity;

      for (let i = 0; i < 9; i++) {
        if (newBoard.board[i] === 0) {
          newBoard.board[i] = this.playTurn === 1 ? 2 : 1;
          let score = this.minimax(newBoard, depth + 1, true);
          newBoard.board[i] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }

      return bestScore;
    }
  }
}

export { HardAi };
