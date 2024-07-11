import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { LayoutLoad } from "./$types";
import {
  createBrowserClient,
  createServerClient,
  isBrowser,
  parse,
} from "@supabase/ssr";
import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();

inject({ mode: dev ? "development" : "production" });

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
        cookies: {
          get(key) {
            const cookie = parse(document.cookie);
            return cookie[key];
          },
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
        cookies: {
          get() {
            return JSON.stringify(data.session);
          },
        },
      });

  const session = isBrowser()
    ? (await supabase.auth.getSession()).data.session
    : data.session;

  const eventsPromise = supabase.from("events").select("*");
  const matchesPromise = supabase.from("matches").select("*");
  const usersPromise = supabase.from("user_profiles").select("*");
  const teamsPromise = supabase.from("teams").select("*");
  const organisationsPromise = supabase.from("organisations").select("*");
  const userProfilePromise = supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", session?.user.id);

  const notificationsPromise = supabase
    .from("notifications")
    .select("*, user_profiles(user_id), match_invites(id)")
    .eq("user_profiles.user_id", data.session?.user.id)
    .is("dismissed_at", null)
    .order("created_at", { ascending: false });

  const [
    events,
    matches,
    users,
    teams,
    organisations,
    notifications,
    userProfile,
  ] = await Promise.all([
    eventsPromise,
    matchesPromise,
    usersPromise,
    teamsPromise,
    organisationsPromise,
    notificationsPromise,
    userProfilePromise,
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
  };
};
