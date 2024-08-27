import type { Server } from "socket.io";

export function handleMapPoolUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Map pool updated");

  io.to(`pool-${payload.new.id}`).emit("map-pool-update", payload);
}
