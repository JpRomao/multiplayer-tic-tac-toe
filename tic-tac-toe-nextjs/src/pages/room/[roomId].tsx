import { Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Board } from "../../components/Board/board";
import { RoomActions } from "../../components/RoomActions/RoomActions";
import { RoomHeader } from "../../components/RoomHeader/RoomHeader";

import { PlayerContext } from "../../contexts/PlayerContext";
import { BasicAi } from "../../game/Ai/BasicAi/BasicAi";
import { HardAi } from "../../game/Ai/HardAi/HardAi";
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
      if (!room || !player) return;

      if (room.isAiActive && room.isRunning) {
        const newRoom = new OffRoom(room);

        newRoom.playerPlay(index);

        newRoom.winner = newRoom.checkWinner();

        if (newRoom.winner) {
          newRoom.isRunning = false;

          setRoom(newRoom);

          return;
        }

        newRoom.aiPlay();

        newRoom.passTurn();

        newRoom.winner = newRoom.checkWinner();

        if (newRoom.winner) {
          newRoom.isRunning = false;
        }

        setRoom(newRoom);

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

    return (
      <Board
        handleCellClick={handleCellClick}
        board={room.board.board}
        isRunning={room.isRunning}
      />
    );
  }, [handleCellClick, room]);

  const renderHeader = useCallback(() => {
    if (!room) return <></>;

    return (
      <RoomHeader
        players={room.players}
        ai={room.ai}
        isAiActive={room.isAiActive}
        draws={room.draws}
      />
    );
  }, [room]);

  const changeAiLevel = useCallback(() => {
    if (!room) return;

    if (!room.isAiActive) return;

    setRoom((room) => {
      if (!room) return;

      const newRoom = new OffRoom(room);

      newRoom.ai =
        newRoom.ai.level === "easy"
          ? (newRoom.ai = new HardAi())
          : (newRoom.ai = new BasicAi());

      return newRoom;
    });
  }, [room]);

  const handleResetBoard = useCallback(() => {
    if (!room) return;

    if (room.isRunning) return;

    if (room.board.getAvailablePositions().length >= 9) return;

    if (!socket) return;

    if (room.isAiActive) {
      const newRoom = new OffRoom(room);

      newRoom.board.resetBoard();

      newRoom.startGame();

      setRoom(newRoom);

      return;
    }

    socket.emit("reset-board");
  }, [room]);

  const renderButtons = useCallback(() => {
    if (!room) return <></>;

    return (
      <RoomActions
        changeAiLevel={changeAiLevel}
        gameInitiated={room.board.getAvailablePositions().length < 9}
        isRunning={room.isRunning}
        socket={socket}
        isAiActive={room.isAiActive}
        handleResetBoard={handleResetBoard}
      />
    );
  }, [room, changeAiLevel, handleResetBoard]);

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      alignItems="center"
    >
      {renderHeader()}
      {renderBoard()}
      {renderButtons()}
    </Flex>
  );
};

export default Room;
