export type BoardAvailablePositions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface IBoard {
  board: (0 | 1 | null)[];
  isFull: boolean;

  setBoardPosition(position: BoardAvailablePositions, value: 0 | 1): void;
  isPositionAvailable(position: BoardAvailablePositions): boolean;
  checkIfBoardIsFull(): boolean;
}
