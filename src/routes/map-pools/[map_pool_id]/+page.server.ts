import type { Actions, PageServerLoad } from "./$types";
import { v2, auth } from "osu-api-extended";
import { OSU_CLIENT_ID, OSU_CLIENT_SECRET } from "$env/static/private";

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
    // const formData = await request.formData();
    // const mapId = formData.get("mapId");

    // await auth.login(OSU_CLIENT_ID, OSU_CLIENT_SECRET, ["public"]);

    // const osuMap = await v2.beatmap.id.details(mapId);

    // if (!osuMap) {
    //   return;
    // }

    console.log("hello");

    // await locals.supabase.from("mapsets").upsert({
    //   osu_id: osuMap.beatmapset_id,
    //   artist: osuMap.beatmapset.artist,
    //   title: osuMap.beatmapset.title,
    //   bpm: osuMap.bpm,
    // });
  },
} satisfies Actions;
