export interface IAi {
  id: string;
  name: string;
  type: "ai";
  score: number;
  playTurn: 1 | 2;
  level: "easy" | "hard";
}
