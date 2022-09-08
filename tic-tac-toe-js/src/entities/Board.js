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

  verifyWinner() {
    const winningPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningPositions.length; i++) {
      const [a, b, c] = winningPositions[i];

      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }

    return null;
  }
}

export default Board;
