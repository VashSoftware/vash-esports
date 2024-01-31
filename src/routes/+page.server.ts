import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const matches = await locals.supabase
    .from("matches")
    .select(
      `*, rounds (name, events (id, name)), match_participants (points, participants (teams (name))), spectators(count)`
    )
    .eq("ongoing", true)
    .is("spectators.stopped_at", null);

  const events = await locals.supabase
    .from("events")
    .select(
      `*, participants (teams(team_members( user_profiles(*)))), organisations (name)`
    )
    .eq("started", true)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    matches: matches.data,
    events: events.data,
  };
};

export const actions = {
  register: async (event) => { console.log('hello!')}
} satisfies Actions;