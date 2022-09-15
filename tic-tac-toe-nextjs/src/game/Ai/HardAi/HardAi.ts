import Board from "../../Board/Board";
import { BoardAvailablePositions } from "../../Board/IBoard";
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

  getAiMove(board: Board, playerTurn?: 1 | 2): BoardAvailablePositions {
    if (!playerTurn) {
      return 0;
    }

    const availablePositions = board.getAvailablePositions();

    if (availablePositions) {
      return availablePositions[0];
    }

    return 0;
  }

  minimax(newBoard: Board, playerTurn: 1 | 2) {}
}

export { HardAi };
