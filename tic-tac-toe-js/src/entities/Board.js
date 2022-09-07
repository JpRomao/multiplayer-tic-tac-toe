class Board {
  board;
  isBoardFull;

  constructor() {
    this.board = Array(9).fill(null);

    this.isBoardFull = false;
  }

  getBoard() {
    return this.board;
  }

  setBoard(position, value) {
    this.board[position] = value;
  }

  verifyIsBoardFull() {
    this.isBoardFull = this.board.every((position) => position !== null);
  }
}

export { Board };
