import { Flex } from "@chakra-ui/react";
import OffRoom from "../../game/Room/Room";
import { PlayerScoreboard } from "./PlayerScoreboard";

export const RoomHeader: React.FC<OffRoom> = ({ players }) => {
  return (
    <Flex as="header" flexDirection="column">
      <PlayerScoreboard players={players} />
    </Flex>
  );
};
