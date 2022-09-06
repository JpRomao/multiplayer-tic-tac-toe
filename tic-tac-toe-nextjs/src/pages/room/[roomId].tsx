import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import { PlayerContext } from "../../contexts/PlayerContext";
import { Room } from "../../types/room";
import { getPlayer } from "../../utils/getPlayer";

const Room: NextPage = () => {
  const router = useRouter();
  const { player, updatePlayer } = useContext(PlayerContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (socket?.id) return;

    console.log("initializing socket", socket);

    const newSocket = io("http://localhost:3334", {
      transports: ["websocket"],
    });

    console.log("socket -> ", newSocket);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (player.id) {
      return;
    }

    const currentPlayer = JSON.parse(localStorage.getItem("player") || "{}");

    if (!currentPlayer.id) {
      router.push("/");
    }

    updatePlayer(currentPlayer);
  }, [player, router, updatePlayer]);

  useEffect(() => {
    if (isJoining) return;

    if (hasJoined) return;

    if (!router.query.roomId) return;

    if (!socket?.id) return;

    const playerInfo = getPlayer();

    if (!player || !player.id) {
      if (playerInfo) {
        console.log("updating Player Info");

        updatePlayer(playerInfo);
      }

      return;
    }

    console.log("isJoining", isJoining);

    console.log("joining room -> ", router.query.roomId);

    console.log("player -> ", player);

    socket.emit("join-room", router.query.roomId, player);

    setIsJoining(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.roomId, hasJoined, isJoining]);

  useEffect(() => {
    if (!socket) {
      console.log("socket or room not found");

      return;
    }

    socket.on("room-joined", (data) => {
      console.log("room-joined -> ", data);

      setRoom(data.room);

      setIsJoining(false);

      setHasJoined(true);
    });

    socket.on("played", ({ board, playerTurn, turn }: Room) => {
      console.log("played -> ", { board, playerTurn, turn });

      setRoom((room) => {
        if (!room || !room.id) return null;

        return {
          ...room,
          board,
          playerTurn,
          turn,
        };
      });
    });

    return () => {
      socket.off("played");
      socket.off("room-joined");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, hasJoined]);

  const handleCellClick = (index: number) => {
    if (!socket || !player || !player.name || !room?.id) {
      console.log({
        player,
        room,
        socket,
      });

      return;
    }

    socket.emit("play", {
      playerId: player.id,
      position: index,
      roomId: room.id,
    });
  };

  return (
    <Flex minWidth="100vw" minHeight="100vh">
      <Grid
        width={["100%", "100%", "100%", "75%", "75%", "50%"]}
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(3, 1fr)"
      >
        {room &&
          room.board?.board.map((value, index) => {
            return (
              <GridItem
                display="flex"
                key={index}
                border="1px solid black"
                justifyContent="center"
                alignItems="center"
                fontSize="9xl"
                onClick={() => handleCellClick(index)}
              >
                {value === 0 ? "X" : value === 1 ? "O" : ""}
              </GridItem>
            );
          })}
      </Grid>
    </Flex>
  );
};

export default Room;
