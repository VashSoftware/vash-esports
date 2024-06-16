import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

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
      match_maps(*, map_pool_maps(*, maps(*, mapsets(*))), scores(*, match_participant_players(*))),
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

    const match = await locals.supabase
      .from("matches")
      .select(
        `*, match_participants(match_participant_players(id)), rounds(map_pool_id)`,
      )
      .eq("id", params.match_id)
      .single();

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .select("*, maps(*), map_pool_mods(code)")
      .eq("id", mapId)
      .single();

    const matchMap = await locals.supabase
      .from("match_maps")
      .insert({ map_pool_map_id: mapId, match_id: params.match_id })
      .select("id, map_pool_maps(maps(*))")
      .single();

    for (
      const participant of match.data.match_participants
    ) {
      for (const player of participant.match_participant_players) {
        await locals.supabase.from("scores").insert({
          match_map_id: matchMap.data.id,
          match_participant_player_id: player.id,
        });
      }
    }

    locals.supabase.functions.invoke(
      "send-osu-message",
      {
        body: {
          channel: match.data.channel_name,
          messages: [
            `!mp map ${matchMap.data.map_pool_maps.maps.osu_id}`,
            `!mp mods ${mapPoolMap.data.map_pool_mods.code}`,
          ],
        },
      },
    );

    console.log("Picked map with ID: ", mapId);
  },
  sendOsuMessage: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const channel = formData.get("channel");
    const message = formData.get("message");

    locals.supabase.functions.invoke(
      "send-osu-message",
      {
        body: { channel: channel, messages: [message] },
      },
    );
  },
  makeMatch: async ({ locals, params, request }) => {
    const match = await locals.supabase
      .from("matches")
      .select(`*, 
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
      match_maps(*, map_pool_maps( maps(*, mapsets(*))), scores(*, match_participant_players(*))),
      match_bans(*, match_participants(*, participants(*, teams(name))))`)
      .eq("id", params.match_id)
      .single();

    locals.supabase.functions.invoke(
      "make-osu-match",
      {
        body: { match: match.data },
      },
    );
  },
  startMap: async ({ locals, params, request }) => {
    const match = await locals.supabase
      .from("matches")
      .select("*")
      .eq("id", params.match_id)
      .single();

    locals.supabase.functions.invoke(
      "send-osu-message",
      {
        body: {
          channel: match.data.channel_name,
          messages: [
            `!mp start 5`,
          ],
        },
      },
    );
  },
  deleteMatch: async ({ locals, params, request }) => {
    const match = await locals.supabase
      .from("matches")
      .update({ ongoing: false })
      .eq("id", params.match_id)
      .select("*");

    locals.supabase.functions.invoke(
      "send-osu-message",
      {
        body: {
          channel: match.data[0].channel_name,
          messages: [
            `!mp close`,
          ],
        },
      },
    );

    console.log("Deleted match with ID: ", params.match_id);

    throw redirect(302, `/matches`);
  },
} satisfies Actions;
