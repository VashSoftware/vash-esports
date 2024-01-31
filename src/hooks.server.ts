import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from "$env/static/private";
import { createServerClient } from "@supabase/ssr";

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          event.cookies.set(key, value, options);
        },
        remove: (key, options) => {
          event.cookies.delete(key, options);
        },
      },
    }
  );

  const session = await event.locals.supabase.auth.getSession();
  if (session.data.session) {
      const user = await event.locals.supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", session.data.session.user.id)
      .single();

    event.locals.user = user.data;
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};
