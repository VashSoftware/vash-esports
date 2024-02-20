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

    const mapPoolMods = await locals.supabase
      .from("map_pool_mods")
      .select("*, map_pool_maps(*)")
      .eq("map_pool_id", params.map_pool_id);

    await Promise.all(
      mapPoolMods.data.map(async (mapPoolMod) => {
        const formDataKey = `map-pool-mods-${mapPoolMod.id}`;
        const modLengthDifference =
          Number.parseInt(formData.get(formDataKey) as string) -
          mapPoolMod.map_pool_maps.length;

        // console.log("formDataKey: ", formDataKey);
        // console.log("formData.get(formDataKey): ", formData.get(formDataKey));
        // console.log(
        //   "mapPoolMod.map_pool_maps.length: ",
        //   mapPoolMod.map_pool_maps.length
        // );

        if (modLengthDifference == 0) {
          return;
        }

        if (modLengthDifference < 0) {
          console.log(
            `Deleting ${-modLengthDifference} map pool maps with map pool mod: `,
            mapPoolMod.name
          );

          const toBeDeleted = await locals.supabase
            .from("map_pool_maps")
            .select("*")
            .eq("map_pool_mod_id", mapPoolMod.id)
            .limit(-modLengthDifference)
            .order("mod_priority", { ascending: false });

          const maps = await locals.supabase
            .from("map_pool_maps")
            .delete()
            .in(
              "id",
              toBeDeleted.data.map((map) => map.id)
            );

          console.log(maps);
        }

        if (modLengthDifference > 0) {
          console.log(
            `Adding ${modLengthDifference} map pool maps with map pool mod: `,
            mapPoolMod.name
          );

          let mapPoolMaps = [];
          for (let i = 0; i < modLengthDifference; i++) {
            mapPoolMaps.push({
              map_pool_id: params.map_pool_id,
              mod_priority: mapPoolMod.map_pool_maps.length + i + 1,
              map_pool_mod_id: mapPoolMod.id,
            });
          }

          const maps = await locals.supabase
            .from("map_pool_maps")
            .insert(mapPoolMaps);
        }
      })
    );
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
