import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {


  const eventsPromise = supabase.from("events").select("*");
  const matchesPromise = supabase.from("matches").select("*");
  const usersPromise = supabase
    .from("user_profiles")
    .select("*")
    .eq("finished_setup", true);
  const teamsPromise = supabase.from("teams").select("*");
  const organisationsPromise = supabase.from("organisations").select("*");
  const userProfilePromise = supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", session?.user.id);

  const notificationsPromise = supabase
    .from("notifications")
    .select("*, user_profiles!inner(user_id), match_invites(id)")
    .eq("user_profiles.user_id", session?.user.id)
    .is("dismissed_at", null)
    .order("created_at", { ascending: false });

  const ongoingMatchesPromise = supabase
    .from("matches")
    .select(
      `
    id, ongoing, match_participants(
      match_participant_players(
        team_members(
          user_profiles(user_id)
        )
      ), 
      participants(teams(name))
    ), 
    match_queue(*)
    `
    )
    .eq("ongoing", true);

  const announcementPromise = supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .is("removed_at", null)
    .limit(1);

  const quickQueuePromise = supabase
    .from("quick_queue")
    .select(
      "*, teams!inner(*, team_members!inner(user_profiles!inner(user_id)))"
    )
    .not("position", "is", null);

  const matchQueuePromise = supabase
    .from("match_queue")
    .select(
      "*, matches(match_participants(match_participant_players(team_members(user_profiles(user_id)))))"
    )
    .not("position", "is", null);

  const [
    events,
    matches,
    users,
    teams,
    organisations,
    notifications,
    userProfile,
    ongoingMatches,
    announcement,
    quickQueue,
    matchQueue,
  ] = await Promise.all([
    eventsPromise,
    matchesPromise,
    usersPromise,
    teamsPromise,
    organisationsPromise,
    notificationsPromise,
    userProfilePromise,
    ongoingMatchesPromise,
    announcementPromise,
    quickQueuePromise,
    matchQueuePromise,
  ]);

  return {
    supabase,
    userProfile,
    session,
    events: events.data,
    matches: matches.data,
    users: users.data,
    teams: teams.data,
    organisations: organisations.data,
    notifications: notifications.data ?? [],
    ongoingMatches: ongoingMatches?.data,
    announcement: announcement.data?.[0],
    quickQueue: quickQueue.data,
    matchQueue: matchQueue.data,
  };
};
