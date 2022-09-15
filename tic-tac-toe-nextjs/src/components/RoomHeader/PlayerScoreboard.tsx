import { Flex, Text } from "@chakra-ui/react";
import { BasicAi } from "../../game/Ai/BasicAi/BasicAi";
import { HardAi } from "../../game/Ai/HardAi/HardAi";
import OffPlayer from "../../game/Player/Player";

interface PlayerScoreboardProps {
  players: {
    1: OffPlayer;
    2: OffPlayer | HardAi | BasicAi;
  };
}

export const PlayerScoreboard: React.FC<PlayerScoreboardProps> = ({
  players,
}) => {
  return (
    <Flex>
      <Flex>
        <Text>{players[1].type}</Text>
        <Text>{players[1].name}</Text>
        <Text color="yellow.500">{players[1].score}</Text>
      </Flex>

      <Flex>
        <Text>{players[2].type}</Text>
        <Text>
          {players[2].type === "human" ? players[2].name : players[2].level}
        </Text>
        <Text>{players[2].score}</Text>
      </Flex>
    </Flex>
  );
};
