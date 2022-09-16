import { Flex } from "@chakra-ui/react";
import { useCallback } from "react";
import { Socket } from "socket.io-client";
import OffRoom from "../../game/Room/Room";

import { Button } from "../Button/Button";

interface RoomActionsProps {
  socket: Socket;
  isRunning: OffRoom["isRunning"];
  isAiActive: OffRoom["isAiActive"];
  gameInitiated: boolean;
  changeAiLevel: () => void;
  handleResetBoard: () => void;
}

const RoomActions: React.FC<RoomActionsProps> = ({
  isRunning,
  socket,
  isAiActive,
  changeAiLevel,
  gameInitiated,
  handleResetBoard,
}) => {
  return (
    <Flex
      width={["100%", "100%", "100%", "75%", "75%", "50%"]}
      justifyContent="space-around"
      mb="4"
    >
      <Button onClick={handleResetBoard} disabled={isRunning}>
        Reset Board
      </Button>

      {isAiActive && (
        <Button onClick={changeAiLevel} disabled={gameInitiated}>
          Change Ai Level
        </Button>
      )}

      <Button>Leave Room</Button>
    </Flex>
  );
};

export { RoomActions };
