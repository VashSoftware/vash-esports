export async function load(request) {
  const userRatings = await request.locals.supabase
    .from("user_ratings")
    .select(
      "*, user_profiles (name, team_members (teams( participants (match_participants (matches (count))))))"
    );

  const matchesPlayed = await request.locals.supabase
    .from("matches")
    .select(
      `*, rounds (name, events (id, name)), match_participants (participants (teams (name)))`
    );

  const teams = await request.locals.supabase.from("teams").select("*, participants(count)");

  const organisations = await request.locals.supabase.from('organisations').select('*, events(count)')

  return {
    userRatings: userRatings.data,
    matchesPlayed: matchesPlayed.data,
    teams: teams.data,
    organisations: organisations.data,
  };
}
