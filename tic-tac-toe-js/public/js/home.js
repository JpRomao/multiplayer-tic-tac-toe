// import axios from "axios";

import axios from "axios";

async function createPlayer(event) {
  event.preventDefault();

  console.log(event);

  const playerName = document.getElementsByName("playerName")[0].value;

  const player = await axios.post("/players/create", {
    playerName,
  });

  window.history.pushState({}, "", `/lobby`);

  // const response = await axios.post("/api/players", {
  //   playerName,
  // });

  // console.log(response);
}
