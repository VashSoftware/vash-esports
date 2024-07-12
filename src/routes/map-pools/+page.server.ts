import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const mapPools = await locals.supabase
    .from("map_pools")
    .select(
      `*,
      map_pool_mods(*, map_pool_mod_mods(*, mods(*)), map_pool_maps(*, maps(*, mapsets(*))))`
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return {
    mapPools: mapPools.data,
  };
};
