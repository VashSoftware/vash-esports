import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const events = await locals.supabase
    .from("events")
    .select(`*, participants (teams(team_members( user_profiles(*)))), organisations (name)`)
    .eq('started', true)
    .order("created_at", { ascending: false })
    .limit(10);
  
  const matches = await locals.supabase
    .from("matches")
    .select(
      `*, rounds (name, events (id, name)), participants!matches_participant1_id_fkey (teams (name))`
  );

  console.log(events)

  return {
    events: events.data,
    matches: matches.data,
  };
};
