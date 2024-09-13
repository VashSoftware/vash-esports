import type { Server } from "socket.io";

export function handleMatchesUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Matches updated");

  io.emit("matches-update", payload);
}
