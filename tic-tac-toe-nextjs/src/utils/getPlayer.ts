import { Player } from "../types/player";

export function getPlayer(): Player | null {
  const player = localStorage.getItem("player");

  if (player) {
    return JSON.parse(player);
  }

  return null;
}
