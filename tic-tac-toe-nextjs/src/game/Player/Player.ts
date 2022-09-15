import { IPlayer } from "./IPlayer";

class OffPlayer implements IPlayer {
  id: string | null;
  score: number;
  name: string;
  playTurn: 1 | 2;
  type: "human";

  constructor(player: OffPlayer) {
    this.id = player.id;
    this.name = player.name;
    this.score = player.score;
    this.playTurn = player.playTurn;
    this.type = "human";
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

export default OffPlayer;
