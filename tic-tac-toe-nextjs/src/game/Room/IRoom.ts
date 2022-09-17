import { BoardAvailablePositions, BoardValue } from "../Board/IBoard";
import Board from "../Board/Board";
import Player from "../Player/Player";
import { HardAi } from "../Ai/HardAi/HardAi";
import { BasicAi } from "../Ai/BasicAi/BasicAi";

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
    "2": Player | HardAi | BasicAi;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 1 | 2;
  board: Board;
  isAiActive: boolean;
  ai: HardAi | BasicAi;
  winner: 0 | 1 | 2 | 3;
  draws: number;

  playerPlay(position: BoardAvailablePositions): BoardValue[];
  aiPlay(): void;
  changeAiLevel(): void;
  passTurn(): void;
  setGame(): RoomProps;
  stopGame(): void;
  startGame(): void;
}
