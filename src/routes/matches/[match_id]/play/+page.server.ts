import { PUBLIC_OSU_SERVER_ENDPOINT } from "$env/static/public";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import _ from "lodash";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const match = await locals.supabase
    .from("matches")
    .select(
      `
      *,
      rounds(
        *,
        events(
          *,
          event_groups(
            *
          )
        )
      ),
      match_participants(
        *,
        match_participant_players(
          *,
          match_participant_player_states(
            *
          ),
          team_members(
            *,
            user_profiles(
              *
            )
          )
        ),
        participants(*,
          teams(*, team_members(user_profiles(id, user_id)))
        )
      ),
      match_maps(*,
        map_pool_maps(*,
          maps(*,
            mapsets(*)
          )
        ),
        scores(*,
          match_participant_players(*)
        )
      ),
      match_bans(*,
        match_participants(*,
          participants(*,
            teams(name)
          )
        )
      ),
      map_pools(
        *,          
        map_pool_maps(
          *,
          maps(
            *,
            mapsets(
              *
            )
          ),
          map_pool_map_mods(
            *,
            mods(
              *
            )
          )
        )
      )
      `
    )
    .eq("id", params.match_id)
    .order("created_at", { referencedTable: "match_maps" })
    .single();

  return {
    match: match.data,
  };
};

export const actions = {
  banMap: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const mapId = formData.get("map-pool-map-id");
    const banId = formData.get("ban-id");

    const matchBan = await locals.supabase
      .from("match_bans")
      .update({ map_pool_map_id: mapId, ban_time: new Date() })
      .eq("id", banId)
      .select("*");

    console.log(matchBan.error);

    console.log("Banned map with ID: ", matchBan.data?.id);
  },
  surrenderBans: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const matchParticipant = formData.get("match-participant-id");

    await locals.supabase
      .from("match_participants")
      .update({ surrendered_bans: true })
      .eq("id", matchParticipant);

    console.log("Surrendered bans for participant with ID: ", matchParticipant);
  },
  pickMap: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const mapId = formData.get("map-id");
    const matchParticipant = formData.get("match-participant-id");

    const match = await locals.supabase
      .from("matches")
      .select(`*, match_participants(match_participant_players(id))`)
      .eq("id", params.match_id)
      .single();

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .select("*, maps(*), map_pool_map_mods(mods(code))")
      .eq("id", mapId)
      .single();

    const matchMap = await locals.supabase
      .from("match_maps")
      .insert({
        map_pool_map_id: mapId,
        match_id: params.match_id,
        status: "waiting",
        picked_by: matchParticipant,
      })
      .select("id, map_pool_maps(maps(osu_id))")
      .single();

    const scores = [];

    for (const participant of match.data.match_participants) {
      for (const player of participant.match_participant_players) {
        scores.push({
          match_map_id: matchMap.data.id,
          match_participant_player_id: player.id,
        });
      }
    }

    await locals.supabase.from("scores").insert(scores);

    try {
      const response = await fetch(
        PUBLIC_OSU_SERVER_ENDPOINT + "/send-messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channelId: match.data.lobby_id,
            messages: [
              `!mp map ${matchMap.data.map_pool_maps.maps.osu_id}`,
              `!mp mods NF ${mapPoolMap.data.map_pool_map_mods.map(
                (mod) => mod.mods.code
              )}`,
            ],
          }),
        }
      );

      if (!response.ok) {
        // Handle server response errors (e.g., 4xx and 5xx status codes)
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending messages to the server:", error);
      // Here, you can add more specific error handling, for example:
      // - Retry the request if it makes sense
      // - Notify the user/admin
      // - Log the error for further investigation
    }

    console.log("Picked map with ID: ", mapId);
  },
  startMap: async ({ locals, params, request }) => {
    const match = await locals.supabase
      .from("matches")
      .select("*")
      .eq("id", params.match_id)
      .single();

    await fetch(PUBLIC_OSU_SERVER_ENDPOINT + "/send-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: match.data.lobby_id,
        messages: [`!mp start 5`],
      }),
    });
  },
  endMatch: async ({ locals, params, request }) => {
    const match = await locals.supabase
      .from("matches")
      .update({ ongoing: false })
      .eq("id", params.match_id)
      .select("*")
      .single();

    await fetch(PUBLIC_OSU_SERVER_ENDPOINT + "/send-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: match.data.lobby_id,
        messages: [`!mp close`],
      }),
    });

    console.log("Deleted match with ID: ", params.match_id);

    throw redirect(302, `/matches`);
  },
  invitePlayer: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const matchParticipantPlayerId = formData.get(
      "match-participant-player-id"
    );

    const matchParticipantPlayer = await locals.supabase
      .from("match_participant_players")
      .select(
        "*, match_participants(matches(lobby_id)), team_members(user_profiles(name, user_platforms(*, platforms(name))))"
      )
      .eq("id", matchParticipantPlayerId)
      .single();

    await fetch(PUBLIC_OSU_SERVER_ENDPOINT + "/send-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          "!mp invite " +
            matchParticipantPlayer.data.team_members.user_profiles.user_platforms.filter(
              (pf: any) => pf.platforms.name == "osu!"
            )[0].value,
        ],
        channelId:
          matchParticipantPlayer.data.match_participants.matches.lobby_id,
      }),
    });

    console.log(
      "Invited player: ",
      matchParticipantPlayer.data.team_members.user_profiles.name
    );
  },
  roll: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const matchParticipantPlayer = await locals.supabase
      .from("match_participants")
      .update({ roll: Math.floor(Math.random() * 100) + 1 })
      .eq("id", formData.get("match-participant-id"));
  },
  addSampleScores: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const matchMapScores = await locals.supabase
      .from("scores")
      .select("id")
      .eq("match_map_id", formData.get("match-map-id"));

    for (const score of matchMapScores.data) {
      await locals.supabase
        .from("scores")
        .update({ score: Math.floor(Math.random() * 1_000_000) })
        .eq("id", score.id);
    }

    await locals.supabase
      .from("match_maps")
      .update({ status: "finished" })
      .eq("id", formData.get("match-map-id"));

    const match = await locals.supabase
      .from("matches")
      .select(
        "*, match_maps(*, scores(*, match_participant_players(*))), match_participants(id, match_participant_players(match_participant_id)), rounds(best_of)"
      )
      .eq("id", params.match_id)
      .single();

    // Calculate wins for each participant
    const winsForParticipant1 = match.data.match_maps.filter(
      (match_map) =>
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              match.data.match_participants[0].id
          )
          .reduce((sum, score) => sum + score.score, 0) >
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              match.data.match_participants[1].id
          )
          .reduce((sum, score) => sum + score.score, 0)
    ).length;

    const winsForParticipant2 = match.data.match_maps.filter(
      (match_map) =>
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              match.data.match_participants[1].id
          )
          .reduce((sum, score) => sum + score.score, 0) >
        match_map.scores
          .filter(
            (score) =>
              score.match_participant_players.match_participant_id ==
              match.data.match_participants[0].id
          )
          .reduce((sum, score) => sum + score.score, 0)
    ).length;

    // Determine if a participant has won more than half of the total rounds
    const halfOfBestOf = match.data.rounds.best_of / 2;
    if (
      winsForParticipant1 > halfOfBestOf ||
      winsForParticipant2 > halfOfBestOf
    ) {
      // Update the match to no longer ongoing
      const updatedMatch = await locals.supabase
        .from("matches")
        .update({ ongoing: false })
        .eq("id", params.match_id);
    }
  },
  deleteScores: async ({ locals, params, request }) => {
    const formData = await request.formData();

    await locals.supabase
      .from("scores")
      .delete()
      .eq("match_map_id", formData.get("match-map-id"));

    await locals.supabase
      .from("match_maps")
      .delete()
      .eq("id", formData.get("match-map-id"));
  },
} satisfies Actions;
