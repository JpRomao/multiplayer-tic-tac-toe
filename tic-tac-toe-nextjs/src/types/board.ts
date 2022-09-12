export interface Board {
  board: BoardValue[];
  isFull: boolean;
}

export type BoardValue = 1 | 2;
