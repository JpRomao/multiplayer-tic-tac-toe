import { Flex, Heading, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { Button } from "../Button/Button";

import { LobbyRoomsContainerProps } from "./LobbyRoomsContainer";

const RoomCard: React.FC<LobbyRoomsContainerProps> = ({
  name,
  players,
  roomId,
}) => {
  const playersCount = useCallback(() => {
    let count = 0;

    if (players[1].id) count++;
    if (players[2].id) count++;

    return count;
  }, [players]);

  const handleJoinRoom = useCallback((roomId: string) => {
    console.log("join room ", roomId);
  }, []);

  return (
    <Flex>
      <Heading>{name}</Heading>

      <Text>{playersCount()}/2</Text>

      <Button onClick={() => handleJoinRoom(roomId)}>Join</Button>
    </Flex>
  );
};

export { RoomCard };
