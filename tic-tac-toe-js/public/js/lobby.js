import { socket } from "./socket.js";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage.js";

const player = getLocalStorage("player");

if (!player || !player.id) {
  window.location.href = "/";
}

socket.on("connect", () => {
  socket.emit("get-all-rooms");
});

const createRoomButton = document.getElementById("createRoom");

createRoomButton.onclick = () => {
  const player = JSON.parse(localStorage.getItem("player"));

  createRoom(player);

  createRoomButton.disabled = true;
};

function createRoom(player) {
  socket.emit("create-room", player);
}

function joinRoom(player, roomId) {
  socket.emit("join-room", { player, roomId });
}

socket.on("room-created", (room) => {
  console.log(room);
  if (!room) {
    return;
  }

  setLocalStorage("room", JSON.stringify(room));

  const createRoomButton = document.getElementById("createRoom");

  createRoomButton.disabled = false;

  window.location.href = "/room";
});

socket.on("all-rooms", ({ rooms, roomsStatus }) => {
  document.getElementsByTagName("strong")[0].innerHTML =
    roomsStatus.roomsNumber;

  document.getElementsByTagName("strong")[1].innerHTML =
    roomsStatus.roomsRunning;

  if (rooms.length <= 0) {
    return;
  }

  const roomsSection = document.getElementById("rooms");

  roomsSection.innerHTML = "";

  rooms.forEach((room) => {
    if (room.isRunning) {
      return;
    }

    roomsSection.innerHTML += `
      <div class="room">
        <div>${room.name}</div>

        <div>${room.players.length} / 2</div>

        <button class="joinRoom" data-room-id="${room.id}">Join</button>
      </div>
    `;
  });

  const joinRoomButtons = document.querySelectorAll(".joinRoom");

  joinRoomButtons.forEach((joinRoomButton) => {
    joinRoomButton.onclick = () => {
      const roomId = joinRoomButton.dataset.roomId;

      joinRoom(player, roomId);
    };
  });
});

socket.on("room-joined", (room) => {
  console.log(room);
  if (!room) {
    socket.emit("get-all-rooms");

    return;
  }

  setLocalStorage("room", JSON.stringify(room));

  window.location.href = "/room";
});
