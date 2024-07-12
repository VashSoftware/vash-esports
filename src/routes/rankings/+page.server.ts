export async function load(request) {
  const userRatingsPromise = request.locals.supabase
    .from("user_profiles")
    .select(
      "*, user_ratings(*), team_members (teams( participants (match_participants (matches (id)))))"
    )
    .eq("finished_setup", true);

  const teamsPromise = request.locals.supabase
    .from("teams")
    .select("*, participants(count)");

  const organisationsPromise = request.locals.supabase
    .from("organisations")
    .select("*, events(count)");

  const [userRatings, teams, organisations] = await Promise.all([
    userRatingsPromise,
    teamsPromise,
    organisationsPromise,
  ]);

  return {
    userRatings: userRatings.data,
    teams: teams.data,
    organisations: organisations.data,
  };
}
