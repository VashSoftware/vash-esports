import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const match = await locals.supabase
    .from("matches")
    .select(
      `*, 
      rounds (*, 
        map_pools(*,
          map_pool_mods(*,
            map_pool_mod_mods(*,
              mods(*
              )
            ),
            map_pool_maps(*,
              maps(*, 
                mapsets(*
                )
              )
            )
          )
        ),
        events(*, event_groups(*))
      ),
      match_participants(*,
        match_participant_players(*,
          match_participant_player_states(*
          ),
          team_members(*, 
            user_profiles(*
            )
          )
        ),
        participants(*, 
          teams(*
          )
        )
      ),
      match_maps(*, maps(*, mapsets(*)), scores(*, match_participant_players(*))),
      match_bans(*, match_participants(*, participants(*, teams(name))))`,
    )
    .eq("id", params.match_id)
    .order("priority", {
      referencedTable: "rounds.map_pools.map_pool_mods",
      ascending: true,
    })
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

    const matchMap = await locals.supabase
      .from("match_maps")
      .insert({ map_id: mapId, match_id: params.match_id })
      .select("*");

    const mapPlayers = await locals.supabase
      .from("match_participant_players")
      .select("*, match_participants(*)")
      .eq("match_participants.match_id", params.match_id);

    for (const player of mapPlayers.data) {
      await locals.supabase.from("scores").insert({
        match_map_id: matchMap.data[0].id,
        match_participant_player_id: player.id,
      });
    }

    console.log("Picked map with ID: ", mapId);
  },
  sendOsuMessage: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const channel = formData.get("channel");
    const message = formData.get("message");

    const { data, error } = await locals.supabase.functions.invoke(
      "send-osu-message",
      {
        body: { channel: channel, messages: [message, message, message] },
      },
    );

    console.log(data, error);
  },
} satisfies Actions;
