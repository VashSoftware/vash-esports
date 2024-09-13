import type { Server } from "socket.io";

export function handleMatchMapsUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Match maps updated");

  io.to(`match-${payload.new.id}`).emit("match-maps-update", payload);
}
