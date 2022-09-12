import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Board } from "../../components/Board/board";

import { PlayerContext } from "../../contexts/PlayerContext";
import server from "../../services/server";
import { socket } from "../../services/socket";
import { Room } from "../../types/room";
import { useLocalStorage } from "../../utils/useLocalStorage";

const Room: NextPage = () => {
  const router = useRouter();

  const { player, getPlayer } = useContext(PlayerContext);
  const { setItem } = useLocalStorage();

  const [room, setRoom] = useState<Room>({} as Room);

  const getRoom = useCallback(async () => {
    const { roomId } = router.query;

    const { data } = await server.get(`/rooms/${roomId}`);

    return data.room;
  }, [router.query]);

  useEffect(() => {
    if (!router) return;

    getPlayer().then((player) => {
      if (player) {
        getRoom().then((room: Room) => {
          setItem("room", room);

          setRoom(room);

          return;
        });
      }

      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, getPlayer, getRoom, router.query.roomId]);

  useEffect(() => {
    socket.on("played", (room: Room) => {
      if (!room || !room.id) {
        router.push("/lobby");

        return;
      }

      setRoom(room);
      console.log(room);
    });

    return () => {
      socket.off("played");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex minWidth="100vw" minHeight="100vh">
      <Board room={room} player={player} socket={socket} />
    </Flex>
  );
};

export default Room;
