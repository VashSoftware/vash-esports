import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const mapPools = await locals.supabase
    .from("map_pools")
    .select(
      `id,
      rounds(name, events(name, event_groups(name))),
      name,
      map_pool_maps(*, map_pool_map_mods(*, mods(*)))`
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return {
    mapPools: mapPools.data,
  };
};
