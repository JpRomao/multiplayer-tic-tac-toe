import { BoardAvailablePositions } from "../Board/IBoard";
import Player from "../Player/Player";
import Room from "../Room/Room";

export interface IGame {
  rooms: Room[];

  createRoom(player: Player): { player: Player; room: Room } | void;
  joinRoom(roomId: string, player: Player): { player: Player; room: Room };
  leaveRoom(roomId: string, playerId: string): void;
  play(playerId: string, position: BoardAvailablePositions): void;
  deleteRoom(roomId: string): void;
  generateRoomId(): string;
}
