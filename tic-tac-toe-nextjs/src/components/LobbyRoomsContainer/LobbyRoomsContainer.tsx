import { Flex, Heading } from "@chakra-ui/react";

import OffRoom from "../../game/Room/Room";
import { RoomCard } from "./RoomCard";

export interface RoomCardProps {
  name: OffRoom["name"];
  players: OffRoom["players"];
}

const LobbyRoomsContainer: React.FC<RoomCardProps> = ({ name, players }) => {
  return (
    <Flex>
      <Heading>Rooms</Heading>

      <RoomCard name={name} players={players} />
    </Flex>
  );
};

export { LobbyRoomsContainer };
