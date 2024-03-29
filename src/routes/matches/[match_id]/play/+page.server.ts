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
        )
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
      )`
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

    const matchBan = await locals.supabase
      .from("match_bans")
      .insert([{ match_id: params.match_id, map_pool_map_id: mapId }])
      .select("*");

    console.log("Banned map with ID: ", matchBan?.data[0].id);
  },
} satisfies Actions;
