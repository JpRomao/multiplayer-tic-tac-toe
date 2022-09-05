import { Button, Flex, Input } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { PlayerContext } from "../contexts/PlayerContext";
import server from "../services/server";
import { Player } from "../types/player";

const Home: NextPage = () => {
  const router = useRouter();

  const { updatePlayer } = useContext(PlayerContext);

  const [name, setName] = useState("");

  useEffect(() => {
    const currentPlayer: Player = JSON.parse(
      localStorage.getItem("player") || "{}"
    );

    if (!currentPlayer.name) {
      return;
    }

    updatePlayer(currentPlayer);

    if (currentPlayer) {
      router.push("/lobby");
    }
  }, [router, updatePlayer]);

  const handleCreatePlayer = async () => {
    const response = await server.post("/create/player", {
      playerName: name,
    });

    if (response.status !== 200) {
      return;
    }

    localStorage.setItem("player", JSON.stringify(response.data));

    updatePlayer(response.data);

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
