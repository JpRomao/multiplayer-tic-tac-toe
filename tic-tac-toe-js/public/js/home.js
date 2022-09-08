import { socket } from "./socket.js";
import { treatName } from "../utils/nameTreat.js";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage.js";

const form = document.getElementById("playerForm");

const player = getLocalStorage("player");

if (player && player.id) {
  window.location.href = "/lobby";
}

function createPlayer(playerName) {
  if (!playerName) {
    return;
  }

  playerName = treatName(playerName);

  socket.emit("create-player", playerName);
}

form.onsubmit = (event) => {
  event.preventDefault();

  const playerName = document.getElementById("playerName").value;

  createPlayer(playerName);
};

socket.on("player-created", (player) => {
  setLocalStorage("player", JSON.stringify(player));

  window.location.href = "/lobby";
});
