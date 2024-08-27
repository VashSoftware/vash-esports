import type { RequestHandler } from "./$types";
import { auth, v2 } from "osu-api-extended";
import { OSU_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_OSU_CLIENT_ID } from "$env/static/public";

export const POST: RequestHandler = async ({ request, locals }) => {
  let { search } = await request.json();

  if (search == "") {
    return new Response("Invalid request");
  }

  if (search.startsWith("https://osu.ppy.sh/beatmapsets/")) {
    const urlParts = search.split("/");
    search = urlParts[urlParts.length - 1];
  }

  if (isNaN(Number(search))) {
    return new Response("Invalid request");
  }

  const osuMap = await getOsuMap(search);

  if (!osuMap.id) {
    return new Response("Map not found", { status: 404 });
  }

  const mapset = await locals.supabase
    .from("mapsets")
    .upsert({
      osu_id: osuMap.beatmapset_id,
      artist: osuMap.beatmapset.artist,
      title: osuMap.beatmapset.title,
      bpm: osuMap.bpm,
      creator: osuMap.beatmapset.creator,
    })
    .select("*")
    .single();

  console.dir(mapset);

  const map = await locals.supabase
    .from("maps")
    .upsert({
      mapset_id: mapset.data.id,
      osu_id: osuMap.id,
      star_rating: osuMap.difficulty_rating,
      approach_rate: osuMap.ar,
      circle_size: osuMap.cs,
      overall_difficulty: osuMap.accuracy,
      difficulty_name: osuMap.version,
    })
    .select("*, mapsets(*)")
    .single();

  return new Response(JSON.stringify(map.data));
};

async function getOsuMap(id: number) {
  await auth.login(Number(PUBLIC_OSU_CLIENT_ID), OSU_CLIENT_SECRET, ["public"]);

  const map = await v2.beatmap.id.details(id);

  return map;
}
