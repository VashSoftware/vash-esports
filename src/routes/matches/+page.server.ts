import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const matches = await locals.supabase
    .from("matches")
      .select("*, rounds(events (name)), match_participants(participants(teams(name)))");

  return {
    matches: matches.data,
  };
};
