import { Grid, GridItem } from "@chakra-ui/react";

import { BoardAvailablePositions, BoardValue } from "../../game/Board/IBoard";

export const Board: React.FC<{
  board: BoardValue[];
  handleCellClick: (position: BoardAvailablePositions) => void;
}> = ({ board, handleCellClick }) => {
  return (
    <Grid
      width={["100%", "100%", "100%", "75%", "75%", "50%"]}
      minHeight="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(3, 1fr)"
    >
      {board.map((value, index) => {
        return (
          <GridItem
            display="flex"
            key={index as BoardAvailablePositions}
            border="1px solid black"
            justifyContent="center"
            alignItems="center"
            fontSize="9xl"
            onClick={() => handleCellClick(index as BoardAvailablePositions)}
            cursor="pointer"
          >
            {value === 1 ? "X" : value === 2 ? "O" : ""}
          </GridItem>
        );
      })}
    </Grid>
  );
};
