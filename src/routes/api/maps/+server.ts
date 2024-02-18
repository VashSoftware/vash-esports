import type { RequestHandler } from "./$types";
import { v2, auth } from "osu-api-extended";
import { OSU_CLIENT_ID, OSU_CLIENT_SECRET } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
  await auth.login(Number(OSU_CLIENT_ID), OSU_CLIENT_SECRET, ["public"]);

  const { id } = await request.json();

  const map = await v2.beatmap.id.details(id);

  return new Response(JSON.stringify(map));
};
