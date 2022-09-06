export interface Player {
  id: string;
  score: number;
  name: string;
  roomId: string;
  playTurn: 0 | 1;
}
