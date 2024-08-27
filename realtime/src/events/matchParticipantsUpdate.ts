import type { Server } from "socket.io";

export function handleMatchParticipantsUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Match participants updated");

  io.to(`match-${payload.new.id}`).emit("match-participants-update", payload);
}
