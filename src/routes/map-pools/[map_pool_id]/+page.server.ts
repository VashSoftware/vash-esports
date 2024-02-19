import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals, params, url }) => {
  const mapPool = await locals.supabase
    .from("map_pools")
    .select(
      `*,
            map_pool_maps(*, maps(*, mapsets(*)))`
    )
    .eq("id", params.map_pool_id)
    .single();

  return {
    mapPool: mapPool.data,
  };
};

export const actions = {
  addMap: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const mapId = formData.get("mapId");
    const notes = formData.get("notes");

    const mapPoolMap = await locals.supabase.from("map_pool_maps").upsert({
      map_pool_id: params.map_pool_id,
      map_id: mapId,
      notes: notes,
    });
  },
} satisfies Actions;
