import type { Server } from "socket.io";

export function handleNotificationsUpdate(payload: any, io: Server) {
  console.log("Notifications updated");

  io.to(`user-${payload.new.user_id}`).emit("notifications-update", payload);
}
