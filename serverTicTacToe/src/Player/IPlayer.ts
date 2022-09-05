export interface IPlayer {
  readonly id: string;
  score: number;
  name: string;

  getScore(): number;
  addScore(): number;
  setName(name: string): void;
  generatePlayerId(): string;
}
