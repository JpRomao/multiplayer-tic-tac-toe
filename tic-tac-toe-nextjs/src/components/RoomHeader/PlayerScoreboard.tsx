import { Flex, Text } from "@chakra-ui/react";

import { BasicAi } from "../../game/Ai/BasicAi/BasicAi";
import { HardAi } from "../../game/Ai/HardAi/HardAi";
import OffPlayer from "../../game/Player/Player";
import OffRoom from "../../game/Room/Room";
import { PlayerScore } from "./PlayerScore";

interface PlayerScoreboardProps {
  players: {
    1: OffPlayer;
    2: OffPlayer | HardAi | BasicAi;
  };
  ai: OffRoom["ai"];
  isAiActive: OffRoom["isAiActive"];
  draws: OffRoom["draws"];
}

export const PlayerScoreboard: React.FC<PlayerScoreboardProps> = ({
  players,
  ai,
  isAiActive,
  draws,
}) => {
  return (
    <Flex justifyContent="space-around">
      <PlayerScore player={players[1]} />

      <Flex direction="column" ms="8" alignItems="center">
        <Text fontWeight="bold">Draws</Text>
        <Text fontWeight="bold" color="yellow.500">
          {draws}
        </Text>
      </Flex>

      {isAiActive ? (
        <PlayerScore player={ai} />
      ) : (
        <PlayerScore player={players[2]} />
      )}
    </Flex>
  );
};
