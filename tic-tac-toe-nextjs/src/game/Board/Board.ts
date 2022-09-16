import { BoardAvailablePositions, BoardValue, IBoard } from "./IBoard";

class OffBoard implements IBoard {
  board: BoardValue[];
  isFull: boolean;

  constructor(board: OffBoard) {
    this.board = board.board || Array(9).fill(0);
    this.isFull = board.isFull || false;
  }

  getBoard(): BoardValue[] {
    return this.board;
  }

  isPositionAvailable(position: BoardAvailablePositions): boolean {
    if (this.board[position] === 0) {
      return true;
    }

    return false;
  }

  resetBoard(): void {
    this.board = Array(9).fill(0);
  }

  checkWinner(): 0 | 1 | 2 | 3 {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    if (this.checkIfBoardIsFull()) {
      return 3;
    }

    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];

      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }

    return 0;
  }

  setBoardPosition(position: BoardAvailablePositions, value: 1 | 2): void {
    if (this.board[position] === 0) {
      this.board[position] = value;
    }
  }

  checkIfBoardIsFull(): boolean {
    const isFull = this.board.every((position) => position !== 0);

    this.isFull = isFull;

    return isFull;
  }

  getAvailablePositions(): BoardAvailablePositions[] {
    const availablePositions: BoardAvailablePositions[] = [];

    this.board.forEach((position, index) => {
      if (position === 0) {
        availablePositions.push(index as BoardAvailablePositions);
      }
    });

    return availablePositions;
  }
}

export default OffBoard;
