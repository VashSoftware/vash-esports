import { createServerClient } from "@supabase/ssr";
import { type Handle, redirect } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { JWT_SECRET } from "$env/static/private";
import type { Session } from "@supabase/supabase-js";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          event.cookies.set(key, value, { ...options, path: "/" });
        },
        remove: (key, options) => {
          event.cookies.delete(key, { ...options, path: "/" });
        },
      },
    }
  );

  event.locals.getSession = async (): Promise<Session | null> => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) return null;

    /**
     * Ensures the session is fully validated. See README Security section for details.
     *
     * !!! Simply verifying the JWT does not validate the `session.user` object for use. !!!
     * See "False Security" in https://github.com/orgs/supabase/discussions/23224
     * The safest and easiest way to validate the session is by calling `getUser()`
     * and using it's returned data. An alternative, which does not make a network call,
     * is to create a validated session; which we do below.
     */
    try {
      const decoded = jwt.verify(session.access_token, JWT_SECRET);

      /**
       * Create a validated session.
       *
       * Most of these properties are required for functionality or typing.
       * Add any data needed for your layouts or pages. In this example,
       * the only properties which aren't required are `user.user_metadata.avatar_url & .nickname`,
       * otherwise we'd just need to leave `user.user_metadata` as an empty object.
       *
       * If possible, avoid using anything from `session.user` to populate these,
       * especially unique user data like `id`, an email address, or any other
       * user-unique data for queries.
       */
      const validated_session: Session = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: decoded.exp,
        expires_in: decoded.exp - Math.round(Date.now() / 1000),
        token_type: "bearer",
        user: {
          app_metadata: {},
          aud: "authenticated",
          created_at: "",
          id: decoded.sub,
          user_metadata: {
            avatar_url: decoded.user_metadata?.avatar_url,
            nickname: decoded.user_metadata?.nickname,
          },
        },
      };

      return validated_session;
    } catch (err) {
      return null;
    }
  };

  const session = await event.locals.getSession();

  /**
   * Only authenticated users can access these paths and their sub-paths.
   *
   * If you'd rather do this in your routes, see (authenticated)/app/+page.server.ts
   * for an example.
   *
   * If you don't use a layout group for auth-protected paths, then you can use
   * new Set(['app', 'self']) or whatever your top-level path segments are, and
   * .has(event.url.pathname.split('/')[1])
   */
  const auth_protected_paths = new Set(["(authenticated)"]);
  if (
    !session &&
    auth_protected_paths.has(event.route.id?.split("/")[1] || "")
  ) {
    redirect(307, "/auth");
  }

  const user = await event.locals.supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", session?.user.id);

  if (
    session &&
    user?.data[0].finished_setup == false &&
    event.route.id !== `/users/[user_id]/welcome` &&
    event.route.id !== `/auth/callback/osu`
  ) {
    redirect(307, `/users/${user.data[0]?.id}/welcome`);
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
