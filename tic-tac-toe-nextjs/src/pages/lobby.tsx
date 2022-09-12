import { Button, Flex, Text } from "@chakra-ui/react";
import { GetStaticPropsContext, NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import server from "../services/server";
import { useRouter } from "next/router";
import { Room } from "../types/room";
import { PlayerContext } from "../contexts/PlayerContext";
import { useLocalStorage } from "../utils/useLocalStorage";
import { socket } from "../services/socket";

const Lobby: NextPage = () => {
  const router = useRouter();

  const { getItem, setItem } = useLocalStorage();

  const { player, getPlayer } = useContext(PlayerContext);

  const [rooms, setRooms] = useState<Room[]>([]);

  const t = useTranslations();

  async function getRooms() {
    const { data } = await server.get("/rooms");

    return data.rooms;
  }

  useEffect(() => {
    getPlayer().then((player) => {
      if (player) {
        getRooms().then((rooms) => {
          setRooms(rooms);

          return;
        });
      }
    });
  }, [getPlayer]);

  useEffect(() => {
    if (!router) return;

    socket.on("room-created", (room) => {
      if (!room || !room.id) return;

      setItem("room", room);

      router.push(`/room/${room.id}`);

      return;
    });

    socket.on("room-joined", (room) => {
      if (!room || !room.id) return;

      setItem("room", room);

      router.push(`/room/${room.id}`);

      return;
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateRoom = async () => {
    if (!player || !player.name) return;
    console.log("player -> ", player);
    socket.emit("room-create", player);
  };

  const handleJoinRoom = async (roomId: string) => {
    socket.emit("room-join", { roomId, player });

    return;
  };

  return (
    <Flex
      minWidth="100vw"
      minHeight="100vh"
      paddingY={["64", "32"]}
      paddingX={["4", "8", "8", "12"]}
      justifyContent={["center", "center", "center", "space-around"]}
    >
      <Flex alignItems="center" justifyContent="center">
        <Flex direction="column">
          <Flex direction="column">
            <Text>Rooms</Text>

            <Button
              bg="pink.600"
              onClick={() => {
                getRooms().then((rooms) => {
                  setRooms(rooms);
                });
              }}
            >
              reload
            </Button>

            <Button bg="pink.600" onClick={handleCreateRoom}>
              Criar sala
            </Button>

            <Flex>
              {rooms.map((room) => {
                return (
                  <Flex key={room.id} direction="column">
                    <Text>{room.name}</Text>

                    <Flex>
                      <Button
                        bg="pink.600"
                        onClick={() => handleJoinRoom(room.id)}
                      >
                        Join
                      </Button>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../translations/${locale}.json`)).default,
    },
  };
}

export default Lobby;
