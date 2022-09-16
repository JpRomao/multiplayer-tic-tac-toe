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
    this.id = "AiSpecial";
    this.name = "HardAi";
    this.type = "ai";
    this.playTurn = 2;
    this.level = "hard";
    this.score = 0;
  }
}

export { HardAi };
