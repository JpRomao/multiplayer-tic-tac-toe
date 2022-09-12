import { Button, Flex, Input } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { PlayerContext } from "../contexts/PlayerContext";
import server from "../services/server";
import { useLocalStorage } from "../utils/useLocalStorage";

const Home: NextPage = () => {
  const router = useRouter();

  const { updatePlayer, getPlayer } = useContext(PlayerContext);
  const { setItem } = useLocalStorage();

  const [name, setName] = useState("");

  useEffect(() => {
    getPlayer().then((player) => {
      if (player) {
        router.push("/lobby");

        return;
      }
    });
  }, [router, getPlayer]);

  const handleCreatePlayer = async () => {
    const { data, status } = await server.post("/create/player", {
      name,
    });

    if (status !== 201) {
      return;
    }

    setItem("player", data.player);

    updatePlayer(data.player);

    router.push("/lobby");
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Flex direction="column" alignItems="center" maxW="700px" width="100%">
        <Flex alignItems="center" width="50%">
          <label htmlFor="playerName">Nome: </label>

          <Input
            type="text"
            value={name}
            name="playerName"
            onChange={(e) => {
              const { value } = e.target;

              setName(value);
            }}
          />
        </Flex>

        <Button
          type="button"
          bg="pink.700"
          onClick={handleCreatePlayer}
          width="25%"
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
