export async function load(request) {
  const userRatingsPromise = request.locals.supabase
    .from("user_ratings")
    .select(
      "*, user_profiles (name, team_members (teams( participants (match_participants (matches (count))))))"
    );

  const matchesPlayedPromise = request.locals.supabase
    .from("matches")
    .select(
      `*, rounds (name, events (id, name)), match_participants (participants (teams (name)))`
    );

  const teamsPromise = request.locals.supabase
    .from("teams")
    .select("*, participants(count)");

  const organisationsPromise = request.locals.supabase
    .from("organisations")
    .select("*, events(count)");

  const [userRatings, matchesPlayed, teams, organisations] = await Promise.all([
    userRatingsPromise,
    matchesPlayedPromise,
    teamsPromise,
    organisationsPromise,
  ]);

  return {
    userRatings: userRatings.data,
    matchesPlayed: matchesPlayed.data,
    teams: teams.data,
    organisations: organisations.data,
  };
}
