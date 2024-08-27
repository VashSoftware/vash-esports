import type { SupabaseClient } from "@supabase/supabase-js";
import type { Server } from "socket.io";

export async function handleQuickQueueUpdate(payload: any, io: Server) {
  // Your code here
  console.log("Scores updated.");

  io.emit("quick-queue-update", payload);
}
