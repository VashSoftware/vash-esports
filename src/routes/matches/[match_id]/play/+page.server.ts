import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const match = await locals.supabase
    .from("matches")
    .select(
      "*, rounds (*, map_pools(*, map_pool_maps(*, maps(*, mapsets(*)), map_pool_map_mods(*))))"
    )
    .eq("id", params.match_id)
    .single();

  console.log(match);

  return {
    match: match.data,
  };
};

export const actions = {
  addPrediction: async ({ locals, params, request }) => {},
} satisfies Actions;
