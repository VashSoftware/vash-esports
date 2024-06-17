import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { LayoutLoad } from "./$types";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();

inject({ mode: dev ? "development" : "production" });

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        fetch,
      },
      cookies: {
        get(key) {
          if (!isBrowser()) {
            return JSON.stringify(data.session);
          }

          const cookie = parse(document.cookie);
          return cookie[key];
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userPromise = supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", session?.user.id)
    .single();

  const eventsPromise = supabase.from("events").select("*");
  const matchesPromise = supabase.from("matches").select("*");
  const usersPromise = supabase.from("user_profiles").select("*");
  const teamsPromise = supabase.from("teams").select("*");
  const organisationsPromise = supabase.from("organisations").select("*");

  const notificationsPromise = supabase
    .from("notifications")
    .select("*, user_profiles(user_id)")
    .eq("user_profiles.user_id", (await supabase.auth.getUser()).data.user.id)
    .is("dismissed_at", null)
    .order("created_at", { ascending: false });

  const [user, events, matches, users, teams, organisations, notifications] =
    await Promise.all([
      userPromise,
      eventsPromise,
      matchesPromise,
      usersPromise,
      teamsPromise,
      organisationsPromise,
      notificationsPromise,
    ]);

  const userPictureUrl = await supabase.storage
    .from("user_pictures")
    .getPublicUrl(user.data?.id);

  return {
    supabase,
    session,
    userPictureUrl: userPictureUrl.data.publicUrl,
    user,
    events: events.data,
    matches: matches.data,
    users: users.data,
    teams: teams.data,
    organisations: organisations.data,
    notifications: notifications.data,
  };
};
