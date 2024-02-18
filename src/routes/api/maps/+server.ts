import type { RequestHandler } from "./$types";
import { v2, auth } from "osu-api-extended";
import { OSU_CLIENT_ID, OSU_CLIENT_SECRET } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
  await auth.login(Number(OSU_CLIENT_ID), OSU_CLIENT_SECRET, ["public"]);

  let { id } = await request.json();

  if (!id) {
    return new Response("Invalid request", { status: 400 });
  }

  if (id.startsWith("https://osu.ppy.sh/beatmapsets/")) {
    const urlParts = id.split("/");
    id = urlParts[urlParts.length - 1];
  }

  const map = await v2.beatmap.id.details(id);

  return new Response(JSON.stringify(map));
};
