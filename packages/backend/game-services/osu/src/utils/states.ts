import type { SupabaseClient } from "@supabase/supabase-js";
import type { Socket } from "socket.io-client";

export async function changeAllPlayersState(
  state: number,
  matchId: number,
  supabase: SupabaseClient,
  socket: Socket
) {
  const players = await supabase
    .from("match_participant_players")
    .select("id, match_participants(match_id)")
    .eq("match_participants.match_id", matchId);

  if (players.error) {
    throw players.error;
  }

  await supabase
    .from("match_participant_players")
    .update({ state: state })
    .in(
      "id",
      players.data.map((player) => player.id)
    );

  socket.emit("match-participant-players-update", { new: { id: matchId } });
}

export async function changeStateById(
  id: number,
  state: number,
  matchId: number,
  supabase: SupabaseClient,
  socket: Socket
) {
  const players = await supabase
    .from("match_participant_players")
    .select(
      "id, team_members(user_profiles(user_platforms(platforms(name), value))), match_participants!inner(match_id)"
    )
    .eq("team_members.user_profiles.user_platforms.value", id)
    .eq("team_members.user_profiles.user_platforms.platforms.name", "osu!")
    .eq("match_participants.match_id", matchId);

  if (players.error) {
    throw players.error;
  }

  await supabase
    .from("match_participant_players")
    .update({ state: state })
    .in(
      "id",
      players.data.map((player) => player.id)
    )
    .select();

  socket.emit("match-participant-players-update", { new: { id: matchId } });
}
