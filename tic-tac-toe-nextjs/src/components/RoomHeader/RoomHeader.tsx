import { Flex } from "@chakra-ui/react";
import OffRoom from "../../game/Room/Room";
import { PlayerScoreboard } from "./PlayerScoreboard";

interface RoomHeaderProps {
  players: OffRoom["players"];
  ai: OffRoom["ai"];
  isAiActive: OffRoom["isAiActive"];
  draws: OffRoom["draws"];
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  players,
  ai,
  isAiActive,
  draws,
}) => {
  return (
    <Flex
      as="header"
      flexDirection="column"
      alignItems="stretch"
      width={["100%", "100%", "100%", "75%", "75%", "50%"]}
      mt="4"
    >
      <PlayerScoreboard
        draws={draws}
        players={players}
        ai={ai}
        isAiActive={isAiActive}
      />
    </Flex>
  );
};
