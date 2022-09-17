import { Flex, Heading, Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { RoomCardProps } from "./LobbyRoomsContainer";

const RoomCard: React.FC<RoomCardProps> = ({ name, players }) => {
  const playersCount = useCallback(() => {
    let count = 0;

    if (players[1].id) count++;
    if (players[2].id) count++;

    return count;
  }, [players]);

  return (
    <Flex>
      <Heading>{name}</Heading>

      <Text>{playersCount()}/2</Text>
    </Flex>
  );
};

export { RoomCard };
