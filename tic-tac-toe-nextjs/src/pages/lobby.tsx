import { Flex, Text } from "@chakra-ui/react";
import { GetStaticPropsContext, NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import server from "../services/server";
import { useRouter } from "next/router";
import { PlayerContext } from "../contexts/PlayerContext";
import { useLocalStorage } from "../utils/useLocalStorage";
import { socket } from "../services/socket";
import OffRoom from "../game/Room/Room";
import { Button } from "../components/Button/Button";

const Lobby: NextPage = () => {
  const router = useRouter();

  const { setItem } = useLocalStorage();

  const { player, getPlayer } = useContext(PlayerContext);

  const [rooms, setRooms] = useState<OffRoom[]>([]);

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
          <Flex direction="column" alignItems="center">
            <Text>Rooms</Text>

            <Button
              fontSize={["md, lg, xl, 2xl"]}
              py={["2", "2", "2", "2", "4"]}
              mt="4"
              onClick={handleCreateRoom}
            >
              Criar sala
            </Button>
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
