import { Board } from "./board";
import { Player } from "./player";

export interface RoomProps {
  playerTurn: 1 | 2;
  turn: number;
  board: (0 | 1 | null)[];
}

export interface Room {
  id: string;
  playerId: string;
  name: string;
  players: {
    "1": Player | null;
    "2": Player | null;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 1 | 2;
  board: Board;
}
