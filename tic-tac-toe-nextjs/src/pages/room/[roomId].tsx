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

    if (!router.query.roomId) return;

    const newSocket = io("http://localhost:3334", {
      transports: ["websocket"],
      query: {
        roomId: router.query.roomId,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.roomId]);

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
    if (room && room.id) return;

    console.log("room", room);

    if (!router.query.roomId) return;

    const { roomId } = router.query;

    server
      .post(`rooms/${roomId}/join`, {
        player,
      })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          router.push("/");
        }

        const { data } = response;

        setRoom(data.room);
        updatePlayer(data.player);
      });
  }, [router, player, room, updatePlayer]);

  useEffect(() => {
    if (!socket || !room?.id) {
      console.log("socket or room not found");

      return;
    }

    socket.on("played", ({ board, playerTurn, turn }: Room) => {
      console.log("played -> ", { board, playerTurn, turn });
      console.log("room -> ", room);

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleCellClick = (index: number) => {
    if (!socket?.connected || !player || !player.name || !room?.id) {
      console.log({
        player,
        room,
        socket,
      });
      return;
    }

    console.log(player.playTurn);

    if (player.playTurn !== room.playerTurn) {
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
