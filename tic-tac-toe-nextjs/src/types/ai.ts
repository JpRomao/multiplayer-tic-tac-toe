export interface Ai {
  id: string;
  name: string;
  type: "ai";
  playTurn: 0 | 1;
  level: "easy" | "hard";
}
