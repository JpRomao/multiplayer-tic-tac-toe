export interface IPlayer {
  id: string;
  score: number;
  name: string;
  playTurn: 0 | 1;

  getScore(): number;
  addScore(): number;
  setName(name: string): void;
  generatePlayerId(): string;
}
