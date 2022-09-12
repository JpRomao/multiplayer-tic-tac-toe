export type BoardAvailablePositions = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type BoardValue = 1 | 2;
export interface IBoard {
  board: BoardValue[];
  isFull: boolean;

  setBoardPosition(position: BoardAvailablePositions, value: 1 | 2): void;
  isPositionAvailable(position: BoardAvailablePositions): boolean;
  checkIfBoardIsFull(): boolean;
  getAvailablePositions(): BoardAvailablePositions[] | null;
  checkWinner(): 0 | 1 | 2;
}
