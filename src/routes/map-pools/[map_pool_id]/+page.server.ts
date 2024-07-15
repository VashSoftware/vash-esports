import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const mapPool = await locals.supabase
    .from("map_pools")
    .select(
      `*,
      map_pool_maps(*, maps(*, mapsets(*)), map_pool_map_mods(*, mods(*)))`
    )
    .eq("id", params.map_pool_id)
    .single();

  // Group maps by mod order
  const groupedByModOrder = mapPool.data.map_pool_maps.reduce((acc, map) => {
    const modOrder = map.map_pool_map_mods[0]?.mods.order;
    if (!acc[modOrder]) {
      acc[modOrder] = [];
    }
    acc[modOrder].push(map);
    return acc;
  }, {});

  // Sort each group by mod priority and flatten the groups back into a single array
  mapPool.data.map_pool_maps = Object.values(groupedByModOrder).reduce(
    (sortedMaps, group) => {
      const sortedGroup = group.sort((a, b) => a.mod_priority - b.mod_priority);
      return sortedMaps.concat(sortedGroup);
    },
    []
  );

  console.dir(mapPool);

  return {
    mapPool: mapPool.data,
  };
};

export const actions = {
  addMap: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const mapId = formData.get("mapId");
    const notes = formData.get("notes");
    const mapPoolMapId = formData.get("mapPoolMapId");

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .update({
        map_id: mapId,
        notes: notes,
      })
      .eq("id", mapPoolMapId);
  },
  editMapPool: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");

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
  deleteMapPool: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const mapPoolMapId = formData.get("map-pool-map-id");

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .update({ map_id: null })
      .eq("id", mapPoolMapId);
  },
  deleteMapPoolMap: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const mapPoolMapId = formData.get("map-pool-map-id");

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .update({ map_id: null })
      .eq("id", mapPoolMapId);
  },
  updateMapPoolMapNotes: async ({ locals, params, request }) => {
    const formData = await request.formData();
    const mapPoolMapId = formData.get("map-pool-map-id");
    const notes = formData.get("notes");

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .update({ notes: notes })
      .eq("id", mapPoolMapId);
  },
  addMapPoolMod: async ({ locals, params, request }) => {
    const formData = await request.formData();

    console.dir(formData);

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .insert({
        map_pool_id: params.map_pool_id,
        mod_priority: 1,
      })
      .select("id")
      .single();

    const mapPoolMapMod = await locals.supabase
      .from("map_pool_map_mods")
      .insert({
        map_pool_map_id: mapPoolMap.data.id,
        mod_id: formData.get("mods"),
      });

    console.dir(mapPoolMapMod);
  },
  addMapPoolMapMod: async ({ locals, params, request }) => {
    const formData = await request.formData();

    console.dir(formData);

    const mapPoolMap = await locals.supabase
      .from("map_pool_maps")
      .insert({
        map_pool_id: params.map_pool_id,
        mod_priority: formData.get("mod-priority"),
      })
      .select("id")
      .single();

    const mapPoolMapMod = await locals.supabase
      .from("map_pool_map_mods")
      .insert({
        map_pool_map_id: mapPoolMap.data.id,
        mod_id: formData.get("mod-id"),
      });
  },
  removeMapPoolMap: async ({ locals, params, request }) => {
    const formData = await request.formData();

    await locals.supabase
      .from("map_pool_map_mods")
      .delete()
      .eq("map_pool_map_id", formData.get("map-pool-map-id"));

    await locals.supabase
      .from("map_pool_maps")
      .delete()
      .eq("id", formData.get("map-pool-map-id"));
  },
} satisfies Actions;
