import { IPlayer } from "./IPlayer";
import { getRandomInt } from "../utils/rng";
import Game from "../Game/Game";

class Player implements IPlayer {
  readonly id: string;
  score: number;
  name: string;

  constructor(name: string) {
    this.id = this.generatePlayerId();

    this.name = name;
    this.score = 0;
  }

  generatePlayerId(): string {
    const min = 1;
    const max = 99999;

    const playerId = getRandomInt(min, max).toString();

    const playerExists = Game.players.find((player) => player.id === playerId);

    if (playerExists) {
      return this.generatePlayerId();
    }

    return playerId;
  }

  getScore(): number {
    return this.score;
  }

  addScore(): number {
    this.score++;

    return this.score;
  }

  setName(name: string): void {
    if (name.length < 4) {
      throw new Error("Name must be at least 4 characters long.");
    }

    this.name = name;
  }
}

export default Player;
