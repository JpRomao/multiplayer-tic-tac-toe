import { sleep } from "./../../../utils/sleep";
import { BoardAvailablePositions } from "./../../Board/IBoard";
import Board from "../../Board/Board";
import { IAi } from "../IAi";

class BasicAi implements IAi {
  id: string;
  name: string;
  type: "Ai";
  playTurn: 1 | 2;
  level: "easy";
  score: number;

  constructor(ai?: BasicAi) {
    this.id = "AiSpecial";
    this.name = "BasicAi";
    this.type = "Ai";
    this.playTurn = ai?.playTurn || 2;
    this.score = ai?.score || 0;
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
