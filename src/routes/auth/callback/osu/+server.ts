import { redirect } from "@sveltejs/kit";
import { PUBLIC_OSU_CLIENT_ID } from "$env/static/public";
import { OSU_CLIENT_SECRET } from "$env/static/private";

export const GET = async ({ url, locals: { supabase, getSession } }) => {
  const code = url.searchParams.get("code") as string;

  if (code) {
    const token = await fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: PUBLIC_OSU_CLIENT_ID,
        client_secret: OSU_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${url.origin}/auth/callback/osu`,
      }),
    });

    const { access_token } = await token.json();

    const user = await fetch("https://osu.ppy.sh/api/v2/me/osu", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const osuData = await user.json();

    const session = await getSession();

    const userProfile = await supabase
      .from("user_profiles")
      .update({ name: osuData.username, country_code: osuData.country_code })
      .eq("user_id", session.user.id)
      .select("id, user_id")
      .single();

    const userPlatforms = await supabase
      .from("user_platforms")
      .upsert(
        [
          {
            user_id: userProfile.data.id,
            platform_id: 1,
            value: osuData.id,
          },
          {
            user_id: userProfile.data.id,
            platform_id: 10,
            value: osuData.username,
          },
        ],
        {
          onConflict: "user_id, platform_id",
        }
      )
      .select("*");

    redirect(303, `/users/${userProfile.data.id}/welcome`);
  }

  /* Return the user to an error page with instructions */
  redirect(303, `/`);
};
