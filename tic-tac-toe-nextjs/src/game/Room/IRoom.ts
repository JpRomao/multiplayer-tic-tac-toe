import { BoardAvailablePositions, BoardValue } from "../Board/IBoard";
import Board from "../Board/Board";
import Player from "../Player/Player";
import { Ai } from "../../types/ai";

export interface RoomProps {
  playerTurn: BoardValue;
  turn: number;
  board: BoardValue[];
  aiLevel: "easy" | "hard";
}

export interface IRoom {
  id: string;
  name: string;
  players: {
    "1": Player;
    "2": Player | Ai;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 1 | 2;
  board: Board;
  isAiActive: boolean;
  ai: Ai;
  winner: 0 | 1 | 2;

  playerPlay(position: BoardAvailablePositions): BoardValue[];
  aiPlay(): void;
  changeAiLevel(): void;
  passTurn(): void;
  resetTurns(): void;
  setGame(): RoomProps;
  stopGame(): void;
  startGame(): void;
}
