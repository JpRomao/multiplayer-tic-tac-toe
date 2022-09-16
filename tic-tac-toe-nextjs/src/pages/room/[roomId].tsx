import { Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Board } from "../../components/Board/board";
import { RoomHeader } from "../../components/RoomHeader/RoomHeader";

import { PlayerContext } from "../../contexts/PlayerContext";
import { BoardAvailablePositions } from "../../game/Board/IBoard";
import OffRoom from "../../game/Room/Room";
import server from "../../services/server";
import { socket } from "../../services/socket";
import { useLocalStorage } from "../../utils/useLocalStorage";

const Room: NextPage = () => {
  const router = useRouter();

  const { player, getPlayer } = useContext(PlayerContext);
  const { setItem } = useLocalStorage();

  const [room, setRoom] = useState<OffRoom>();

  const getRoom = useCallback(async () => {
    const { roomId } = router.query;

    const { data } = await server.get(`/rooms/${roomId}`);

    return data.room;
  }, [router.query]);

  useEffect(() => {
    if (!router || !router.query.roomId) return;

    getPlayer().then((player) => {
      if (player) {
        getRoom().then((roomResponse: OffRoom) => {
          setItem("room", new OffRoom(roomResponse));

          setRoom(new OffRoom(roomResponse));

          return;
        });
      }

      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPlayer, getRoom, router.query.roomId]);

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

  const handleCellClick = useCallback(
    (index: BoardAvailablePositions) => {
      console.log("clicked");
      if (!room || !player) return;

      if (room.isAiActive) {
        setRoom((room) => {
          if (!room) return;

          const newRoom = new OffRoom(room);

          newRoom.playerPlay(index);

          return newRoom;
        });

        return;
      }

      socket.emit("play", {
        playerId: player.id,
        position: index,
        roomId: room.id,
      });
    },
    [player, room]
  );

  const renderBoard = useCallback(() => {
    if (!room) return <></>;

    return <Board handleCellClick={handleCellClick} board={room.board.board} />;
  }, [handleCellClick, room]);

  return (
    <Flex
      flexDirection="column"
      height="500px"
      width="100%"
      minWidth="100vw"
      minHeight="100vh"
    >
      {renderBoard()}
    </Flex>
  );
};

export default Room;
