import { Flex, Heading } from "@chakra-ui/react";

import OffRoom from "../../game/Room/Room";
import { RoomCard } from "./RoomCard";

export interface LobbyRoomsContainerProps {
  name: OffRoom["name"];
  players: OffRoom["players"];
  roomId: OffRoom["id"];
}

const LobbyRoomsContainer: React.FC<LobbyRoomsContainerProps> = ({
  name,
  players,
  roomId,
}) => {
  return (
    <Flex>
      <Heading>Rooms</Heading>

      <RoomCard roomId={roomId} name={name} players={players} />
    </Flex>
  );
};

export { LobbyRoomsContainer };
