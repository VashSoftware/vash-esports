import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const match = await locals.supabase
    .from("matches")
    .select(
      `*, 
  rounds (*, 
    map_pools(*, 
        map_pool_maps(*, 
            maps(*, 
                mapsets(*)), 
            map_pool_map_mods(*)))), 
  match_participants(*,
    match_participant_players(*,
      match_participant_player_states(*),   
        team_members(*, 
            user_profiles(*))),
    participants(*, 
        teams(*))))`
    )
    .eq("id", params.match_id)
    .single();

  return {
    match: match.data,
  };
};

export const actions = {
  addPrediction: async ({ locals, params, request }) => {},
} satisfies Actions;
