import { BoardAvailablePositions } from "./../../Board/IBoard";
import Board from "../../Board/Board";
import { IAi } from "../IAi";

class BasicAi implements IAi {
  id: string;
  name: string;
  type: "ai";
  playTurn: 1 | 2;
  level: "easy";
  score: number;

  constructor() {
    this.id = "AiSpecial";
    this.name = "BasicAi";
    this.type = "ai";
    this.playTurn = 2;
    this.score = 0;
    this.level = "easy";
  }

  getAiMove(board: Board): BoardAvailablePositions {
    const availablePositions = board.getAvailablePositions();
    const randomPosition =
      availablePositions[Math.floor(Math.random() * availablePositions.length)];

    return randomPosition;
  }
}

export { BasicAi };
