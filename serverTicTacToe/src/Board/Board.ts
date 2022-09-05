import { BoardAvailablePositions, IBoard } from "./IBoard";

class Board implements IBoard {
  board: (0 | 1 | null)[];
  isFull: boolean;

  constructor() {
    this.board = Array(9).fill(null);
    this.isFull = false;
  }

  isPositionAvailable(position: BoardAvailablePositions): boolean {
    if (this.board[position] === null) {
      return true;
    }

    return false;
  }

  resetBoard(): void {
    this.board = Array(9).fill(null);
  }

  setBoardPosition(position: BoardAvailablePositions, value: 0 | 1): void {
    this.board[position] = value;
  }

  checkIfBoardIsFull(): boolean {
    const isFull = this.board.every((position) => position !== null);

    this.isFull = isFull;

    return isFull;
  }
}

export default Board;
