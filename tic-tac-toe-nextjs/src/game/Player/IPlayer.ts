import { BoardValue } from "../Board/IBoard";

export interface IPlayer {
  id: string | null;
  score: number;
  name: string;
  playTurn: BoardValue;
  type: "Human";

  getScore(): number;
  addScore(): number;
  setName(name: string): void;
}
