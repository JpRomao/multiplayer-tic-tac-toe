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
}

export { BasicAi };
