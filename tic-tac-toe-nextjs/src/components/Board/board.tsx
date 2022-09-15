import { Grid, GridItem } from "@chakra-ui/react";
import { Socket } from "socket.io-client";
import OffPlayer from "../../game/Player/Player";
import OffRoom from "../../game/Room/Room";

export const Board: React.FC<{
  room: OffRoom;
  socket: Socket;
  player: OffPlayer;
}> = ({ room, socket, player }) => {
  const handleCellClick = (index: number) => {
    if (!player.id || !player.name || !room.id) {
      return;
    }

    socket.emit("play", {
      playerId: player.id,
      position: index,
      roomId: room.id,
    });
  };

  return (
    <Grid
      width={["100%", "100%", "100%", "75%", "75%", "50%"]}
      minHeight="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(3, 1fr)"
    >
      {room.board.board.map((value, index) => {
        return (
          <GridItem
            display="flex"
            key={index}
            border="1px solid black"
            justifyContent="center"
            alignItems="center"
            fontSize="9xl"
            onClick={() => handleCellClick(index)}
            cursor="pointer"
          >
            {value === 1 ? "X" : value === 2 ? "O" : ""}
          </GridItem>
        );
      })}
    </Grid>
  );
};
