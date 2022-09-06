import { Button, Flex, Text } from "@chakra-ui/react";
import { GetStaticPropsContext, NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import server from "../services/server";
import { useRouter } from "next/router";
import { Room } from "../types/room";
import { PlayerContext } from "../contexts/PlayerContext";
import { Player } from "../types/player";

const Lobby: NextPage = () => {
  const router = useRouter();
  const { player, updatePlayer } = useContext(PlayerContext);

  const [rooms, setRooms] = useState<Room[]>([]);

  const t = useTranslations();

  async function getRooms() {
    const { data } = await server.get("/rooms");

    return data;
  }

  useEffect(() => {
    const currentPlayer: Player =
      player || JSON.parse(localStorage.getItem("player") || "{}");

    if (!currentPlayer.name) {
      router.push("/");
    }

    updatePlayer(currentPlayer);
  }, [player, router, updatePlayer]);

  useEffect(() => {
    getRooms().then((rooms) => {
      setRooms(rooms);
    });
  }, []);

  const handleCreateRoom = async () => {
    if (!player.name) return;

    const response = await server.post("/rooms/create");

    if (response.status !== 201) {
      return;
    }

    await router.push(`/room/${response.data.id}`);
  };

  const handleJoinRoom = async (roomId: string) => {
    router.push(`/room/${roomId}`);
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
