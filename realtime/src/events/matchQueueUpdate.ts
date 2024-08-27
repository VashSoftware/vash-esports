import type { SupabaseClient } from "@supabase/supabase-js";
import type { Server } from "socket.io";

export async function handleMatchQueueUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Match queue updated.");

  io.emit("match-queue-update", payload);
}
