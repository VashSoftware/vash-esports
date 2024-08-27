import type { Server } from "socket.io";

export function handleMatchParticipantPlayersUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Match participant players updated");

  io.to(`match-${payload.new.id}`).emit(
    "match-participant-players-update",
    payload
  );
}
