import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals, params, url }) => {
  const mapPool = await locals.supabase
    .from("map_pools")
    .select(
      `*,
      map_pool_mods(*, map_pool_mod_mods(*, mods(*)), map_pool_maps(*, maps(*, mapsets(*))))`
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
  editMapPool: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");

    // console.log(formData);

    const mapPool = await locals.supabase
      .from("map_pools")
      .upsert({
        id: params.map_pool_id,
        name: name,
        description: description,
      })
      .select("*");

    const mapPoolMods = await locals.supabase
      .from("map_pool_mods")
      .select("*, map_pool_maps(*)")
      .eq("map_pool_id", params.map_pool_id);

    mapPoolMods.data.forEach(async (mapPoolMod) => {
      const formDataKey = `map-pool-mods-${mapPoolMod.mod_id}`;

      if (formData.get(formDataKey) == mapPoolMod.map_pool_maps.length) {
        return;
      }

      if (formData.get(formDataKey) == 0) {
        await locals.supabase
          .from("map_pool_maps")
          .delete()
          .eq("id", mapPoolMod.id);
      }

      if (formData.get(formDataKey) > 0) {
        await locals.supabase
          .from("map_pool_mods")
          .upsert({
            id: mapPoolMod.id,
            count: formData.get(formDataKey),
          })
          .select("*");
      }
    });
  },
  deleteMapPoolMap: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const mapPoolMapId = formData.get("map-pool-map-id");

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .delete()
      .eq("id", mapPoolMapId);
  },
} satisfies Actions;
