import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const matches = await locals.supabase
    .from("matches")
    .select(
      "*, rounds(events (name)), match_participants(participants(teams(name)))",
    );

  return {
    matches: matches.data,
  };
};

export const actions = {
  quickMatch: async ({ locals, params, request }) => {
    const formData = await request.formData();

    const opponentId = formData.get("opponent-id");
    const quickPlayMaps = formData.getAll("quickPlayMap");
    const modIds = formData.getAll("mod");

    const supabase = locals.supabase;

    const insertData = async (table, data) => {
      const result = await supabase.from(table).insert(data).select("*");
      if (result.error) throw new Error(result.error.message);
      return result.data;
    };

    const event = await insertData("events", {
      name: "Stan vs Stan",
      quick_event: true,
    });
    const map_pool = await insertData("map_pools", {
      name: "Quick Play Map Pool Stan vs Stan",
    });

    const mods = await supabase.from("mods").select("*");
    if (mods.error) throw new Error(mods.error.message);

    // Insert mods and their mappings
    for (const mod of mods.data) {
      const mapPoolMod = await insertData("map_pool_mods", {
        type: "mod",
        map_pool_id: map_pool[0].id,
        name: mod.name,
        code: mod.code,
      });

      await insertData("map_pool_mod_mods", {
        map_pool_mod_id: mapPoolMod[0].id,
        mod_id: mod.id,
      });
    }

    // Insert maps into the map pool
    await insertData(
      "map_pool_maps",
      quickPlayMaps.map((map) => ({
        map_pool_id: map_pool[0].id,
        mod_priority: 1,
        map_pool_mod_id: mods.data[0].id,
        map_id: map,
      })),
    );

    const round = await insertData("rounds", {
      event_id: event[0].id,
      map_pool_id: map_pool[0].id,
      best_of: quickPlayMaps.length,
      match_player_bans: 0,
      name: "Stan vs Stan",
    });

    let match = await insertData("matches", {
      ongoing: true,
      start_time: new Date(),
      round_id: round[0].id,
    });

    const participantData = { team_id: 3, event_id: event[0].id };
    const participant_1 = await insertData("participants", participantData);
    const participant_2 = await insertData("participants", participantData);

    const matchParticipantData = [
      {
        match_id: match[0].id,
        participant_id: participant_1[0].id,
        surrendered_bans: true,
      },
      {
        match_id: match[0].id,
        participant_id: participant_2[0].id,
        surrendered_bans: true,
      },
    ];
    const match_participant_1 = await insertData(
      "match_participants",
      matchParticipantData[0],
    );
    const match_participant_2 = await insertData(
      "match_participants",
      matchParticipantData[1],
    );

    const matchParticipantPlayerData = [
      {
        match_participant_id: match_participant_1[0].id,
        team_member: 33,
        state: 1,
      },
      {
        match_participant_id: match_participant_2[0].id,
        team_member: 33,
        state: 1,
      },
    ];
    await insertData(
      "match_participant_players",
      matchParticipantPlayerData[0],
    );
    await insertData(
      "match_participant_players",
      matchParticipantPlayerData[1],
    );

    match = await supabase
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
      match_maps(*, maps(*, mapsets(*)), scores(*, match_participant_players(*))),
      match_bans(*, match_participants(*, participants(*, teams(name))))`)
      .eq("id", match[0].id);

    const osuLobby = locals.supabase.functions.invoke(
      "make-osu-match",
      {
        body: {
          match: match.data[0],
        },
      },
    );

    console.log(osuLobby);

    throw redirect(302, `/matches/${match.data[0].id}/play`);
  },
} satisfies Actions;
