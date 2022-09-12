import { BoardValue } from "../Board/IBoard";
import Board from "../Board/Board";
import { HardAi } from "../Ai/HardAi/HardAi";
import { BasicAi } from "../Ai/BasicAi/BasicAi";
import Player from "../Player/Player";

export interface RoomProps {
  playerTurn: BoardValue;
  turn: number;
  board: BoardValue[] | null[];
  aiLevel: "easy" | "hard";
}

export interface IRoom {
  id: string;
  name: string;
  players: {
    "1": Player;
    "2": Player | BasicAi | HardAi;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 1 | 2;
  board: Board;
  isAiActive: boolean;
  ai: BasicAi | HardAi;
  winner: 0 | 1 | 2;

  aiPlay(): void;
  changeAiLevel(): void;
  passTurn(): void;
  resetTurns(): void;
  leaveRoom(playerId: string): void;
  setPlayer(player: Player): Player | HardAi | BasicAi | void;
  getPlayerById(playerId: string): {
    player: Player | BasicAi | HardAi;
    playerValue: 0 | 1 | 2;
  };
  setGame(): RoomProps;
  stopGame(): void;
  roomIsEmpty(): boolean;
  startGame(): void;
}
