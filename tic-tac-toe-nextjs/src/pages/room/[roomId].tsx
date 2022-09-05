import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { PlayerContext } from "../../contexts/PlayerContext";

import server from "../../services/server";
import { Room } from "../../types/room";

const Room: NextPage = () => {
  const router = useRouter();
  const { player, updatePlayer } = useContext(PlayerContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (socket?.connected) return;

    const newSocket = io("http://localhost:3334", {
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      autoConnect: true,
      secure: true,
      transports: ["", "websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!router) return;

    const { roomId } = router.query;

    server.get(`rooms/${roomId}`).then((response) => {
      if (response.status !== 200) {
        router.push("/");
      }

      const { data } = response;

      setRoom(data);
    });
  }, [socket, router, updatePlayer]);

  useEffect(() => {
    if (!socket || !room) return;

    socket.on("played", ({ board, playerTurn, turn }: Room) => {
      setRoom((room) => {
        if (!room) return null;

        return {
          ...room,
          board,
          playerTurn,
          turn,
        };
      });
    });
  }, [socket, room]);

  const handleCellClick = (index: number) => {
    if (!socket || !player || !player.name || !room?.id || !room.isRunning) {
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
