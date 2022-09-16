import { Flex, Text } from "@chakra-ui/react";

import OffRoom from "../../game/Room/Room";

interface PlayerScoreProps {
  player: OffRoom["players"][1] | OffRoom["players"][2] | OffRoom["ai"];
}

const PlayerScore = ({ player }: PlayerScoreProps) => {
  return (
    <Flex direction="column" ms="8" alignItems="center">
      <Text fontWeight="bold">{player.type}</Text>
      <Text>{player.name}</Text>
      <Text fontWeight="bold" color="yellow.500">
        {player.score}
      </Text>
    </Flex>
  );
};

export { PlayerScore };
