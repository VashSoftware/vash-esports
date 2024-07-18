import { redirect } from "@sveltejs/kit";
import { PUBLIC_DISCORD_CLIENT_ID } from "$env/static/public";
import { DISCORD_CLIENT_SECRET } from "$env/static/private";

export const GET = async ({ url, locals: { supabase, getSession } }) => {
  const code = url.searchParams.get("code") as string;

  if (code) {
    const token = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: PUBLIC_DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${url.origin}/auth/callback/discord`,
      }),
    });

    const { access_token } = await token.json();

    const user = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await user.json();

    const session = await getSession();

    const userProfile = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    const discordPlatform = await supabase
      .from("platforms")
      .select("id")
      .eq("name", "discord")
      .single();

    const userPlatforms = await supabase
      .from("user_platforms")
      .upsert(
        [
          {
            user_id: userProfile.data.id,
            platform_id: discordPlatform.data.id,
            value: data.id,
          },
        ],
        {
          onConflict: "user_id, platform_id",
        }
      )
      .select("*");

    redirect(303, `/users/${userProfile.data.id}`);
  }

  /* Return the user to an error page with instructions */
  redirect(303, `/`);
};
