import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

export const socket = io("http://localhost:3333", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server");
});
