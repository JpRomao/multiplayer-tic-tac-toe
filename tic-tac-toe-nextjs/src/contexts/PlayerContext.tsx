import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Player } from "../types/player";

type PlayerContextType = {
  player: Player;
  updatePlayer: (player: Player) => void;
};

interface PlayerContextProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext<PlayerContextType>({
  player: {} as Player,
  updatePlayer: (player: Player) => {},
});

export const PlayerProvider = ({ children }: PlayerContextProviderProps) => {
  const [player, setPlayer] = useState<Player>({} as Player);

  const updatePlayer = useCallback((player: Player) => {
    setPlayer(player);
  }, []);

  const playerContextValue = useMemo(
    () => ({ player, updatePlayer }),
    [player, updatePlayer]
  );

  return (
    <PlayerContext.Provider value={playerContextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
