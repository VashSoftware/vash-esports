import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const matches = await locals.supabase
    .from("matches")
    .select(
      "*, rounds(events (name)), match_participants(participants(teams(name)))",
    ).order("start_time", { ascending: false });

  return {
    matches: matches.data,
  };
};
