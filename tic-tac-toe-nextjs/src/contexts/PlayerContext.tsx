import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import server from "../services/server";
import { Player } from "../types/player";
import { useLocalStorage } from "../utils/useLocalStorage";

type PlayerContextType = {
  player: Player;
  updatePlayer: (player: Player) => void;
  getPlayer: () => Promise<Player>;
};

interface PlayerContextProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext<PlayerContextType>({
  player: {} as Player,
  updatePlayer: (player: Player) => {},
  getPlayer: () => new Promise((resolve) => resolve({} as Player)),
});

export const PlayerProvider = ({ children }: PlayerContextProviderProps) => {
  const [player, setPlayer] = useState<Player>({} as Player);

  const { getItem, setItem } = useLocalStorage();

  const router = useRouter();

  const updatePlayer = useCallback(
    (player: Player) => {
      setItem("player", player);
      setPlayer(player);
    },
    [setItem]
  );

  const getPlayer = useCallback(async () => {
    const currentPlayer: Player = getItem("player");

    if (!currentPlayer || !currentPlayer.id) {
      router.push("/");

      return;
    }

    try {
      const { data } = await server.get(`/players/${currentPlayer.id}`);

      updatePlayer(data.player);

      setItem("player", data.player);

      return data.player;
    } catch (error: any) {
      console.log(error.response.data.message || error.response.data.error);
    } finally {
      try {
        const { data } = await server.post("/create/player", currentPlayer);

        setItem("player", data.player);

        updatePlayer(data.player);
      } catch (error: any) {
        console.log(error.response.data.message || error.response.data.error);

        router.push("/");

        return;
      }
    }
  }, [router, updatePlayer, setItem, getItem]);

  const playerContextValue = useMemo(
    () => ({ player, updatePlayer, getPlayer }),
    [player, updatePlayer, getPlayer]
  );

  return (
    <PlayerContext.Provider value={playerContextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
