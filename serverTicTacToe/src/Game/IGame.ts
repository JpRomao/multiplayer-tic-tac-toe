import { BoardAvailablePositions } from "../Board/IBoard";
import Player from "../Player/Player";
import Room from "../Room/Room";

export interface IGame {
  rooms: Room[];
  players: Player[];

  findPlayerByPlayerId(playerId: string): Player | void;
  createRoom(player: Player): Room | void;
  joinRoom(roomId: string, player: Player): Room;
  leaveRoom(roomId: string, playerId: string): void;
  play(playerId: string, position: BoardAvailablePositions): Room;
  deleteRoom(roomId: string): void;
  generateRoomId(): string;
  verifyPlayerAlreadyAtRoom(roomId: string, player: Player): Room;
  replaceRoom(room: Room): Room;
}
