export interface Player {
  id: string;
  score: number;
  name: string;
  playTurn: 1 | 2;
  type: "human";
}
