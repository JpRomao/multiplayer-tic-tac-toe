import Board from "./Board.js";
import { generateRandomId } from "../utils/generateRandomId.js";

class Room {
  id;
  board;
  name;
  isRunning;
  turn;
  playerTurn;
  winner;

  constructor(player) {
    this.id = generateRandomId(1, 99999);

    this.name = `Room-${this.id}`;

    this.players = {
      1: player,
      2: null,
    };

    this.board = new Board();

    this.isRunning = false;

    this.turn = 1;

    this.playerTurn = 0;

    this.winner = null;
  }

  setBoard(position, playerWhoPlayed) {
    this.board.setBoard(position, playerWhoPlayed);
  }

  checkWinner() {
    return this.board.verifyWinner();
  }
}

export default Room;
