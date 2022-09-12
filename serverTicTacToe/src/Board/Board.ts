import { BoardAvailablePositions, BoardValue, IBoard } from "./IBoard";

class Board implements IBoard {
  board: BoardValue[];
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

  checkWinner(): 0 | 1 | 2 {
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
    console.log("play", position, value);
    this.board[position] = value;
  }

  checkIfBoardIsFull(): boolean {
    const isFull = this.board.every((position) => position !== null);

    this.isFull = isFull;

    return isFull;
  }

  getAvailablePositions(): BoardAvailablePositions[] {
    const availablePositions: BoardAvailablePositions[] = [];

    this.board.forEach((position, index) => {
      if (position === null) {
        availablePositions.push(index as BoardAvailablePositions);
      }
    });

    return availablePositions;
  }
}

export default Board;
