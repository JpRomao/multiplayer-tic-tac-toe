import io from "socket.io-client";

const socket = io("http://localhost:3334", {
  transports: ["websocket"],
});

socket.on("join-room", (data) => {
  console.log(data);
});
