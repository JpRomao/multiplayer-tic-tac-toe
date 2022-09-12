import { Ai } from "./Ai";
import { Board, BoardValue } from "./board";
import { Player } from "./player";

export interface RoomProps {
  playerTurn: BoardValue;
  turn: number;
  board: BoardValue[] | null[];
  aiLevel: "easy" | "hard";
}

export interface Room {
  id: string;
  name: string;
  players: {
    "1": Player;
    "2": Player | Ai;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: BoardValue;
  board: Board;
  isAiActive: boolean;
  ai: Ai;
}
