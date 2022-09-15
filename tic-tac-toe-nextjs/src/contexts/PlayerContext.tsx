import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import OffPlayer from "../game/Player/Player";
import server from "../services/server";
import { useLocalStorage } from "../utils/useLocalStorage";

type PlayerContextType = {
  player: OffPlayer;
  updatePlayer: (player: OffPlayer) => void;
  getPlayer: () => Promise<OffPlayer>;
};

interface PlayerContextProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext<PlayerContextType>({
  player: {} as OffPlayer,
  updatePlayer: (player: OffPlayer) => {},
  getPlayer: () => new Promise((resolve) => resolve({} as OffPlayer)),
});

export const PlayerProvider = ({ children }: PlayerContextProviderProps) => {
  const [player, setPlayer] = useState<OffPlayer>({} as OffPlayer);

  const { getItem, setItem } = useLocalStorage();

  const router = useRouter();

  const updatePlayer = useCallback(
    (player: OffPlayer) => {
      setItem("player", player);
      setPlayer(player);
    },
    [setItem]
  );

  const getPlayer = useCallback(async () => {
    const currentPlayer: OffPlayer = getItem("player");

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
      console.log(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          console.error
      );
    } finally {
      try {
        const { data } = await server.post("/create/player", currentPlayer);

        setItem("player", data.player);

        updatePlayer(data.player);
      } catch (error: any) {
        console.log(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            console.error
        );

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
