import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import type { LayoutLoad } from "./$types";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";

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
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", session?.user.id)
    .single();

  const userPictureUrl = await supabase.storage
    .from("user_pictures")
    .getPublicUrl(user.data?.id);

  return { supabase, session, userPictureUrl: userPictureUrl.data.publicUrl };
};