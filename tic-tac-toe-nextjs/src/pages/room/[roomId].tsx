import { Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Board } from "../../components/Board/board";
import { RoomHeader } from "../../components/RoomHeader/RoomHeader";

import { PlayerContext } from "../../contexts/PlayerContext";
import OffRoom from "../../game/Room/Room";
import server from "../../services/server";
import { socket } from "../../services/socket";
import { useLocalStorage } from "../../utils/useLocalStorage";

const Room: NextPage = () => {
  const router = useRouter();

  const { player, getPlayer } = useContext(PlayerContext);
  const { setItem } = useLocalStorage();

  const [room, setRoom] = useState<OffRoom>({} as OffRoom);

  const getRoom = useCallback(async () => {
    const { roomId } = router.query;

    const { data } = await server.get(`/rooms/${roomId}`);

    return data.room;
  }, [router.query]);

  useEffect(() => {
    if (!router) return;

    getPlayer().then((player) => {
      if (player) {
        getRoom().then((room: OffRoom) => {
          setItem("room", room);

          setRoom((room) => {
            const newRoom = new OffRoom(room);

            return newRoom;
          });

          return;
        });
      }

      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, getPlayer, getRoom, router.query.roomId]);

  useEffect(() => {
    if (!room) return;
    if (room.isAiActive) {
      return;
    }
    socket.on("played", (room: OffRoom) => {
      if (!room || !room.id) {
        router.push("/lobby");

        return;
      }

      setRoom(room);
    });

    return () => {
      socket.off("played");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      flexDirection="column"
      height="500px"
      width="100%"
      minWidth="100vw"
      minHeight="100vh"
    >
      {room && <Board room={room} player={player} socket={socket} />}
    </Flex>
  );
};

export default Room;
