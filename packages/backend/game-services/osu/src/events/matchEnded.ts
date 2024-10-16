import type { SupabaseClient } from "@supabase/supabase-js";
import type { BanchoMultiplayerChannel } from "bancho.js";
import { changeAllPlayersState } from "../utils/states";

async function updateMatchQueue(supabase: SupabaseClient) {
  const matchQueue = await supabase
    .from("match_queue")
    .select("id, position")
    .gt("position", 0);

  for (const match of matchQueue.data!) {
    await supabase
      .from("match_queue")
      .update({ position: match.position - 1 })
      .eq("id", match.id);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function handleMatchWin(
  matchParticipantPlayerIndex: number,
  supabase: SupabaseClient,
  channel: BanchoMultiplayerChannel,
  match: any
) {
  const matchParticipantPlayer =
    match.data.match_participants[matchParticipantPlayerIndex]
      .match_participant_players[0];

  const winnerName = matchParticipantPlayer.team_members.user_profiles.name;
  await channel.sendMessage(
    `The match has been won by ${winnerName}. The lobby will close in 60 seconds.`
  );

  await supabase
    .from("matches")
    .update({
      ongoing: false,
      winner_participant_id:
        match.data.match_participants[matchParticipantPlayerIndex].id,
    })
    .eq("id", match.data.id);

  // Wait for 60 seconds
  await sleep(60000);

  await channel.lobby.closeLobby();

  await updateMatchQueue(supabase);
}

export async function checkMatchWin(
  supabase: SupabaseClient,
  channel: BanchoMultiplayerChannel,
  match: any
) {
  const matchMaps = await supabase
    .from("match_maps")
    .select(
      "id, scores(score, match_participant_players(match_participant_id))"
    )
    .eq("match_id", match.data.id)
    .order("created_at", { ascending: true });

  if (matchMaps.error) {
    throw matchMaps.error;
  }

  const pointsTeam1 = matchMaps.data.filter(
    (match_map) =>
      match_map.scores
        .filter(
          (score) =>
            // @ts-ignore
            score.match_participant_players.match_participant_id ==
            match.data.match_participants[0].id
        )
        .reduce((sum, score) => sum + score.score, 0) >
      match_map.scores
        .filter(
          (score) =>
            // @ts-ignore
            score.match_participant_players.match_participant_id ==
            match.data.match_participants[1].id
        )
        .reduce((sum, score) => sum + score.score, 0)
  ).length;

  const pointsTeam2 = matchMaps.data.filter(
    (match_map) =>
      match_map.scores
        .filter(
          (score) =>
            // @ts-ignore
            score.match_participant_players.match_participant_id ==
            match.data.match_participants[1].id
        )
        .reduce((sum, score) => sum + score.score, 0) >
      match_map.scores
        .filter(
          (score) =>
            // @ts-ignore
            score.match_participant_players.match_participant_id ==
            match.data.match_participants[0].id
        )
        .reduce((sum, score) => sum + score.score, 0)
  ).length;

  console.log(pointsTeam1, pointsTeam2);

  if (pointsTeam1 > match.data.rounds.best_of / 2) {
    await handleMatchWin(0, supabase, channel, match);
  }

  if (pointsTeam2 > match.data.rounds.best_of / 2) {
    await handleMatchWin(1, supabase, channel, match);
  }
}
