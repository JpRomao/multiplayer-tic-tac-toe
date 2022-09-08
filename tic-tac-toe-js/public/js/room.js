import { socket } from "./socket.js";
import { getLocalStorage, removeLocalStorage } from "../utils/localStorage.js";

const player = getLocalStorage("player");
const room = getLocalStorage("room");

socket.emit("enter-room", {
  player,
  room,
});

socket.on("entered-room", ({ room, isAtRoom }) => {
  if (!isAtRoom) {
    removeLocalStorage("room");

    window.location.href = "/lobby";

    return;
  }

  if (!room) {
    return;
  }

  document.title = `${document.title} ${room.roomId}`;

  renderBoard(room.board.board);
});

socket.on("played", (board) => {
  renderBoard(board);
});

socket.on("room-not-found", () => {
  removeLocalStorage("room");

  window.location.href = "/lobby";
});

function renderBoard(board) {
  const boardDiv = document.getElementById("board");

  boardDiv.innerHTML = "";

  board.forEach((position) => {
    console.log("position", position);

    boardDiv.innerHTML += `<div class="position">${
      position === 0 ? "X" : position === 1 ? "O" : ""
    }</div>`;
  });

  const positions = document.querySelectorAll(".position");

  positions.forEach((position, index) => {
    position.onclick = () => {
      socket.emit("play", {
        position: index,
        room: room,
        player,
      });
    };
  });
}
