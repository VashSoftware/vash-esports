import type { RequestHandler } from "./$types";
import { v2, auth } from "osu-api-extended";
import { OSU_CLIENT_ID, OSU_CLIENT_SECRET } from "$env/static/private";

export const POST: RequestHandler = async ({ request, locals }) => {
  let { id } = await request.json();

  if (id == "") {
    return new Response("Invalid request");
  }

  if (id.startsWith("https://osu.ppy.sh/beatmapsets/")) {
    const urlParts = id.split("/");
    id = urlParts[urlParts.length - 1];
  }

  let map = await locals.supabase
    .from("maps")
    .select("*, mapsets(*)")
    .eq("osu_id", id)
    .single();
  if (map.data) {
    return new Response(JSON.stringify(map.data));
  }
  const osuMap = await getOsuMap(id);

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
    .select("*");

  map = await locals.supabase
    .from("maps")
    .upsert({
      mapset_id: mapset.data[0].id,
      osu_id: osuMap.id,
      star_rating: osuMap.difficulty_rating,
      approach_rate: osuMap.ar,
      circle_size: osuMap.cs,
      overall_difficulty: osuMap.accuracy,
      difficulty_name: osuMap.version,
    })
    .select("*, mapsets(*)");

  return new Response(JSON.stringify(map.data));
};

async function getOsuMap(id: number) {
  await auth.login(Number(OSU_CLIENT_ID), OSU_CLIENT_SECRET, ["public"]);

  const map = await v2.beatmap.id.details(id);

  return map;
}
