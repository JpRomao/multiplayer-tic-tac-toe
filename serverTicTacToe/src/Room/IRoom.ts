import { BoardAvailablePositions } from "../Board/IBoard";
import Board from "../Board/Board";
import { IPlayer } from "../Player/IPlayer";

export interface RoomProps {
  playerTurn: 0 | 1;
  turn: number;
  board: (0 | 1 | null)[];
}

export interface IRoom {
  id: string;
  name: string;
  players: {
    "1"?: IPlayer | null;
    "2"?: IPlayer | null;
  };
  turn: number;
  isRunning: boolean;
  playerTurn: 0 | 1;
  board: Board;

  passTurn(): void;
  resetTurns(): void;
  leaveRoom(playerId: string): void;
  setPlayer(player: IPlayer): void;
  getPlayerById(
    playerId: string
  ):
    | { player: IPlayer; playerValue: 0 | 1 }
    | { player: null; playerValue: null };
  setGame(): RoomProps;
  stopGame(): void;
  roomIsEmpty(): boolean;
  play(position: BoardAvailablePositions, playerId: string): RoomProps | void;
  startGame(): void;
}
