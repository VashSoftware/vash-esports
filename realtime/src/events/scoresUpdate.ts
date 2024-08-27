import type { SupabaseClient } from "@supabase/supabase-js";
import type { Server } from "socket.io";

export async function handleScoresUpdate(
  payload: any,
  io: Server,
  supabase: SupabaseClient
) {
  // Your code here
  console.log("Scores updated.");

  io.to(`match-${payload.new.id}`).emit("scores-update", payload);
}
